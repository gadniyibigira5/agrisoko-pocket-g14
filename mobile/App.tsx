import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import { RootNav } from "./src/navigation/RootNav";

function Inner() {
  const { mode } = useTheme();
  return <><StatusBar style={mode === "light" ? "dark" : "light"} /><RootNav /></>;
}

export default function App() {
  return <SafeAreaProvider><ThemeProvider><Inner /></ThemeProvider></SafeAreaProvider>;
}