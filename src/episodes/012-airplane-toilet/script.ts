// Episode 012 — "The 300 MPH Flush".
// Everyday-machines pillar, ZACK-STYLE mode (see ZACK-STYLE.md +
// EPISODE-PLANS-011-012.md §Z). Cold open mid-press, one "but" pivot, cold
// ending on the peak image, CTA in the post caption only.
// Narration is LOCKED (zack v2, 2026-08-21) and matches the recorded take.
// align.mjs snaps scene boundaries to each scene's first three words —
// "That rushing…" and "That tank…" diverge at word 2, which is enough.

import type { SceneData } from "../types";

export const STEPS = ["VALVE", "BOWL", "GROUND", "TANK"] as const;

export const SCENES: SceneData[] = [
  {
    id: "valve",
    label: "THE VALVE",
    stepIndex: 0,
    seconds: 14.6,
    narration:
      "The moment you press that flush button, a valve snaps open — and behind it is the sky, with barely any air. The crowded cabin air rushes toward that emptiness, dragging everything down the pipe at three hundred miles per hour.",
  },
  {
    id: "bowl",
    label: "THE BOWL",
    stepIndex: 1,
    seconds: 11.8,
    narration:
      "That rushing air scrubs a bowl slicker than a nonstick pan — so one cup of blue liquid replaces gallons of water — and everything slams into a sealed tank in the plane's belly.",
  },
  {
    id: "ground",
    label: "THE GROUND",
    stepIndex: 2,
    seconds: 9.1,
    narration:
      "But on the ground, the outside air is just as thick as the inside — nothing rushes — so a roaring pump fakes the sky until takeoff.",
  },
  {
    id: "tank",
    label: "THE TANK",
    stepIndex: 3,
    seconds: 8.2,
    narration:
      "That tank never opens in flight — every flush rides beneath your feet, sloshing, and lands when you do.",
  },
];

export const FULL_NARRATION = SCENES.map((scene) => scene.narration).join("\n\n");
export const HAS_NARRATION = true;
