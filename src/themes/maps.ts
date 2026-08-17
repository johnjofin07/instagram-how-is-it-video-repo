import type { ThemeSpec } from "./types";

// "Daylight street map" — the first LIGHT skin. Warm paper land, Google-blue
// working accent (routes), traffic red as the subject-brand token, semantic
// green/amber for flow/congestion. Ink is hue-shifted blue-gray, never pure
// black; shadows are cool-gray, never black. Bouncy motion for the cute
// cartoon personality.
//
// Contrast notes (on #EDF0EA): text #20303C ≈ 12:1, textDim #55676F ≈ 5.5:1,
// accent #1A73E8 ≈ 4.6:1, brand #D93025 ≈ 4.9:1, good #188038 ≈ 5.4:1.
// Traffic red/green also differ strongly in lightness, so jams stay readable
// for red-green colorblind viewers; scenes always add shape/position cues too.
export const maps: ThemeSpec = {
  name: "maps",

  bg: "#EDF0EA",
  bgLifted: "#FFFFFF",
  background: { kind: "map" },

  line: "rgba(32, 48, 60, 0.22)",
  lineFaint: "rgba(32, 48, 60, 0.1)",
  text: "#20303C",
  textDim: "#55676F",
  textFaint: "#93A1AB",

  accent: "#1A73E8",
  accentDim: "#9EC3F5",
  accentGlow: "rgba(26, 115, 232, 0.3)",
  second: "#E8710A",
  secondDim: "rgba(232, 113, 10, 0.45)",
  good: "#188038",
  warn: "#E8710A",

  brand: "#D93025",
  brandDim: "#F3B7B1",
  brandGlow: "rgba(217, 48, 37, 0.28)",

  card: "rgba(255, 255, 255, 0.94)",
  cardBorder: "rgba(32, 48, 60, 0.14)",
  cardShadow: "0 12px 32px rgba(60, 80, 90, 0.18)",

  vignette: "rgba(96, 116, 110, 0.22)",

  caption: {
    spoken: "rgba(28, 42, 52, 0.97)",
    unspoken: "rgba(28, 42, 52, 0.28)",
    halo: "none",
    font: "sans",
    boxed: true,
  },

  motion: { damping: 13, stiffness: 190, mass: 0.7 },
};
