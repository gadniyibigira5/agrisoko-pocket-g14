import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { palettes, Palette, ThemeMode } from "./tokens";

type Ctx = {
  mode: ThemeMode;
  palette: Palette;
  toggle: () => void;
};

const ThemeCtx = createContext<Ctx | null>(null);
const KEY = "@agrisoko/theme/v1";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(KEY);
        if (saved === "dark" || saved === "light") setMode(saved);
      } catch {}
    })();
  }, []);

  const value = useMemo<Ctx>(() => ({
    mode,
    palette: palettes[mode] as Palette,
    toggle: () => setMode((m) => {
      const next: ThemeMode = m === "light" ? "dark" : "light";
      AsyncStorage.setItem(KEY, next).catch(() => {});
      return next;
    }),
  }), [mode]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme(): Ctx {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}