import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { useTheme } from "../theme/ThemeContext";
import { space, type } from "../theme/tokens";

const MEMBERS = [
  { id: "gad",      fullName: "Niyibigira Gad",              role: "Group Lead + Mobile", avatar: require("../../assets/avatars/gad.png") },
  { id: "erssie",   fullName: "Teta Erssie",                 role: "AI Engineer",         avatar: require("../../assets/avatars/erssie.png") },
  { id: "sandrine", fullName: "Mbabazi Sandrine",            role: "AI Engineer",         avatar: require("../../assets/avatars/sandrine.png") },
  { id: "joel",     fullName: "Joel Mogar Jr Eliezar",       role: "Mobile Developer",    avatar: require("../../assets/avatars/joel.png") },
  { id: "claire",   fullName: "Uwiringiyimana Marie Claire", role: "Mobile Developer",    avatar: require("../../assets/avatars/claire.png") },
  { id: "bashir",   fullName: "Mohamed Bashir",              role: "Integration + QA",    avatar: require("../../assets/avatars/bashir.png") },
];

export function DirectoryScreen() {
  const { palette } = useTheme();
  const nav = useNavigation<any>();
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space.md, paddingBottom: 40 }}>
        <Text style={[styles.h, { color: palette.text.primary }]}>Team directory</Text>
        <Text style={[styles.sub, { color: palette.text.muted }]}>Tap a member to see their evidence-grounded profile.</Text>
        {MEMBERS.map((m) => (
          <TouchableOpacity key={m.id} onPress={() => nav.navigate("Profile", { memberId: m.id })}>
            <Card style={{ marginTop: space.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
                <Image source={m.avatar} style={[styles.avatar, { borderColor: palette.brand.lime400 }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.name, { color: palette.text.primary }]}>{m.fullName}</Text>
                  <Text style={[styles.role, { color: palette.brand.lime600 }]}>{m.role}</Text>
                </View>
                <Text style={{ color: palette.brand.lime500, fontSize: 24 }}>{">"}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  h:      { ...type.h1 },
  sub:    { ...type.body, marginTop: space.xs, marginBottom: space.sm },
  name:   { ...type.h2 },
  role:   { ...type.small, marginTop: 2 },
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2 },
});