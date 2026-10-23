import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { radius, space } from "../theme/tokens";

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { palette, mode } = useTheme();
  return (
    <View style={[
      {
        backgroundColor: palette.card,
        borderRadius: radius.lg,
        padding: space.md,
        borderWidth: 1,
        borderColor: palette.border,
        shadowColor: mode === "light" ? "#2F4A00" : "#000000",
        shadowOpacity: mode === "light" ? 0.10 : 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
      },
      style,
    ]}>{children}</View>
  );
}