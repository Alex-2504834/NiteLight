import { Text, View } from "react-native";

import { globalStyles } from "../theme/styles";
import { useTheme } from "../theme/useTheme";

export default function SettingsScreen() {
    const { colour } = useTheme();

    return (
        <View style={[globalStyles.screen, {backgroundColor: colour.background}]}>
          <Text style={[globalStyles.title, {color: colour.text}]}>Setting Screen</Text>
        </View>
    );
}
