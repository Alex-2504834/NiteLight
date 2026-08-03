import { useCallback, useEffect, useState } from "react";
import {
  AppState,
  Linking,
  PermissionsAndroid,
  Platform,
  Text,
  View,
} from "react-native";

import {
  SettingsPage,
  SettingsRow,
  SettingsSection,
} from "../../components/settings/SettingsComponents";
import { clearPlaceDetailsCache } from "../../services/placeDetails";
import { settingsStyles } from "../../styles/settings";
import { useSettingsDialog } from "../../components/settings/SettingsDialog";
import { useTheme } from "../../styles/useTheme";

type PrivacyPermissionsScreenProps = {
  onBack: () => void;
};

type LocationPermissionState = "Allowed" | "Denied" | "Manage in Settings";

export default function PrivacyPermissionsScreen({
  onBack,
}: PrivacyPermissionsScreenProps) {
  const { colour } = useTheme();
  const { showDialog } = useSettingsDialog();
  const [locationPermission, setLocationPermission] =
    useState<LocationPermissionState>(
      Platform.OS === "ios" ? "Manage in Settings" : "Denied"
    );

  const refreshLocationPermission = useCallback(async () => {
    if (Platform.OS !== "android") {
      setLocationPermission("Manage in Settings");
      return;
    }

    try {
      const isGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      setLocationPermission(isGranted ? "Allowed" : "Denied");
    } catch (error) {
      console.warn("Could not check location permission:", error);
      setLocationPermission("Denied");
    }
  }, []);

  useEffect(() => {
    refreshLocationPermission();

    const subscription = AppState.addEventListener("change", nextState => {
      if (nextState === "active") {
        refreshLocationPermission();
      }
    });

    return () => subscription.remove();
  }, [refreshLocationPermission]);

  async function openDeviceSettings() {
    try {
      await Linking.openSettings();
    } catch {
      showDialog({
        title: "Unable to open settings",
        message: "Open your device settings and select NiteLight.",
        icon: "settings-outline",
        actions: [{ label: "OK", tone: "primary" }],
      });
    }
  }

  function handleClearCache() {
    showDialog({
      title: "Clear cached service data?",
      message:
        "Support-service details will be downloaded again when you open them.",
      icon: "layers-outline",
      actions: [
        { label: "Cancel" },
        {
          label: "Clear",
          tone: "destructive",
          onPress: () => {
            clearPlaceDetailsCache();
            showDialog({
              title: "Cache cleared",
              message: "Cached support-service details were removed.",
              icon: "checkmark-circle-outline",
              actions: [{ label: "OK", tone: "primary" }],
            });
          },
        },
      ],
    });
  }

  return (
    <SettingsPage
      title="Privacy & Permissions"
      subtitle="Control device access and local app data."
      onBack={onBack}
    >
      <SettingsSection title="Permissions">
        <SettingsRow
          title="Location access"
          description="Used to show your position near local support services"
          icon="location-outline"
          value={locationPermission}
          onPress={openDeviceSettings}
        />
        <SettingsRow
          title="Open device settings"
          description="Change NiteLight permissions in your phone settings"
          icon="phone-portrait-outline"
          onPress={openDeviceSettings}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Data on this device">
        <SettingsRow
          title="Clear cached service data"
          description="Remove temporary support-service details stored in memory"
          icon="layers-outline"
          onPress={handleClearCache}
          destructive
          isLast
        />
      </SettingsSection>

      <View
        style={[
          settingsStyles.bodyCard,
          {
            backgroundColor: colour.surface,
            borderColor: colour.border,
            borderLeftColor: colour.primary,
          },
        ]}
      >
        <Text style={[settingsStyles.bodyTitle, { color: colour.text }]}>
          How location is used
        </Text>
        <Text style={[settingsStyles.bodyText, { color: colour.textSecondary }]}>
          NiteLight uses location while the app is open to show where you are on
          the support map. Your location preference is stored on this device.
          Device permission can be changed at any time in system settings.
        </Text>
      </View>
    </SettingsPage>
  );
}
