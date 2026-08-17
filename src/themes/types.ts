// The theme CONTRACT. Every skin provides the same semantic tokens with
// different values — scenes and components only ever reference tokens, so any
// episode can swap its entire design language without touching component code.
// Fonts are deliberately NOT part of the theme: typography is a channel
// constant (see FONTS in ../theme).

export type BackgroundVariant =
  | { kind: "galaxy" } // starfield + nebula
  | { kind: "blueprint" } // graph-paper grid
  | { kind: "map" } // light street-map canvas (parks, water, faint road grid)
  | { kind: "plain" }; // flat with glow only

export type ThemeSpec = {
  name: string;

  // canvas
  bg: string;
  bgLifted: string;
  background: BackgroundVariant;

  // lines & text
  line: string;
  lineFaint: string;
  text: string;
  textDim: string;
  textFaint: string;

  // semantic accents
  accent: string; // the working highlight
  accentDim: string;
  accentGlow: string;
  second: string; // secondary/structural accent
  secondDim: string;
  good: string; // success/health
  warn: string; // caution/degraded

  // subject-brand tokens (e.g. Netflix red) — episodes may override
  brand: string;
  brandDim: string;
  brandGlow: string;

  // surfaces
  card: string;
  cardBorder: string;
  cardShadow: string; // resting shadow for non-accent cards

  // edge vignette color (the darkening at the frame edges)
  vignette: string;

  // karaoke caption colors (light skins need dark words + light halo)
  caption: {
    spoken: string;
    unspoken: string;
    halo: string; // base text-shadow behind every word
  };

  // animation personality
  motion: {
    damping: number; // lower = bouncier
    stiffness: number; // higher = snappier
    mass: number;
  };
};
