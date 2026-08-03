import { Linking, Platform, Text, View } from "react-native";

import {
  SettingsPage,
  SettingsRow,
  SettingsSection,
} from "../../components/settings/SettingsComponents";
import { appMetadata } from "../../config/appMetadata";
import { settingsStyles } from "../../styles/settings";
import { useTheme } from "../../styles/useTheme";
import { useSettingsDialog } from "../../components/settings/SettingsDialog";

type HelpAboutScreenProps = {
  onBack: () => void;
};

const SUPPORT_EMAIL = "nadia@nitelightcic.co.uk";
const GENERAL_EMAIL = "info@nitelightcic.co.uk";
const WEBSITE_URL = "https://nitelightcic.co.uk/";
const SERVICES_URL = "https://nitelightcic.co.uk/services/";
const PRIVACY_URL = "https://nitelightcic.co.uk/privacy-policy/";

export default function HelpAboutScreen({ onBack }: HelpAboutScreenProps) {
  const { colour } = useTheme();
  const { showDialog } = useSettingsDialog();
  const deviceDetails = `${Platform.OS} ${String(Platform.Version)}`;

  async function openEmailComposer(
    recipient: string,
    subject: string,
    body: string
  ) {
    const url = `mailto:${recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    try {
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        showDialog({
          title: "No email app found",
          message: `Email ${recipient} from another device.`,
          icon: "mail-outline",
          actions: [{ label: "OK", tone: "primary" }],
        });
        return;
      }

      await Linking.openURL(url);
    } catch {
      showDialog({
        title: "Unable to open email",
        message: `Email ${recipient} from another device.`,
        icon: "mail-outline",
        actions: [{ label: "OK", tone: "primary" }],
      });
    }
  }

  async function openWebsite(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      showDialog({
        title: "Unable to open website",
        message: "Please try again when you have an internet connection.",
        icon: "globe-outline",
        actions: [{ label: "OK", tone: "primary" }],
      });
    }
  }

  return (
    <SettingsPage
      title="Help & About"
      subtitle="Contact NiteLight, report service information and learn about the app."
      onBack={onBack}
    >
      <SettingsSection title="Get help">
        <SettingsRow
          title="Contact NiteLight for support"
          description="Ask for help for yourself or someone you support"
          icon="heart-outline"
          onPress={() =>
            openEmailComposer(
              SUPPORT_EMAIL,
              "Request for support",
              "Please tell us what support is needed and include a telephone number if possible.\n\n"
            )
          }
        />
        <SettingsRow
          title="View NiteLight services"
          description="Food, essentials, community hubs and practical support"
          icon="hand-left-outline"
          onPress={() => openWebsite(SERVICES_URL)}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Feedback">
        <SettingsRow
          title="Report incorrect service information"
          description="Tell us if an address, phone number or opening time is wrong"
          icon="flag-outline"
          onPress={() =>
            openEmailComposer(
              GENERAL_EMAIL,
              "Incorrect support-service information",
              "Support location or organisation:\n\nWhat needs correcting?\n\n"
            )
          }
        />
        <SettingsRow
          title="Send app feedback"
          description="Share an idea or tell us what could be clearer"
          icon="chatbubble-ellipses-outline"
          onPress={() =>
            openEmailComposer(
              GENERAL_EMAIL,
              "NiteLight app feedback",
              `\n\nApp version: ${appMetadata.version}\nDevice: ${deviceDetails}`
            )
          }
        />
        <SettingsRow
          title="Report an app problem"
          description="Describe something that is not working correctly"
          icon="bug-outline"
          onPress={() =>
            openEmailComposer(
              GENERAL_EMAIL,
              "NiteLight app problem report",
              `What happened?\n\nWhat did you expect?\n\nApp version: ${appMetadata.version}\nDevice: ${deviceDetails}`
            )
          }
          isLast
        />
      </SettingsSection>

      <SettingsSection title="NiteLight online">
        <SettingsRow
          title="NiteLight website"
          description="Learn about services, community hubs and ways to help"
          icon="globe-outline"
          onPress={() => openWebsite(WEBSITE_URL)}
        />
        <SettingsRow
          title="Privacy policy"
          description="Read how NiteLight handles personal information"
          icon="document-text-outline"
          onPress={() => openWebsite(PRIVACY_URL)}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="App information">
        <SettingsRow
          title="Version"
          icon="information-circle-outline"
          value={appMetadata.version}
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
        <Text style={[settingsStyles.bodyTitle, { color: colour.text }]}>About NiteLight</Text>
        <Text style={[settingsStyles.bodyText, { color: colour.textSecondary }]}>
          NiteLight is the companion app for Nite Light CIC. It helps people who
          are homeless or facing financial hardship find food, clothing, hygiene
          essentials, community facilities and practical support across the Tees
          Valley.
        </Text>
        <Text style={[settingsStyles.bodyText, { color: colour.textSecondary }]}>
          Service information can change. Check the listed opening hours and
          contact the organisation before making a special journey.
        </Text>
      </View>
    </SettingsPage>
  );
}
