import React from "react";
import { Text, TouchableOpacity, Linking, Alert, StyleSheet } from "react-native";
import { colors, type, space } from "../theme/tokens";

export function EvidenceLink({ label, url }: { label: string; url?: string }) {
  const onPress = async () => {
    if (!url) {
      Alert.alert("Not yet available", `"${label}" will be linked once the ${label.toLowerCase()} URL is verified.`);
      return;
    }
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) throw new Error("unsupported");
      await Linking.openURL(url);
    } catch {
      Alert.alert("Could not open link", "The URL could not be reached on this device.");
    }
  };

  const disabled = !url;
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={`Open ${label}`}
      style={[styles.row, disabled && { opacity: 0.55 }]}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.arrow}>â€º</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: space.sm, borderBottomWidth: 1, borderBottomColor: colors.ink100 },
  label: { ...type.body, color: colors.lime700, fontWeight: "700" },
  arrow: { ...type.h2, color: colors.lime500 },
});