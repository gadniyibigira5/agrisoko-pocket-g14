/**
 * Lime Grove design tokens â€” single source of truth.
 * Owner: Niyibigira Gad
 * Branch: feat/home-nav
 */
export const colors = {
  lime50:  "#F7FFE0",
  lime100: "#E9FFB5",
  lime200: "#D6FF7A",
  lime300: "#BFF23F",
  lime400: "#A3E00A",
  lime500: "#7FB800",
  lime600: "#4F7A00",
  lime700: "#2F4A00",

  ink900: "#0E1A0C",
  ink700: "#243322",
  ink500: "#4A5A47",
  ink300: "#8B9A87",
  ink100: "#E7EDE2",
  canvas: "#F6FBEF",
  card:   "#FFFFFF",

  success: "#3FA34D",
  warn:    "#E0A100",
  danger:  "#C4432B",
  offline: "#5B6B57",
  info:    "#2B7A78",
} as const;

export const gradients = {
  brand:   ["#D6FF7A", "#A3E00A", "#4F7A00"] as const,
  wash:    ["#F7FFE0", "#E9FFB5"] as const,
  cta:     ["#BFF23F", "#7FB800"] as const,
  offline: ["#E7EDE2", "#C7D1C2"] as const,
};

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

export const shadow = {
  card: {
    shadowColor: "#2F4A00",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
};