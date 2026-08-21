// Episode 008 — "Your Microwave Has Cold Spots".
// Everyday-machines pillar. ~134 words ≈ 58s — the sub-60 target is a hard
// requirement (owner call, 2026-08-21): trim words, never pacing, to keep it.
//
// v3 hook flip (2026-08-21): the lightning line tested as the strongest hook,
// so it is PROMOTED from rehook to main hook; the cold-spots claim is demoted
// to the rehook slot. The claim belongs to the MACHINE ("your microwave makes
// real lightning") — the fork is just the named trigger. The loop ladder:
//   title hook   on-screen stamp by f9 ("YOUR MICROWAVE MAKES / REAL LIGHTNING")
//   visual hook  the fork is ALREADY striking inside the cavity at f0 —
//                bolts mid-flash before the viewer can blink
//   verbal hook  the lightning claim — no spoken deferral; the "saved for
//                last" chip carries the open loop on-screen, paid off by
//                `spark` (same ForkSpark glyph, scaled up, all tines firing)
//   rehook       cold spots + "the real reason the plate spins" -> paid off
//                across `waves`/`spin` (the mid-video engine)
//   interrupt    "Don't believe me?" — hard snap cut to the cheese proof
//                (unchanged from v2)
//
// ⚠ Narration NOT yet re-recorded for v3 — the MP3 on disk is the 66.9s v2
// take. Record the §008.1 block (EPISODE-PLANS.md) in the ElevenLabs web UI,
// replace public/episodes/008-microwave/narration.mp3, then `npm run produce
// -- 008-microwave` and retune Hook.tsx beats from the new timing.json.
//
// CTA IS ON-SCREEN ONLY (§0.7.4): the spoken "What machine should I break
// down next?" must NOT appear in these strings — align.mjs would hunt for
// words the audio never says.
//
// Reuses the `kitchen` skin from 003 (same room of the house, zero new theme
// work); the episode's own identity is a thermal-camera palette in kit.tsx.
// Narration recorded via ElevenLabs web UI (Brian "Relatable Everyman", v3).
// The plan's [bracketed] v3 audio tags are performance directions for the web
// UI only and are deliberately ABSENT here.
// Scene `seconds` are estimates until the v3 take lands; timing.json is truth.

import type { SceneData } from "../types";

export const STEPS = ["FORK", "WAVES", "SPIN", "DOOR", "SPARK"] as const;

export const SCENES: SceneData[] = [
  {
    id: "hook",
    label: "THE FORK",
    stepIndex: 0,
    seconds: 14.0,
    narration:
      "Your microwave can make real lightning — all it takes is a fork. And the same waves that spark it leave cold spots in your food. That's the real reason the plate spins.",
  },
  {
    id: "waves",
    label: "THE WAVES",
    stepIndex: 1,
    seconds: 9.1,
    narration:
      "Inside, invisible waves bounce between the metal walls — and get stuck. Hot spots here. Cold spots there. Always the same places.",
  },
  {
    id: "spin",
    label: "THE SPIN",
    stepIndex: 2,
    seconds: 14.3,
    narration:
      "The hot spots can't move. So your food does. The plate drags every bite through them. Don't believe me? Take the plate out and microwave a tray of cheese — it melts in stripes.",
  },
  {
    id: "door",
    label: "THE DOOR",
    stepIndex: 3,
    seconds: 11.3,
    narration:
      "And that mesh on the door? Light slips through the tiny holes — so you can watch. The waves? Too big. To them, it's a solid wall.",
  },
  {
    id: "spark",
    label: "THE SPARK",
    stepIndex: 4,
    seconds: 9.6,
    // ALIGN: this opener must match whisper's tokens exactly — it hears "Now,
    // about that fork" (comma, no em dash). An em dash here tokenizes as its
    // own word and breaks align.mjs's 3-word lead match (matched: false).
    // NOTE: never put a comment between `narration:` and its string — the
    // regex in align.mjs that harvests these strings silently skips the scene.
    narration:
      "Now, about that fork. Its sharp edges squeeze the waves into tiny lightning bolts. Real, indoor lightning. Maybe don't test that one.",
  },
];

export const FULL_NARRATION = SCENES.map((scene) => scene.narration).join("\n\n");
export const HAS_NARRATION = true;
