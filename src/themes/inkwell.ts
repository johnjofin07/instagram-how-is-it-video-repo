import type { ThemeSpec } from "./types";

// "Inkwell" v2 — the AI-text-watermarking skin (007). A warm cream-and-brown
// writing desk: Anthropic's own identity register (ivory paper, terracotta,
// espresso ink) turned into a stage where invisible writing DEVELOPS under a
// warm scan lamp, the way lemon-juice ink appears over a flame.
//
// The conceptual win of the cream ground: the hidden watermark glows in
// Claude's own color, so the signature is literally Claude-colored. Two signal
// colors carry the whole argument and never swap roles:
//
//   accent fired clay  = the watermark itself (the hidden mark, the words that
//                        develop when the lamp passes, the detector's finding)
//   second dark bronze = the picking mechanism (the coin, the word-choice
//                        chips, the tally) — bronze is the CAUSE, clay the
//                        EVIDENCE. If a viewer can name which is which, the
//                        episode has landed.
//
// `warn` deep red appears exactly twice (the "NOT RELEASED YET" band and the
// failed-essay grade), always as a shape with text on it. `brand` holds the
// true Claude terracotta and marks the subject — the neutral AI chip glyph
// only. NO logos, NO wordmarks, no starburst (§0.4): the palette evokes
// Claude, the shapes stay original.
//
// Scheme: the ground is a warm near-monochrome (bg/bgLifted/text/textDim/
// textFaint all sit in the 30-45° warm band, so the whole desk reads as one
// paper), and the two signals are analogous-but-separated — clay H15 against
// bronze H41. Warm advances on a warm ground, so separation is carried by
// LIGHTNESS, not hue alone (see the colorblindness note). Shadows are
// hue-shifted taupe (rgba(60,52,40)), never pure black; the pattern-interrupt
// veil in the coin scene is deep umber for the same reason.
//
// Contrast on bg #F0EEE6: text 13.1:1 · textDim 4.9:1 · textFaint 4.5:1 ·
// accent 4.8:1 · second 6.0:1 · good 4.4:1 · warn 6.4:1. On white cards and
// the kit's PAPER every one of those rises (accent 5.5:1 on card). All text
// tokens clear 4.4:1 on all three surfaces this episode uses.
//
// FILL-ONLY tokens (never text, they fail contrast by design):
//   brand #D97757 2.7:1 · accentDim #E5C0AE 1.5:1 · kit COIN_GOLD 1.7:1 ·
//   kit PAPER_LINE kraft 2.0:1. These are for glyph bodies, tints, coin faces
//   and fake text bars — anything a viewer must READ uses a text token.
//
// Colorblindness: the load-bearing clay/bronze pair is separated by 6.5 L*
// (44.3 vs 37.8) plus hue, and `warn` was pushed to L* 30.7 specifically so
// the warm triple (clay/bronze/red) never collapses into one value under
// deuteranopia. As always, nothing carries meaning by color alone — the
// rigged coin has a visible weight crescent, the AI glyph is a distinct
// shape, and both `warn` beats are a diagonal band and a stamped grade with
// words on them.
export const inkwell: ThemeSpec = {
  name: "inkwell",

  bg: "#F0EEE6", // Anthropic ivory
  bgLifted: "#FAF9F5",
  background: { kind: "plain" },

  line: "rgba(43, 37, 25, 0.25)",
  lineFaint: "rgba(43, 37, 25, 0.10)",
  text: "#2B2519", // warm espresso ink, never pure black
  textDim: "#6C665A",
  textFaint: "#736C5A", // this episode puts real information in faint type

  accent: "#A94E28", // fired clay — THE WATERMARK
  // Mid clay. NOT a pale tint: shared Chrome.tsx draws the stepper's progress
  // line in accentDim, and at #E5C0AE (1.5:1) that line was invisible on
  // cream — the stepper lost its progress affordance for the whole episode.
  // #C08059 reads on both cream (2.8:1) and PAPER (3.1:1) while staying
  // clearly lighter than `accent` (1.7:1 apart), so "dim" still reads as dim.
  accentDim: "#C08059", // FILLS AND HAIRLINES — still never body text
  accentGlow: "rgba(217, 119, 87, 0.35)", // true Claude terracotta as the bloom
  second: "#75530E", // dark bronze — THE MECHANISM
  secondDim: "rgba(227, 179, 65, 0.50)",
  good: "#3E7B3E",
  warn: "#8C1D18",

  brand: "#D97757", // the real Claude terracotta — LARGE FILLS ONLY
  brandDim: "#EFC9B8",
  brandGlow: "rgba(217, 119, 87, 0.28)",

  card: "#FFFFFF",
  cardBorder: "rgba(43, 37, 25, 0.14)",
  // hue-shifted taupe, never pure black
  cardShadow: "0 12px 32px rgba(60, 52, 40, 0.18)",

  vignette: "rgba(90, 74, 52, 0.20)",

  // Light skin -> the maps-skin treatment: dark words in a boxed pill.
  // Mono is kept (the channel's editorial voice for a text-about-text
  // episode); only the dressing changes.
  caption: {
    spoken: "rgba(35, 29, 20, 0.98)",
    unspoken: "rgba(35, 29, 20, 0.30)",
    halo: "none",
    font: "mono",
    boxed: true,
    radius: 14,
  },

  // Editorial snap: typewriter-crisp entries that settle without float.
  motion: { damping: 15, stiffness: 170, mass: 0.9 },
};
