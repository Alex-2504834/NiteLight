import React from "react";
import { View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  createLightBulbMarkerDynamicStyles,
  getLightBulbColour,
  markerStyles,
} from "../styles/global";

type LightBulbMarkerProps = {
  brightness: number;
  size?: number;
};

export default function LightBulbMarker({
  brightness,
  size = 30,
}: LightBulbMarkerProps) {
  const value = Math.max(0, Math.min(100, brightness));
  const glow = value / 100;
  const isLit = value > 0;

  const iconName = isLit ? "bulb" : "bulb-outline";
  const bulbColor = getLightBulbColour(value);
  const dynamicStyles = createLightBulbMarkerDynamicStyles({ size, glow, isLit });

  return (
    <View style={[markerStyles.container, dynamicStyles.container]}>
      <View style={[markerStyles.glow, dynamicStyles.glow]} />

      <Ionicons name={iconName} size={size} color={bulbColor} />
    </View>
  );
}
