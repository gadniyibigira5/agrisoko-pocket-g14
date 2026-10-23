/**
 * Cache helpers for offline behavior.
 * Keys are versioned so we can invalidate without touching the app.
 * Owner: Mohamed Bashir
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CACHE_KEYS = {
  directory:       "@agrisoko/directory/v1",
  directoryFull:   "@agrisoko/directory/full/v1",
  lastResult:      "@agrisoko/lastResult/v1",
  modelInfo:       "@agrisoko/modelInfo/v1",
};

export async function saveCache<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silent â€” cache failures should never break the UI.
  }
}

export async function readCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function clearCaches(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(CACHE_KEYS));
  } catch {
    // Silent.
  }
}