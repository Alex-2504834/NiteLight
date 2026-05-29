import React from "react";
import { StyleSheet, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

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

  const iconName = value <= 0 ? "bulb-outline" : "bulb";

  const bulbColor =
    value >= 75
      ? "#FFD84D"
      : value >= 45
        ? "#D9A93B"
        : value > 0
          ? "#8F7B4C"
          : "#666666";

  return (
    <View
      style={[
        styles.container,
        {
          width: size + 22,
          height: size + 22,
          shadowColor: "#FFD84D",
          shadowOpacity: glow * 0.9,
          shadowRadius: 4 + glow * 12,
          shadowOffset: { width: 0, height: 0 },
          elevation: value > 0 ? 6 : 0,
        },
      ]}
    >
      <View
        style={[
          styles.glow,
          {
            opacity: glow * 0.45,
            width: size + glow * 22,
            height: size + glow * 22,
            borderRadius: 999,
          },
        ]}
      />

      <Ionicons name={iconName} size={size} color={bulbColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },

  glow: {
    position: "absolute",
    backgroundColor: "#FFD84D",
  },
});
