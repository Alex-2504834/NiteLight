import { ComponentProps } from "react";
import { Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { authStyles } from "../../../styles/global";
import { opacity } from "../../../styles/theme";

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
        authStyles.actionButton,
        {
          backgroundColor,
          borderColor: borderColor || backgroundColor,
          opacity: disabled ? opacity.disabled : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={textColor} />
      <Text style={[authStyles.actionButtonText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}
