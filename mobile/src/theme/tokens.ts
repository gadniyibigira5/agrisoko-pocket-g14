export type ThemeMode = "light" | "dark";

const light = {
  mode: "light" as const,
  brand: {
    lime50: "#F7FFE0", lime100: "#E9FFB5", lime200: "#D6FF7A",
    lime300: "#BFF23F", lime400: "#A3E00A", lime500: "#7FB800",
    lime600: "#4F7A00", lime700: "#2F4A00",
  },
  ink: { ink900: "#0E1A0C", ink700: "#243322", ink500: "#4A5A47", ink300: "#8B9A87", ink100: "#E7EDE2" },
  canvas: "#F6FBEF",
  card: "#FFFFFF",
  border: "#E7EDE2",
  text: { primary: "#0E1A0C", secondary: "#243322", muted: "#4A5A47" },
  semantic: { success: "#3FA34D", warn: "#E0A100", danger: "#C4432B", info: "#2B7A78" },
  gradient: {
    hero: ["#D6FF7A", "#A3E00A", "#4F7A00"] as [string,string,string],
    cta:  ["#BFF23F", "#7FB800"] as [string,string],
  },
};

const dark = {
  mode: "dark" as const,
  brand: {
    lime50: "#1E2A12", lime100: "#283A18", lime200: "#3A5220",
    lime300: "#5E7F2A", lime400: "#BFF23F", lime500: "#A3E00A",
    lime600: "#D6FF7A", lime700: "#E9FFB5",
  },
  ink: { ink900: "#F7FFE0", ink700: "#E9FFB5", ink500: "#A3B89B", ink300: "#5C7057", ink100: "#1B2917" },
  canvas: "#0E1A0C",
  card: "#182610",
  border: "#243322",
  text: { primary: "#F7FFE0", secondary: "#D6FF7A", muted: "#A3B89B" },
  semantic: { success: "#7ED488", warn: "#F2C94C", danger: "#F07167", info: "#4DB5B2" },
  gradient: {
    hero: ["#2F4A00", "#4F7A00", "#A3E00A"] as [string,string,string],
    cta:  ["#7FB800", "#BFF23F"] as [string,string],
  },
};

export const palettes = { light, dark } as const;
export type Palette = typeof light;

export const radius = { sm: 10, md: 16, lg: 22, pill: 999 } as const;
export const space  = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32 } as const;

export const type = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: "800" as const },
  h1:      { fontSize: 24, lineHeight: 30, fontWeight: "800" as const },
  h2:      { fontSize: 19, lineHeight: 26, fontWeight: "700" as const },
  body:    { fontSize: 16, lineHeight: 24, fontWeight: "500" as const },
  small:   { fontSize: 13, lineHeight: 18, fontWeight: "600" as const },
  tiny:    { fontSize: 11, lineHeight: 14, fontWeight: "700" as const, letterSpacing: 0.6 },
};