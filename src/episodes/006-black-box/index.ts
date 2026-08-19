import React from "react";
import { THEMES } from "../../themes";
import type { Episode } from "../types";
import { Hook } from "./scenes/Hook";
import { Locate } from "./scenes/Locate";
import { Memory } from "./scenes/Memory";
import { Rebuild } from "./scenes/Rebuild";
import { Recorders } from "./scenes/Recorders";
import { HAS_NARRATION, SCENES, STEPS } from "./script";
import timing from "./timing.json";

export const episode: Episode = {
  slug: "006-black-box",
  title: "Engineers Try to Destroy the Black Box",
  theme: THEMES.flightlab,
  steps: STEPS,
  scenes: SCENES,
  timing,
  hasNarration: HAS_NARRATION,
  audioPath: "episodes/006-black-box/narration.mp3",
  // New IG/YT safe-zone rule: no text above y269.
  chrome: { headerTop: 280, stepperTop: 352 },
  components: {
    hook: Hook,
    memory: Memory,
    recorders: Recorders,
    locate: Locate,
    rebuild: Rebuild,
  } as Record<string, React.FC>,
};
