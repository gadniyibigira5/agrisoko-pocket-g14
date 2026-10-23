/**
 * Root entry â€” wires providers, navigation, and first-launch directory cache.
 * Owner: Mohamed Bashir
 */
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { RootNav } from "./src/navigation/RootNav";
import { saveCache, CACHE_KEYS } from "./src/lib/cache";
import { CONFIG } from "./src/lib/api";

export default function App() {
  useEffect(() => {
    // Prime directory cache on first launch so offline lookup works immediately.
    (async () => {
      try {
        const r = await fetch(`${CONFIG.apiBaseUrl}/members`, { method: "GET" });
        if (r.ok) {
          const data = await r.json();
          await saveCache(CACHE_KEYS.directory, data);
        }
        const mi = await fetch(`${CONFIG.apiBaseUrl}/model-info`, { method: "GET" });
        if (mi.ok) {
          const info = await mi.json();
          await saveCache(CACHE_KEYS.modelInfo, info);
        }
      } catch {
        // Offline â€” use whatever is already cached.
      }
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <RootNav />
    </SafeAreaProvider>
  );
}