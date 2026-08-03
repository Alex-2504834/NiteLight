import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import RNBootSplash from "react-native-bootsplash";
import { NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import TabNavigator from "./src/navigation/TabNavigator";
import InitialScreen from "./src/screens/InitialScreen";
import { appConfig } from "./src/config/appConfig";
import {
  AppPreferencesProvider,
  useAppPreferences,
} from "./src/settings/AppPreferencesContext";

async function handleSplashScreen() {
  await RNBootSplash.hide({ fade: true });
}

function AppContent() {
  const { isReady: arePreferencesReady } = useAppPreferences();
  const [hasResolvedInitialRoute, setHasResolvedInitialRoute] = useState(false);
  const [canEnterApp, setCanEnterApp] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(
      (user: FirebaseAuthTypes.User | null) => {
        setCanEnterApp(Boolean(user));
        setHasResolvedInitialRoute(true);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (hasResolvedInitialRoute && arePreferencesReady) {
      handleSplashScreen();
    }
  }, [arePreferencesReady, hasResolvedInitialRoute]);

  function handleInitialFlowComplete() {
    setCanEnterApp(true);
  }

  if (!hasResolvedInitialRoute || !arePreferencesReady) {
    return null;
  }

  return (
    <StripeProvider publishableKey={appConfig.stripePublishableKey}>
      <NavigationContainer>
        {canEnterApp ? (
          <TabNavigator />
        ) : (
          <InitialScreen onComplete={handleInitialFlowComplete} />
        )}
      </NavigationContainer>
    </StripeProvider>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AppPreferencesProvider>
        <AppContent />
      </AppPreferencesProvider>
    </SafeAreaProvider>
  );
}

export default App;
