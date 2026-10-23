/**
 * API client for AgriSoko Pocket â€” 8s timeout, cached fallback, offline lookup.
 * Owner: Joel Mogar Jr Eliezar
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export const CONFIG = {
  groupCode: "G14",
  appVersion: "1.0.0",
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:8000",
  apiTimeoutMs: 8000,
  confidenceThreshold: 0.45,
};

const K_LAST = "@agrisoko/lastResult/v1";
const K_DIR  = "@agrisoko/directory/v1";

export type AskResult = {
  match: any | null;
  confidence: number;
  reason: string;
  introduction: string | null;
  modelVersion: string;
  groupCode: string;
  suggestions?: string[];
  source: "live" | "cached" | "offline-local";
};

async function fetchWithTimeout(url: string, init: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), CONFIG.apiTimeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

export async function askTeam(question: string): Promise<AskResult> {
  const net = await NetInfo.fetch();
  if (!net.isConnected) return offlineLocal(question);

  try {
    const r = await fetchWithTimeout(`${CONFIG.apiBaseUrl}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    const out: AskResult = { ...data, source: "live" };
    if (out.match) await AsyncStorage.setItem(K_LAST, JSON.stringify(out));
    return out;
  } catch {
    const cached = await AsyncStorage.getItem(K_LAST);
    if (cached) return { ...JSON.parse(cached), source: "cached" };
    return offlineLocal(question);
  }
}

async function offlineLocal(question: string): Promise<AskResult> {
  const raw = await AsyncStorage.getItem(K_DIR);
  const members: any[] = raw ? JSON.parse(raw) : [];
  const needle = question.toLowerCase().trim();
  const hit = members.find((m) =>
    [m.fullName, ...(m.aliases ?? []), m.role, m.feature]
      .filter(Boolean)
      .some((f: string) => f.toLowerCase().includes(needle))
  );
  return {
    match: hit ?? null,
    confidence: hit ? 1 : 0,
    reason: hit ? "Exact name/alias/role lookup (offline)" : "No offline match",
    introduction: hit?.introductionDraft ?? null,
    modelVersion: "offline-local",
    groupCode: CONFIG.groupCode,
    suggestions: members.slice(0, 3).map((m) => m.fullName),
    source: "offline-local",
  };
}