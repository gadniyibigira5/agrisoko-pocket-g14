import React from "react";
import { Text, ScrollView, StyleSheet } from "react-native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { useTheme } from "../theme/ThemeContext";
import { space, type } from "../theme/tokens";

export function AboutScreen() {
  const { palette, mode } = useTheme();
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: space.md }}>
        <Card>
          <Text style={[styles.h, { color: palette.brand.lime600 }]}>About AgriSoko Pocket</Text>
          <Text style={[styles.body, { color: palette.text.muted }]}>Evidence-grounded AI profile finder. Ask a question, get a grounded profile with GitHub evidence.</Text>
          <Text style={[styles.body, { color: palette.text.muted }]}>Current theme: {mode}</Text>
        </Card>
        <Card style={{ marginTop: space.md }}>
          <Text style={[styles.h, { color: palette.brand.lime600 }]}>Model</Text>
          <Text style={[styles.body, { color: palette.text.muted }]}>TF-IDF word (1,2) sublinear, cosine similarity, threshold 0.45</Text>
          <Text style={[styles.body, { color: palette.text.muted }]}>Group: G14 - Version 1.0.1</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  h:    { ...type.h2, marginBottom: space.xs },
  body: { ...type.body, marginTop: 4 },
});