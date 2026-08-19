import type { ThemeSpec } from "./types";

// "Flight-recorder test lab" — the existing blueprint canvas, recolored for
// an industrial qualification rig. Safety orange is the physical recorder;
// oscilloscope cyan is the information protected inside it.
export const flightlab: ThemeSpec = {
  name: "flightlab",
  bg: "#0D1217",
  bgLifted: "#172029",
  background: { kind: "blueprint" },
  line: "rgba(169, 187, 201, 0.25)",
  lineFaint: "rgba(169, 187, 201, 0.11)",
  text: "#F1F5F7",
  textDim: "#9AAAB6",
  textFaint: "#586873",
  accent: "#FF7A1A",
  accentDim: "#9A430E",
  accentGlow: "rgba(255, 122, 26, 0.30)",
  second: "#54D6E8",
  secondDim: "rgba(84, 214, 232, 0.45)",
  good: "#55D68A",
  warn: "#FF4D4D",
  brand: "#FF7A1A",
  brandDim: "#9A430E",
  brandGlow: "rgba(255, 122, 26, 0.30)",
  card: "rgba(23, 32, 41, 0.94)",
  cardBorder: "rgba(169, 187, 201, 0.19)",
  cardShadow: "0 16px 42px rgba(0, 0, 0, 0.48)",
  vignette: "rgba(0, 0, 0, 0.72)",
  caption: {
    spoken: "rgba(241, 245, 247, 0.98)",
    unspoken: "rgba(241, 245, 247, 0.30)",
    halo: "0 2px 18px rgba(0, 0, 0, 0.95)",
    font: "mono",
    boxed: false,
  },
  motion: { damping: 22, stiffness: 260, mass: 0.65 },
};
