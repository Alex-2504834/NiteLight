import { Text, View, Image } from "react-native";

import { seedPlaces } from "../dev/seedPlaces";
import { createTestPaymentSheet } from "../services/payments";
import { globalStyles, homeStyles } from "../styles/global";
import { opacity } from "../styles/theme";
import { useTheme } from "../styles/useTheme";

export default function HomeScreen() {
  const { colour } = useTheme();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

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
