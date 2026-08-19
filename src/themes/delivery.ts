import type { ThemeSpec } from "./types";

// "Parcel depot" — the Netflix-rework skin. Netflix played as a shipping
// company, so the canvas is cool pale warehouse concrete and everything warm
// sits ON it: kraft cardboard, red parcels. Split-complementary scheme —
// Netflix red (brand AND working accent, the parcels ARE the subject), kraft
// tan as the supporting warm (lives in the episode kit, not the tokens), teal
// as the structural counterweight (wifi, internet, machinery). Cool canvas
// recedes, warm cargo pops. Ink is slate blue-gray, never black; shadows are
// hue-shifted cool, never black.
//
// Contrast notes (on #E8ECEF): text #25313A ≈ 11.9:1, textDim #576874 ≈ 5.6:1,
// accent/brand #C50812 ≈ 5.6:1, second #0E7490 ≈ 4.6:1, good #1F7A3F ≈ 4.6:1.
// Red vs teal also differ strongly in lightness, so signal pairs survive
// red-green colorblindness; scenes add shape cues (tape, slashes, labels) too.
export const delivery: ThemeSpec = {
  name: "delivery",

  bg: "#E8ECEF",
  bgLifted: "#FFFFFF",
  background: { kind: "depot" },

  line: "rgba(37, 49, 58, 0.22)",
  lineFaint: "rgba(37, 49, 58, 0.1)",
  text: "#25313A",
  textDim: "#576874",
  textFaint: "#94A3AE",

  accent: "#C50812",
  accentDim: "#F0ABA8",
  accentGlow: "rgba(197, 8, 18, 0.26)",
  second: "#0E7490",
  secondDim: "rgba(14, 116, 144, 0.45)",
  good: "#1F7A3F",
  warn: "#B45309",

  brand: "#C50812",
  brandDim: "#F0ABA8",
  brandGlow: "rgba(197, 8, 18, 0.26)",

  card: "rgba(255, 255, 255, 0.95)",
  cardBorder: "rgba(37, 49, 58, 0.14)",
  cardShadow: "0 12px 32px rgba(55, 75, 90, 0.18)",

  vignette: "rgba(90, 105, 118, 0.22)",

  caption: {
    spoken: "rgba(30, 41, 50, 0.97)",
    unspoken: "rgba(30, 41, 50, 0.28)",
    halo: "none",
    font: "sans",
    boxed: true,
  },

  motion: { damping: 12, stiffness: 200, mass: 0.7 },
};
