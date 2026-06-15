import { Dispatch, SetStateAction } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { signInWithGoogle } from "../../services/auth";
import { authStyles } from "../../styles/global";
import { useTheme } from "../../styles/useTheme";
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
    <View style={authStyles.formStack}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onBackToChoice}
        style={authStyles.topBackButton}
      >
        <Ionicons name="chevron-back" size={22} color={colour.textSecondary} />
        <Text style={[authStyles.backButtonText, { color: colour.textSecondary }]}>Back</Text>
      </TouchableOpacity>

      <Text style={[authStyles.formTitle, { color: colour.text }]}>Continue with another platform</Text>

      <Text style={[authStyles.formSubtitle, { color: colour.textSecondary }]}>Choose a provider to continue into NiteLight.</Text>

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
