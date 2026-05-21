import { useColorScheme } from "react-native";

import { darkColours, lightColours } from "./colour";

export function useTheme() {
    const isDarkMode = useColorScheme() === "dark";

    return {isDarkMode, colour: isDarkMode ? darkColours : lightColours};
}