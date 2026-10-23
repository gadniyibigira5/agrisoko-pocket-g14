import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import { colors, radius, space } from "../theme/tokens";

type Variant = "live" | "cached" | "offline" | "matched" | "info";

const palette: Record<Variant, { bg: string; fg: string; label: string }> = {
  live:     { bg: colors.lime200, fg: colors.lime700, label: "LIVE" },
  cached:   { bg: colors.lime100, fg: colors.lime700, label: "CACHED" },
  offline:  { bg: colors.ink100,  fg: colors.offline, label: "OFFLINE" },
  matched:  { bg: colors.lime300, fg: colors.lime700, label: "MATCHED" },
  info:     { bg: colors.info,    fg: "#FFFFFF",      label: "INFO" },
};

export function Chip({
  variant,
  label,
  style,
}: {
  variant: Variant;
  label?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const p = palette[variant];
  return (
    <View
      style={[
        {
          backgroundColor: p.bg,
          borderRadius: radius.pill,
          paddingHorizontal: space.sm,
          paddingVertical: 4,
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      <Text style={{ color: p.fg, fontSize: 11, fontWeight: "700", letterSpacing: 0.8 }}>
        {label ?? p.label}
      </Text>
    </View>
  );
}