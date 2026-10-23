import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradients } from "../theme/tokens";

type Props = {
  children: React.ReactNode;
  gradientHeader?: boolean;
};

export function Screen({ children, gradientHeader = false }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }} edges={["top", "left", "right"]}>
      {gradientHeader && (
        <LinearGradient
          colors={gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        />
      )}
      <View style={styles.body}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { height: 8, width: "100%" },
  body:   { flex: 1 },
});