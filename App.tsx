import { useEffect } from "react";
import RNBootSplash from 'react-native-bootsplash';
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./src/navigation/TabNavigator";

async function handleSplashScreen() {
  await RNBootSplash.hide({ fade: true});
}


function App() {
  useEffect(() => {handleSplashScreen()}, [])

  return (
    <NavigationContainer>
      <TabNavigator/>
    </NavigationContainer>
  );
}

export default App