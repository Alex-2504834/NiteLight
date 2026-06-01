import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import RNBootSplash from "react-native-bootsplash";
import { NavigationContainer } from "@react-navigation/native";
import { StripeProvider } from "@stripe/stripe-react-native";

import TabNavigator from "./src/navigation/TabNavigator";
import InitialScreen from "./src/screens/InitialScreen";
import { appConfig } from "./src/config/appConfig";

async function handleSplashScreen() {
  await RNBootSplash.hide({ fade: true });
}

function App() {
  const [hasResolvedInitialRoute, setHasResolvedInitialRoute] = useState(false);
  const [canEnterApp, setCanEnterApp] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(
      (user: FirebaseAuthTypes.User | null) => {
        setCanEnterApp(Boolean(user));
        setHasResolvedInitialRoute(true);
        handleSplashScreen();
      }
    );

    return unsubscribe;
  }, []);

  function handleInitialFlowComplete() {
    setCanEnterApp(true);
  }

  if (!hasResolvedInitialRoute) {
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

export default App;
