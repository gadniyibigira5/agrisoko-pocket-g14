import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { colors, radius, space, type } from "../theme/tokens";

export function ConfidenceBar({ confidence }: { confidence: number }) {
  const width = useRef(new Animated.Value(0)).current;
  const pct = Math.max(0, Math.min(1, confidence));

  useEffect(() => {
    Animated.timing(width, {
      toValue: pct,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [pct, width]);

  const tint = pct >= 0.7 ? colors.success : pct >= 0.45 ? colors.warn : colors.danger;

  return (
    <View style={{ marginTop: space.sm }}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: tint, width: width.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) },
          ]}
        />
      </View>
      <Text style={[type.small, { color: tint, marginTop: 4 }]}>Confidence: {(pct * 100).toFixed(0)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: radius.pill, backgroundColor: colors.ink100, overflow: "hidden" },
  fill:  { height: "100%", borderRadius: radius.pill },
});