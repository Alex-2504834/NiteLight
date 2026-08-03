import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { loginWithIdentifier } from "../../services/auth";
import { authStyles } from "../../styles/global";
import { colors } from "../../styles/theme";
import { useTheme } from "../../styles/useTheme";
import { AuthActionRunner, FieldErrors } from "./authTypes";
import ActionButton from "./components/ActionButton";
import AuthInput from "./components/AuthInput";

type LoginScreenProps = {
  isLoading: boolean;
  runAuthAction: AuthActionRunner;
  onBackToChoice: () => void;
};

function cleanValue(value: string) {
  return value.trim();
}

function hasValue(value: string) {
  return cleanValue(value).length > 0;
}

export default function LoginScreen({
  isLoading,
  runAuthAction,
  onBackToChoice,
}: LoginScreenProps) {
  const { colour } = useTheme();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleLogin() {
    const nextErrors: FieldErrors = {};

    if (!hasValue(identifier)) {
      nextErrors.loginUsername = "Enter your email, phone number, or username.";
    }

    if (!hasValue(password)) {
      nextErrors.loginPassword = "Enter your password.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    runAuthAction(() => loginWithIdentifier({ identifier, password }));
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

      <View style={authStyles.formHeader}>
        <Text style={[authStyles.formTitle, { color: colour.text }]}>Welcome back</Text>
        <View
          style={[authStyles.formRule, { backgroundColor: colour.primary }]}
        />
      </View>

      <AuthInput
        label="Email, phone, or username"
        value={identifier}
        onChangeText={value => {
          setIdentifier(value);
          setErrors(current => ({ ...current, loginUsername: undefined }));
        }}
        placeholder="alex@email.com, +447123456789, or nitelight_user"
        autoCapitalize="none"
        autoCorrect={false}
        colour={colour}
        error={errors.loginUsername}
      />

      <AuthInput
        label="Password"
        value={password}
        onChangeText={value => {
          setPassword(value);
          setErrors(current => ({ ...current, loginPassword: undefined }));
        }}
        placeholder="Your password"
        secureTextEntry
        colour={colour}
        error={errors.loginPassword}
      />

      <ActionButton
        icon="log-in-outline"
        label="Log in"
        onPress={handleLogin}
        backgroundColor={colour.primary}
        textColor={colors.brandText}
        disabled={isLoading}
      />
    </View>
  );
}
