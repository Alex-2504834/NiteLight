import { useMemo, useState } from "react";
import auth from "@react-native-firebase/auth";

import {
  SettingsDetailRow,
  SettingsPage,
  SettingsRow,
  SettingsSection,
} from "../../components/settings/SettingsComponents";
import { logout } from "../../services/auth";
import { useSettingsDialog } from "../../components/settings/SettingsDialog";

type AccountSettingsScreenProps = {
  onBack: () => void;
};

const USERNAME_EMAIL_DOMAIN = "@users.nitelight.local";

function getProviderLabel() {
  const user = auth().currentUser;

  if (!user || user.isAnonymous) return "Guest";

  const providerIds = user.providerData.map(provider => provider.providerId);

  if (providerIds.includes("google.com")) return "Google";
  if (providerIds.includes("password")) return "Email or username";

  return "Signed in";
}

export default function AccountSettingsScreen({
  onBack,
}: AccountSettingsScreenProps) {
  const [isWorking, setIsWorking] = useState(false);
  const { showDialog } = useSettingsDialog();
  const user = auth().currentUser;

  const profile = useMemo(() => {
    const isGuest = !user || user.isAnonymous;
    const rawEmail = user?.email?.trim() ?? "";
    const isInternalUsernameEmail = rawEmail.endsWith(USERNAME_EMAIL_DOMAIN);

    return {
      displayName:
        user?.displayName?.trim() || (isGuest ? "Guest" : "Not added"),
      email: isInternalUsernameEmail ? "Not added" : rawEmail || "Not added",
      phoneNumber: user?.phoneNumber?.trim() || "Not added",
      isGuest,
    };
  }, [user]);

  async function handleSignOut() {
    showDialog({
      title: profile.isGuest ? "Leave guest session?" : "Sign out?",
      message: profile.isGuest
        ? "You will return to the sign-in screen."
        : "You will need to sign in again to use your account.",
      icon: profile.isGuest ? "person-add-outline" : "log-out-outline",
      actions: [
        { label: "Cancel" },
        {
          label: profile.isGuest ? "Continue" : "Sign out",
          tone: profile.isGuest ? "primary" : "destructive",
          onPress: async () => {
            try {
              setIsWorking(true);
              await logout();
            } catch (error) {
              const message =
                error instanceof Error ? error.message : "Could not sign out.";
              showDialog({
                title: "Sign out failed",
                message,
                icon: "alert-circle-outline",
                actions: [{ label: "OK", tone: "primary" }],
              });
            } finally {
              setIsWorking(false);
            }
          },
        },
      ],
    });
  }

  function handleDeleteAccount() {
    showDialog({
      title: "Delete account?",
      message:
        "This permanently removes your Firebase account. This action cannot be undone.",
      icon: "trash-outline",
      actions: [
        { label: "Cancel" },
        {
          label: "Delete",
          tone: "destructive",
          onPress: async () => {
            const currentUser = auth().currentUser;

            if (!currentUser) return;

            try {
              setIsWorking(true);
              await currentUser.delete();
            } catch (error) {
              console.error("Failed to delete account:", error);

              const requiresRecentLogin =
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                error.code === "auth/requires-recent-login";

              showDialog({
                title: "Account not deleted",
                message: requiresRecentLogin
                  ? "For security, sign out and sign back in before deleting your account."
                  : "NiteLight could not delete the account. Please try again.",
                icon: "alert-circle-outline",
                actions: [{ label: "OK", tone: "primary" }],
              });
            } finally {
              setIsWorking(false);
            }
          },
        },
      ],
    });
  }

  return (
    <SettingsPage
      title="Account"
      subtitle="Your profile and sign-in details."
      onBack={onBack}
    >
      <SettingsSection title="Profile">
        <SettingsDetailRow
          label="Display name"
          value={profile.displayName}
        />
        <SettingsDetailRow label="Email" value={profile.email} />
        <SettingsDetailRow
          label="Phone number"
          value={profile.phoneNumber}
        />
        <SettingsDetailRow
          label="Sign-in method"
          value={getProviderLabel()}
          isLast
        />
      </SettingsSection>

      <SettingsSection title="Account actions">
        <SettingsRow
          title={profile.isGuest ? "Create account or sign in" : "Sign out"}
          description={
            profile.isGuest
              ? "Leave the guest session and return to the sign-in screen"
              : undefined
          }
          icon={profile.isGuest ? "person-add-outline" : "log-out-outline"}
          onPress={handleSignOut}
          disabled={isWorking}
          destructive={!profile.isGuest}
        />
        <SettingsRow
          title="Delete account"
          description="Permanently remove this account"
          icon="trash-outline"
          onPress={handleDeleteAccount}
          disabled={isWorking}
          destructive
          isLast
        />
      </SettingsSection>
    </SettingsPage>
  );
}
