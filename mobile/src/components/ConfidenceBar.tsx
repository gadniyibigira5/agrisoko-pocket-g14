import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { radius, space, type } from "../theme/tokens";

export function ConfidenceBar({ confidence }: { confidence: number }) {
  const { palette } = useTheme();
  const w = useRef(new Animated.Value(0)).current;
  const pct = Math.max(0, Math.min(1, confidence));
  useEffect(() => {
    Animated.spring(w, { toValue: pct, useNativeDriver: false, friction: 6, tension: 80 }).start();
  }, [pct]);
  const tint = pct >= 0.7 ? palette.semantic.success : pct >= 0.45 ? palette.semantic.warn : palette.semantic.danger;
  return (
    <View style={{ marginTop: space.sm }}>
      <View style={[styles.track, { backgroundColor: palette.ink.ink100 }]}>
        <Animated.View style={[styles.fill, { backgroundColor: tint, width: w.interpolate({ inputRange: [0,1], outputRange: ["0%","100%"] }) }]} />
      </View>
      <Text style={[type.small, { color: tint, marginTop: 4 }]}>Confidence: {(pct*100).toFixed(0)}%</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  track: { height: 10, borderRadius: radius.pill, overflow: "hidden" },
  fill:  { height: "100%", borderRadius: radius.pill },
});