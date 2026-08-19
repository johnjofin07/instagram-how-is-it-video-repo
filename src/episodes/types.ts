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
  // optional lowered chrome position (new safe-margin rule: no text y<269)
  chrome?: { headerTop: number; stepperTop: number };
  components: Record<string, React.FC>;
};
