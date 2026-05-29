import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useTheme } from "../../../theme/useTheme";
import { CountryCode } from "../authTypes";

type PhoneInputProps = {
  label: string;
  countryCode: CountryCode;
  onCountryPress: () => void;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  colour: ReturnType<typeof useTheme>["colour"];
  error?: string;
};

export default function PhoneInput({
  label,
  countryCode,
  onCountryPress,
  value,
  onChangeText,
  placeholder,
  colour,
  error,
}: PhoneInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colour.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.phoneRow,
          {
            backgroundColor: colour.surface,
            borderColor: error ? colour.error : colour.border,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.countryButton, { borderRightColor: colour.border }]}
          onPress={onCountryPress}
        >
          <Text style={[styles.countryButtonText, { color: colour.text }]}>
            {countryCode.flag} {countryCode.code}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colour.textSecondary} />
        </TouchableOpacity>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colour.textSecondary}
          keyboardType="phone-pad"
          style={[styles.phoneInput, { color: colour.text }]}
        />
      </View>
      {error && <Text style={[styles.fieldError, { color: colour.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: { gap: 7 },
  inputLabel: { fontSize: 13, fontWeight: "700" },
  phoneRow: { minHeight: 52, borderRadius: 999, borderWidth: 1, flexDirection: "row", alignItems: "center", overflow: "hidden" },
  countryButton: { height: "100%", paddingHorizontal: 14, borderRightWidth: 1, flexDirection: "row", alignItems: "center", gap: 5 },
  countryButtonText: { fontSize: 15, fontWeight: "700" },
  phoneInput: { flex: 1, height: "100%", paddingHorizontal: 14, fontSize: 16 },
  fieldError: { fontSize: 12, lineHeight: 17, fontWeight: "700" },
});
