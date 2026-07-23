import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { appConfig } from "../config/appConfig";
import {
  resolveLoginIdentifier,
  syncGoogleProfile,
  syncGuestProfile,
  syncPasswordProfile,
} from "./api";

export type SignUpInput = {
  username: string;
  displayName: string;
  password: string;
  email?: string;
  phoneNumber?: string;
};

export type LoginInput = {
  identifier: string;
  password: string;
};

const USERNAME_EMAIL_DOMAIN = "users.nitelight.local";

GoogleSignin.configure({
  webClientId: appConfig.googleWebClientId,
});

function normaliseUsername(username: string) {
  return username.trim().toLowerCase();
}

function normaliseEmail(email?: string) {
  const value = email?.trim().toLowerCase() || "";
  return value.length > 0 ? value : null;
}

function normalisePhoneNumber(phoneNumber?: string) {
  const value = phoneNumber?.replace(/[\s()-]/g, "").trim() || "";
  return value.length > 0 ? value : null;
}

function assertValidUsername(username: string) {
  if (!/^[a-z0-9_.-]{3,32}$/.test(username)) {
    throw new Error(
      "Username must be 3-32 characters and only use letters, numbers, dots, dashes, or underscores."
    );
  }
}

function assertValidEmail(email: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
}

function assertValidPhoneNumber(phoneNumber: string) {
  if (!/^\+[0-9]{7,15}$/.test(phoneNumber)) {
    throw new Error("Please enter a valid phone number with a country code.");
  }
}

function assertValidPassword(password: string) {
  const passwordHasEnoughCharacters = password.length >= 8;
  const passwordHasCapitalLetter = /[A-Z]/.test(password);
  const passwordHasSymbol = /[!@#$%&*?._+\-=()[\]{};:'",<>/\\|`~^]/.test(
    password
  );

  if (
    !passwordHasEnoughCharacters ||
    !passwordHasCapitalLetter ||
    !passwordHasSymbol
  ) {
    throw new Error(
      "Password must be 8+ characters and include a capital letter and a symbol, such as ! @ # $ % & * ?."
    );
  }
}

function usernameToAuthEmail(username: string) {
  const normalisedUsername = normaliseUsername(username);
  assertValidUsername(normalisedUsername);

  return `${normalisedUsername}@${USERNAME_EMAIL_DOMAIN}`;
}

export async function signUpWithUsername(input: SignUpInput) {
  const username = normaliseUsername(input.username);
  const displayName = input.displayName.trim();
  const email = normaliseEmail(input.email);
  const phoneNumber = normalisePhoneNumber(input.phoneNumber);
  const authEmail = email || usernameToAuthEmail(username);

  assertValidUsername(username);

  if (displayName.length < 2) {
    throw new Error("Display name must be at least 2 characters.");
  }

  assertValidPassword(input.password);

  if (!email && !phoneNumber) {
    throw new Error("Please add either an email address or a phone number.");
  }

  if (email) {
    assertValidEmail(email);
  }

  if (phoneNumber) {
    assertValidPhoneNumber(phoneNumber);
  }

  const credential = await auth().createUserWithEmailAndPassword(
    authEmail,
    input.password
  );

  try {
    await credential.user.updateProfile({ displayName });

    await syncPasswordProfile({
      username,
      displayName,
      email,
      phoneNumber,
      authEmail,
      authProvider: email ? "email-password" : "phone-password",
    });

    return credential.user;
  } catch (error) {
    await credential.user.delete().catch(() => {});
    throw error;
  }
}

export async function loginWithIdentifier(input: LoginInput) {
  const { authEmail } = await resolveLoginIdentifier(input.identifier);
  const credential = await auth().signInWithEmailAndPassword(
    authEmail,
    input.password
  );

  return credential.user;
}

export const loginWithUsername = loginWithIdentifier;

export async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });

  const signInResult = await GoogleSignin.signIn();

  const idToken =
    "data" in signInResult
      ? signInResult.data?.idToken
      : signInResult.idToken;

  if (!idToken) {
    throw new Error("Google sign-in did not return an ID token.");
  }

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const credential = await auth().signInWithCredential(googleCredential);

  await syncGoogleProfile();

  return credential.user;
}

export async function continueAsGuest() {
  const credential = await auth().signInAnonymously();

  await syncGuestProfile();

  return credential.user;
}

export async function logout() {
  await auth().signOut();
  await GoogleSignin.signOut().catch(() => {});
}
