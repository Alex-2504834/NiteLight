import { Text, View } from "react-native";

import { globalStyles } from "../theme/styles";
import { useTheme } from "../theme/useTheme";

export default function HomeScreen() {
    const { colour } = useTheme();

    return (
        <View style={[globalStyles.screen, {backgroundColor: colour.background}]}>
          <Text style={[globalStyles.title, {color: colour.text}]}>Home Screen</Text>
        </View>
    );
}
