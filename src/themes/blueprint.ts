import type { ThemeSpec } from "./types";

// "Engineer's blueprint at night" — ink-navy graph paper, amber working
// accent, cyan structure. Snappier motion than galaxy.
export const blueprint: ThemeSpec = {
  name: "blueprint",

  bg: "#0b1020",
  bgLifted: "#111830",
  background: { kind: "blueprint" },

  line: "rgba(148, 180, 230, 0.28)",
  lineFaint: "rgba(148, 180, 230, 0.14)",
  text: "#edf1f8",
  textDim: "#9aa7bf",
  textFaint: "#5d6a84",

  accent: "#fbbf24",
  accentDim: "#8a6410",
  accentGlow: "rgba(251, 191, 36, 0.28)",
  second: "#7dd3fc",
  secondDim: "rgba(125, 211, 252, 0.5)",
  good: "#4ade80",
  warn: "#fb923c",

  brand: "#e50914",
  brandDim: "#8f1d22",
  brandGlow: "rgba(229, 9, 20, 0.3)",

  card: "rgba(15, 23, 42, 0.6)",
  cardBorder: "rgba(148, 180, 230, 0.25)",
  cardShadow: "0 10px 30px rgba(2, 6, 18, 0.4)",

  vignette: "rgba(0, 0, 8, 0.68)",

  caption: {
    spoken: "rgba(238, 240, 247, 0.96)",
    unspoken: "rgba(238, 240, 247, 0.3)",
    halo: "0 2px 18px rgba(0, 0, 10, 0.9)",
    font: "mono",
    boxed: false,
  },

  motion: { damping: 20, stiffness: 220, mass: 0.6 },
};
