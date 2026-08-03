import auth from "@react-native-firebase/auth";

import {
  SettingsMenuRow,
  SettingsPage,
  SettingsSection,
} from "../../components/settings/SettingsComponents";

type SettingsMenuScreenProps = {
  onBack: () => void;
  onOpenAccount: () => void;
  onOpenAppPreferences: () => void;
  onOpenPrivacyPermissions: () => void;
  onOpenHelpAbout: () => void;
};

export default function SettingsMenuScreen({
  onBack,
  onOpenAccount,
  onOpenAppPreferences,
  onOpenPrivacyPermissions,
  onOpenHelpAbout,
}: SettingsMenuScreenProps) {
  const user = auth().currentUser;
  const accountDescription = user?.isAnonymous
    ? "Guest account and sign-in options"
    : "Profile, email and account actions";

  return (
    <SettingsPage title="Settings" onBack={onBack}>
      <SettingsSection>
        <SettingsMenuRow
          title="Account"
          description={accountDescription}
          icon="person-outline"
          onPress={onOpenAccount}
        />
        <SettingsMenuRow
          title="App Preferences"
          description="Appearance, launch and map behaviour"
          icon="options-outline"
          onPress={onOpenAppPreferences}
        />
        <SettingsMenuRow
          title="Privacy & Permissions"
          description="Location access and cached app data"
          icon="shield-checkmark-outline"
          onPress={onOpenPrivacyPermissions}
        />
        <SettingsMenuRow
          title="Help & About"
          description="Contact, service feedback and app information"
          icon="help-circle-outline"
          onPress={onOpenHelpAbout}
          isLast
        />
      </SettingsSection>
    </SettingsPage>
  );
}
