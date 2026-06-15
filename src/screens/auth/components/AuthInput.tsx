import { ComponentProps } from "react";
import { Text, TextInput, View } from "react-native";

import { authStyles } from "../../../styles/global";
import { useTheme } from "../../../styles/useTheme";

type AuthInputProps = ComponentProps<typeof TextInput> & {
  label: string;
  colour: ReturnType<typeof useTheme>["colour"];
  error?: string;
  helperText?: string;
};

export default function AuthInput({
  label,
  colour,
  style,
  error,
  helperText,
  ...props
}: AuthInputProps) {
  return (
    <View style={authStyles.inputGroup}>
      <Text style={[authStyles.inputLabel, { color: colour.textSecondary }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colour.textSecondary}
        style={[
          authStyles.input,
          {
            backgroundColor: colour.surface,
            borderColor: error ? colour.error : colour.border,
            color: colour.text,
          },
          style,
        ]}
        {...props}
      />
      {error ? (
        <Text style={[authStyles.fieldError, { color: colour.error }]}>{error}</Text>
      ) : helperText ? (
        <Text style={[authStyles.helperText, { color: colour.textSecondary }]}>{helperText}</Text>
      ) : null}
    </View>
  );
}
