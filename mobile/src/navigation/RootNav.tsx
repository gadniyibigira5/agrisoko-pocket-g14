import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import { HomeScreen } from "../screens/HomeScreen";
import { AskScreen } from "../screens/AskScreen";
import { DirectoryScreen } from "../screens/DirectoryScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { AboutScreen } from "../screens/AboutScreen";
import { useTheme } from "../theme/ThemeContext";

export type RootStackParamList = {
  Tabs: undefined;
  Profile: { memberId: string };
  About: undefined;
};
export type TabsParamList = {
  Home: undefined;
  Ask: undefined;
  Directory: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();

function TabIcon({ name, color }: { name: string; color: string }) {
  const map: Record<string, string> = { Home: "\u{1F3E0}", Ask: "\u{1F4AC}", Directory: "\u{1F465}", About: "\u{2139}\u{FE0F}" };
  return <Text style={{ fontSize: 20, color }}>{map[name] ?? "."}</Text>;
}

function TabsScreen() {
  const { palette } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.brand.lime400,
        tabBarInactiveTintColor: palette.text.muted,
        tabBarStyle: { backgroundColor: palette.card, borderTopColor: palette.border },
        tabBarIcon: ({ color }) => <TabIcon name={route.name} color={color} />,
      })}
    >
      <Tabs.Screen name="Home"      component={HomeScreen} />
      <Tabs.Screen name="Ask"       component={AskScreen} />
      <Tabs.Screen name="Directory" component={DirectoryScreen} />
      <Tabs.Screen name="About"     component={AboutScreen} />
    </Tabs.Navigator>
  );
}

export function RootNav() {
  const { palette, mode } = useTheme();
  const base = mode === "dark" ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: palette.canvas,
      card: palette.card,
      text: palette.text.primary,
      border: palette.border,
      primary: palette.brand.lime400,
    },
  };
  return (
    <NavigationContainer theme={navTheme as any}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: palette.card },
          headerTintColor: palette.brand.lime600,
          headerTitleStyle: { color: palette.text.primary, fontWeight: "800" },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Tabs" component={TabsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile", headerBackTitle: "Back" }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: "About" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}