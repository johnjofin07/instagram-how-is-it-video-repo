// Episode 013 — "Netflix Is a Delivery Company" · ZACK MODE (v2 script).
// v1 (004's 94s narration reused verbatim, default style) is preserved in
// script.v1.ts / timing.v1.json / narration-v1.mp3 — swap them back to rebuild
// the long cut. This version is a zack-style A/B entry (ZACK-STYLE.md):
// claim-first hook on the most shareable image (the warehouse on your
// street), chain-link causality, one "but" pivot at 58%, one number, zero
// questions, cold end, NO on-screen CTA. 110 words ≈ 37–43s at the recorded
// pace. Scene ids/order are unchanged from v1 so the five components carry
// over; every internal beat is re-timed to the new durations.
//
// Scene `seconds` are ESTIMATES at 165 wpm until the take exists;
// timing.json (align.mjs) is the truth after `npm run produce`.

import type { SceneData } from "../types";

export const STEPS = ["STUDIO", "PACK", "SHIP", "DEPOT", "YOU"] as const;

export const SCENES: SceneData[] = [
  {
    id: "hook",
    label: "TONIGHT",
    stepIndex: 4,
    seconds: 6.5,
    narration:
      "Netflix runs a warehouse at the end of your street, and tonight's show is already on its shelf.",
  },
  {
    id: "pack",
    label: "PACK",
    stepIndex: 1,
    seconds: 7.6,
    narration:
      "That shelf gets stocked like any parcel: one enormous file, repacked into every box size, from glorious 4K down to potato.",
  },
  {
    id: "ship",
    label: "PARCELS",
    stepIndex: 2,
    seconds: 9.1,
    narration:
      "Each box is chopped into four-second parcels, and your TV orders them one at a time, picking a smaller box whenever your wifi gets busy.",
  },
  {
    id: "depot",
    label: "WAREHOUSE",
    stepIndex: 3,
    seconds: 10.9,
    narration:
      "But those parcels never travel far, because Netflix hands that warehouse to your internet provider for free, and every night it fills up with what your neighborhood will watch tomorrow.",
  },
  {
    id: "payoff",
    label: "PRESS PLAY",
    stepIndex: 4,
    seconds: 5.8,
    narration:
      "So the show you pressed play on was stocked before you even knew you wanted it.",
  },
];

export const FULL_NARRATION = SCENES.map((s) => s.narration).join(" ");

// Flip to true once the zack-mode take is saved as
// public/episodes/013-netflix-papersky/narration.mp3, then `npm run produce`.
export const HAS_NARRATION = true;
