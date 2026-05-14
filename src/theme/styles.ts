import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontSize: 24,
        fontWeight: "600"
    },
});

export const createTabBarStyles = (colour: any) => ({
    tabBarStyle: {
        backgroundColor: colour.surface,
        borderTopColor: colour.border,

        height: 120,
        paddingBottom: 10,
        paddingTop: 10,
    },

    tabBarActiveTintColor: colour.primary,
    tabBarInactiveTintColor: colour.textSecondary,

    headerStyle: {
        backgroundColor: colour.surface,
    },

    headerTintColor: colour.text,
});