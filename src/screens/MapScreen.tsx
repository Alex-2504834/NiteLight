import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  FlatList,
  Image,
  LayoutAnimation,
  Linking,
  Modal,
  PanResponder,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  useWindowDimensions,
  View,
} from "react-native";
import type { PanResponderGestureState } from "react-native";
import Mapbox, { Camera, Location } from "@rnmapbox/maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

import { appConfig } from "../config/appConfig";
import { useAppPreferences } from "../settings/AppPreferencesContext";
import { mapStyles } from "../styles/global";
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
type PlaceSheetSnap = "collapsed" | "expanded" | "dragging" | "closed";

const PLACE_SHEET_HANDLE_HEIGHT = 26;
const PLACE_SHEET_TOP_GAP = 18;
const PLACE_SHEET_CLOSE_GAP = 64;
const PLACE_SHEET_MIN_COLLAPSED_HEIGHT = 430;
const PLACE_SHEET_PREVIEW_BODY_HEIGHT = 250;

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

const serviceTypeLabels: Record<string, string> = {
  support: "Support & advice",
  food: "Food & essentials",
  clothes: "Clothing & hygiene",
  utilities: "Community facilities",
};

function formatPlaceType(type: string) {
  if (!type) return "Support service";

  const normalisedType = type.trim().toLowerCase();

  return (
    serviceTypeLabels[normalisedType] ??
    type
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, character => character.toUpperCase())
  );
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
  const { centreOnLocation } = useAppPreferences();
  const insets = useSafeAreaInsets();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [mapViewportHeight, setMapViewportHeight] = useState(windowHeight);
  const placeSheetTopInset = Math.max(PLACE_SHEET_TOP_GAP, insets.top + 6);
  const expandedPlaceSheetHeight = Math.max(
    420,
    mapViewportHeight - placeSheetTopInset
  );
  const placeInfoImageHeight = Math.max(
    180,
    Math.min(230, Math.round(expandedPlaceSheetHeight * 0.24))
  );
  const collapsedPlaceSheetHeight = Math.min(
    expandedPlaceSheetHeight - 96,
    Math.max(
      PLACE_SHEET_MIN_COLLAPSED_HEIGHT,
      placeInfoImageHeight +
        PLACE_SHEET_HANDLE_HEIGHT +
        PLACE_SHEET_PREVIEW_BODY_HEIGHT
    )
  );
  const collapsedPlaceSheetTranslateY = Math.max(
    0,
    expandedPlaceSheetHeight - collapsedPlaceSheetHeight
  );
  const closedPlaceSheetTranslateY =
    expandedPlaceSheetHeight + PLACE_SHEET_CLOSE_GAP;

  const cameraRef = useRef<Camera>(null);
  const placeInfoScrollRef = useRef<ScrollView>(null);
  const placeInfoScrollOffsetY = useRef(0);
  const placeDetailsRequestId = useRef(0);

  const recenterTranslateX = useRef(new Animated.Value(150)).current;
  const recenterWidth = useRef(new Animated.Value(132)).current;
  const recenterTextOpacity = useRef(new Animated.Value(1)).current;
  const recenterInnerPadding = useRef(new Animated.Value(0)).current;
  const placeSheetTranslateY = useRef(
    new Animated.Value(windowHeight)
  ).current;
  const placeSheetPositionRef = useRef(windowHeight);
  const placeSheetDragStartY = useRef(windowHeight);
  const placeSheetGestureStartDyRef = useRef(0);
  const placeSheetLatestGestureDyRef = useRef(0);
  const placeSheetDragReadyRef = useRef(true);
  const placeSheetPendingReleaseVelocityRef = useRef<number | null>(null);
  const placeSheetDragStartSnapRef = useRef<"collapsed" | "expanded">(
    "collapsed"
  );
  const placeSheetSnapRef = useRef<PlaceSheetSnap>("closed");
  const placeSheetGeometryRef = useRef({
    collapsedY: collapsedPlaceSheetTranslateY,
    closedY: closedPlaceSheetTranslateY,
  });
  const isPlaceSheetExpandedRef = useRef(false);
  const finishPlaceSheetDragRef = useRef<
    (gesture: PanResponderGestureState) => void
  >(() => {});
  const settlePlaceSheetRef = useRef<(velocity: number) => void>(() => {});
  const placeSheetAnimationId = useRef(0);
  const placeDetailsLoadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  placeSheetGeometryRef.current = {
    collapsedY: collapsedPlaceSheetTranslateY,
    closedY: closedPlaceSheetTranslateY,
  };

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
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);

  const [hasLocationPermission, setHasLocationPermission] = useState(
    Platform.OS === "ios"
  );

  const [userCoordinate, setUserCoordinate] = useState<Coordinate | null>(null);
  const [hasCenteredOnce, setHasCenteredOnce] = useState(false);
  const [showRecenterButton, setShowRecenterButton] = useState(false);
  const [isRecenterCollapsed, setIsRecenterCollapsed] = useState(false);

  const placeSheetPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        const isVerticalGesture =
          Math.abs(gesture.dy) > 4 &&
          Math.abs(gesture.dy) > Math.abs(gesture.dx) * 1.15;

        if (!isVerticalGesture) return false;
        if (!isPlaceSheetExpandedRef.current) return true;

        return gesture.dy > 0 && placeInfoScrollOffsetY.current <= 1;
      },
      onMoveShouldSetPanResponderCapture: (_, gesture) => {
        const isVerticalGesture =
          Math.abs(gesture.dy) > 4 &&
          Math.abs(gesture.dy) > Math.abs(gesture.dx) * 1.15;

        if (!isVerticalGesture) return false;
        if (!isPlaceSheetExpandedRef.current) return true;

        return gesture.dy > 0 && placeInfoScrollOffsetY.current <= 1;
      },
      onPanResponderGrant: (_, gesture) => {
        placeSheetAnimationId.current += 1;
        placeSheetDragReadyRef.current = false;
        placeSheetPendingReleaseVelocityRef.current = null;
        placeSheetLatestGestureDyRef.current = gesture.dy;
        placeSheetDragStartSnapRef.current = isPlaceSheetExpandedRef.current
          ? "expanded"
          : "collapsed";
        placeSheetSnapRef.current = "dragging";

        if (placeDetailsLoadTimerRef.current) {
          clearTimeout(placeDetailsLoadTimerRef.current);
          placeDetailsLoadTimerRef.current = null;
        }

        placeSheetTranslateY.stopAnimation(value => {
          const { closedY } = placeSheetGeometryRef.current;
          const currentPosition = Math.max(0, Math.min(closedY, value));

          placeSheetPositionRef.current = currentPosition;
          placeSheetDragStartY.current = currentPosition;
          placeSheetGestureStartDyRef.current =
            placeSheetLatestGestureDyRef.current;
          placeSheetTranslateY.setValue(currentPosition);
          placeSheetDragReadyRef.current = true;

          const pendingVelocity =
            placeSheetPendingReleaseVelocityRef.current;
          if (pendingVelocity !== null) {
            placeSheetPendingReleaseVelocityRef.current = null;
            settlePlaceSheetRef.current(pendingVelocity);
          }
        });
      },
      onPanResponderMove: (_, gesture) => {
        placeSheetLatestGestureDyRef.current = gesture.dy;
        if (!placeSheetDragReadyRef.current) return;

        const { closedY } = placeSheetGeometryRef.current;
        const dragDistance = gesture.dy - placeSheetGestureStartDyRef.current;
        const nextPosition = Math.max(
          0,
          Math.min(closedY, placeSheetDragStartY.current + dragDistance)
        );

        placeSheetPositionRef.current = nextPosition;
        placeSheetTranslateY.setValue(nextPosition);
      },
      onPanResponderRelease: (_, gesture) => {
        placeSheetLatestGestureDyRef.current = gesture.dy;
        if (!placeSheetDragReadyRef.current) {
          placeSheetPendingReleaseVelocityRef.current = gesture.vy;
          return;
        }
        finishPlaceSheetDragRef.current(gesture);
      },
      onPanResponderTerminate: (_, gesture) => {
        placeSheetLatestGestureDyRef.current = gesture.dy;
        if (!placeSheetDragReadyRef.current) {
          placeSheetPendingReleaseVelocityRef.current = gesture.vy;
          return;
        }
        finishPlaceSheetDragRef.current(gesture);
      },
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
    })
  ).current;

  useEffect(() => {
    if (Platform.OS !== "android") return;

    UIManager.setLayoutAnimationEnabledExperimental?.(true);

    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )
      .then(setHasLocationPermission)
      .catch(error => {
        console.warn("Could not check location permission:", error);
      });
  }, []);

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
    const listenerId = placeSheetTranslateY.addListener(({ value }) => {
      placeSheetPositionRef.current = value;
    });

    return () => {
      placeSheetTranslateY.removeListener(listenerId);
    };
  }, [placeSheetTranslateY]);

  useEffect(() => {
    if (selectedPlace) return;

    placeSheetAnimationId.current += 1;
    placeSheetSnapRef.current = "closed";
    placeSheetPositionRef.current = closedPlaceSheetTranslateY;
    placeSheetTranslateY.stopAnimation();
    placeSheetTranslateY.setValue(closedPlaceSheetTranslateY);
  }, [
    closedPlaceSheetTranslateY,
    placeSheetTranslateY,
    selectedPlace,
  ]);

  useEffect(() => {
    return () => {
      if (placeDetailsLoadTimerRef.current) {
        clearTimeout(placeDetailsLoadTimerRef.current);
      }
    };
  }, []);

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
      if (centreOnLocation) {
        centerCameraOnUser(coordinate);
      }

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
      Animated.timing(recenterTranslateX, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
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

  function clampPlaceSheetPosition(value: number) {
    return Math.max(0, Math.min(closedPlaceSheetTranslateY, value));
  }

  function scheduleSelectedPlaceDetailsLoad(
    place = selectedPlace,
    delay = 220
  ) {
    if (!place || selectedPlaceDetails || isPlaceDetailsLoading) return;

    if (placeDetailsLoadTimerRef.current) {
      clearTimeout(placeDetailsLoadTimerRef.current);
    }

    placeDetailsLoadTimerRef.current = setTimeout(() => {
      placeDetailsLoadTimerRef.current = null;
      void loadSelectedPlaceDetails(place);
    }, delay);
  }

  function animatePlaceSheetTo(
    toValue: number,
    snap: Exclude<PlaceSheetSnap, "dragging">,
    velocity = 0,
    onComplete?: () => void
  ) {
    const animationId = placeSheetAnimationId.current + 1;
    placeSheetAnimationId.current = animationId;
    placeSheetSnapRef.current = snap;
    placeSheetTranslateY.stopAnimation();

    const currentPosition = placeSheetPositionRef.current;
    const distance = Math.abs(toValue - currentPosition);
    const distanceRatio = Math.min(
      1,
      distance / Math.max(1, expandedPlaceSheetHeight)
    );
    const velocityAdjustment = Math.min(55, Math.abs(velocity) * 24);
    const duration = Math.max(
      170,
      Math.round(180 + 160 * distanceRatio - velocityAdjustment)
    );

    Animated.timing(placeSheetTranslateY, {
      toValue,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished || placeSheetAnimationId.current !== animationId) return;

      placeSheetPositionRef.current = toValue;
      placeSheetTranslateY.setValue(toValue);
      onComplete?.();
    });
  }

  function expandPlaceSheet(releaseVelocity = 0) {
    isPlaceSheetExpandedRef.current = true;
    placeInfoScrollOffsetY.current = 0;
    placeInfoScrollRef.current?.scrollTo({ y: 0, animated: false });
    animatePlaceSheetTo(0, "expanded", releaseVelocity, () => {
      setIsPlaceSheetExpanded(true);
      scheduleSelectedPlaceDetailsLoad(selectedPlace, 80);
    });
  }

  function collapsePlaceSheet(releaseVelocity = 0) {
    isPlaceSheetExpandedRef.current = false;
    setIsPlaceSheetExpanded(false);
    animatePlaceSheetTo(
      collapsedPlaceSheetTranslateY,
      "collapsed",
      releaseVelocity,
      () => {
        placeInfoScrollOffsetY.current = 0;
        placeInfoScrollRef.current?.scrollTo({ y: 0, animated: false });
        setIsOpeningHoursListVisible(false);
        scheduleSelectedPlaceDetailsLoad(selectedPlace, 180);
      }
    );
  }

  function settlePlaceSheet(releaseVelocity: number) {
    const currentPosition = placeSheetPositionRef.current;
    const projectedPosition = clampPlaceSheetPosition(
      currentPosition + releaseVelocity * 120
    );
    const startedExpanded = placeSheetDragStartSnapRef.current === "expanded";
    const expandThreshold = collapsedPlaceSheetTranslateY * 0.52;
    const closeThreshold =
      collapsedPlaceSheetTranslateY + Math.max(72, PLACE_SHEET_CLOSE_GAP);

    if (releaseVelocity < -0.5) {
      expandPlaceSheet(releaseVelocity);
      return;
    }

    if (releaseVelocity > 0.75) {
      if (
        !startedExpanded ||
        currentPosition > collapsedPlaceSheetTranslateY + 28
      ) {
        handleClosePlaceInfo(releaseVelocity);
      } else {
        collapsePlaceSheet(releaseVelocity);
      }
      return;
    }

    if (projectedPosition < expandThreshold) {
      expandPlaceSheet(releaseVelocity);
      return;
    }

    if (projectedPosition > closeThreshold) {
      handleClosePlaceInfo(releaseVelocity);
      return;
    }

    collapsePlaceSheet(releaseVelocity);
  }

  function finishPlaceSheetDrag(gesture: PanResponderGestureState) {
    settlePlaceSheet(gesture.vy);
  }

  settlePlaceSheetRef.current = settlePlaceSheet;
  finishPlaceSheetDragRef.current = finishPlaceSheetDrag;

  function toggleOpeningHoursList() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpeningHoursListVisible(value => !value);
  }

  async function loadSelectedPlaceDetails(
    place = selectedPlace,
    options: { ignoreCurrentState?: boolean; } = {}
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
          "Saved information shown. Live details are unavailable right now."
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
    placeSheetAnimationId.current += 1;
    placeSheetTranslateY.stopAnimation();
    placeSheetDragReadyRef.current = true;
    placeSheetPendingReleaseVelocityRef.current = null;
    placeSheetSnapRef.current = "collapsed";
    isPlaceSheetExpandedRef.current = false;
    setIsPlaceSheetExpanded(false);

    placeSheetPositionRef.current = collapsedPlaceSheetTranslateY;
    placeSheetTranslateY.setValue(collapsedPlaceSheetTranslateY);

    setSelectedPlace(place);
    setSelectedPlaceDetails(null);
    setPlaceDetailsError(null);
    setIsPlaceDetailsLoading(false);
    setHasPhotoLoadFailed(false);
    setIsOpeningHoursListVisible(false);
    placeInfoScrollOffsetY.current = 0;
    placeInfoScrollRef.current?.scrollTo({ y: 0, animated: false });
    setIsImageViewerVisible(false);
    setImageViewerIndex(0);

    if (placeDetailsLoadTimerRef.current) {
      clearTimeout(placeDetailsLoadTimerRef.current);
    }
    placeDetailsLoadTimerRef.current = setTimeout(() => {
      placeDetailsLoadTimerRef.current = null;
      void loadSelectedPlaceDetails(place, { ignoreCurrentState: true });
    }, 260);
  }

  function handleClosePlaceInfo(releaseVelocity = 0) {
    if (placeDetailsLoadTimerRef.current) {
      clearTimeout(placeDetailsLoadTimerRef.current);
      placeDetailsLoadTimerRef.current = null;
    }

    const closeRequestId = placeDetailsRequestId.current + 1;
    placeDetailsRequestId.current = closeRequestId;
    setPlaceDetailsError(null);
    setIsPlaceDetailsLoading(false);
    placeSheetDragReadyRef.current = true;
    placeSheetPendingReleaseVelocityRef.current = null;
    isPlaceSheetExpandedRef.current = false;
    setIsPlaceSheetExpanded(false);
    setHasPhotoLoadFailed(false);
    setIsOpeningHoursListVisible(false);
    placeInfoScrollOffsetY.current = 0;
    placeInfoScrollRef.current?.scrollTo({ y: 0, animated: false });
    setIsImageViewerVisible(false);
    setImageViewerIndex(0);

    animatePlaceSheetTo(
      closedPlaceSheetTranslateY,
      "closed",
      Math.max(0, releaseVelocity),
      () => {
        if (placeDetailsRequestId.current !== closeRequestId) return;

        setSelectedPlace(null);
        setSelectedPlaceDetails(null);
      }
    );
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
      "Try opening this support location manually in Google Maps."
    );
  }

  function handleOpenSelectedPlaceWebsite() {
    if (!selectedPlaceDetails?.websiteUri) return;

    openUrl(
      selectedPlaceDetails.websiteUri,
      "Try opening this organisation website manually."
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

  function getSelectedPlacePhotos() {
    if (!selectedPlace) return [];

    const savedImageUri = selectedPlace.imageUrl ?? selectedPlace.photoUrl;
    const photos = [...(selectedPlaceDetails?.photos ?? [])];

    if (selectedPlaceDetails?.photoUri && !photos.some(photo => photo.uri === selectedPlaceDetails.photoUri)) {
      photos.unshift({
        uri: selectedPlaceDetails.photoUri,
        attributions: selectedPlaceDetails.photoAttributions,
      });
    }

    if (savedImageUri && !photos.some(photo => photo.uri === savedImageUri)) {
      photos.push({ uri: savedImageUri });
    }

    return photos.filter(
      (photo, index, allPhotos) =>
        Boolean(photo.uri) && allPhotos.findIndex(item => item.uri === photo.uri) === index
    );
  }

  function openImageViewer(index = 0) {
    const photos = getSelectedPlacePhotos();
    if (!photos.length) return;

    setImageViewerIndex(Math.max(0, Math.min(index, photos.length - 1)));
    setIsImageViewerVisible(true);
  }

  function renderImageViewer() {
    const photos = getSelectedPlacePhotos();
    if (!photos.length) return null;

    const currentPhoto = photos[imageViewerIndex] ?? photos[0];
    const attribution = currentPhoto.attributions?.length
      ? `Photo: ${currentPhoto.attributions.join(", ")}`
      : null;

    return (
      <Modal
        visible={isImageViewerVisible}
        animationType="fade"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={() => setIsImageViewerVisible(false)}
      >
        <View style={mapStyles.imageViewer}>
          <FlatList
            data={photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={imageViewerIndex}
            getItemLayout={(_, index) => ({
              length: windowWidth,
              offset: windowWidth * index,
              index,
            })}
            keyExtractor={photo => photo.uri}
            onMomentumScrollEnd={event => {
              const nextIndex = Math.round(
                event.nativeEvent.contentOffset.x / windowWidth
              );
              setImageViewerIndex(nextIndex);
            }}
            renderItem={({ item }) => (
              <View style={[mapStyles.imageViewerSlide, { width: windowWidth }]}>
                <Image
                  source={{ uri: item.uri }}
                  style={mapStyles.imageViewerImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />

          <View style={mapStyles.imageViewerTopBar}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setIsImageViewerVisible(false)}
              style={mapStyles.imageViewerCloseButton}
              accessibilityRole="button"
              accessibilityLabel="Close image viewer"
            >
              <Text style={mapStyles.imageViewerCloseText}>×</Text>
            </TouchableOpacity>

            <Text style={mapStyles.imageViewerCounter}>
              {imageViewerIndex + 1} / {photos.length}
            </Text>
          </View>

          {attribution && (
            <View style={mapStyles.imageViewerAttribution}>
              <Text style={mapStyles.imageViewerAttributionText} numberOfLines={2}>
                {attribution}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    );
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
        ? `${rating.toFixed(1)} / 5${selectedPlaceDetails?.userRatingCount
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
      googlePhotoUri &&
      photoUri === googlePhotoUri &&
      selectedPlaceDetails?.photoAttributions?.length
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
    const previewPhotoIndex = Math.max(
      0,
      getSelectedPlacePhotos().findIndex(photo => photo.uri === photoUri)
    );
    const placeSheetBackdropOpacity = placeSheetTranslateY.interpolate({
      inputRange: [0, Math.max(1, collapsedPlaceSheetTranslateY)],
      outputRange: [0.18, 0],
      extrapolate: "clamp",
    });
    const placeSheetTopPaddingOpacity = placeSheetTranslateY.interpolate({
      inputRange: [
        0,
        Math.max(1, collapsedPlaceSheetTranslateY * 0.55),
        Math.max(2, collapsedPlaceSheetTranslateY),
      ],
      outputRange: [1, 0.35, 0],
      extrapolate: "clamp",
    });

    return (
      <>
        <Animated.View
          pointerEvents="none"
          style={[
            mapStyles.placeInfoBackdrop,
            { opacity: placeSheetBackdropOpacity },
          ]}
        />

        <Animated.View
          pointerEvents="none"
          style={[
            mapStyles.placeInfoTopPadding,
            {
              height: placeSheetTopInset,
              backgroundColor: colour.surfaceSecondary,
              opacity: placeSheetTopPaddingOpacity,
            },
          ]}
        />

        <Animated.View
          {...placeSheetPanResponder.panHandlers}
          renderToHardwareTextureAndroid
          shouldRasterizeIOS
          style={[
            mapStyles.placeInfoCard,
            {
              backgroundColor: colour.surface,
              borderColor: colour.border,
              borderTopColor: colour.primary,
              height: expandedPlaceSheetHeight,
              transform: [{ translateY: placeSheetTranslateY }],
            },
          ]}
        >
          {photoUri ? (
            <View
              style={[
                mapStyles.placeInfoImageWrap,
                { height: placeInfoImageHeight },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => openImageViewer(previewPhotoIndex)}
                style={mapStyles.placeInfoImageButton}
                accessibilityRole="imagebutton"
                accessibilityLabel="Open support location photos full screen"
              >
                <Image
                  source={{ uri: photoUri }}
                  style={mapStyles.placeInfoImage}
                  resizeMode="cover"
                  onError={() => setHasPhotoLoadFailed(true)}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.78}
                onPress={() => handleClosePlaceInfo()}
                style={mapStyles.placeInfoImageCloseIcon}
                accessibilityRole="button"
                accessibilityLabel="Close support location details"
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.78}
                onPress={() => openImageViewer(previewPhotoIndex)}
                style={mapStyles.placeInfoImageExpandIcon}
                accessibilityRole="button"
                accessibilityLabel="Expand support location photo"
              >
                <Ionicons name="expand-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              {photoAttribution && (
                <View
                  pointerEvents="none"
                  style={mapStyles.placeInfoPhotoCreditPill}
                >
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
                {
                  backgroundColor: colour.surfaceSecondary,
                  height: placeInfoImageHeight,
                },
              ]}
            >
              <Text
                style={[
                  mapStyles.placeInfoImagePlaceholderText,
                  { color: colour.textSecondary },
                ]}
              >
                {isPlaceDetailsLoading
                  ? "Loading image preview"
                  : "No image preview yet"}
              </Text>

              <TouchableOpacity
                activeOpacity={0.78}
                onPress={() => handleClosePlaceInfo()}
                style={mapStyles.placeInfoImageCloseIcon}
                accessibilityRole="button"
                accessibilityLabel="Close support location details"
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.78}
            onPress={() => {
              if (isPlaceSheetExpanded) {
                collapsePlaceSheet();
              } else {
                expandPlaceSheet();
              }
            }}
            style={[
              mapStyles.placeInfoDragHandleTouchArea,
              {
                backgroundColor: colour.surfaceSecondary,
                borderBottomColor: colour.border,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={
              isPlaceSheetExpanded
                ? "Minimise support location details"
                : "Expand support location details"
            }
          >
            <View
              style={[
                mapStyles.placeInfoDragHandle,
                { backgroundColor: colour.textSecondary },
              ]}
            />
          </TouchableOpacity>

          <ScrollView
            ref={placeInfoScrollRef}
            style={mapStyles.placeInfoScroll}
            contentContainerStyle={mapStyles.placeInfoBody}
            scrollEnabled={isPlaceSheetExpanded}
            nestedScrollEnabled
            showsVerticalScrollIndicator={isPlaceSheetExpanded}
            scrollEventThrottle={16}
            onScroll={event => {
              placeInfoScrollOffsetY.current = event.nativeEvent.contentOffset.y;
            }}
          >
            <View
              style={[
                mapStyles.placeInfoHeader,
                { borderBottomColor: colour.border },
              ]}
            >
              <View style={mapStyles.placeInfoContent}>
                <Text
                  style={[mapStyles.placeInfoTitle, { color: colour.text }]}
                  numberOfLines={2}
                >
                  {title}
                </Text>

                <Text
                  style={[mapStyles.placeInfoMeta, { color: statusColor }]}
                  numberOfLines={2}
                >
                  {formatPlaceType(selectedPlace.type)} • {liveOpenText ?? placeStatusLabels[status]}
                </Text>
              </View>
            </View>

            {address && (
              <Text
                style={[
                  mapStyles.placeInfoAddress,
                  { color: colour.textSecondary },
                ]}
                numberOfLines={2}
              >
                {address}
              </Text>
            )}

            <View
              style={[
                mapStyles.placeInfoActions,
                { borderTopColor: colour.border },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleOpenSelectedPlaceInMaps}
                style={[
                  mapStyles.placeInfoButton,
                  {
                    backgroundColor: colour.primary,
                    borderColor: colour.primaryHover,
                  },
                ]}
              >
                <Text style={mapStyles.placeInfoButtonText}>Directions</Text>
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

            <View
              pointerEvents={isPlaceSheetExpanded ? "auto" : "none"}
              style={mapStyles.placeInfoDetailsReveal}
            >
              {isPlaceDetailsLoading && (
                <View style={mapStyles.placeInfoLoadingRow}>
                  <ActivityIndicator />
                  <Text
                    style={[
                      mapStyles.placeInfoLoadingText,
                      { color: colour.textSecondary },
                    ]}
                  >
                    Loading service details...
                  </Text>
                </View>
              )}

              {ratingText && (
                <View
                  style={[
                    mapStyles.placeInfoRow,
                    { borderTopColor: colour.border },
                  ]}
                >
                  <Text
                    style={[
                      mapStyles.placeInfoLabel,
                      { color: colour.textSecondary },
                    ]}
                  >
                    Google rating
                  </Text>
                  <Text style={[mapStyles.placeInfoValue, { color: colour.text }]}>
                    {ratingText}
                  </Text>
                </View>
              )}

              {selectedPlaceDetails?.phoneNumber && (
                <View
                  style={[
                    mapStyles.placeInfoRow,
                    { borderTopColor: colour.border },
                  ]}
                >
                  <Text
                    style={[
                      mapStyles.placeInfoLabel,
                      { color: colour.textSecondary },
                    ]}
                  >
                    Phone
                  </Text>
                  <Text style={[mapStyles.placeInfoValue, { color: colour.text }]}>
                    {selectedPlaceDetails.phoneNumber}
                  </Text>
                </View>
              )}

              {businessStatus && (
                <View
                  style={[
                    mapStyles.placeInfoRow,
                    { borderTopColor: colour.border },
                  ]}
                >
                  <Text
                    style={[
                      mapStyles.placeInfoLabel,
                      { color: colour.textSecondary },
                    ]}
                  >
                    Service status
                  </Text>
                  <Text style={[mapStyles.placeInfoValue, { color: colour.text }]}>
                    {businessStatus}
                  </Text>
                </View>
              )}

              {placeDetailsError && (
                <Text
                  style={[
                    mapStyles.placeInfoError,
                    { color: colour.textSecondary },
                  ]}
                >
                  {placeDetailsError}
                </Text>
              )}

              <View
                style={[
                  mapStyles.placeInfoExpandedSection,
                  { borderColor: colour.border },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={toggleOpeningHoursList}
                  style={mapStyles.placeInfoHoursToggle}
                >
                  <View style={mapStyles.placeInfoHoursToggleTextWrap}>
                    <Text
                      style={[
                        mapStyles.placeInfoSectionTitle,
                        { color: colour.text },
                      ]}
                    >
                      Opening hours
                    </Text>
                    <Text
                      style={[
                        mapStyles.placeInfoHoursSummary,
                        { color: colour.textSecondary },
                      ]}
                    >
                      {liveOpenText ?? placeStatusLabels[status]}
                    </Text>
                  </View>

                  <View style={mapStyles.placeInfoHoursToggleAction}>
                    <Text
                      style={[
                        mapStyles.placeInfoHoursToggleHint,
                        { color: colour.textSecondary },
                      ]}
                    >
                      {isOpeningHoursListVisible ? "Hide" : "View"}
                    </Text>
                    <Ionicons
                      name={
                        isOpeningHoursListVisible
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={18}
                      color={colour.textSecondary}
                    />
                  </View>
                </TouchableOpacity>

                {isOpeningHoursListVisible &&
                  openingHourDescriptions.map(line => (
                    <Text
                      key={line}
                      style={[
                        mapStyles.placeInfoHoursText,
                        { color: colour.textSecondary },
                      ]}
                    >
                      {line}
                    </Text>
                  ))}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </>
    );
  }

  return (
    <View
      style={[mapStyles.container, { backgroundColor: colour.background }]}
      onLayout={event => {
        const nextHeight = Math.ceil(event.nativeEvent.layout.height);

        const heightChanged = Math.abs(nextHeight - mapViewportHeight) > 2;

        if (nextHeight > 0 && heightChanged && !selectedPlace) {
          setMapViewportHeight(nextHeight);
        }
      }}
    >
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
        <View
          style={[
            mapStyles.cacheBadge,
            { backgroundColor: colour.surface, borderColor: colour.border },
          ]}
        >
          <Text style={[mapStyles.cacheBadgeText, { color: colour.textSecondary }]}>
            Cached
          </Text>
        </View>
      )}

      {renderSelectedPlaceInfo()}

      {showRecenterButton && userCoordinate && !selectedPlace && (
        <Animated.View
          style={[
            mapStyles.recenterButtonWrapper,
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

      {renderImageViewer()}

      {!hasLocationPermission && (
        <View
          style={[
            mapStyles.permissionCard,
            {
              backgroundColor: colour.surface,
              borderColor: colour.border,
              borderLeftColor: colour.primary,
            },
          ]}
        >
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
