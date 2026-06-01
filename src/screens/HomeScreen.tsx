import { useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";

import { seedPlaces } from "../dev/seedPlaces";
import { createTestPaymentSheet } from "../services/payments";
import { globalStyles } from "../theme/styles";
import { useTheme } from "../theme/useTheme";

export default function HomeScreen() {
  const { colour } = useTheme();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  async function handleSeedPlaces() {
    try {
      await seedPlaces();

      Alert.alert("Done", "Places seeded into Firebase.");
    } catch (error) {
      console.error(error);

      Alert.alert("Error", "Failed to seed places. Check the console.");
    }
  }

  async function handleTestPayment() {
    try {
      setIsPaymentLoading(true);

      const paymentSheet = await createTestPaymentSheet();

      const initResult = await initPaymentSheet({
        merchantDisplayName: "NiteLight",
        paymentIntentClientSecret: paymentSheet.paymentIntentClientSecret,
        allowsDelayedPaymentMethods: false,
      });

      if (initResult.error) {
        Alert.alert("Payment setup failed", initResult.error.message);
        return;
      }

      const paymentResult = await presentPaymentSheet();

      if (paymentResult.error) {
        Alert.alert("Payment failed", paymentResult.error.message);
        return;
      }

      Alert.alert("Payment complete", "Stripe test payment succeeded.");
    } catch (error) {
      console.error(error);

      const message = error instanceof Error ? error.message : "Something went wrong.";
      Alert.alert("Payment error", message);
    } finally {
      setIsPaymentLoading(false);
    }
  }

  const buttonStyle = {
    marginTop: 20,
    backgroundColor: colour.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    minWidth: 180,
    alignItems: "center" as const,
  };

  return (
    <View style={[globalStyles.screen, { backgroundColor: colour.background }]}>
      <Text style={[globalStyles.title, { color: colour.text }]}>
        Home Screen
      </Text>

      <TouchableOpacity onPress={handleSeedPlaces} style={buttonStyle}>
        <Text style={{ color: "#1F2122", fontWeight: "700" }}>
          Seed places
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={isPaymentLoading}
        onPress={handleTestPayment}
        style={[buttonStyle, { opacity: isPaymentLoading ? 0.6 : 1 }]}
      >
        {isPaymentLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={{ color: "#1F2122", fontWeight: "700" }}>
            Test Stripe payment
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
