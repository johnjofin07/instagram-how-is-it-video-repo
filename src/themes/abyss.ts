import type { ThemeSpec } from "./types";

// "Abyss" — the undersea-cable skin. The canvas IS the water column: near-black
// blue-green, barely lit at the surface, black on the floor. Everything the
// episode argues is carried by two signal colors that never swap roles:
//
//   accent cyan  = the light inside the glass (data, pulses, the fiber itself)
//   second amber = the surface world (ships, the grapnel, hands, deck light)
//
// Cold machine light on the floor, warm human light on top — warm advances,
// cool recedes, so the rescue always reads as nearer than the machinery.
// `warn` red is reserved EXCLUSIVELY for cable breaks and only ever appears as
// a brief flash on a cable that is visibly parting — never as a static fill.
// That shape cue (a gap where there was a line, pulses stopping dead) is the
// redundant, non-color signal, so the break still reads under deuteranopia
// where red and amber can converge.
//
// Scheme: the ground is monochromatic-cool (bg/text/textDim all sit at
// H201-206), and the signals are split-complementary to the cyan accent
// (H185) — amber H40 and red H0 straddle its complement at H5.
//
// Contrast on bg #07131C: text 16.4:1 · textDim 8.1:1 · accent 11.0:1 ·
// second 10.6:1 · good 10.1:1 · warn 6.8:1 · brand 12.9:1. textFaint is
// 3.9:1 — inert chrome only, never information.
export const abyss: ThemeSpec = {
  name: "abyss",

  bg: "#07131C",
  bgLifted: "#0E2432",
  background: { kind: "abyss" },

  line: "rgba(180, 214, 232, 0.24)",
  lineFaint: "rgba(180, 214, 232, 0.1)",
  text: "#E6F1F7",
  textDim: "#93AEBE",
  textFaint: "#5A7688",

  accent: "#38D9E8",
  accentDim: "#1B7F8C",
  accentGlow: "rgba(56, 217, 232, 0.28)",
  second: "#F5B944",
  secondDim: "rgba(245, 185, 68, 0.45)",
  good: "#3FD69A",
  warn: "#F87171",

  brand: "#8FE3F0",
  brandDim: "rgba(143, 227, 240, 0.45)",
  brandGlow: "rgba(143, 227, 240, 0.26)",

  card: "rgba(14, 36, 50, 0.92)",
  cardBorder: "rgba(180, 214, 232, 0.18)",
  // hue-shifted toward the water, never pure black
  cardShadow: "0 14px 40px rgba(2, 18, 28, 0.6)",

  vignette: "rgba(2, 8, 14, 0.72)",

  // Captions: bordered dark card in bold sans (per user feedback on 005 —
  // boxless mono read poorly on the busy water column). Squared corners to
  // match the episode's chip/stepper geometry — not the pill look.
  caption: {
    spoken: "rgba(238, 246, 251, 0.99)",
    unspoken: "rgba(238, 246, 251, 0.34)",
    halo: "none",
    font: "sans",
    boxed: true,
    radius: 14,
  },

  // Heavier than delivery's 12/200/0.7 — things move through WATER. Slower
  // settle, no bounce. This is the episode's signature feel.
  motion: { damping: 18, stiffness: 130, mass: 1.1 },
};
