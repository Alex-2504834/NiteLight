import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { continueAsGuest } from "../services/auth";
import { useTheme } from "../theme/useTheme";
import { AuthMode, FieldErrors } from "./auth/authTypes";
import ActionButton from "./auth/components/ActionButton";
import LoginScreen from "./auth/LoginScreen";
import PlatformsScreen from "./auth/PlatformsScreen";
import SignUpScreen from "./auth/SignUpScreen";

type InitialScreenProps = {
  onComplete: () => void;
};

export default function InitialScreen({ onComplete }: InitialScreenProps) {
  const { colour } = useTheme();
  const signUpAnimation = useRef(new Animated.Value(0)).current;

  const [mode, setMode] = useState<AuthMode>("choice");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const choiceOpacity = signUpAnimation.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [1, 0, 0],
  });

  const logoScale = signUpAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.82],
  });

  async function runAuthAction(action: () => Promise<unknown>) {
    try {
      setIsLoading(true);
      setErrors({});

      await action();

      onComplete();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  }

  function openSignUp() {
    setErrors({});
    setMode("signup");

    signUpAnimation.setValue(0);

    Animated.spring(signUpAnimation, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 55,
    }).start();
  }

  function openLogin() {
    setErrors({});
    setMode("login");
    signUpAnimation.setValue(1);
  }

  function openPlatforms() {
    setErrors({});
    setMode("platforms");
    signUpAnimation.setValue(1);
  }

  function goBackToChoice() {
    Animated.timing(signUpAnimation, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setErrors({});
      setMode("choice");
    });
  }

  function handleGuestPress() {
    runAuthAction(continueAsGuest);
  }

  const isChoiceMode = mode === "choice";
  const isSignUpMode = mode === "signup";
  const isLoginMode = mode === "login";
  const isPlatformsMode = mode === "platforms";
  const showBrand = isChoiceMode;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.screen, { backgroundColor: colour.background }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          isChoiceMode && styles.choiceContent,
          isSignUpMode && styles.signUpContent,
          (isLoginMode || isPlatformsMode) && styles.upperContent,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {showBrand && (
          <Animated.View
            style={[
              styles.brandLockup,
              {
                transform: [{ scale: logoScale }],
                opacity: isChoiceMode ? choiceOpacity : 1,
              },
            ]}
          >
            <View style={[styles.logoMark, { backgroundColor: colour.primary }]}>
              <Ionicons name="bulb-outline" size={34} color="#1F2122" />
            </View>

            <Text style={[styles.appName, { color: colour.text }]}>NiteLight</Text>

            <Text style={[styles.subtitle, { color: colour.textSecondary }]}>Place Holder Text.</Text>
          </Animated.View>
        )}

        {isChoiceMode && (
          <Animated.View style={[styles.choiceStack, { opacity: choiceOpacity }]}>
            <ActionButton
              icon="person-add-outline"
              label="Sign up"
              onPress={openSignUp}
              backgroundColor={colour.primary}
              textColor="#1F2122"
              disabled={isLoading}
            />

            <ActionButton
              icon="log-in-outline"
              label="Log in"
              onPress={openLogin}
              backgroundColor={colour.surface}
              textColor={colour.text}
              borderColor={colour.border}
              disabled={isLoading}
            />

            <ActionButton
              icon="navigate-outline"
              label="Continue as guest"
              onPress={handleGuestPress}
              backgroundColor={colour.surfaceSecondary}
              textColor={colour.text}
              disabled={isLoading}
            />

            <ActionButton
              icon="apps-outline"
              label="Continue with other platforms"
              onPress={openPlatforms}
              backgroundColor={colour.surface}
              textColor={colour.text}
              borderColor={colour.border}
              disabled={isLoading}
            />
          </Animated.View>
        )}

        {isSignUpMode && (
          <SignUpScreen
            signUpAnimation={signUpAnimation}
            isLoading={isLoading}
            runAuthAction={runAuthAction}
            onBackToChoice={goBackToChoice}
          />
        )}

        {isLoginMode && (
          <LoginScreen
            isLoading={isLoading}
            runAuthAction={runAuthAction}
            onBackToChoice={goBackToChoice}
          />
        )}

        {isPlatformsMode && (
          <PlatformsScreen
            isLoading={isLoading}
            runAuthAction={runAuthAction}
            onBackToChoice={goBackToChoice}
            setErrors={setErrors}
          />
        )}

        {errors.general && (
          <Text style={[styles.generalError, { color: colour.error }]}>{errors.general}</Text>
        )}

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color={colour.primary} />
          </View>
        )}

        {(isSignUpMode || isLoginMode || isPlatformsMode) && (
          <Text style={[styles.securityNote, { color: colour.textSecondary }]}>Passwords are handled securely</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 },
  choiceContent: { justifyContent: "center", paddingTop: 24 },
  upperContent: { justifyContent: "flex-start", paddingTop: 64 },
  signUpContent: { justifyContent: "flex-start", paddingTop: 64 },
  brandLockup: { alignItems: "center", marginBottom: 26 },
  logoMark: { width: 68, height: 68, borderRadius: 999, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  appName: { fontSize: 34, fontWeight: "800" },
  subtitle: { marginTop: 8, fontSize: 16, lineHeight: 22, textAlign: "center" },
  choiceStack: { gap: 12 },
  generalError: { marginTop: 14, fontSize: 13, lineHeight: 18, fontWeight: "700", textAlign: "center" },
  securityNote: { marginTop: 20, fontSize: 12, lineHeight: 17, textAlign: "center" },
  loadingOverlay: { marginTop: 16, alignItems: "center" },
});
