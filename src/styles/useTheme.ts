import { useColorScheme } from "react-native";

import { useAppPreferences } from "../settings/AppPreferencesContext";
import { darkColours, lightColours } from "./theme";

export function useTheme() {
  const systemColourScheme = useColorScheme();
  const { themePreference } = useAppPreferences();
  const isDarkMode =
    themePreference === "dark" ||
    (themePreference === "system" && systemColourScheme === "dark");

  return {
    isDarkMode,
    colour: isDarkMode ? darkColours : lightColours,
  };
}
