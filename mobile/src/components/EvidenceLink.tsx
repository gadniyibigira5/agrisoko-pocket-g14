import React from "react";
import { Text, TouchableOpacity, Linking, Alert, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { space, type } from "../theme/tokens";

export function EvidenceLink({ label, url }: { label: string; url?: string }) {
  const { palette } = useTheme();
  const onPress = async () => {
    if (!url) {
      Alert.alert("Not yet available", `"${label}" will be linked once the URL is verified.`);
      return;
    }
    try {
      const ok = await Linking.canOpenURL(url);
      if (!ok) throw new Error("unsupported");
      await Linking.openURL(url);
    } catch {
      Alert.alert("Could not open link", "The URL could not be reached on this device.");
    }
  };
  return (
    <TouchableOpacity onPress={onPress} style={[styles.row, { borderBottomColor: palette.border }, !url && { opacity: 0.55 }]}>
      <Text style={[styles.label, { color: palette.brand.lime600 }]}>{label}</Text>
      <Text style={[styles.arrow, { color: palette.brand.lime500 }]}>â€º</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  row:  { flexDirection: "row", justifyContent: "space-between", paddingVertical: space.sm, borderBottomWidth: 1 },
  label:{ ...type.body, fontWeight: "700" },
  arrow:{ ...type.h2 },
});