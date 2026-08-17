import type { ThemeSpec } from "./types";

// "Deep space control room" — the episode-001 look.
export const galaxy: ThemeSpec = {
  name: "galaxy",

  bg: "#050510",
  bgLifted: "#0d0d1e",
  background: { kind: "galaxy" },

  line: "rgba(148, 163, 200, 0.28)",
  lineFaint: "rgba(148, 163, 200, 0.15)",
  text: "#eef0f7",
  textDim: "#9aa2b8",
  textFaint: "#5a617a",

  accent: "#e50914",
  accentDim: "#7f1d1d",
  accentGlow: "rgba(229, 9, 20, 0.32)",
  second: "#7dd3fc",
  secondDim: "rgba(125, 211, 252, 0.5)",
  good: "#4ade80",
  warn: "#fbbf24",

  brand: "#e50914",
  brandDim: "#7f1d1d",
  brandGlow: "rgba(229, 9, 20, 0.32)",

  card: "rgba(10, 10, 22, 0.82)",
  cardBorder: "rgba(148, 163, 200, 0.22)",
  cardShadow: "0 10px 30px rgba(2, 6, 18, 0.4)",

  vignette: "rgba(0, 0, 8, 0.68)",

  caption: {
    spoken: "rgba(238, 240, 247, 0.96)",
    unspoken: "rgba(238, 240, 247, 0.3)",
    halo: "0 2px 18px rgba(0, 0, 10, 0.9)",
    font: "mono",
    boxed: false,
  },

  motion: { damping: 16, stiffness: 160, mass: 0.7 },
};
