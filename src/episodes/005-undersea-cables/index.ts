import React from "react";
import { SCENES, STEPS, HAS_NARRATION } from "./script";
import timing from "./timing.json";
import { Hook } from "./scenes/Hook";
import { Glass } from "./scenes/Glass";
import { Snap } from "./scenes/Snap";
import { Fix } from "./scenes/Fix";
import type { Episode } from "../types";
import { THEMES } from "../../themes";

export const episode: Episode = {
  slug: "005-undersea-cables",
  title: "The Internet Is Lying on the Ocean Floor",
  theme: THEMES.abyss,
  steps: STEPS,
  scenes: SCENES,
  timing,
  hasNarration: HAS_NARRATION,
  audioPath: "episodes/005-undersea-cables/narration.mp3",
  // top chrome lowered below the IG/YT top band (no text y<269)
  chrome: { headerTop: 280, stepperTop: 352 },
  components: {
    hook: Hook,
    glass: Glass,
    snap: Snap,
    fix: Fix,
  } as Record<string, React.FC>,
};
