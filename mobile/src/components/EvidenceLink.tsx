import React from "react";
import { Text, View, TouchableOpacity, Linking, Alert, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { space, type } from "../theme/tokens";

export function EvidenceLink({ label, url }: { label: string; url?: string }) {
  const { palette } = useTheme();

  const onPress = async () => {
    if (!url || url.trim() === "") {
      Alert.alert(
        "Link not configured",
        `The ${label.toLowerCase()} URL is not yet set for this member. See the CONTRIBUTIONS.md file for the actual commit history.`
      );
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

  const disabled = !url || url.trim() === "";
  const displayUrl = disabled
    ? "Not linked yet (see CONTRIBUTIONS.md)"
    : url.replace(/^https?:\/\//, "").slice(0, 50);

  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={`Open ${label}`}
      style={[
        styles.row,
        { borderBottomColor: palette.border },
        disabled && { opacity: 0.55 },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, { color: palette.brand.lime600 }]}>{label}</Text>
        <Text style={[styles.url, { color: palette.text.muted }]} numberOfLines={1}>
          {displayUrl}
        </Text>
      </View>
      <Text style={[styles.arrow, { color: palette.brand.lime500 }]}>
        {disabled ? "—" : "Open ↗"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: space.sm,
    borderBottomWidth: 1,
  },
  label: { ...type.body, fontWeight: "700" },
  url: { ...type.small, marginTop: 2 },
  arrow: { ...type.small, fontWeight: "700" },
});