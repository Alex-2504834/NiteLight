import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { continueAsGuest } from "../services/auth";
import { authStyles } from "../styles/global";
import { colors } from "../styles/theme";
import { useTheme } from "../styles/useTheme";
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
      style={[authStyles.screen, { backgroundColor: colour.background }]}
    >
      <ScrollView
        contentContainerStyle={[
          authStyles.content,
          isChoiceMode && authStyles.choiceContent,
          isSignUpMode && authStyles.signUpContent,
          (isLoginMode || isPlatformsMode) && authStyles.upperContent,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {showBrand && (
          <Animated.View
            style={[
              authStyles.brandLockup,
              {
                transform: [{ scale: logoScale }],
                opacity: isChoiceMode ? choiceOpacity : 1,
              },
            ]}
          >
            <View style={[authStyles.logoMark, { backgroundColor: colour.primary }]}>
              <Ionicons name="bulb-outline" size={34} color={colors.brandText} />
            </View>

            <Text style={[authStyles.appName, { color: colour.text }]}>NiteLight</Text>
            <View
              style={[authStyles.brandRule, { backgroundColor: colour.primary }]}
            />

            <Text style={[authStyles.subtitle, { color: colour.textSecondary }]}>Find nearby food, essentials and support services.</Text>
          </Animated.View>
        )}

        {isChoiceMode && (
          <Animated.View style={[authStyles.choiceStack, { opacity: choiceOpacity }]}>
            <ActionButton
              icon="person-add-outline"
              label="Sign up"
              onPress={openSignUp}
              backgroundColor={colour.primary}
              textColor={colors.brandText}
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
          <Text style={[authStyles.generalError, { color: colour.error }]}>{errors.general}</Text>
        )}

        {isLoading && (
          <View style={authStyles.loadingOverlay}>
            <ActivityIndicator color={colour.primary} />
          </View>
        )}

        {(isSignUpMode || isLoginMode || isPlatformsMode) && (
          <Text style={[authStyles.securityNote, { color: colour.textSecondary }]}>Passwords are handled securely</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
