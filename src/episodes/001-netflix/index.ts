import React from "react";
import { SCENES, HAS_NARRATION } from "./script";
import timing from "./timing.json";
import { Hook } from "./scenes/Hook";
import { Ladder } from "./scenes/Ladder";
import { Chunks } from "./scenes/Chunks";
import { OpenConnect } from "./scenes/OpenConnect";
import { Payoff } from "./scenes/Payoff";
import type { Episode } from "../types";
import { THEMES } from "../../themes";
import { PIPELINE_STEPS } from "../../theme";

export const episode: Episode = {
  slug: "001-netflix",
  title: "How Netflix Works",
  theme: THEMES.galaxy,
  steps: PIPELINE_STEPS,
  scenes: SCENES,
  timing,
  hasNarration: HAS_NARRATION,
  audioPath: "episodes/001-netflix/narration.mp3",
  components: {
    hook: Hook,
    ladder: Ladder,
    chunks: Chunks,
    openconnect: OpenConnect,
    payoff: Payoff,
  } as Record<string, React.FC>,
};
