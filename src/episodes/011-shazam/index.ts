import React from "react";
import { THEMES } from "../../themes";
import type { Episode } from "../types";
import { CrowdScene } from "./scenes/CrowdScene";
import { HumScene } from "./scenes/HumScene";
import { MapScene } from "./scenes/MapScene";
import { MatchScene } from "./scenes/MatchScene";
import { HAS_NARRATION, SCENES, STEPS } from "./script";
import timing from "./timing.json";

export const episode: Episode = {
  slug: "011-shazam",
  title: "Every Song Is a Constellation",
  // The galaxy starfield IS the metaphor — this skin is reused unchanged.
  theme: THEMES.galaxy,
  steps: STEPS,
  scenes: SCENES,
  timing,
  hasNarration: HAS_NARRATION,
  audioPath: "episodes/011-shazam/narration.mp3",
  // zack mode cuts hard on a chain word — the chrome must never blink out
  chrome: { headerTop: 280, stepperTop: 352, instantEnter: true },
  components: {
    map: MapScene,
    match: MatchScene,
    crowd: CrowdScene,
    hum: HumScene,
  } as Record<string, React.FC>,
};
