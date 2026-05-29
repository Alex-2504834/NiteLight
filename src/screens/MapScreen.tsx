import { useEffect, useRef, useState } from "react";
import {
  Animated,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Mapbox, { Camera, Location } from "@rnmapbox/maps";

import { appConfig } from "../config/appConfig";
import { useTheme } from "../theme/useTheme";
import { listenToPlaces, NiteLightPlace } from "../services/places";
import LightBulbMarker from "../components/LightBulbMarker";
import { getPlaceBrightness } from "../utils/placeStatus";

Mapbox.setAccessToken(appConfig.mapboxAccessToken);

type Coordinate = [number, number];

export default function MapScreen() {
  const { colour } = useTheme();
  const cameraRef = useRef<Camera>(null);

  const recenterTranslateX = useRef(new Animated.Value(150)).current;
  const recenterWidth = useRef(new Animated.Value(132)).current;
  const recenterTextOpacity = useRef(new Animated.Value(1)).current;
  const recenterInnerPadding = useRef(new Animated.Value(0)).current;

  const [places, setPlaces] = useState<NiteLightPlace[]>([]);
  const [placesFromCache, setPlacesFromCache] = useState(false);
  const [now, setNow] = useState(new Date());

  const [hasLocationPermission, setHasLocationPermission] = useState(
    Platform.OS === "ios"
  );

  const [userCoordinate, setUserCoordinate] = useState<Coordinate | null>(null);
  const [hasCenteredOnce, setHasCenteredOnce] = useState(false);
  const [showRecenterButton, setShowRecenterButton] = useState(false);
  const [isRecenterCollapsed, setIsRecenterCollapsed] = useState(false);

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

  return (
    <View style={[styles.container, { backgroundColor: colour.background }]}>
      <Mapbox.MapView
        style={styles.map}
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
            >
              <View style={styles.placeMarker}>
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
        <View style={[styles.cacheBadge, { backgroundColor: colour.surface }]}>
          <Text style={[styles.cacheBadgeText, { color: colour.textSecondary }]}>
            Cached
          </Text>
        </View>
      )}

      {showRecenterButton && userCoordinate && (
        <Animated.View
          style={[
            styles.recenterButtonWrapper,
            {
              transform: [{ translateX: recenterTranslateX }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={0.85} onPress={handleRecenterPress}>
            <Animated.View
              style={[
                styles.recenterButton,
                {
                  width: recenterWidth,
                  paddingLeft: recenterInnerPadding,
                  paddingRight: recenterInnerPadding,
                  backgroundColor: colour.surface,
                  borderColor: colour.border,
                },
              ]}
            >
              <Text style={[styles.recenterIcon, { color: colour.text }]}>
                ⌖
              </Text>

              {!isRecenterCollapsed && (
                <Animated.Text
                  style={[
                    styles.recenterButtonText,
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
        <View style={[styles.permissionCard, { backgroundColor: colour.surface }]}>
          <Text style={[styles.permissionText, { color: colour.text }]}>
            Allow location to show where you are on the map.
          </Text>

          <TouchableOpacity
            style={[styles.permissionButton, { backgroundColor: colour.primary }]}
            onPress={requestLocationPermission}
          >
            <Text style={styles.permissionButtonText}>Enable location</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  placeMarker: {
    width: 54,
    height: 54,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },

  cacheBadge: {
    position: "absolute",
    left: 16,
    top: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    opacity: 0.9,
  },

  cacheBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  recenterButtonWrapper: {
    position: "absolute",
    right: 0,
    bottom: 110,
  },

  recenterButton: {
    height: 48,
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderRightWidth: 0,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  recenterIcon: {
    fontSize: 22,
    fontWeight: "700",
  },

  recenterButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "700",
  },

  permissionCard: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 30,
    borderRadius: 24,
    padding: 16,
  },

  permissionText: {
    fontSize: 15,
    marginBottom: 12,
  },

  permissionButton: {
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },

  permissionButtonText: {
    color: "#1F2122",
    fontWeight: "700",
  },
});