/**
 * Root navigation â€” bottom tabs Home / Ask / Directory + stack for detail screens.
 * Owner: Niyibigira Gad
 */
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import { HomeScreen } from "../screens/HomeScreen";
import { colors } from "../theme/tokens";

export type RootStackParamList = {
  Tabs: undefined;
  Result: { memberId: string };
  Profile: { memberId: string };
  About: undefined;
};

export type TabsParamList = {
  Home: undefined;
  Ask: undefined;
  Directory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();

function Placeholder({ name }: { name: string }) {
  return <Text style={{ padding: 24, color: colors.ink700 }}>{name} screen â€” coming in a later branch.</Text>;
}

function TabsScreen() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.lime400 },
        headerTitleStyle: { color: colors.lime700, fontWeight: "800" },
        tabBarActiveTintColor: colors.lime600,
        tabBarInactiveTintColor: colors.ink500,
      }}
    >
      <Tabs.Screen name="Home"      component={HomeScreen} />
      <Tabs.Screen name="Ask"       children={() => <Placeholder name="Ask" />} />
      <Tabs.Screen name="Directory" children={() => <Placeholder name="Directory" />} />
    </Tabs.Navigator>
  );
}

export function RootNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabsScreen} />
        <Stack.Screen name="Result" children={() => <Placeholder name="Result" />} />
        <Stack.Screen name="Profile" children={() => <Placeholder name="Profile" />} />
        <Stack.Screen name="About" children={() => <Placeholder name="About" />} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}