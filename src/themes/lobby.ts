import type { ThemeSpec } from "./types";

// "Lobby" — the elevator-dispatching skin (010) and the channel's third LIGHT
// skin (after `maps` and `delivery`). The canvas IS a hotel-lobby cutaway:
// warm marble ground, brass fittings, and one cool machine-intelligence color
// drawing the plan over the top of it. The split that carries the episode:
//
//   accent deep teal = the algorithm (route lines, the dispatcher's plan,
//                      destination groupings, the door timer) — everything
//                      invisible and thinking
//   second/brand brass = the physical machine and the human ritual (buttons,
//                      doors, the car, the firefighter key) — everything you
//                      can touch
//
// Teal thinks, brass moves. The hook's joke is brass (a press) being ignored
// by teal (the plan); the closer is the same shot, resolved.
//
// Scheme: the ground is monochromatic-warm (bg/text/textDim/textFaint all sit
// at H38-45, so the marble reads as one warm stone), and the accent is its
// direct complement — teal H176 against the ground's H41. Warm brass advances
// off the warm marble by chroma alone; cool teal recedes, which is exactly
// right for a color that represents something you cannot see.
// Shadows are hue-shifted warm (rgba(40,32,18)), never pure black.
//
// Contrast on bg #EFEBE3: text 13.3:1 · textDim 4.7:1 · accent 5.7:1 ·
// second 4.7:1 · good 5.2:1 · warn 5.0:1 · brand 6.1:1. textFaint is 3.8:1
// (raised from a first draft's 2.4:1 — the building cutaway prints floor
// NUMBERS in it, which is information, not chrome). On the white `card`
// surface every one of those improves by ~1 point (accent 6.8:1, second
// 5.6:1, textFaint 4.5:1). accentDim is 3.0:1 on marble — dim strokes only.
//
// Two deliberate moves away from the first draft, both driven by measurement:
//   * accent teal was #0F766E (4.60:1 — no headroom once the delivery encode
//     re-quantizes it, and the plan itself flagged it). Darkened to #0C6660,
//     which sits between that and the plan's #0B5D57 fallback: 5.7:1 on
//     marble while staying luminous enough for 3px route lines and a glow.
//   * second brass was #B08A3E (2.70:1 — a fail, and the hook stamps the word
//     "PLACEBO" in it at display size). Darkened to #866224 (4.66:1).
//
// DARK-SURFACE CAVEAT for 010's kit: `second` #866224 is only 2.7:1 on the
// kit's SHAFT interior (#2B2620). Brass drawn INSIDE the shaft (the car trim,
// the direction triangle) must use a lit brass — `brandGlow`'s rgb, or a
// kit-local BRASS_LIT const around #C8A24A — not `second` straight.
//
// Colorblindness: the load-bearing teal/brass pair separates on both hue and
// lightness under deuteranopia and protanopia (teal -> #413a62 dark violet-
// grey L*39, brass -> #7a7d3f olive L*44). `good` and `warn` converge in
// lightness under deuteranopia (L* 41 vs 42) but not in hue, and every use of
// them is a bordered chip with words in it, so nothing rides on color alone.
export const lobby: ThemeSpec = {
  name: "lobby",

  bg: "#EFEBE3",
  bgLifted: "#FFFFFF",
  background: { kind: "plain" },

  line: "rgba(45, 40, 32, 0.25)",
  lineFaint: "rgba(45, 40, 32, 0.10)",
  text: "#26221B",
  textDim: "#6E6758",
  textFaint: "#7E765F",

  accent: "#0C6660",
  accentDim: "#4E938C",
  accentGlow: "rgba(12, 102, 96, 0.18)",
  second: "#866224",
  secondDim: "rgba(134, 98, 36, 0.45)",
  good: "#14712F",
  warn: "#B23A0A",

  brand: "#6B5320",
  brandDim: "rgba(107, 83, 32, 0.45)",
  // the lit-brass highlight — the one brass value bright enough for the dark
  // shaft interior, so kits can pull its rgb for trim on SHAFT
  brandGlow: "rgba(200, 162, 74, 0.30)",

  card: "#FFFFFF",
  cardBorder: "rgba(45, 40, 32, 0.14)",
  // warm-shifted toward the marble, never pure black
  cardShadow: "0 10px 30px rgba(40, 32, 18, 0.14)",

  vignette: "rgba(72, 62, 44, 0.20)",

  // Light skin -> the `maps` treatment: dark words on a white rounded card,
  // bold sans, light halo. Squared-ish radius to match the chip geometry.
  caption: {
    spoken: "rgba(28, 24, 17, 0.98)",
    unspoken: "rgba(28, 24, 17, 0.30)",
    halo: "0 1px 10px rgba(255, 255, 255, 0.85)",
    font: "sans",
    boxed: true,
    radius: 14,
  },

  // Elevator physics: heavy, damped, zero bounce — doors glide, they don't pop.
  motion: { damping: 20, stiffness: 150, mass: 1.0 },
};
