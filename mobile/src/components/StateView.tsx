import React from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { radius, space, type } from "../theme/tokens";

type Kind = "loading" | "empty" | "error" | "offline";

export function StateView({ kind, onRetry }: { kind: Kind; onRetry?: () => void }) {
  const { palette } = useTheme();
  const config = {
    loading: { t: "Searching the team", b: "Comparing your question with approved profiles.", cta: null as string | null },
    empty:   { t: "No confident match", b: "Try a name, role or feature. Or open Directory.", cta: "Try again" },
    error:   { t: "Server unavailable", b: "We could not reach the AI service.", cta: "Retry" },
    offline: { t: "You are offline", b: "Showing results from your cached directory only.", cta: "Retry" },
  }[kind];
  return (
    <View style={styles.wrap}>
      {kind === "loading" ? (
        <ActivityIndicator color={palette.brand.lime400} size="large" />
      ) : (
        <Image source={require("../../assets/empty.png")} style={{ width: 120, height: 120, opacity: 0.85 }} resizeMode="contain" />
      )}
      <Text style={[styles.title, { color: palette.text.primary }]}>{config.t}</Text>
      <Text style={[styles.body, { color: palette.text.muted }]}>{config.b}</Text>
      {config.cta && onRetry && (
        <TouchableOpacity onPress={onRetry} style={[styles.cta, { backgroundColor: palette.brand.lime400 }]}>
          <Text style={styles.ctaTxt}>{config.cta}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap:  { alignItems: "center", padding: space.lg },
  title: { ...type.h2, marginTop: space.sm },
  body:  { ...type.body, textAlign: "center", marginTop: space.xs },
  cta:   { marginTop: space.md, paddingHorizontal: space.lg, paddingVertical: 12, borderRadius: radius.pill },
  ctaTxt:{ color: "#0E1A0C", ...type.body, fontWeight: "800" },
});