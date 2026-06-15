import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Linking,
  PanResponder,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import type { PanResponderGestureState } from "react-native";
import Mapbox, { Camera, Location } from "@rnmapbox/maps";

import { appConfig } from "../config/appConfig";
import { mapStyles } from "../styles/global";
import { sizes, spacing } from "../styles/theme";
import { useTheme } from "../styles/useTheme";
import { listenToPlaces, NiteLightPlace } from "../services/places";
import {
  getGooglePlaceDetails,
  PlaceDetails,
} from "../services/placeDetails";
import LightBulbMarker from "../components/LightBulbMarker";
import { getPlaceBrightness } from "../utils/placeStatus";

Mapbox.setAccessToken(appConfig.mapboxAccessToken);

type Coordinate = [number, number];

const placeStatusLabels = {
  open: "Open now",
  opensSoon: "Opening soon",
  closingSoon: "Closing soon",
  closed: "Closed now",
} as const;

const dayLabels = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
} as const;

const savedOpeningHourOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

function getSavedOpeningHourDescriptions(
  openingHours: NiteLightPlace["openingHours"]
) {
  return savedOpeningHourOrder.map(day => {
    const periods = openingHours[day] ?? [];
    const hoursText = periods.length
      ? periods.map(period => `${period.open}–${period.close}`).join(", ")
      : "Closed";

    return `${dayLabels[day]}: ${hoursText}`;
  });
}

function formatPlaceType(type: string) {
  if (!type) return "Place";

  return type
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, character => character.toUpperCase());
}

function formatBusinessStatus(status?: string) {
  if (!status) return null;

  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, character => character.toUpperCase());
}

function formatPlaceTime(timestamp?: string) {
  if (!timestamp) return null;

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return null;

  return {
    time: date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    day: date.toLocaleDateString("en-GB", { weekday: "long" }).toLowerCase(),
  };
}

function getLiveOpeningText(details: PlaceDetails | null) {
  if (typeof details?.openNow !== "boolean") return null;

  if (details.openNow) {
    const nextClose = formatPlaceTime(details.nextCloseTime);

    return nextClose
      ? `Open until ${nextClose.time} on ${nextClose.day}`
      : "Open now";
  }

  const nextOpen = formatPlaceTime(details.nextOpenTime);

  return nextOpen
    ? `Closed until ${nextOpen.time} on ${nextOpen.day}`
    : "Closed now";
}

function getMapsUrl(place: NiteLightPlace, details: PlaceDetails | null) {
  if (details?.googleMapsUri) {
    return details.googleMapsUri;
  }

  const coordinateQuery = `${place.coord.latitude},${place.coord.longitude}`;
  const encodedQuery = encodeURIComponent(place.name || coordinateQuery);
  const encodedPlaceId = place.placeId ? encodeURIComponent(place.placeId) : null;

  if (encodedPlaceId) {
    return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}&query_place_id=${encodedPlaceId}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    coordinateQuery
  )}`;
}

export default function MapScreen() {
  const { colour } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const expandedPlaceSheetHeight = Math.max(
    sizes.placeInfoSheetOffset,
    windowHeight - 44
  );
  const collapsedPlaceSheetTranslateY = Math.max(
    0,
    expandedPlaceSheetHeight - sizes.placeInfoSheetOffset
  );

  const cameraRef = useRef<Camera>(null);
  const placeDetailsRequestId = useRef(0);

  const recenterTranslateX = useRef(new Animated.Value(150)).current;
  const recenterWidth = useRef(new Animated.Value(132)).current;
  const recenterTextOpacity = useRef(new Animated.Value(1)).current;
  const recenterInnerPadding = useRef(new Animated.Value(0)).current;
  const placeSheetTranslateY = useRef(new Animated.Value(420)).current;
  const placeSheetDragY = useRef(new Animated.Value(0)).current;
  const previousExpandedPlaceSheetHeight = useRef(expandedPlaceSheetHeight);

  const [places, setPlaces] = useState<NiteLightPlace[]>([]);
  const [placesFromCache, setPlacesFromCache] = useState(false);
  const [now, setNow] = useState(new Date());
  const [selectedPlace, setSelectedPlace] = useState<NiteLightPlace | null>(null);
  const [isPlaceSheetExpanded, setIsPlaceSheetExpanded] = useState(false);
  const [selectedPlaceDetails, setSelectedPlaceDetails] =
    useState<PlaceDetails | null>(null);
  const [isPlaceDetailsLoading, setIsPlaceDetailsLoading] = useState(false);
  const [placeDetailsError, setPlaceDetailsError] = useState<string | null>(null);
  const [hasPhotoLoadFailed, setHasPhotoLoadFailed] = useState(false);
  const [isOpeningHoursListVisible, setIsOpeningHoursListVisible] = useState(false);

  const [hasLocationPermission, setHasLocationPermission] = useState(
    Platform.OS === "ios"
  );

  const [userCoordinate, setUserCoordinate] = useState<Coordinate | null>(null);
  const [hasCenteredOnce, setHasCenteredOnce] = useState(false);
  const [showRecenterButton, setShowRecenterButton] = useState(false);
  const [isRecenterCollapsed, setIsRecenterCollapsed] = useState(false);

  const placeSheetPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dy) > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderGrant: () => {
          placeSheetDragY.setValue(0);
        },
        onPanResponderMove: (_, gesture) => {
          const minDragY = isPlaceSheetExpanded
            ? 0
            : -collapsedPlaceSheetTranslateY;
          const maxDragY = isPlaceSheetExpanded
            ? expandedPlaceSheetHeight
            : 180;

          placeSheetDragY.setValue(
            Math.max(minDragY, Math.min(maxDragY, gesture.dy))
          );
        },
        onPanResponderRelease: (_, gesture) => {
          finishPlaceSheetDrag(gesture);
        },
        onPanResponderTerminate: () => {
          resetPlaceSheetDrag();
        },
      }),
    [isPlaceSheetExpanded, expandedPlaceSheetHeight, collapsedPlaceSheetTranslateY]
  );

  useEffect(() => {
    const unsubscribe = listenToPlaces(
      info => {
        setPlaces(info.places);
        setPlacesFromCache(info.isFromCache);
      },
      error => {
        console.error("Failed to load places:", error);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const previousHeight = previousExpandedPlaceSheetHeight.current;
    previousExpandedPlaceSheetHeight.current = expandedPlaceSheetHeight;

    if (!selectedPlace || previousHeight === expandedPlaceSheetHeight) return;

    placeSheetTranslateY.setValue(
      isPlaceSheetExpanded ? 0 : collapsedPlaceSheetTranslateY
    );
    placeSheetDragY.setValue(0);
  }, [
    collapsedPlaceSheetTranslateY,
    expandedPlaceSheetHeight,
    isPlaceSheetExpanded,
    placeSheetDragY,
    placeSheetTranslateY,
    selectedPlace,
  ]);

  async function requestLocationPermission() {
    if (Platform.OS === "android") {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location permission",
          message: "NiteLight needs your location to show you on the map.",
          buttonPositive: "Allow",
          buttonNegative: "Deny",
        }
      );

      const granted = result === PermissionsAndroid.RESULTS.GRANTED;
      setHasLocationPermission(granted);
      return granted;
    }

    setHasLocationPermission(true);
    return true;
  }

  function centerCameraOnUser(coordinate: Coordinate) {
    cameraRef.current?.setCamera({
      centerCoordinate: coordinate,
      zoomLevel: 15,
      animationDuration: 800,
    });
  }

  function handleUserLocationUpdate(location: Location) {
    const coords = location.coords;
    const coordinate: Coordinate = [coords.longitude, coords.latitude];

    setUserCoordinate(coordinate);

    if (!hasCenteredOnce) {
      centerCameraOnUser(coordinate);
      setHasCenteredOnce(true);
    }
  }

  function animateRecenterButtonIn() {
    setShowRecenterButton(true);
    setIsRecenterCollapsed(false);

    recenterTranslateX.setValue(150);
    recenterWidth.setValue(132);
    recenterTextOpacity.setValue(1);
    recenterInnerPadding.setValue(0);

    Animated.sequence([
      Animated.spring(recenterTranslateX, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 70,
      }),

      Animated.delay(1800),

      Animated.parallel([
        Animated.timing(recenterWidth, {
          toValue: 56,
          duration: 260,
          useNativeDriver: false,
        }),
        Animated.timing(recenterTextOpacity, {
          toValue: 0,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.timing(recenterInnerPadding, {
          toValue: 4,
          duration: 260,
          useNativeDriver: false,
        }),
      ]),
    ]).start(() => {
      setIsRecenterCollapsed(true);
    });
  }

  function handleMapTouch() {
    if (!hasCenteredOnce || showRecenterButton) return;

    animateRecenterButtonIn();
  }

  function resetPlaceSheetDrag() {
    Animated.spring(placeSheetDragY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  }

  function animatePlaceSheetTo(toValue: number) {
    Animated.spring(placeSheetTranslateY, {
      toValue,
      useNativeDriver: true,
      friction: 9,
      tension: 70,
    }).start();
  }

  function animatePlaceSheetIn() {
    setIsPlaceSheetExpanded(false);
    placeSheetTranslateY.setValue(expandedPlaceSheetHeight);
    placeSheetDragY.setValue(0);
    animatePlaceSheetTo(collapsedPlaceSheetTranslateY);
  }

  function expandPlaceSheet() {
    setIsPlaceSheetExpanded(true);
    placeSheetDragY.setValue(0);
    animatePlaceSheetTo(0);
    void loadSelectedPlaceDetails();
  }

  function finishPlaceSheetDrag(gesture: PanResponderGestureState) {
    const shouldClose = gesture.dy > 80 || gesture.vy > 0.75;
    const shouldExpand = gesture.dy < -70 || gesture.vy < -0.75;

    if (shouldClose) {
      handleClosePlaceInfo();
      return;
    }

    if (shouldExpand) {
      expandPlaceSheet();
      return;
    }

    resetPlaceSheetDrag();
  }

  async function loadSelectedPlaceDetails(
    place = selectedPlace,
    options: { ignoreCurrentState?: boolean } = {}
  ) {
    if (!place) return;

    if (!options.ignoreCurrentState && (selectedPlaceDetails || isPlaceDetailsLoading)) {
      return;
    }

    const requestId = placeDetailsRequestId.current + 1;
    placeDetailsRequestId.current = requestId;

    if (!place.placeId) {
      setIsPlaceDetailsLoading(false);
      setPlaceDetailsError(null);
      return;
    }

    try {
      setIsPlaceDetailsLoading(true);
      setPlaceDetailsError(null);
      const details = await getGooglePlaceDetails(place.placeId);

      if (placeDetailsRequestId.current === requestId) {
        setSelectedPlaceDetails(details);
        setHasPhotoLoadFailed(false);
      }
    } catch (error) {
      console.error("Failed to load Google place details:", error);

      if (placeDetailsRequestId.current === requestId) {
        setPlaceDetailsError(
          error instanceof Error
            ? `Saved info shown. ${error.message}`
            : "Saved info shown. Live Google details unavailable."
        );
      }
    } finally {
      if (placeDetailsRequestId.current === requestId) {
        setIsPlaceDetailsLoading(false);
      }
    }
  }

  async function handlePlacePress(place: NiteLightPlace) {
    placeDetailsRequestId.current += 1;

    setSelectedPlace(place);
    setSelectedPlaceDetails(null);
    setPlaceDetailsError(null);
    setIsPlaceDetailsLoading(false);
    setHasPhotoLoadFailed(false);
    setIsOpeningHoursListVisible(false);
    animatePlaceSheetIn();
    void loadSelectedPlaceDetails(place, { ignoreCurrentState: true });
  }

  function handleClosePlaceInfo() {
    const closeRequestId = placeDetailsRequestId.current + 1;
    placeDetailsRequestId.current = closeRequestId;
    setPlaceDetailsError(null);
    setIsPlaceDetailsLoading(false);
    setIsPlaceSheetExpanded(false);
    setHasPhotoLoadFailed(false);
    setIsOpeningHoursListVisible(false);

    Animated.parallel([
      Animated.timing(placeSheetTranslateY, {
        toValue: expandedPlaceSheetHeight,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(placeSheetDragY, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (placeDetailsRequestId.current !== closeRequestId) return;

      setSelectedPlace(null);
      setSelectedPlaceDetails(null);
    });
  }

  async function openUrl(url: string, errorMessage: string) {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error(error);
      Alert.alert("Could not open link", errorMessage);
    }
  }

  function handleOpenSelectedPlaceInMaps() {
    if (!selectedPlace) return;

    openUrl(
      getMapsUrl(selectedPlace, selectedPlaceDetails),
      "Try opening this place manually in Google Maps."
    );
  }

  function handleOpenSelectedPlaceWebsite() {
    if (!selectedPlaceDetails?.websiteUri) return;

    openUrl(
      selectedPlaceDetails.websiteUri,
      "Try opening this place website manually."
    );
  }

  function handleRecenterPress() {
    if (!userCoordinate) return;

    centerCameraOnUser(userCoordinate);

    Animated.parallel([
      Animated.timing(recenterTranslateX, {
        toValue: 150,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(recenterTextOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowRecenterButton(false);
      setIsRecenterCollapsed(false);
    });
  }

  function renderSelectedPlaceInfo() {
    if (!selectedPlace) return null;

    const { status } = getPlaceBrightness(selectedPlace.openingHours, now);
    const title = selectedPlaceDetails?.name ?? selectedPlace.name;
    const address = selectedPlaceDetails?.formattedAddress ?? selectedPlace.address;
    const businessStatus = formatBusinessStatus(selectedPlaceDetails?.businessStatus);
    const rating = selectedPlaceDetails?.rating;
    const ratingText =
      typeof rating === "number"
        ? `${rating.toFixed(1)} / 5${
            selectedPlaceDetails?.userRatingCount
              ? ` (${selectedPlaceDetails.userRatingCount} reviews)`
              : ""
          }`
        : null;
    const liveOpenText = getLiveOpeningText(selectedPlaceDetails);
    const savedImageUri = selectedPlace.imageUrl ?? selectedPlace.photoUrl;
    const googlePhotoUri = selectedPlaceDetails?.photoUri;
    const photoUri = hasPhotoLoadFailed
      ? googlePhotoUri && savedImageUri !== googlePhotoUri
        ? savedImageUri
        : null
      : googlePhotoUri ?? savedImageUri;
    const photoAttribution =
      googlePhotoUri && photoUri === googlePhotoUri && selectedPlaceDetails?.photoAttributions?.length
        ? `Photo: ${selectedPlaceDetails.photoAttributions.join(", ")}`
        : null;
    const openingHourDescriptions = selectedPlaceDetails?.weekdayDescriptions?.length
      ? selectedPlaceDetails.weekdayDescriptions
      : getSavedOpeningHourDescriptions(selectedPlace.openingHours);
    const statusColor =
      status === "open"
        ? colour.success
        : status === "closed"
        ? colour.textSecondary
        : colour.warning;

    return (
      <Animated.View
        style={[
          mapStyles.placeInfoCard,
          {
            backgroundColor: colour.surface,
            borderColor: colour.border,
            height: expandedPlaceSheetHeight,
            transform: [
              { translateY: Animated.add(placeSheetTranslateY, placeSheetDragY) },
            ],
          },
        ]}
      >
        {photoUri ? (
          <View
            style={[
              mapStyles.placeInfoImageWrap,
              isPlaceSheetExpanded && mapStyles.placeInfoImageWrapExpanded,
            ]}
          >
            <Image
              source={{ uri: photoUri }}
              style={mapStyles.placeInfoImage}
              onError={() => setHasPhotoLoadFailed(true)}
            />

            <View
              {...placeSheetPanResponder.panHandlers}
              style={mapStyles.placeInfoDragHandleTouchArea}
            >
              <View
                style={[
                  mapStyles.placeInfoDragHandle,
                  {
                    backgroundColor: colour.surface,
                    borderColor: colour.border,
                  },
                ]}
              />
            </View>

            {photoAttribution && (
              <View style={mapStyles.placeInfoPhotoCreditPill}>
                <Text
                  style={mapStyles.placeInfoPhotoCreditText}
                  numberOfLines={1}
                >
                  {photoAttribution}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View
            style={[
              mapStyles.placeInfoImagePlaceholder,
              isPlaceSheetExpanded && mapStyles.placeInfoImageWrapExpanded,
              { backgroundColor: colour.surfaceSecondary },
            ]}
          >
            <View
              {...placeSheetPanResponder.panHandlers}
              style={mapStyles.placeInfoDragHandleTouchArea}
            >
              <View
                style={[
                  mapStyles.placeInfoDragHandle,
                  {
                    backgroundColor: colour.surface,
                    borderColor: colour.border,
                  },
                ]}
              />
            </View>

            <Text style={[mapStyles.placeInfoImagePlaceholderIcon, { color: colour.primary }]}>
              ✦
            </Text>
            <Text style={[mapStyles.placeInfoImagePlaceholderText, { color: colour.textSecondary }]}>
              {isPlaceDetailsLoading ? "Loading image preview" : "No image preview yet"}
            </Text>
          </View>
        )}

        <ScrollView
          style={mapStyles.placeInfoScroll}
          contentContainerStyle={[
            mapStyles.placeInfoBody,
            isPlaceSheetExpanded && mapStyles.placeInfoBodyExpanded,
          ]}
          scrollEnabled={isPlaceSheetExpanded}
          showsVerticalScrollIndicator={isPlaceSheetExpanded}
        >
          <View style={mapStyles.placeInfoHeader}>
          <View style={mapStyles.placeInfoContent}>
            <Text style={[mapStyles.placeInfoTitle, { color: colour.text }]}>
              {title}
            </Text>

            <Text style={[mapStyles.placeInfoMeta, { color: statusColor }]}>
              {formatPlaceType(selectedPlace.type)} • {liveOpenText ?? placeStatusLabels[status]}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleClosePlaceInfo}
            style={[
              mapStyles.placeInfoCloseButton,
              { backgroundColor: colour.surfaceSecondary },
            ]}
          >
            <Text style={[mapStyles.placeInfoCloseText, { color: colour.text }]}>×</Text>
          </TouchableOpacity>
        </View>

        {address && (
          <Text style={[mapStyles.placeInfoAddress, { color: colour.textSecondary }]}>
            {address}
          </Text>
        )}

        {!isPlaceSheetExpanded && selectedPlace.placeId && isPlaceDetailsLoading && (
          <Text style={[mapStyles.placeInfoHint, { color: colour.textSecondary }]}>
            Loading live photo and details…
          </Text>
        )}

        {isPlaceDetailsLoading && (
          <View style={mapStyles.placeInfoLoadingRow}>
            <ActivityIndicator />
            <Text style={[mapStyles.placeInfoLoadingText, { color: colour.textSecondary }]}>
              Loading place details...
            </Text>
          </View>
        )}

        {ratingText && (
          <View style={mapStyles.placeInfoRow}>
            <Text style={[mapStyles.placeInfoLabel, { color: colour.textSecondary }]}>Rating</Text>
            <Text style={[mapStyles.placeInfoValue, { color: colour.text }]}>
              {ratingText}
            </Text>
          </View>
        )}

        {selectedPlaceDetails?.phoneNumber && (
          <View style={mapStyles.placeInfoRow}>
            <Text style={[mapStyles.placeInfoLabel, { color: colour.textSecondary }]}>Phone</Text>
            <Text style={[mapStyles.placeInfoValue, { color: colour.text }]}>
              {selectedPlaceDetails.phoneNumber}
            </Text>
          </View>
        )}

        {businessStatus && (
          <View style={mapStyles.placeInfoRow}>
            <Text style={[mapStyles.placeInfoLabel, { color: colour.textSecondary }]}>Status</Text>
            <Text style={[mapStyles.placeInfoValue, { color: colour.text }]}>
              {businessStatus}
            </Text>
          </View>
        )}

        {placeDetailsError && (
          <Text style={[mapStyles.placeInfoError, { color: colour.textSecondary }]}>
            {placeDetailsError}
          </Text>
        )}

        {isPlaceSheetExpanded && (
          <View style={mapStyles.placeInfoExpandedSection}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsOpeningHoursListVisible(value => !value)}
              style={mapStyles.placeInfoHoursToggle}
            >
              <View style={mapStyles.placeInfoHoursToggleTextWrap}>
                <Text style={[mapStyles.placeInfoSectionTitle, { color: colour.text }]}>
                  Opening hours
                </Text>
                <Text style={[mapStyles.placeInfoHoursSummary, { color: colour.textSecondary }]}>
                  {liveOpenText ?? placeStatusLabels[status]}
                </Text>
              </View>

              <Text style={[mapStyles.placeInfoHoursToggleHint, { color: colour.textSecondary }]}>
                {isOpeningHoursListVisible ? "Hide list" : "Tap for full list"}
              </Text>
            </TouchableOpacity>

            {isOpeningHoursListVisible &&
              openingHourDescriptions.map(line => (
                <Text
                  key={line}
                  style={[mapStyles.placeInfoHoursText, { color: colour.textSecondary }]}
                >
                  {line}
                </Text>
              ))}
          </View>
        )}

          <View style={mapStyles.placeInfoActions}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleOpenSelectedPlaceInMaps}
              style={[mapStyles.placeInfoButton, { backgroundColor: colour.primary }]}
            >
              <Text style={mapStyles.placeInfoButtonText}>Open map</Text>
            </TouchableOpacity>

            {selectedPlaceDetails?.websiteUri && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleOpenSelectedPlaceWebsite}
                style={[
                  mapStyles.placeInfoButton,
                  mapStyles.placeInfoButtonSecondary,
                  { borderColor: colour.border },
                ]}
              >
                <Text
                  style={[
                    mapStyles.placeInfoSecondaryButtonText,
                    { color: colour.text },
                  ]}
                >
                  Website
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    );
  }

  return (
    <View style={[mapStyles.container, { backgroundColor: colour.background }]}>
      <Mapbox.MapView
        style={mapStyles.map}
        styleURL={Mapbox.StyleURL.Street}
        onTouchStart={handleMapTouch}
      >
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={12}
          centerCoordinate={[-0.1276, 51.5072]}
        />

        {places.map(place => {
          const { brightness } = getPlaceBrightness(place.openingHours, now);

          return (
            <Mapbox.PointAnnotation
              key={place.id}
              id={place.id}
              coordinate={[place.coord.longitude, place.coord.latitude]}
              onSelected={() => handlePlacePress(place)}
            >
              <View style={mapStyles.placeMarker}>
                <LightBulbMarker brightness={brightness} />
              </View>
            </Mapbox.PointAnnotation>
          );
        })}

        {hasLocationPermission && (
          <Mapbox.UserLocation
            visible
            showsUserHeadingIndicator
            onUpdate={handleUserLocationUpdate}
          />
        )}
      </Mapbox.MapView>

      {placesFromCache && (
        <View style={[mapStyles.cacheBadge, { backgroundColor: colour.surface }]}>
          <Text style={[mapStyles.cacheBadgeText, { color: colour.textSecondary }]}>
            Cached
          </Text>
        </View>
      )}

      {renderSelectedPlaceInfo()}

      {showRecenterButton && userCoordinate && (
        <Animated.View
          style={[
            mapStyles.recenterButtonWrapper,
            selectedPlace && {
              bottom:
                (isPlaceSheetExpanded
                  ? expandedPlaceSheetHeight
                  : sizes.placeInfoSheetOffset) + spacing.xl,
            },
            {
              transform: [{ translateX: recenterTranslateX }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={0.85} onPress={handleRecenterPress}>
            <Animated.View
              style={[
                mapStyles.recenterButton,
                {
                  width: recenterWidth,
                  paddingLeft: recenterInnerPadding,
                  paddingRight: recenterInnerPadding,
                  backgroundColor: colour.surface,
                  borderColor: colour.border,
                },
              ]}
            >
              <Text style={[mapStyles.recenterIcon, { color: colour.text }]}>
                ⌖
              </Text>

              {!isRecenterCollapsed && (
                <Animated.Text
                  style={[
                    mapStyles.recenterButtonText,
                    {
                      color: colour.text,
                      opacity: recenterTextOpacity,
                    },
                  ]}
                  numberOfLines={1}
                >
                  Recenter
                </Animated.Text>
              )}
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {!hasLocationPermission && (
        <View style={[mapStyles.permissionCard, { backgroundColor: colour.surface }]}>
          <Text style={[mapStyles.permissionText, { color: colour.text }]}>
            Allow location to show where you are on the map.
          </Text>

          <TouchableOpacity
            style={[mapStyles.permissionButton, { backgroundColor: colour.primary }]}
            onPress={requestLocationPermission}
          >
            <Text style={mapStyles.permissionButtonText}>Enable location</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
