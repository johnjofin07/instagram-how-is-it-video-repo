import React from "react";
import { SCENES, STEPS, HAS_NARRATION } from "./script";
import timing from "./timing.json";
import { Hook } from "./scenes/Hook";
import { Machine } from "./scenes/Machine";
import { Air } from "./scenes/Air";
import { Crisp } from "./scenes/Crisp";
import { Payoff } from "./scenes/Payoff";
import type { Episode } from "../types";
import { THEMES } from "../../themes";

export const episode: Episode = {
  slug: "003-air-fryer",
  title: "There Is No Frying In Your Air Fryer",
  theme: THEMES.kitchen,
  steps: STEPS,
  scenes: SCENES,
  timing,
  hasNarration: HAS_NARRATION,
  audioPath: "episodes/003-air-fryer/narration.mp3",
  components: {
    hook: Hook,
    machine: Machine,
    air: Air,
    crisp: Crisp,
    payoff: Payoff,
  } as Record<string, React.FC>,
};
