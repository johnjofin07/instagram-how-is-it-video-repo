import React from "react";
import { SCENES, STEPS, HAS_NARRATION } from "./script";
import timing from "./timing.json";
import { Hook } from "./scenes/Hook";
import { Pack } from "./scenes/Pack";
import { Ship } from "./scenes/Ship";
import { Depot } from "./scenes/Depot";
import { Payoff } from "./scenes/Payoff";
import type { Episode } from "../types";
import { THEMES } from "../../themes";

export const episode: Episode = {
  slug: "004-netflix-delivery",
  title: "Netflix Is a Delivery Company",
  theme: THEMES.delivery,
  steps: STEPS,
  scenes: SCENES,
  timing,
  hasNarration: HAS_NARRATION,
  audioPath: "episodes/004-netflix-delivery/narration.mp3",
  components: {
    hook: Hook,
    pack: Pack,
    ship: Ship,
    depot: Depot,
    payoff: Payoff,
  } as Record<string, React.FC>,
};
