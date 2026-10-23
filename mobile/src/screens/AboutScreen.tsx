import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { readCache, CACHE_KEYS } from "../lib/cache";
import { colors, space, type } from "../theme/tokens";

type ModelInfo = {
  groupCode: string;
  vectorizer: string;
  threshold: number;
  datasetFingerprint: string;
  modelVersion: string;
  limitations: string[];
};

export function AboutScreen() {
  const [info, setInfo] = useState<ModelInfo | null>(null);

  useEffect(() => {
    (async () => {
      const cached = await readCache<ModelInfo>(CACHE_KEYS.modelInfo);
      if (cached) setInfo(cached);
    })();
  }, []);

  return (
    <Screen gradientHeader>
      <ScrollView contentContainerStyle={{ padding: space.md }}>
        <Card>
          <Text style={styles.h}>About AgriSoko Pocket</Text>
          <Text style={styles.body}>
            Evidence-grounded AI profile finder. Ask a question about a teammate,
            get a grounded profile that links to GitHub evidence.
          </Text>
          <View style={{ flexDirection: "row", gap: space.xs, marginTop: space.sm }}>
            <Chip variant="info" label="v1.0.0" />
            <Chip variant="matched" label="G14" />
          </View>
        </Card>

        <Card style={{ marginTop: space.md }}>
          <Text style={styles.h}>Model information</Text>
          {info ? (
            <>
              <Text style={styles.body}>Vectorizer: {info.vectorizer}</Text>
              <Text style={styles.body}>Threshold: {info.threshold}</Text>
              <Text style={styles.body}>Version: {info.modelVersion}</Text>
              <Text style={styles.body}>Fingerprint: {info.datasetFingerprint.slice(0, 16)}â€¦</Text>
              <Text style={styles.h2}>Limitations</Text>
              {info.limitations.map((l, i) => <Text key={i} style={styles.body}>â€¢ {l}</Text>)}
            </>
          ) : (
            <Text style={styles.body}>Model info will load once the API is online.</Text>
          )}
        </Card>

        <Card style={{ marginTop: space.md }}>
          <Text style={styles.h}>Evidence & source</Text>
          <Text style={styles.body}>Repository: github.com/gadniyibigira5/agrisoko-pocket-g14</Text>
          <Text style={styles.body}>APK: AgriSokoPocket_G14.apk</Text>
          <Text style={styles.body}>AI service: FastAPI + scikit-learn TF-IDF</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h:    { color: colors.lime700, ...type.h2, marginBottom: space.xs },
  h2:   { color: colors.lime600, ...type.small, marginTop: space.sm },
  body: { color: colors.ink700, ...type.body, marginTop: 2 },
});