import { ComponentProps } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

type ActionButtonProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  disabled?: boolean;
};

export default function ActionButton({
  icon,
  label,
  onPress,
  backgroundColor,
  textColor,
  borderColor,
  disabled,
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.82}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.actionButton, {
          backgroundColor,
          borderColor: borderColor || backgroundColor,
          opacity: disabled ? 0.6 : 1,
        },
      ]}>
        
      <Ionicons name={icon} size={20} color={textColor} />
      <Text style={[styles.actionButtonText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    minHeight: 54,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "800",
  },
});
