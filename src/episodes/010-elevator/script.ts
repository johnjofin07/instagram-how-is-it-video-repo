// Episode 010 — "The Close Button In Your Elevator Is a Dummy".
// Everyday-machines pillar. Recorded take: 65.8s.
//
// v2 hook framework (EPISODE-PLANS.md §0.7) — all five devices:
//   title hook   on-screen stamp by f9 ("THE CLOSE BUTTON / IS FAKE")
//   visual hook  hook scene OPENS mid-press — the dead grey ring flashes by f6
//   verbal hook  "The close button in your elevator? It's a dummy."
//   rehook       "works for exactly one person — wait till you see who"
//                -> the firefighter key in `timer`
//   interrupt    "look —" (whispered) hard cut to the buttonless brass wall
//
// Plain words on purpose: "dummy"/"fake"/"does nothing", never "placebo" —
// and the first line names the elevator so viewers place the object instantly.
//
// CTA IS ON-SCREEN ONLY (§0.7.4): the spoken "What machine should I break
// down next?" was cut from the recording, so it must NOT appear in these
// strings — align.mjs would hunt for words the audio never says.
//
// The delivery-van simile is CUT from the narration, so the `sort` scene's
// van beat (old f340-430) is cut with it — the 3-shaft express-runs shot
// breathes longer instead.
//
// Uses the `lobby` skin (light marble + brass, teal algorithm) — see
// src/themes/lobby.ts for token contrast measurements and the dark-shaft
// brass caveat the kit has to respect.
// Narration recorded via ElevenLabs web UI (Brian "Relatable Everyman", v3).
// The plan's [bracketed] v3 audio tags are performance directions for the web
// UI only and are deliberately ABSENT here.
// Scene `seconds` are estimates scaled to the 65.8s take; timing.json is truth.
// ALIGN NOTE: `timer` and `doors` both open on "So". They are distinct at
// three words ("So why does" vs "So next time"), which is exactly what
// align.mjs compares — but confirm `matched: true` for both in the produce log.

import type { SceneData } from "../types";

export const STEPS = ["BUTTON", "RULE", "SORT", "TIMER", "DOORS"] as const;

export const SCENES: SceneData[] = [
  {
    id: "hook",
    label: "THE BUTTON",
    stepIndex: 0,
    seconds: 17.5,
    narration:
      "The close button in your elevator? It's a dummy. A fake. Pressing it does nothing — the elevator ignores you, because it already has a plan. And you're part of it. The button does work, though… for exactly one person. Wait till you see who.",
  },
  {
    id: "rule",
    label: "THE RULE",
    stepIndex: 1,
    seconds: 12.2,
    narration:
      "An elevator follows one simple rule: pick a direction, and finish it. Collect everyone going up. Then turn around and collect everyone going down. Never zig-zag — zig-zagging leaves people stranded.",
  },
  {
    id: "sort",
    label: "THE SORT",
    stepIndex: 2,
    seconds: 16,
    narration:
      "Fancy buildings go further. You type your floor in the lobby, and a computer sorts the people — everyone heading to nearby floors gets packed into the same car. Which is why — look — some elevators have no buttons inside at all.",
  },
  {
    id: "timer",
    label: "THE TIMER",
    stepIndex: 3,
    seconds: 14.5,
    narration:
      "So why does the close button exist? By law, the doors must stay open long enough for a wheelchair. The button can't skip that timer. And the one person it truly works for? A firefighter, with a key.",
  },
  {
    id: "doors",
    label: "THE DOORS",
    stepIndex: 4,
    seconds: 5.7,
    narration:
      "So next time the doors shut right after you press it… they were closing anyway.",
  },
];

export const FULL_NARRATION = SCENES.map((scene) => scene.narration).join("\n\n");
export const HAS_NARRATION = true;
