import { Dispatch, SetStateAction } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { signInWithGoogle } from "../../services/auth";
import { useTheme } from "../../theme/useTheme";
import { AuthActionRunner, FieldErrors } from "./authTypes";
import ActionButton from "./components/ActionButton";

type PlatformsScreenProps = {
  isLoading: boolean;
  runAuthAction: AuthActionRunner;
  onBackToChoice: () => void;
  setErrors: Dispatch<SetStateAction<FieldErrors>>;
};

export default function PlatformsScreen({
  isLoading,
  runAuthAction,
  onBackToChoice,
  setErrors,
}: PlatformsScreenProps) {
  const { colour } = useTheme();

  function handleGooglePress() {
    runAuthAction(signInWithGoogle);
  }

  return (
    <View style={styles.formStack}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onBackToChoice}
        style={styles.topBackButton}
      >
        <Ionicons name="chevron-back" size={22} color={colour.textSecondary} />
        <Text style={[styles.backButtonText, { color: colour.textSecondary }]}>Back</Text>
      </TouchableOpacity>

      <Text style={[styles.formTitle, { color: colour.text }]}>Continue with another platform</Text>

      <Text style={[styles.formSubtitle, { color: colour.textSecondary }]}>Choose a provider to continue into NiteLight.</Text>

      <ActionButton
        icon="logo-google"
        label="Continue with Google"
        onPress={handleGooglePress}
        backgroundColor={colour.surface}
        textColor={colour.text}
        borderColor={colour.border}
        disabled={isLoading}
      />

      <ActionButton
        icon="logo-apple"
        label="Continue with Apple"
        onPress={() => setErrors({ general: "Apple sign-in is not set up yet." })}
        backgroundColor={colour.surface}
        textColor={colour.text}
        borderColor={colour.border}
        disabled={isLoading}
      />

      <ActionButton
        icon="logo-facebook"
        label="Continue with Facebook"
        onPress={() => setErrors({ general: "Facebook sign-in is not set up yet." })}
        backgroundColor={colour.surface}
        textColor={colour.text}
        borderColor={colour.border}
        disabled={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formStack: { gap: 14 },
  topBackButton: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", marginBottom: 18 },
  backButtonText: { fontSize: 15, fontWeight: "700" },
  formTitle: { fontSize: 28, fontWeight: "800" },
  formSubtitle: { marginTop: 6, fontSize: 15, lineHeight: 21 },
});
