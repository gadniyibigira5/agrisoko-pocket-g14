import React from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { colors, radius, space, type } from "../theme/tokens";

type Kind = "loading" | "empty" | "error" | "offline";

const config: Record<Kind, { title: string; body: string; cta?: string }> = {
  loading: { title: "Searching the team", body: "Comparing your question with approved profiles." },
  empty:   { title: "No confident match", body: "Try a name, role or feature. You can also open the Directory." },
  error:   { title: "Server unavailable", body: "We could not reach the AI service. Retry or browse the Directory.", cta: "Retry" },
  offline: { title: "You are offline", body: "Showing results from your cached directory only.", cta: "Retry" },
};

export function StateView({
  kind,
  onRetry,
}: {
  kind: Kind;
  onRetry?: () => void;
}) {
  const c = config[kind];
  return (
    <View style={styles.wrap}>
      {kind === "loading" && <ActivityIndicator color={colors.lime500} size="large" />}
      <Text style={styles.title}>{c.title}</Text>
      <Text style={styles.body}>{c.body}</Text>
      {c.cta && onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.cta} accessibilityRole="button">
          <Text style={styles.ctaLabel}>{c.cta}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", padding: space.lg },
  title: { ...type.h2, color: colors.ink900, marginTop: space.sm },
  body:  { ...type.body, color: colors.ink500, textAlign: "center", marginTop: space.xs },
  cta:   { marginTop: space.md, backgroundColor: colors.lime400, paddingHorizontal: space.lg, paddingVertical: 12, borderRadius: radius.pill },
  ctaLabel: { ...type.body, color: colors.ink900, fontWeight: "800" },
});