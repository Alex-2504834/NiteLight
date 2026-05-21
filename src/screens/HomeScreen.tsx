import { Text, View, Image } from "react-native";

import { globalStyles } from "../theme/styles";
import { useTheme } from "../theme/useTheme";

export default function HomeScreen() {
    const { colour } = useTheme();

    return (
        <View
            style={[
                globalStyles.screen,
                { backgroundColor: colour.background }
            ]}
        >
<Image
    source={require("../../assets/logo.png")}
    style={{
        width: 200,
        height: 200,
    }}
/>

            <Text
                style={[
                    globalStyles.title,
                    { color: colour.text }
                ]}
            >
                Home Screen
            </Text>
        </View>
    );
}