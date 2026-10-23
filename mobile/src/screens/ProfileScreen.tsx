import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { EvidenceLink } from "../components/EvidenceLink";
import { StateView } from "../components/StateView";
import { colors, space, type } from "../theme/tokens";

type Member = {
  id: string;
  fullName: string;
  registrationNumber: string;
  aliases: string[];
  githubUsername: string;
  role: string;
  skills: string[];
  targetUser: string;
  problem: string;
  contribution: string;
  feature: string;
  outcomeMetric: string | null;
  evidenceLinks: { issue: string; pr: string; commit: string; demoTimestamp: string };
  testerFeedback: { category: string; consent: boolean; quote: string } | null;
  introductionDraft: string;
};

export function ProfileScreen() {
  const route = useRoute<any>();
  const memberId: string = route.params.memberId;
  const [member, setMember] = useState<Member | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
        const raw = await AsyncStorage.getItem("@agrisoko/directory/full/v1");
        const all: Member[] = raw ? JSON.parse(raw) : [];
        const found = all.find((m) => m.id === memberId);
        if (found) setMember(found);
        else setError("Profile not cached. Connect and open the Ask screen once to refresh.");
      } catch (e: any) {
        setError(e?.message ?? "Could not load profile.");
      }
    })();
  }, [memberId]);

  if (!member) {
    return (
      <Screen gradientHeader>
        <StateView kind={error ? "error" : "loading"} />
        {error && <Text style={{ padding: space.md, color: colors.ink500 }}>{error}</Text>}
      </Screen>
    );
  }

  return (
    <Screen gradientHeader>
      <ScrollView contentContainerStyle={{ padding: space.md }}>
        <Card>
          <View style={{ flexDirection: "row", gap: space.xs }}>
            <Chip variant="matched" label={member.role} />
          </View>
          <Text style={styles.name}>{member.fullName}</Text>
          <Text style={styles.reg}>{member.registrationNumber} Â· @{member.githubUsername}</Text>
          <Text style={styles.intro}>{member.introductionDraft}</Text>
        </Card>

        <Card style={{ marginTop: space.md }}>
          <Text style={styles.h}>Contribution</Text>
          <Text style={styles.body}>{member.contribution}</Text>
          <Text style={styles.h2}>Feature</Text>
          <Text style={styles.body}>{member.feature}</Text>
          <Text style={styles.h2}>Target user</Text>
          <Text style={styles.body}>{member.targetUser}</Text>
          <Text style={styles.h2}>Problem</Text>
          <Text style={styles.body}>{member.problem}</Text>
        </Card>

        <Card style={{ marginTop: space.md }}>
          <Text style={styles.h}>Measured evidence</Text>
          <Text style={styles.body}>{member.outcomeMetric ?? "No verified metric yet. Claims limited to what was built and tested."}</Text>
        </Card>

        <Card style={{ marginTop: space.md }}>
          <Text style={styles.h}>Skills</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.xs, marginTop: space.xs }}>
            {member.skills.map((s) => <Chip key={s} variant="info" label={s} />)}
          </View>
        </Card>

        <Card style={{ marginTop: space.md }}>
          <Text style={styles.h}>Evidence links</Text>
          <EvidenceLink label="Issue" url={member.evidenceLinks.issue} />
          <EvidenceLink label="Pull request" url={member.evidenceLinks.pr} />
          <EvidenceLink label="Final commit" url={member.evidenceLinks.commit} />
        </Card>

        {member.testerFeedback && member.testerFeedback.consent && (
          <Card style={{ marginTop: space.md }}>
            <Text style={styles.h}>Tester feedback</Text>
            <Text style={styles.body}>Category: {member.testerFeedback.category}</Text>
            <Text style={styles.quote}>"{member.testerFeedback.quote}"</Text>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name:  { color: colors.ink900, ...type.h1, marginTop: space.sm },
  reg:   { color: colors.ink500, ...type.small, marginTop: 2 },
  intro: { color: colors.ink700, ...type.body, marginTop: space.sm },
  h:     { color: colors.lime700, ...type.h2 },
  h2:    { color: colors.lime600, ...type.small, marginTop: space.sm },
  body:  { color: colors.ink700, ...type.body, marginTop: 2 },
  quote: { color: colors.lime700, ...type.body, fontStyle: "italic", marginTop: space.xs },
});