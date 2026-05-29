import { Alert, Text, TouchableOpacity, View } from "react-native";

import { seedPlaces } from "../dev/seedPlaces";
import { globalStyles } from "../theme/styles";
import { useTheme } from "../theme/useTheme";

export default function HomeScreen() {
  const { colour } = useTheme();

  async function handleSeedPlaces() {
    try {
      await seedPlaces();

      Alert.alert("Done", "Places seeded into Firebase.");
    } catch (error) {
      console.error(error);

      Alert.alert("Error", "Failed to seed places. Check the console.");
    }
  }

  return (
    <View style={[globalStyles.screen, { backgroundColor: colour.background }]}>
      <Text style={[globalStyles.title, { color: colour.text }]}>
        Home Screen
      </Text>

      <TouchableOpacity
        onPress={handleSeedPlaces}
        style={{
          marginTop: 20,
          backgroundColor: colour.primary,
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 999,
        }}
      >
        <Text style={{ color: "#1F2122", fontWeight: "700" }}>
          Seed places
        </Text>
      </TouchableOpacity>
    </View>
  );
}