/**
 * API client for AgriSoko Pocket G14.
 * Live URL for LAN demo. Bundled directory for offline-from-first-install.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export const CONFIG = {
  groupCode: "G14",
  appVersion: "1.0.1",
  apiBaseUrl: "http://10.214.240.106:8000",
  apiTimeoutMs: 10000,
  confidenceThreshold: 0.45,
};

const K_LAST = "@agrisoko/lastResult/v1";
const K_DIR  = "@agrisoko/directory/v1";

// Bundled directory - offline works from first install, no network needed.
const BUNDLED_DIRECTORY = [
  {
    id: "gad",
    fullName: "Niyibigira Gad",
    aliases: ["Gad", "Gad Niyibigira"],
    role: "Group Lead and Mobile Developer",
    feature: "Home screen navigation shell",
    introductionDraft: "My name is Gad. I am the group lead of AgriSoko Pocket G14. I built the app shell and navigation so visitors can move from the home screen to any teammate profile.",
  },
  {
    id: "erssie",
    fullName: "Teta Erssie",
    aliases: ["Erssie", "Teta"],
    role: "AI Engineer",
    feature: "TF-IDF matcher POST ask endpoint",
    introductionDraft: "My name is Erssie. I am an AI engineer on AgriSoko Pocket G14. I built the TF-IDF matcher that turns a natural-language question into a grounded member profile.",
  },
  {
    id: "sandrine",
    fullName: "Mbabazi Sandrine",
    aliases: ["Sandrine", "Mbabazi"],
    role: "AI Engineer",
    feature: "build index fingerprint pytest suite",
    introductionDraft: "My name is Sandrine. I am an AI engineer on AgriSoko Pocket G14. I built the index build script, the dataset fingerprint and the pytest suite that proves the matcher is deterministic.",
  },
  {
    id: "joel",
    fullName: "Joel Mogar Jr Eliezar",
    aliases: ["Joel", "Joel Mogar"],
    role: "Mobile Developer",
    feature: "Ask query screen ConfidenceBar component",
    introductionDraft: "My name is Joel. I am a mobile developer on AgriSoko Pocket G14. I built the Ask screen and confidence bar so users see exactly how sure the AI is.",
  },
  {
    id: "claire",
    fullName: "Uwiringiyimana Marie Claire",
    aliases: ["Claire", "Marie Claire"],
    role: "Mobile Developer",
    feature: "Directory Profile detail screen EvidenceLink",
    introductionDraft: "My name is Marie Claire. I am a mobile developer on AgriSoko Pocket G14. I built the directory and member profile screens so every teammate can be reached by tapping, not only by asking.",
  },
  {
    id: "bashir",
    fullName: "Mohamed Bashir",
    aliases: ["Bashir", "Mohamed"],
    role: "Integration and QA Engineer",
    feature: "offline cache AsyncStorage NetInfo recovery",
    introductionDraft: "My name is Bashir. I am the integration and QA engineer on AgriSoko Pocket G14. I built the offline cache and retry flow so the app keeps working when the network drops.",
  },
];

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
    console.log("Calling:", `${CONFIG.apiBaseUrl}/ask`);
    const r = await fetchWithTimeout(`${CONFIG.apiBaseUrl}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    console.log("Response:", r.status);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    const out: AskResult = { ...data, source: "live" };
    if (out.match) await AsyncStorage.setItem(K_LAST, JSON.stringify(out));
    if (Array.isArray(data)) await AsyncStorage.setItem(K_DIR, JSON.stringify(data));
    return out;
  } catch (e: any) {
    console.warn("API call failed:", e?.message);
    const cached = await AsyncStorage.getItem(K_LAST);
    if (cached) return { ...JSON.parse(cached), source: "cached" };
    return offlineLocal(question);
  }
}

async function offlineLocal(question: string): Promise<AskResult> {
  // Try cached directory first, then bundled fallback
  const raw = await AsyncStorage.getItem(K_DIR);
  let directory: any[] = BUNDLED_DIRECTORY;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) directory = parsed;
    } catch {}
  }

  const needle = question.toLowerCase().trim();
  const hit = directory.find((m) =>
    [m.fullName, ...(m.aliases ?? []), m.role, m.feature]
      .filter(Boolean)
      .some((f: string) => f.toLowerCase().includes(needle))
  );

  return {
    match: hit
      ? { ...hit, introduction: hit.introductionDraft, evidenceLinks: { issue: "", pr: "", commit: "", demoTimestamp: "" }, testerFeedback: null }
      : null,
    confidence: hit ? 1 : 0,
    reason: hit
      ? "Exact name/alias/role lookup (offline)"
      : "No offline match",
    introduction: hit?.introductionDraft ?? null,
    modelVersion: "offline-local",
    groupCode: CONFIG.groupCode,
    suggestions: directory.slice(0, 3).map((m) => m.fullName),
    source: "offline-local",
  };
}