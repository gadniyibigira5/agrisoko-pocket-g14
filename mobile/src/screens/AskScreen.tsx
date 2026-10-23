import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { ConfidenceBar } from "../components/ConfidenceBar";
import { StateView } from "../components/StateView";
import { askTeam, AskResult, CONFIG } from "../lib/api";
import { colors, radius, space, type } from "../theme/tokens";

type UiState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "result"; data: AskResult }
  | { kind: "error"; message: string };

export function AskScreen() {
  const [q, setQ] = useState("");
  const [state, setState] = useState<UiState>({ kind: "idle" });

  const submit = async () => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setState({ kind: "error", message: "Type at least 2 characters." });
      return;
    }
    if (trimmed.length > 300) {
      setState({ kind: "error", message: "Question is too long (max 300)." });
      return;
    }
    setState({ kind: "loading" });
    try {
      const data = await askTeam(trimmed);
      setState({ kind: "result", data });
    } catch (e: any) {
      setState({ kind: "error", message: e?.message ?? "Something went wrong." });
    }
  };

  return (
    <Screen gradientHeader>
      <ScrollView contentContainerStyle={{ padding: space.md }}>
        <Card>
          <Text style={styles.h}>Ask the team</Text>
          <Text style={styles.body}>
            e.g. "Who built offline mode?" or "Tell me about Erssie."
          </Text>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Type your question"
            placeholderTextColor={colors.ink300}
            style={styles.input}
            maxLength={300}
            multiline={false}
            accessibilityLabel="Ask a question about the team"
            returnKeyType="search"
            onSubmitEditing={submit}
          />
          <TouchableOpacity
            onPress={submit}
            disabled={state.kind === "loading"}
            style={[styles.cta, state.kind === "loading" && { opacity: 0.6 }]}
            accessibilityRole="button"
            accessibilityLabel="Submit question"
          >
            <Text style={styles.ctaLabel}>{state.kind === "loading" ? "Asking..." : "Ask"}</Text>
          </TouchableOpacity>
        </Card>

        {state.kind === "loading" && <StateView kind="loading" />}

        {state.kind === "error" && (
          <StateView kind="error" onRetry={submit} />
        )}

        {state.kind === "result" && state.data.match === null && (
          <StateView
            kind="empty"
            onRetry={() => setState({ kind: "idle" })}
          />
        )}

        {state.kind === "result" && state.data.match !== null && (
          <Card style={{ marginTop: space.md }}>
            <View style={{ flexDirection: "row", gap: space.xs, alignItems: "center" }}>
              <Chip variant={state.data.source === "live" ? "live" : state.data.source === "cached" ? "cached" : "offline"} />
              <Chip variant="matched" label={state.data.match.role} />
            </View>
            <Text style={styles.name}>{state.data.match.fullName}</Text>
            <Text style={styles.body}>{state.data.introduction}</Text>
            <ConfidenceBar confidence={state.data.confidence} />
            <Text style={styles.reason}>{state.data.reason}</Text>
          </Card>
        )}

        <Card style={{ marginTop: space.md }}>
          <Text style={styles.small}>Threshold: {CONFIG.confidenceThreshold}. Timeout: {CONFIG.apiTimeoutMs} ms.</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h:       { color: colors.lime700, ...type.h2 },
  body:    { color: colors.ink700, ...type.body, marginTop: space.xs },
  small:   { color: colors.ink500, ...type.small },
  name:    { color: colors.ink900, ...type.h1, marginTop: space.sm },
  reason:  { color: colors.ink500, ...type.small, marginTop: space.xs },
  input: {
    backgroundColor: colors.canvas,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.ink100,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    marginTop: space.sm,
    ...type.body,
    color: colors.ink900,
  },
  cta: {
    backgroundColor: colors.lime400,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: space.sm,
  },
  ctaLabel: { color: colors.ink900, ...type.body, fontWeight: "800" },
});