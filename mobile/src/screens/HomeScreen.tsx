import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { colors, gradients, radius, space, type } from "../theme/tokens";

export function HomeScreen() {
  const [online, setOnline] = useState<boolean>(true);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((s) => {
      setOnline(Boolean(s.isConnected && s.isInternetReachable !== false));
    });
    return () => unsub();
  }, []);

  return (
    <Screen gradientHeader>
      <ScrollView contentContainerStyle={{ padding: space.md }}>
        <LinearGradient
          colors={gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroKicker}>AgriSoko Pocket Â· G14</Text>
          <Text style={styles.heroTitle}>Find the teammate behind the feature</Text>
          <Text style={styles.heroSub}>
            Ask a natural question and get an evidence-grounded profile.
          </Text>
          <View style={{ flexDirection: "row", gap: space.xs, marginTop: space.md }}>
            <Chip variant={online ? "live" : "offline"} />
          </View>
        </LinearGradient>

        <Card style={{ marginTop: space.md }}>
          <Text style={styles.h}>Why this exists</Text>
          <Text style={styles.body}>
            Visitors to the AgriSoko demo cannot tell who built what.
            Ask by name, role or feature and get a concise profile with evidence.
          </Text>
        </Card>

        <Card style={{ marginTop: space.md }}>
          <Text style={styles.h}>How to use it</Text>
          <Text style={styles.body}>1. Go to the Ask tab and type a question.</Text>
          <Text style={styles.body}>2. Or open the Directory and tap any teammate.</Text>
          <Text style={styles.body}>3. Follow the evidence links to the repo and demo.</Text>
        </Card>

        <Card style={{ marginTop: space.md }}>
          <Text style={styles.h}>Status</Text>
          <Text style={styles.body}>Version: 1.0.0</Text>
          <Text style={styles.body}>Group code: G14</Text>
          <Text style={styles.body}>Connection: {online ? "online" : "offline"}</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: radius.lg,
    padding: space.lg,
  },
  heroKicker: { color: colors.lime700, ...type.tiny, textTransform: "uppercase" },
  heroTitle:  { color: colors.ink900, ...type.display, marginTop: 6 },
  heroSub:    { color: colors.ink700, ...type.body, marginTop: 6 },
  h:          { color: colors.lime700, ...type.h2, marginBottom: space.xs },
  body:       { color: colors.ink700, ...type.body, marginTop: 4 },
});