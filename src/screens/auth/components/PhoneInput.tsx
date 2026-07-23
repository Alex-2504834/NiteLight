import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { authStyles } from "../../../styles/global";
import { useTheme } from "../../../styles/useTheme";
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
    <View style={authStyles.inputGroup}>
      <Text style={[authStyles.inputLabel, { color: colour.textSecondary }]}>{label}</Text>
      <View
        style={[
          authStyles.phoneRow,
          {
            backgroundColor: colour.surface,
            borderColor: error ? colour.error : colour.border,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.75}
          style={[authStyles.countryButton, { borderRightColor: colour.border }]}
          onPress={onCountryPress}
        >
          <Text style={[authStyles.countryButtonText, { color: colour.text }]}>
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
          style={[authStyles.phoneInput, { color: colour.text }]}
        />
      </View>
      {error && <Text style={[authStyles.fieldError, { color: colour.error }]}>{error}</Text>}
    </View>
  );
}
