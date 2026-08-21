import React from "react";
import { THEMES } from "../../themes";
import type { Episode } from "../types";
import { Door } from "./scenes/Door";
import { Hook } from "./scenes/Hook";
import { Spark } from "./scenes/Spark";
import { Spin } from "./scenes/Spin";
import { Waves } from "./scenes/Waves";
import { HAS_NARRATION, SCENES, STEPS } from "./script";
import timing from "./timing.json";

export const episode: Episode = {
  slug: "008-microwave",
  title: "Your Microwave Has Cold Spots",
  theme: THEMES.kitchen,
  steps: STEPS,
  scenes: SCENES,
  timing,
  hasNarration: HAS_NARRATION,
  audioPath: "episodes/008-microwave/narration.mp3",
  // New IG/YT safe-zone rule: no text above y269.
  chrome: { headerTop: 280, stepperTop: 352 },
  components: {
    hook: Hook,
    waves: Waves,
    spin: Spin,
    door: Door,
    spark: Spark,
  } as Record<string, React.FC>,
};
