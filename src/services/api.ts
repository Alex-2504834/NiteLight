import auth from "@react-native-firebase/auth";

import { appConfig } from "../config/appConfig";

export type ApiRequestOptions = RequestInit & {
  requireAuth?: boolean;
};

async function getFirebaseIdToken(requireAuth: boolean) {
  const user = auth().currentUser;

  if (!user) {
    if (requireAuth) {
      throw new Error("You need to be signed in to do that.");
    }

    return null;
  }

  return user.getIdToken();
}

export async function apiFetch(path: string, options: ApiRequestOptions = {}) {
  const { requireAuth = true, headers, ...fetchOptions } = options;
  const token = await getFirebaseIdToken(requireAuth);

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...fetchOptions,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let body: unknown = null;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "detail" in body &&
      typeof body.detail === "string"
        ? body.detail
        : `API request failed with status ${response.status}`;

    throw new Error(message);
  }

  return body;
}

export async function getApiHealth() {
  return apiFetch("/health", { requireAuth: false });
}

export async function getMe() {
  return apiFetch("/me");
}

export async function resolveLoginIdentifier(identifier: string) {
  return apiFetch("/auth/resolve-login", {
    requireAuth: false,
    method: "POST",
    body: JSON.stringify({ identifier }),
  }) as Promise<{ authEmail: string }>;
}

export async function syncPasswordProfile(input: {
  username: string;
  displayName: string;
  email: string | null;
  phoneNumber: string | null;
  authEmail: string;
  authProvider: "email-password" | "phone-password";
}) {
  return apiFetch("/auth/password-profile", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function syncGoogleProfile() {
  return apiFetch("/auth/google-profile", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function syncGuestProfile() {
  return apiFetch("/auth/guest-profile", {
    method: "POST",
    body: JSON.stringify({}),
  });
}
