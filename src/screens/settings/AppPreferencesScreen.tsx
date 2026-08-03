import {
  SettingsPage,
  SettingsRow,
  SettingsSection,
  SettingsSwitchRow,
} from "../../components/settings/SettingsComponents";
import {
  ThemePreference,
  useAppPreferences,
} from "../../settings/AppPreferencesContext";
import { useSettingsDialog } from "../../components/settings/SettingsDialog";

type AppPreferencesScreenProps = {
  onBack: () => void;
};

const themeLabels: Record<ThemePreference, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

export default function AppPreferencesScreen({
  onBack,
}: AppPreferencesScreenProps) {
  const { showDialog } = useSettingsDialog();
  const {
    themePreference,
    openMapOnLaunch,
    centreOnLocation,
    setThemePreference,
    setOpenMapOnLaunch,
    setCentreOnLocation,
    resetPreferences,
  } = useAppPreferences();

  function chooseTheme() {
    showDialog({
      title: "Appearance",
      message: "Choose how NiteLight should look.",
      icon: "contrast-outline",
      actions: [
        { label: "System", onPress: () => setThemePreference("system") },
        { label: "Light", onPress: () => setThemePreference("light") },
        { label: "Dark", onPress: () => setThemePreference("dark") },
        { label: "Cancel" },
      ],
    });
  }

  function handleResetPreferences() {
    showDialog({
      title: "Reset app preferences?",
      message: "Appearance and map preferences will return to their defaults.",
      icon: "refresh-outline",
      actions: [
        { label: "Cancel" },
        {
          label: "Reset",
          tone: "destructive",
          onPress: () => {
            resetPreferences().catch(error => {
              console.error("Failed to reset preferences:", error);
              showDialog({
                title: "Reset failed",
                message: "Preferences could not be reset.",
                icon: "alert-circle-outline",
                actions: [{ label: "OK", tone: "primary" }],
              });
            });
          },
        },
      ],
    });
  }

  return (
    <SettingsPage
      title="App Preferences"
      subtitle="Choose how NiteLight looks and opens."
      onBack={onBack}
    >
      <SettingsSection title="Appearance">
        <SettingsRow
          title="Theme"
          description="Use your device setting or choose a fixed theme"
          icon="contrast-outline"
          value={themeLabels[themePreference]}
          onPress={chooseTheme}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Launch">
        <SettingsSwitchRow
          title="Open map on launch"
          description="Start on the map after signing in"
          icon="map-outline"
          value={openMapOnLaunch}
          onValueChange={setOpenMapOnLaunch}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Map">
        <SettingsSwitchRow
          title="Centre on my location"
          description="Show your position near local support services when location is found"
          icon="locate-outline"
          value={centreOnLocation}
          onValueChange={setCentreOnLocation}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Reset">
        <SettingsRow
          title="Reset app preferences"
          description="Restore the default appearance and map behaviour"
          icon="refresh-outline"
          onPress={handleResetPreferences}
          destructive
          isLast
        />
      </SettingsSection>
    </SettingsPage>
  );
}
