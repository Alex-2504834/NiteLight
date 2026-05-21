import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import MapScreen from "../screens/MapScreen"
import { createTabBarStyles } from "../theme/styles";
import { useTheme } from "../theme/useTheme";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator()

export default function TabNavigator() {
    const { colour } = useTheme();
    return (
        <Tab.Navigator screenOptions={{headerShown: false, ...createTabBarStyles(colour)}}>
            <Tab.Screen name="Home" component={HomeScreen} options={{tabBarIcon: ({ color, size }) => (<Ionicons name="home-outline" size={size} color={color}/>)}}/>
             <Tab.Screen name="Map" component={MapScreen} options={{tabBarIcon: ({ color, size }) => (<Ionicons name="map-outline" size={size} color={color}/>)}}/>
            <Tab.Screen name="Settings" component={SettingsScreen} options={{tabBarIcon: ({ color, size}) => (<Ionicons name="settings-outline" size={size} color={color}/>)}}/>
        </Tab.Navigator>
    )
}