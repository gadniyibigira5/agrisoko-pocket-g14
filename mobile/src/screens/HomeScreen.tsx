import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { useTheme } from "../theme/ThemeContext";
import { radius, space, type } from "../theme/tokens";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

export function HomeScreen() {
  const { palette, mode, toggle } = useTheme();
  const online = useNetworkStatus();
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);
  const styleIn = { opacity: enter, transform: [{ translateY: enter.interpolate({ inputRange: [0,1], outputRange: [16, 0] }) }] };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space.md, paddingBottom: 40 }}>
        <Animated.View style={styleIn}>
          <View style={styles.heroWrap}>
            <Image source={require("../../assets/hero.png")} style={styles.heroImg} resizeMode="cover" />
            <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.45)"]} style={StyleSheet.absoluteFill} />
            <View style={{ position: "absolute", top: 12, left: 16, right: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Chip variant={online ? "live" : "offline"} />
              <TouchableOpacity onPress={toggle} accessibilityLabel="Toggle theme" style={styles.toggle}>
                <Text style={{ fontSize: 22 }}>{mode === "light" ? "\u{1F319}" : "\u{2600}\u{FE0F}"}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
              <Text style={styles.heroKicker}>AGRISOKO POCKET - G14</Text>
              <Text style={styles.heroTitle}>Find the teammate behind the feature</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styleIn, { marginTop: space.md }]}>
          <Card>
            <Text style={[styles.h, { color: palette.brand.lime600 }]}>Why this exists</Text>
            <Text style={[styles.body, { color: palette.text.muted }]}>Visitors to the AgriSoko demo cannot tell who built what. Ask by name, role or feature and get a concise profile with evidence.</Text>
          </Card>
        </Animated.View>

        <Animated.View style={[styleIn, { marginTop: space.md }]}>
          <Card>
            <Text style={[styles.h, { color: palette.brand.lime600 }]}>How to use it</Text>
            <Text style={[styles.body, { color: palette.text.muted }]}>1. Open the Ask tab and type a question.</Text>
            <Text style={[styles.body, { color: palette.text.muted }]}>2. Or browse the Directory and tap a teammate.</Text>
            <Text style={[styles.body, { color: palette.text.muted }]}>3. Follow evidence links to the repo and demo.</Text>
          </Card>
        </Animated.View>

        <Animated.View style={[styleIn, { marginTop: space.md }]}>
          <Card>
            <Text style={[styles.h, { color: palette.brand.lime600 }]}>Status</Text>
            <Text style={[styles.body, { color: palette.text.muted }]}>Version: 1.0.1 (UI polish)</Text>
            <Text style={[styles.body, { color: palette.text.muted }]}>Group code: G14</Text>
            <Text style={[styles.body, { color: palette.text.muted }]}>Connection: {online ? "online" : "offline"}</Text>
            <Text style={[styles.body, { color: palette.text.muted }]}>Theme: {mode}</Text>
          </Card>
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroWrap: { borderRadius: radius.lg, overflow: "hidden", aspectRatio: 2 },
  heroImg:  { width: "100%", height: "100%" },
  heroKicker: { color: "#E9FFB5", ...type.tiny, textTransform: "uppercase", letterSpacing: 1.2 },
  heroTitle:  { color: "#FFFFFF", ...type.display, marginTop: 4 },
  toggle: { backgroundColor: "rgba(255,255,255,0.85)", width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  h: { ...type.h2, marginBottom: space.xs },
  body: { ...type.body, marginTop: 4 },
});