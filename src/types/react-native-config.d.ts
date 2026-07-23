declare module "react-native-config" {
  interface NativeConfig {
    API_BASE_URL?: string;
    GOOGLE_WEB_CLIENT_ID?: string;
    MAPBOX_ACCESS_TOKEN?: string;
    STRIPE_PUBLISHABLE_KEY?: string;
  }

  const Config: NativeConfig;
  export default Config;
}
