import React from "react";
import { THEMES } from "../../themes";
import type { Episode } from "../types";
import { Catch } from "./scenes/Catch";
import { Coin } from "./scenes/Coin";
import { Count } from "./scenes/Count";
import { Hook } from "./scenes/Hook";
import { Law } from "./scenes/Law";
import { HAS_NARRATION, SCENES, STEPS } from "./script";
import timing from "./timing.json";

export const episode: Episode = {
  slug: "007-ai-watermark",
  // [v2] the plan's §007 title; the old "Claude Now Signs Everything It
  // Writes" no longer matches the hook stamp the scene draws
  title: "Anthropic Is Watermarking Your Text",
  theme: THEMES.inkwell,
  steps: STEPS,
  scenes: SCENES,
  timing,
  hasNarration: HAS_NARRATION,
  audioPath: "episodes/007-ai-watermark/narration.mp3",
  // New IG/YT safe-zone rule: no text above y269.
  chrome: { headerTop: 280, stepperTop: 352 },
  components: {
    hook: Hook,
    law: Law,
    coin: Coin,
    count: Count,
    catch: Catch,
  } as Record<string, React.FC>,
};
