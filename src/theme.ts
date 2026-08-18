// CHANNEL CONSTANTS — things that stay the same across every episode and every
// skin: typography, video format, and the pipeline-stepper concept.
// Colors/backgrounds/motion live in src/themes/* and are chosen per episode.

// The channel brand. Deliberately NOT rendered inside episode videos yet —
// keep published videos handle-free until the name is locked in (~ep 15),
// so a rebrand stays a profile-settings change. When ready, pull from here.
export const CHANNEL = {
  name: "superhow",
  tagline: "how things actually work",
  handles: {
    youtube: "@superhow",
    instagram: "@superhow.show",
  },
  domain: "superhow.show",
} as const;

export const FONTS = {
  mono: 'ui-monospace, "SF Mono", Menlo, "Cascadia Code", monospace',
  sans: '-apple-system, "SF Pro Display", "Segoe UI", Helvetica, Arial, sans-serif',
} as const;

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

// Episode 001's stepper labels. The stepper CONCEPT is a channel constant;
// the labels are per-episode (see Episode.steps).
export const PIPELINE_STEPS = [
  "MASTER",
  "STORE",
  "TRANSCODE",
  "CDN",
  "PLAYER",
  "SCREEN",
] as const;
