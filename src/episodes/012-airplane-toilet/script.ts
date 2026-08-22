// Episode 012 — "The 300 MPH Flush".
// Everyday-machines pillar, ZACK-STYLE mode (see ZACK-STYLE.md +
// EPISODE-PLANS-011-012.md §Z / §012.1-v4).
//
// v4 (2026-08-22) — COMPREHENSION REWRITE. v3 tested as too abstract: it
// never spoke the mechanism ("suction"/"air"), gave no home-toilet baseline
// to be surprised by, and opened no curiosity loop. v4 keeps zack mode
// (chain-link causality, zero silence, one "but" pivot, cold ending) but:
//   · claim-first hook (option A, owner pick 2026-08-22): the one number
//     goes in the first 2s and matches the title. No negation opener
//     (retention rule). Amends ZACK rule 3 the same way 011/012 v2 did:
//     open ON the recognizable subject, not the abstraction;
//   · states the physics once, plainly (outside air is thinner → cabin air
//     stampedes out) instead of the poetic "behind it is the sky";
//   · REHOOK (option R3) glued to the hook at ~6s, not at the scene-1 tail:
//     "rides right under your seat for the rest of the flight" — paid off by
//     the truck at the gate in scene 4 (§0.7 device restored; on-screen CTA
//     stays OFF per Z.4);
//   · unmuddles the bowl beat (the COATING is why no water is needed);
//   · replaces "fakes the sky" with what the pump actually does;
//   · cold end = the lavatory truck at the gate draining the tank (rehook
//     payoff; scene 4 no longer spends its own line on "under your feet").
// 150 words ≈ 55s at the v3 take's 163 wpm. Trim list in §012.1-v4.
//
// ⚠ NEEDS A NEW TAKE. narration.mp3 + timing.json are still v3's until
// `npm run produce -- 012-airplane-toilet` runs on the v4 recording.
// align.mjs snaps scene boundaries to each scene's first three words —
// "An airplane toilet" / "The bowl is" / "But on the" / "That tank never" are
// distinct at word 1.

import type { SceneData } from "../types";

export const STEPS = ["VALVE", "BOWL", "GROUND", "TANK"] as const;

export const SCENES: SceneData[] = [
  {
    id: "valve",
    label: "THE VALVE",
    stepIndex: 0,
    seconds: 22.5,
    narration:
      "An airplane toilet flushes at three hundred miles an hour, and whatever goes down it rides right under your seat for the rest of the flight. Press flush, and a valve opens a pipe to the sky, where the air is far thinner than in the cabin, so cabin air stampedes down that pipe and everything in the bowl goes with it.",
  },
  {
    id: "bowl",
    label: "THE BOWL",
    stepIndex: 1,
    seconds: 13.0,
    narration:
      "The bowl is coated so slick that nothing sticks, so instead of gallons of water, one cup of blue disinfectant rinses it clean, and the waste slams into a sealed tank in the plane's belly.",
  },
  {
    id: "ground",
    label: "THE GROUND",
    stepIndex: 2,
    seconds: 10.0,
    narration:
      "But on the ground, the air outside is just as thick as inside — nothing rushes, so a roaring pump under the plane makes the suction instead.",
  },
  {
    id: "tank",
    label: "THE TANK",
    stepIndex: 3,
    seconds: 10.0,
    narration:
      "That tank never opens in flight. It stays sealed under the floor, sloshing, until a truck pulls up at the gate and drains the whole flight's worth.",
  },
];

export const FULL_NARRATION = SCENES.map((scene) => scene.narration).join("\n\n");
export const HAS_NARRATION = true;
