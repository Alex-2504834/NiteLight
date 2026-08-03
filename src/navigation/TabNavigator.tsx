import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { createTabBarStyles } from "../styles/global";
import { useAppPreferences } from "../settings/AppPreferencesContext";
import { useTheme } from "../styles/useTheme";

const Tab = createBottomTabNavigator();

type IconProps = {
  color: string;
  size: number;
};

const HomeTabIcon = ({ color, size }: IconProps) => (
  <Ionicons name="home-outline" size={size} color={color} />
);

const MapTabIcon = ({ color, size }: IconProps) => (
  <Ionicons name="map-outline" size={size} color={color} />
);

const SettingsTabIcon = ({ color, size }: IconProps) => (
  <Ionicons name="settings-outline" size={size} color={color} />
);

export default function TabNavigator() {
  const { colour } = useTheme();
  const { openMapOnLaunch } = useAppPreferences();

  return (
    <Tab.Navigator
      initialRouteName={openMapOnLaunch ? "Map" : "Home"}
      screenOptions={{ headerShown: false, ...createTabBarStyles(colour) }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: HomeTabIcon }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ tabBarIcon: MapTabIcon, tabBarLabel: "Map" }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: SettingsTabIcon }}
      />
    </Tab.Navigator>
  );
}
