import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNav";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { StateView } from "../components/StateView";
import { colors, space, type } from "../theme/tokens";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FALLBACK_MEMBERS = [
  { id: "gad",      fullName: "Niyibigira Gad",              role: "Group Lead and Mobile Developer" },
  { id: "erssie",   fullName: "Teta Erssie",                 role: "AI Engineer" },
  { id: "sandrine", fullName: "Mbabazi Sandrine",            role: "AI Engineer" },
  { id: "joel",     fullName: "Joel Mogar Jr Eliezar",       role: "Mobile Developer" },
  { id: "claire",   fullName: "Uwiringiyimana Marie Claire", role: "Mobile Developer" },
  { id: "bashir",   fullName: "Mohamed Bashir",              role: "Integration and QA Engineer" },
];

export function DirectoryScreen() {
  const navigation = useNavigation<Nav>();
  const [members, setMembers] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Offline-safe: try cache, then fall back to baked-in list
    (async () => {
      try {
        const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
        const raw = await AsyncStorage.getItem("@agrisoko/directory/v1");
        setMembers(raw ? JSON.parse(raw) : FALLBACK_MEMBERS);
      } catch {
        setMembers(FALLBACK_MEMBERS);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  if (!loaded) return <Screen gradientHeader><StateView kind="loading" /></Screen>;

  return (
    <Screen gradientHeader>
      <ScrollView contentContainerStyle={{ padding: space.md }}>
        <Text style={styles.h}>Team directory</Text>
        <Text style={styles.sub}>Tap a member to see their evidence-grounded profile.</Text>
        {members.map((m) => (
          <TouchableOpacity
            key={m.id}
            onPress={() => navigation.navigate("Profile", { memberId: m.id })}
            accessibilityRole="button"
            accessibilityLabel={`Open profile for ${m.fullName}`}
          >
            <Card style={{ marginTop: space.sm }}>
              <Text style={styles.name}>{m.fullName}</Text>
              <Text style={styles.role}>{m.role}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h:    { color: colors.lime700, ...type.h1 },
  sub:  { color: colors.ink500, ...type.body, marginTop: space.xs, marginBottom: space.sm },
  name: { color: colors.ink900, ...type.h2 },
  role: { color: colors.lime600, ...type.small, marginTop: 2 },
});