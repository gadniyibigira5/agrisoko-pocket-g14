import React from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { EvidenceLink } from "../components/EvidenceLink";
import { useTheme } from "../theme/ThemeContext";
import { space, type } from "../theme/tokens";

const BASE = "https://github.com/gadniyibigira5/agrisoko-pocket-g14";

const DATA: Record<string, any> = {
  gad: {
    fullName: "Niyibigira Gad", registrationNumber: "25/26952",
    role: "Group Lead + Mobile",
    targetUser: "potato cooperative members in Musanze",
    problem: "visitors cannot tell who built which part",
    contribution: "built the app shell, typed navigation and home screen",
    feature: "Home screen and navigation",
    avatar: require("../../assets/avatars/gad.png"),
    links: { issue: `${BASE}/issues/1`, pr: `${BASE}/pull/13`, commit: `${BASE}/commit/0b01df6` },
  },
  erssie: {
    fullName: "Teta Erssie", registrationNumber: "25/XXXXX",
    role: "AI Engineer",
    targetUser: "cooperative members asking who built what",
    problem: "finding the right teammate for a topic",
    contribution: "built the TF-IDF matcher and POST /ask",
    feature: "AI matching engine",
    avatar: require("../../assets/avatars/erssie.png"),
    links: { issue: `${BASE}/issues/2`, pr: `${BASE}/pull/12`, commit: `${BASE}/commit/b30f0f4` },
  },
  sandrine: {
    fullName: "Mbabazi Sandrine", registrationNumber: "25/XXXXX",
    role: "AI Engineer",
    targetUser: "release process",
    problem: "the AI must be reproducible",
    contribution: "built build_index.py, fingerprinting, pytest",
    feature: "Index build and AI tests",
    avatar: require("../../assets/avatars/sandrine.png"),
    links: { issue: `${BASE}/issues/3`, pr: `${BASE}/pull/11`, commit: `${BASE}/commit/33b1734` },
  },
  joel: {
    fullName: "Joel Mogar Jr Eliezar", registrationNumber: "25/XXXXX",
    role: "Mobile Developer",
    targetUser: "users typing a question",
    problem: "ask flow needs feedback",
    contribution: "built Ask screen and confidence bar",
    feature: "Ask screen and ConfidenceBar",
    avatar: require("../../assets/avatars/joel.png"),
    links: { issue: `${BASE}/issues/4`, pr: `${BASE}/pull/14`, commit: `${BASE}/commit/ba8fc05` },
  },
  claire: {
    fullName: "Uwiringiyimana Marie Claire", registrationNumber: "25/XXXXX",
    role: "Mobile Developer",
    targetUser: "visitors browsing the team",
    problem: "no manual browse path",
    contribution: "built directory and profile screens",
    feature: "Directory and Profile",
    avatar: require("../../assets/avatars/claire.png"),
    links: { issue: `${BASE}/issues/5`, pr: `${BASE}/pull/15`, commit: `${BASE}/commit/12db7d1` },
  },
  bashir: {
    fullName: "Mohamed Bashir", registrationNumber: "25/XXXXX",
    role: "Integration + QA",
    targetUser: "users on unreliable networks",
    problem: "must work offline",
    contribution: "built offline cache and recovery",
    feature: "Offline mode",
    avatar: require("../../assets/avatars/bashir.png"),
    links: { issue: `${BASE}/issues/6`, pr: `${BASE}/pull/16`, commit: `${BASE}/commit/d1b9ea6` },
  },
};

export function ProfileScreen() {
  const { palette } = useTheme();
  const { params } = useRoute<any>();
  const m = DATA[params.memberId];

  if (!m) return <Screen><Text style={{ padding: 24, color: palette.text.muted }}>Member not found.</Text></Screen>;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space.md, paddingBottom: 40 }}>
        <Card>
          <View style={{ flexDirection: "row", alignItems: "center", gap: space.md }}>
            <Image source={m.avatar} style={[styles.bigAvatar, { borderColor: palette.brand.lime400 }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: palette.text.primary }]}>{m.fullName}</Text>
              <Text style={[styles.reg, { color: palette.text.muted }]}>{m.registrationNumber}</Text>
              <Chip variant="matched" label={m.role} style={{ marginTop: 6 }} />
            </View>
          </View>
        </Card>

        <Card style={{ marginTop: space.md }}>
          <Text style={[styles.h, { color: palette.brand.lime600 }]}>Contribution</Text>
          <Text style={[styles.body, { color: palette.text.muted }]}>{m.contribution}</Text>
          <Text style={[styles.subH, { color: palette.brand.lime600 }]}>Feature</Text>
          <Text style={[styles.body, { color: palette.text.muted }]}>{m.feature}</Text>
          <Text style={[styles.subH, { color: palette.brand.lime600 }]}>Target user</Text>
          <Text style={[styles.body, { color: palette.text.muted }]}>{m.targetUser}</Text>
          <Text style={[styles.subH, { color: palette.brand.lime600 }]}>Problem</Text>
          <Text style={[styles.body, { color: palette.text.muted }]}>{m.problem}</Text>
        </Card>

        <Card style={{ marginTop: space.md }}>
          <Text style={[styles.h, { color: palette.brand.lime600 }]}>Evidence links</Text>
          <EvidenceLink label="Issue"        url={m.links.issue} />
          <EvidenceLink label="Pull request" url={m.links.pr} />
          <EvidenceLink label="Final commit" url={m.links.commit} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name:      { ...type.h1 },
  reg:       { ...type.small, marginTop: 2 },
  h:         { ...type.h2, marginBottom: space.xs },
  subH:      { ...type.small, marginTop: space.sm },
  body:      { ...type.body, marginTop: 2 },
  bigAvatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3 },
});