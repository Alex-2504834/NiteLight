import { useEffect, useState } from "react";
import { BackHandler } from "react-native";
import {
  type NavigationProp,
  type ParamListBase,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";

import AccountSettingsScreen from "./settings/AccountSettingsScreen";
import AppPreferencesScreen from "./settings/AppPreferencesScreen";
import HelpAboutScreen from "./settings/HelpAboutScreen";
import PrivacyPermissionsScreen from "./settings/PrivacyPermissionsScreen";
import SettingsMenuScreen from "./settings/SettingsMenuScreen";
import { SettingsDialogProvider } from "../components/settings/SettingsDialog";

type SettingsPage =
  | "menu"
  | "account"
  | "app-preferences"
  | "privacy-permissions"
  | "help-about";

export default function SettingsScreen() {
  const [page, setPage] = useState<SettingsPage>("menu");
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  useEffect(() => {
    if (!isFocused) {
      setPage("menu");
    }
  }, [isFocused]);

  useEffect(() => {
    if (page === "menu") return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setPage("menu");
        return true;
      }
    );

    return () => subscription.remove();
  }, [page]);

  function renderPage() {
    if (page === "account") {
      return <AccountSettingsScreen onBack={() => setPage("menu")} />;
    }

    if (page === "app-preferences") {
      return <AppPreferencesScreen onBack={() => setPage("menu")} />;
    }

    if (page === "privacy-permissions") {
      return <PrivacyPermissionsScreen onBack={() => setPage("menu")} />;
    }

    if (page === "help-about") {
      return <HelpAboutScreen onBack={() => setPage("menu")} />;
    }

    return (
      <SettingsMenuScreen
        onBack={handleCloseSettings}
        onOpenAccount={() => setPage("account")}
        onOpenAppPreferences={() => setPage("app-preferences")}
        onOpenPrivacyPermissions={() => setPage("privacy-permissions")}
        onOpenHelpAbout={() => setPage("help-about")}
      />
    );
  }

  function handleCloseSettings() {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Home");
  }

  return <SettingsDialogProvider>{renderPage()}</SettingsDialogProvider>;
}
