import React from "react";
import type { ThemeSpec } from "../themes/types";

export type CaptionWord = {
  t: string;
  accent?: "red" | "blue";
};

export type CaptionPhrase = {
  words: CaptionWord[];
};

export type SceneData = {
  id: string;
  label: string; // top-left section label
  stepIndex: number; // which pipeline step lights up
  seconds: number; // estimate until timing.json exists
  narration: string;
  // Scene-local [from, to] frame window of deliberate TOTAL stillness, during
  // which shared chrome suppresses its idle animation (see Stepper's
  // quietFrames). Only set this for a beat whose whole point is that nothing
  // moves — 009's silence interrupt.
  stillFrames?: readonly [number, number];
  phrases?: CaptionPhrase[]; // legacy storyboard hints; captions come from timing.json
};

export type TimedWord = { t: string; s: number; e: number };
export type TimedLine = { start: number; end: number; words: TimedWord[] };

export type EpisodeTiming = {
  sceneSeconds: number[];
  sceneCaptions: TimedLine[][];
};

export type Episode = {
  slug: string;
  title: string;
  theme: ThemeSpec;
  steps: readonly string[]; // stepper labels — the episode's "pipeline"
  scenes: SceneData[];
  timing: EpisodeTiming;
  hasNarration: boolean;
  audioPath: string;
  // optional lowered chrome position (new safe-margin rule: no text y<269).
  // instantEnter skips the chrome's fade-in — for episodes whose scenes cut
  // hard, where a per-scene fade reads as the header blinking out.
  chrome?: { headerTop: number; stepperTop: number; instantEnter?: boolean };
  components: Record<string, React.FC>;
};
