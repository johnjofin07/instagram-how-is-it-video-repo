import React from "react";
import { THEMES } from "../../themes";
import type { Episode } from "../types";
import { Depot } from "./scenes/Depot";
import { Hook } from "./scenes/Hook";
import { Pack } from "./scenes/Pack";
import { Payoff } from "./scenes/Payoff";
import { Ship } from "./scenes/Ship";
import { HAS_NARRATION, SCENES, STEPS } from "./script";
import timing from "./timing.json";

// Ep 004's delivery story on the `papersky` cut-paper skin — now in ZACK MODE
// (110w, ~40s; see script.ts). The v1 default-style 94s cut is preserved as
// script.v1.ts / timing.v1.json / narration-v1.mp3.
// The brand tokens are overridden to true Netflix red (#E50914) rather than
// papersky's softer paper red, because the actual Netflix mark is on screen
// and the tape/roofs/awnings have to match it. ThemeSpec sanctions this:
// brand* are the episode's subject color.
export const episode: Episode = {
  slug: "013-netflix-papersky",
  title: "Netflix Is a Delivery Company",
  theme: {
    ...THEMES.papersky,
    brand: "#E50914",
    brandDim: "#F4A0A4",
    brandGlow: "rgba(229, 9, 20, 0.22)",
  },
  steps: STEPS,
  scenes: SCENES,
  timing,
  hasNarration: HAS_NARRATION,
  audioPath: "episodes/013-netflix-papersky/narration.mp3",
  // safe-margin rule: no text above y269 (YT Shorts chrome). instantEnter:
  // zack mode cuts hard on a chain word — the chrome must never blink out.
  chrome: { headerTop: 280, stepperTop: 352, instantEnter: true },
  components: {
    hook: Hook,
    pack: Pack,
    ship: Ship,
    depot: Depot,
    payoff: Payoff,
  } as Record<string, React.FC>,
};
