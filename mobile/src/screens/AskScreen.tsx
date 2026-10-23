import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { ConfidenceBar } from "../components/ConfidenceBar";
import { StateView } from "../components/StateView";
import { useTheme } from "../theme/ThemeContext";
import { askTeam, AskResult } from "../lib/api";
import { radius, space, type } from "../theme/tokens";

type S = { k: "idle" } | { k: "loading" } | { k: "result"; d: AskResult } | { k: "error"; m: string };

export function AskScreen() {
  const { palette } = useTheme();
  const [q, setQ] = useState("");
  const [s, setS] = useState<S>({ k: "idle" });

  const submit = async () => {
    const t = q.trim();
    if (t.length < 2) { setS({ k: "error", m: "Type at least 2 characters." }); return; }
    if (t.length > 300) { setS({ k: "error", m: "Question is too long (300 max)." }); return; }
    setS({ k: "loading" });
    try { setS({ k: "result", d: await askTeam(t) }); }
    catch (e: any) { setS({ k: "error", m: e?.message ?? "Something went wrong." }); }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space.md }}>
        <Card>
          <Text style={[styles.h, { color: palette.brand.lime600 }]}>Ask the team</Text>
          <Text style={[styles.body, { color: palette.text.muted }]}>Try a name, role or feature.</Text>
          <TextInput
            value={q} onChangeText={setQ} placeholder="Type your question" placeholderTextColor={palette.text.muted}
            style={[styles.input, { color: palette.text.primary, backgroundColor: palette.canvas, borderColor: palette.border }]}
            maxLength={300} returnKeyType="search" onSubmitEditing={submit}
          />
          <TouchableOpacity onPress={submit} disabled={s.k === "loading"}
            style={[styles.cta, { backgroundColor: palette.brand.lime400 }, s.k === "loading" && { opacity: 0.5 }]}>
            <Text style={styles.ctaTxt}>{s.k === "loading" ? "Asking..." : "Ask"}</Text>
          </TouchableOpacity>
        </Card>

        {s.k === "loading" && <StateView kind="loading" />}
        {s.k === "error" && <StateView kind="error" onRetry={submit} />}
        {s.k === "result" && s.d.match === null && <StateView kind="empty" onRetry={() => setS({ k: "idle" })} />}
        {s.k === "result" && s.d.match !== null && (
          <Card style={{ marginTop: space.md }}>
            <View style={{ flexDirection: "row", gap: space.xs }}>
              <Chip variant={s.d.source === "live" ? "live" : s.d.source === "cached" ? "cached" : "offline"} />
              <Chip variant="matched" label={s.d.match.role} />
            </View>
            <Text style={[styles.name, { color: palette.text.primary }]}>{s.d.match.fullName}</Text>
            <Text style={[styles.body, { color: palette.text.muted }]}>{s.d.introduction}</Text>
            <ConfidenceBar confidence={s.d.confidence} />
            <Text style={[styles.small, { color: palette.text.muted }]}>{s.d.reason}</Text>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  h:    { ...type.h2 },
  body: { ...type.body, marginTop: space.xs },
  small:{ ...type.small, marginTop: space.sm },
  name: { ...type.h1, marginTop: space.sm },
  input:{ borderWidth: 1, borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: 12, marginTop: space.sm, ...type.body },
  cta:  { borderRadius: radius.pill, paddingVertical: 14, alignItems: "center", marginTop: space.sm },
  ctaTxt: { color: "#0E1A0C", ...type.body, fontWeight: "800" },
});