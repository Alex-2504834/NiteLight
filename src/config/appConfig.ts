import Config from "react-native-config";

function requiredConfigValue(name: keyof typeof Config) {
  const value = Config[name];

  if (!value || String(value).trim().length === 0) {
    throw new Error(`Missing required app config value: ${String(name)}`);
  }

  return String(value).trim();
}

export const appConfig = {
  apiBaseUrl: requiredConfigValue("API_BASE_URL").replace(/\/$/, ""),
  googleWebClientId: requiredConfigValue("GOOGLE_WEB_CLIENT_ID"),
  mapboxAccessToken: requiredConfigValue("MAPBOX_ACCESS_TOKEN"),
  stripePublishableKey: requiredConfigValue("STRIPE_PUBLISHABLE_KEY"),
};
