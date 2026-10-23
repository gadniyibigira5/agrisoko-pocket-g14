import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../theme/ThemeContext";

export function Screen({ children, gradientHeader = false }: { children: React.ReactNode; gradientHeader?: boolean }) {
  const { palette } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.canvas }} edges={["top","left","right"]}>
      {gradientHeader && <LinearGradient colors={palette.gradient.hero} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.header} />}
      <View style={styles.body}>{children}</View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({ header: { height: 6 }, body: { flex: 1 } });