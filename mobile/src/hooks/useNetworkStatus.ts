/**
 * Network status hook â€” single source of truth for online/offline UI.
 * Owner: Mohamed Bashir
 */
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export function useNetworkStatus(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((s) => {
      setOnline(Boolean(s.isConnected && s.isInternetReachable !== false));
    });
    return () => unsub();
  }, []);

  return online;
}