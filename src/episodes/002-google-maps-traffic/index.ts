import React from "react";
import { SCENES, STEPS, HAS_NARRATION } from "./script";
import timing from "./timing.json";
import { Hook } from "./scenes/Hook";
import { Probes } from "./scenes/Probes";
import { Brain } from "./scenes/Brain";
import { Handcart } from "./scenes/Handcart";
import { Payoff } from "./scenes/Payoff";
import type { Episode } from "../types";
import { THEMES } from "../../themes";

export const episode: Episode = {
  slug: "002-google-maps-traffic",
  title: "How Google Maps Knows About Traffic",
  theme: THEMES.maps,
  steps: STEPS,
  scenes: SCENES,
  timing,
  hasNarration: HAS_NARRATION,
  audioPath: "episodes/002-google-maps-traffic/narration.mp3",
  components: {
    hook: Hook,
    probes: Probes,
    brain: Brain,
    handcart: Handcart,
    payoff: Payoff,
  } as Record<string, React.FC>,
};
