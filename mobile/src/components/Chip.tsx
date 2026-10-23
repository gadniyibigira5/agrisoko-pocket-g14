import React from "react";
import { View, Text, StyleProp, ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { radius, space } from "../theme/tokens";

type Variant = "live" | "cached" | "offline" | "matched" | "info";

export function Chip({ variant, label, style }: { variant: Variant; label?: string; style?: StyleProp<ViewStyle> }) {
  const { palette } = useTheme();
  const map: Record<Variant, { bg: string; fg: string; default: string }> = {
    live:    { bg: palette.brand.lime400, fg: "#0E1A0C", default: "LIVE" },
    cached:  { bg: palette.brand.lime200, fg: "#2F4A00", default: "CACHED" },
    offline: { bg: palette.ink.ink100,    fg: palette.text.muted, default: "OFFLINE" },
    matched: { bg: palette.brand.lime300, fg: "#0E1A0C", default: "MATCHED" },
    info:    { bg: palette.semantic.info, fg: "#FFFFFF", default: "INFO" },
  };
  const m = map[variant];
  return (
    <View style={[{ backgroundColor: m.bg, borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 4, alignSelf: "flex-start" }, style]}>
      <Text style={{ color: m.fg, fontSize: 11, fontWeight: "700", letterSpacing: 0.8 }}>{label ?? m.default}</Text>
    </View>
  );
}