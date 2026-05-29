import { ComponentProps } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { useTheme } from "../../../theme/useTheme";

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
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colour.textSecondary }]}>{label}</Text>
      <TextInput
        placeholderTextColor={colour.textSecondary}
        style={[
          styles.input,
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
        <Text style={[styles.fieldError, { color: colour.error }]}>{error}</Text>
      ) : helperText ? (
        <Text style={[styles.helperText, { color: colour.textSecondary }]}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: { gap: 7 },
  inputLabel: { fontSize: 13, fontWeight: "700" },
  input: { minHeight: 52, borderRadius: 999, borderWidth: 1, paddingHorizontal: 18, fontSize: 16 },
  helperText: { fontSize: 12, lineHeight: 17 },
  fieldError: { fontSize: 12, lineHeight: 17, fontWeight: "700" },
});
