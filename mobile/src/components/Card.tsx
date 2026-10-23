import React from "react";
import { View, ViewStyle, StyleProp } from "react-native";
import { colors, radius, shadow, space } from "../theme/tokens";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, style }: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: space.md,
          ...shadow.card,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}