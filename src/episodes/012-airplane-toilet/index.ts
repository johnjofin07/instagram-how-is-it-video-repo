import React from "react";
import { THEMES } from "../../themes";
import type { Episode } from "../types";
import { BowlScene } from "./scenes/BowlScene";
import { GroundScene } from "./scenes/GroundScene";
import { TankScene } from "./scenes/TankScene";
import { ValveScene } from "./scenes/ValveScene";
import { HAS_NARRATION, SCENES, STEPS } from "./script";
import timing from "./timing.json";

export const episode: Episode = {
  slug: "012-airplane-toilet",
  title: "The 300 MPH Flush",
  // Cut-paper diorama skin (012 v3): sky-blue paper skies, white cloud
  // cutouts, red papercraft plane. See src/themes/papersky.ts for the law.
  theme: THEMES.papersky,
  steps: STEPS,
  scenes: SCENES,
  timing,
  hasNarration: HAS_NARRATION,
  audioPath: "episodes/012-airplane-toilet/narration.mp3",
  // zack mode cuts hard on a chain word — the chrome must never blink out
  chrome: { headerTop: 280, stepperTop: 352, instantEnter: true },
  components: {
    valve: ValveScene,
    bowl: BowlScene,
    ground: GroundScene,
    tank: TankScene,
  } as Record<string, React.FC>,
};
