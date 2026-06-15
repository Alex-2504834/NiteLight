import { useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { signUpWithUsername } from "../../services/auth";
import { authStyles } from "../../styles/global";
import { colors } from "../../styles/theme";
import { useTheme } from "../../styles/useTheme";
import { AuthActionRunner, CountryCode, FieldErrors, SignUpStep } from "./authTypes";
import ActionButton from "./components/ActionButton";
import AuthInput from "./components/AuthInput";
import PhoneInput from "./components/PhoneInput";

type SignUpScreenProps = {
  signUpAnimation: Animated.Value;
  isLoading: boolean;
  runAuthAction: AuthActionRunner;
  onBackToChoice: () => void;
};

const countryCodes: CountryCode[] = [
  { label: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { label: "Ireland", code: "+353", flag: "🇮🇪" },
  { label: "United States", code: "+1", flag: "🇺🇸" },
  { label: "Canada", code: "+1", flag: "🇨🇦" },
  { label: "France", code: "+33", flag: "🇫🇷" },
  { label: "Germany", code: "+49", flag: "🇩🇪" },
  { label: "Spain", code: "+34", flag: "🇪🇸" },
  { label: "Italy", code: "+39", flag: "🇮🇹" },
];

const passwordHelpText =
  "Password must be 8+ characters and include a capital letter and a symbol, such as ! @ # $ % & * ?.";

function cleanValue(value: string) {
  return value.trim();
}

function hasValue(value: string) {
  return cleanValue(value).length > 0;
}

function isValidEmail(value: string) {
  if (!hasValue(value)) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue(value).toLowerCase());
}

function isValidPhone(value: string) {
  if (!hasValue(value)) return true;
  return /^[0-9\s()-]{7,20}$/.test(cleanValue(value));
}

function isValidPassword(value: string) {
  const hasEnoughCharacters = value.length >= 8;
  const hasCapitalLetter = /[A-Z]/.test(value);
  const hasSymbol = /[!@#$%&*?._+\-=()[\]{};:'",<>/\\|`~^]/.test(value);
  return hasEnoughCharacters && hasCapitalLetter && hasSymbol;
}

function isValidUsername(value: string) {
  return /^[a-z0-9_.-]{3,32}$/.test(cleanValue(value).toLowerCase());
}

export default function SignUpScreen({
  signUpAnimation,
  isLoading,
  runAuthAction,
  onBackToChoice,
}: SignUpScreenProps) {
  const { colour } = useTheme();

  const [signUpStep, setSignUpStep] = useState<SignUpStep>(1);
  const [email, setEmail] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const formOpacity = signUpAnimation.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0, 0, 1],
  });

  const formTranslateY = signUpAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [90, 0],
  });

  function validateSignUpStepOne() {
    const nextErrors: FieldErrors = {};

    const cleanedEmail = cleanValue(email);
    const cleanedPhone = cleanValue(phoneNumber);

    if (!cleanedEmail && !cleanedPhone) {
      nextErrors.email = "Add an email address, phone number, or both.";
      nextErrors.phoneNumber = "Add an email address, phone number, or both.";
    }

    if (cleanedEmail && !isValidEmail(cleanedEmail)) {
      nextErrors.email = "Enter a valid email address, like example@email.com.";
    }

    if (cleanedPhone && !isValidPhone(cleanedPhone)) {
      nextErrors.phoneNumber = "Enter a valid phone number.";
    }

    if (!isValidPassword(password)) {
      nextErrors.password = passwordHelpText;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateSignUpStepTwo() {
    const nextErrors: FieldErrors = {};

    if (!isValidUsername(username)) {
      nextErrors.username =
        "Username must be 3-32 characters using letters, numbers, dots, dashes, or underscores.";
    }

    if (cleanValue(displayName).length < 2) {
      nextErrors.displayName = "Display name must be at least 2 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSignUpNext() {
    if (!validateSignUpStepOne()) return;
    setSignUpStep(2);
    setErrors({});
  }

  function handleCreateAccount() {
    if (!validateSignUpStepTwo()) return;

    const cleanedEmail = cleanValue(email);
    const cleanedPhone = cleanValue(phoneNumber);

    runAuthAction(() =>
      signUpWithUsername({
        username,
        displayName,
        password,
        email: cleanedEmail || undefined,
        phoneNumber: cleanedPhone
          ? `${selectedCountryCode.code}${cleanedPhone.replace(/[^0-9]/g, "").replace(/^0+/, "")}`
          : undefined,
      })
    );
  }

  return (
    <>
      <Animated.View
        style={[
          authStyles.formStack,
          authStyles.signUpPanel,
          {
            opacity: formOpacity,
            transform: [{ translateY: formTranslateY }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={signUpStep === 1 ? onBackToChoice : () => setSignUpStep(1)}
          style={authStyles.topBackButton}
        >
          <Ionicons name="chevron-back" size={22} color={colour.textSecondary} />
          <Text style={[authStyles.backButtonText, { color: colour.textSecondary }]}>Back</Text>
        </TouchableOpacity>

        <View style={authStyles.formHeader}>
          <Text style={[authStyles.formTitle, { color: colour.text }]}>
            {signUpStep === 1 ? "Create your account" : "Choose your profile"}
          </Text>

          <Text style={[authStyles.formSubtitle, { color: colour.textSecondary }]}>
            {signUpStep === 1
              ? "Add at least one contact method."
              : "Pick how people will see you in NiteLight."}
          </Text>
        </View>

        <View style={authStyles.stepDots}>
          <View
            style={[
              authStyles.stepDot,
              { backgroundColor: signUpStep === 1 ? colour.primary : colour.border },
            ]}
          />
          <View
            style={[
              authStyles.stepDot,
              { backgroundColor: signUpStep === 2 ? colour.primary : colour.border },
            ]}
          />
        </View>

        {signUpStep === 1 ? (
          <>
            <AuthInput
              label="Email"
              value={email}
              onChangeText={value => {
                setEmail(value);
                setErrors(current => ({ ...current, email: undefined }));
              }}
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              colour={colour}
              error={errors.email}
            />

            <PhoneInput
              label="Phone number"
              countryCode={selectedCountryCode}
              onCountryPress={() => setCountryModalVisible(true)}
              value={phoneNumber}
              onChangeText={value => {
                setPhoneNumber(value);
                setErrors(current => ({ ...current, phoneNumber: undefined }));
              }}
              placeholder="7123 456789"
              colour={colour}
              error={errors.phoneNumber}
            />

            <AuthInput
              label="Password"
              value={password}
              onChangeText={value => {
                setPassword(value);
                setErrors(current => ({ ...current, password: undefined }));
              }}
              placeholder="Make it strong"
              secureTextEntry
              colour={colour}
              error={errors.password}
              helperText={passwordHelpText}
            />

            <ActionButton
              icon="arrow-forward-outline"
              label="Next"
              onPress={handleSignUpNext}
              backgroundColor={colour.primary}
              textColor={colors.brandText}
              disabled={isLoading}
            />
          </>
        ) : (
          <>
            <AuthInput
              label="Username"
              value={username}
              onChangeText={value => {
                setUsername(value);
                setErrors(current => ({ ...current, username: undefined }));
              }}
              placeholder="nitelight_user"
              autoCapitalize="none"
              autoCorrect={false}
              colour={colour}
              error={errors.username}
            />

            <AuthInput
              label="Display name"
              value={displayName}
              onChangeText={value => {
                setDisplayName(value);
                setErrors(current => ({ ...current, displayName: undefined }));
              }}
              placeholder="Alex"
              colour={colour}
              error={errors.displayName}
            />

            <ActionButton
              icon="person-add-outline"
              label="Create account"
              onPress={handleCreateAccount}
              backgroundColor={colour.primary}
              textColor={colors.brandText}
              disabled={isLoading}
            />
          </>
        )}
      </Animated.View>

      <Modal
        visible={countryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <Pressable
          style={authStyles.modalBackdrop}
          onPress={() => setCountryModalVisible(false)}
        >
          <View style={[authStyles.countrySheet, { backgroundColor: colour.surface }]}>
            <Text style={[authStyles.countrySheetTitle, { color: colour.text }]}>Country code</Text>

            {countryCodes.map(country => (
              <TouchableOpacity
                key={`${country.label}-${country.code}`}
                activeOpacity={0.78}
                style={[authStyles.countryOption, { borderBottomColor: colour.border }]}
                onPress={() => {
                  setSelectedCountryCode(country);
                  setCountryModalVisible(false);
                }}
              >
                <Text style={[authStyles.countryText, { color: colour.text }]}>
                  {country.flag} {country.label}
                </Text>

                <Text style={[authStyles.countryCodeText, { color: colour.textSecondary }]}>
                  {country.code}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
