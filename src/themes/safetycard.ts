import type { ThemeSpec } from "./types";

// "Safety card" — the airline-safety-card skin (012) and the channel's fourth
// LIGHT skin (after `maps`, `delivery`, `lobby`). The canvas is the laminated
// instruction card from a seat pocket: cool off-white stock, slate-blue ink
// line work, and the safety-card visual language everyone on a plane already
// knows — big orange action arrows, flat instructional figures, no prose.
//
// The split that carries the episode:
//
//   accent safety orange = ACTION — air in motion, arrows, the stampede, the
//                          pump's pull. Safety cards use exactly this color
//                          for exactly this job (motion arrows), which is why
//                          the episode's "no orange when nothing rushes"
//                          pivot reads instantly here.
//   ink slate blue       = STRUCTURE — the aircraft, the lavatory, the pipe:
//                          everything drawn, calm, and still.
//   second teal-cyan     = the blue liquid, and only the liquid.
//
// Scheme: complementary — a cool slate/teal family (H200–190) against its
// warm opposite, safety orange (H24). The dominant field is near-neutral
// (paper + slate ink), so the single warm accent owns all attention: the
// muted-sophisticated pattern from the color-theory tree, with the accent
// doubling as the aviation-culture reference.
// Warm advances / cool recedes is the depth model: orange motion pops off the
// card; slate structure and teal liquid sit back in the diagram plane.
// Shadows are hue-shifted cool slate (rgba(46,62,80)), never pure black.
//
// Contrast on bg #EFF2EF (measured): text 13.2:1 · ink-line base #33475A
// 8.5:1 · textDim 5.7:1 · accent #C63F0C 4.5:1 · second #0E7490 4.8:1 ·
// good 4.8:1 · warn 5.8:1. All improve ~0.5–0.7 on the white card surface.
// textFaint 3.4:1 — chrome + de-emphasized dots only, never information.
// accent passes 4.5:1 normal-text, so orange can label as well as point.
//
// Colorblindness: the load-bearing orange/slate pair separates on lightness
// as well as hue (deuteranopia: orange → olive-tan L*~48 vs slate L*~30).
// good/warn appear only inside bordered chips with words. The pivot beat
// ("no orange on screen") is redundantly coded: when the orange goes, the
// MOTION goes too — stillness carries the meaning for any color vision.
export const safetycard: ThemeSpec = {
  name: "safetycard",

  bg: "#EFF2EF",
  bgLifted: "#FFFFFF",
  background: { kind: "plain" },

  line: "rgba(51, 71, 90, 0.30)",
  lineFaint: "rgba(51, 71, 90, 0.12)",
  text: "#1D2930",
  textDim: "#4E6170",
  textFaint: "#6F808C",

  accent: "#C63F0C",
  accentDim: "#E0906C",
  accentGlow: "rgba(198, 63, 12, 0.20)",
  second: "#0E7490",
  secondDim: "rgba(14, 116, 144, 0.40)",
  good: "#1D7A3E",
  warn: "#B3261E",

  brand: "#C63F0C",
  brandDim: "#E0906C",
  brandGlow: "rgba(198, 63, 12, 0.20)",

  card: "#FFFFFF",
  cardBorder: "rgba(51, 71, 90, 0.16)",
  // cool-shifted toward the slate ink, never pure black
  cardShadow: "0 10px 28px rgba(46, 62, 80, 0.15)",

  vignette: "rgba(84, 100, 112, 0.16)",

  // Light skin → the `maps`/`lobby` treatment: dark words on a white rounded
  // card, bold sans. Squared-ish radius to match the laminated-card geometry.
  caption: {
    spoken: "rgba(24, 34, 42, 0.98)",
    unspoken: "rgba(24, 34, 42, 0.30)",
    halo: "0 1px 10px rgba(255, 255, 255, 0.85)",
    font: "sans",
    boxed: true,
    radius: 14,
  },

  // Instructional crispness: snappy like flightlab, zero wobble — a safety
  // card doesn't bounce.
  motion: { damping: 21, stiffness: 240, mass: 0.7 },
};
