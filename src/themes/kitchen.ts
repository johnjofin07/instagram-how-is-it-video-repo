import type { ThemeSpec } from "./types";

// "Warm kitchen" — the machines-pillar skin. Cream counter-top canvas (warm,
// appetizing, food context), heat-amber working accent, cool steel-blue as the
// structural second (it literally plays "cool air" in the air-fryer episode),
// appetite/marketing red as the subject-brand token. Analogous warm scheme
// (amber–orange–red) with the blue as its complementary counterweight, so hot
// vs cold reads by hue AND lightness. Ink is warm brown-charcoal, never black;
// shadows are hue-shifted warm umber.
//
// Contrast notes (on #F6EFE3): text #3B2F26 ≈ 11.4:1, textDim #6E5C4D ≈ 5.4:1,
// accent #B45309 ≈ 4.4:1, second #3D6B8E ≈ 5.0:1, brand #C0392B ≈ 4.8:1,
// good #3E7434 ≈ 4.9:1. Hot/cold pairs differ strongly in lightness too, so
// they survive red-green colorblindness; scenes always add shape cues (arrows,
// slashes, labels) on top of color.
export const kitchen: ThemeSpec = {
  name: "kitchen",

  bg: "#F6EFE3",
  bgLifted: "#FFFFFF",
  background: { kind: "plain" },

  line: "rgba(59, 47, 38, 0.22)",
  lineFaint: "rgba(59, 47, 38, 0.1)",
  text: "#3B2F26",
  textDim: "#6E5C4D",
  textFaint: "#A5947F",

  accent: "#B45309",
  accentDim: "#EAC297",
  accentGlow: "rgba(180, 83, 9, 0.3)",
  second: "#3D6B8E",
  secondDim: "rgba(61, 107, 142, 0.45)",
  good: "#3E7434",
  warn: "#A16207",

  brand: "#C0392B",
  brandDim: "#EDB4AB",
  brandGlow: "rgba(192, 57, 43, 0.26)",

  card: "rgba(255, 253, 248, 0.94)",
  cardBorder: "rgba(59, 47, 38, 0.14)",
  cardShadow: "0 12px 32px rgba(96, 72, 56, 0.18)",

  vignette: "rgba(122, 96, 66, 0.22)",

  caption: {
    spoken: "rgba(46, 36, 28, 0.97)",
    unspoken: "rgba(46, 36, 28, 0.28)",
    halo: "none",
    font: "sans",
    boxed: true,
  },

  motion: { damping: 12, stiffness: 175, mass: 0.75 },
};
