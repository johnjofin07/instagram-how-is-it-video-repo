import type { ThemeSpec } from "./types";

// "Paper sky" — the cut-paper diorama skin (012 v3) and the channel's fifth
// LIGHT skin. The canvas is a physical papercraft model photographed straight
// on: layered sky-blue papers for the sky, white paper cutouts for clouds, a
// RED papercraft plane, and deep-blue drop shadows doing the work outlines
// used to do. The rendering law that makes it read as paper:
//
//   NO STROKES. Every shape is a flat paper fill; separation comes from
//   layered pieces and soft hue-shifted shadows (never grey/black — shadow on
//   blue paper is deeper blue). Nearer layers cast longer shadows.
//
// The split that carries the episode:
//
//   brand red      = the PLANE — the one object the episode is about
//   accent orange  = ACTION — air in motion, paper arrows, the stampede,
//                    the pump's pull ("no orange on screen = nothing rushes")
//   second teal    = the blue liquid, and only the liquid
//   ink navy       = text, punched windows, and the thin-air VOID (at
//                    altitude the sky above IS near-navy — physically true)
//
// Scheme: an analogous blue field (sky papers + navy ink + teal liquid)
// broken by its warm complements — red for the object, orange for motion.
// Warm advances off the cool field, which is exactly the hierarchy: plane
// and moving air pop, sky and structure recede.
//
// Contrast on bg #BDDDF0 (measured): text 10.5:1 · textDim 5.4:1 · ink/navy
// 9.6:1 · brand red #C22F2C 4.0:1 · accent orange #C64910 3.4:1 (large/bold
// display use only on sky; 4.8:1 on the white card surfaces where it labels)
// · second teal 4.1:1. textFaint 3.0:1 — chrome only.
// Colorblindness: red vs orange separate by lightness AND role (a plane
// silhouette is never an arrow); the ground pivot is redundantly coded — when
// the orange goes, all MOTION goes with it.
export const papersky: ThemeSpec = {
  name: "papersky",

  bg: "#BDDDF0",
  bgLifted: "#FFFFFF",
  background: { kind: "plain" },

  line: "rgba(22, 41, 58, 0.28)",
  lineFaint: "rgba(22, 41, 58, 0.10)",
  text: "#16293A",
  textDim: "#39566C",
  textFaint: "#5F7E93",

  accent: "#C64910",
  accentDim: "#E8A583",
  accentGlow: "rgba(198, 73, 16, 0.22)",
  second: "#136C8E",
  secondDim: "rgba(19, 108, 142, 0.40)",
  good: "#1D7A3E",
  warn: "#C22F2C",

  brand: "#C22F2C",
  brandDim: "#EBA5A0",
  brandGlow: "rgba(194, 47, 44, 0.22)",

  card: "#FFFFFF",
  cardBorder: "rgba(22, 41, 58, 0.14)",
  // paper shadow: hue-shifted deep blue, soft and offset — never black
  cardShadow: "0 12px 30px rgba(24, 56, 84, 0.28)",

  vignette: "rgba(47, 86, 116, 0.18)",

  // Bordered white card + bold sans (channel rule: never mono captions)
  caption: {
    spoken: "rgba(22, 41, 58, 0.98)",
    unspoken: "rgba(22, 41, 58, 0.30)",
    halo: "0 1px 10px rgba(255, 255, 255, 0.85)",
    font: "sans",
    boxed: true,
    radius: 14,
  },

  // Paper physics: light pieces settle fast with the tiniest flutter
  motion: { damping: 15, stiffness: 210, mass: 0.75 },
};
