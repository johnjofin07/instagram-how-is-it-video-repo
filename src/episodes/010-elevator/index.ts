import React from "react";
import { THEMES } from "../../themes";
import type { Episode } from "../types";
import { Doors } from "./scenes/Doors";
import { Hook } from "./scenes/Hook";
import { Rule } from "./scenes/Rule";
import { Sort } from "./scenes/Sort";
import { Timer } from "./scenes/Timer";
import { HAS_NARRATION, SCENES, STEPS } from "./script";
import timing from "./timing.json";

export const episode: Episode = {
  slug: "010-elevator",
  title: "The Close Button In Your Elevator Is a Dummy",
  theme: THEMES.lobby,
  steps: STEPS,
  scenes: SCENES,
  timing,
  hasNarration: HAS_NARRATION,
  audioPath: "episodes/010-elevator/narration.mp3",
  // New IG/YT safe-zone rule: no text above y269.
  chrome: { headerTop: 280, stepperTop: 352 },
  components: {
    hook: Hook,
    rule: Rule,
    sort: Sort,
    timer: Timer,
    doors: Doors,
  } as Record<string, React.FC>,
};
