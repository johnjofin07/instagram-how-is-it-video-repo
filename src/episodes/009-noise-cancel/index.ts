import React from "react";
import { THEMES } from "../../themes";
import type { Episode } from "../types";
import { Flip } from "./scenes/Flip";
import { Hook } from "./scenes/Hook";
import { Limit } from "./scenes/Limit";
import { Zero } from "./scenes/Zero";
import { HAS_NARRATION, SCENES, STEPS } from "./script";
import timing from "./timing.json";

export const episode: Episode = {
  slug: "009-noise-cancel",
  title: "Silence, Manufactured",
  theme: THEMES.blueprint,
  steps: STEPS,
  scenes: SCENES,
  timing,
  hasNarration: HAS_NARRATION,
  audioPath: "episodes/009-noise-cancel/narration.mp3",
  // New IG/YT safe-zone rule: no text above y269.
  chrome: { headerTop: 280, stepperTop: 352 },
  components: {
    hook: Hook,
    flip: Flip,
    zero: Zero,
    limit: Limit,
  } as Record<string, React.FC>,
};
