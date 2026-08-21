// Episode 009 — "Silence, Manufactured".
// Everyday-machines pillar. Recorded take: 61.6s (longer than the ~52s
// estimate but still the shortest of the four — waves need no words).
//
// v2 hook framework (EPISODE-PLANS.md §0.7) — all five devices:
//   title hook   on-screen stamp by f9 ("FIGHTS NOISE / WITH MORE NOISE")
//   visual hook  hook scene OPENS mid-collision, waves already fighting
//   verbal hook  "How does your headphones' noise cancelling actually work?"
//   rehook       "the one sound they can never erase" -> the baby, unnamed
//   interrupt    LITERAL SILENCE — narration stops after "Listen.", the SUM
//                wave flatlines, ~60f of total stillness in `zero`
//
// The pause after "Listen." is engineered in the scene, not the voice take.
// The `zero` scene must hold its stillness across that gap: nothing moves, no
// drift, no pulse. Confirm the caption builder doesn't render an empty
// karaoke line over the silence.
//
// CTA IS ON-SCREEN ONLY (§0.7.4): the spoken "What machine should I break
// down next?" was cut from the recording, so it must NOT appear in these
// strings — align.mjs would hunt for words the audio never says.
//
// Reuses the `blueprint` skin: its graph-paper grid IS an oscilloscope, so
// the kit only has to turn the grid into a scope and add the wave colors.
// Narration recorded via ElevenLabs web UI (Brian "Relatable Everyman", v3).
// The plan's [bracketed] v3 audio tags are performance directions for the web
// UI only and are deliberately ABSENT here.
// Scene `seconds` are estimates scaled to the 61.6s take; timing.json is truth.

import type { SceneData } from "../types";

export const STEPS = ["NOISE", "FLIP", "ZERO", "LIMIT"] as const;

export const SCENES: SceneData[] = [
  {
    id: "hook",
    label: "THE FIGHT",
    stepIndex: 0,
    seconds: 17.5,
    narration:
      "How does your headphones' noise cancelling actually work? They fight noise… with more noise. They shout back at the world — and that makes silence. By the end of this, you'll know the one sound they can never erase.",
  },
  {
    id: "flip",
    label: "THE FLIP",
    stepIndex: 1,
    seconds: 9.9,
    narration:
      "Tiny microphones on the outside hear the noise before you do. A chip copies the sound wave — then flips it upside down.",
  },
  {
    id: "zero",
    label: "THE ZERO",
    stepIndex: 2,
    seconds: 15.3,
    // The pattern interrupt: the recorded take goes silent here (measured with
    // ffmpeg silencedetect) and the scene flatlines with nothing moving. This
    // window tells the shared Stepper to stop pulsing its active square — it
    // was the only thing still animating during the stillness.
    stillFrames: [223, 306],
    narration:
      "It plays that flipped wave into your ear. Peak meets dip. Plus one meets minus one. Listen. Zero. The air at your eardrum just… stops moving. The noise wasn't blocked — it was erased.",
  },
  {
    id: "limit",
    label: "THE LIMIT",
    stepIndex: 3,
    seconds: 18.9,
    narration:
      "But the chip can only fight noise it can predict. Engine hum? Easy — it never changes. A crying baby? Too sudden — gone before the anti-noise fires. That's why headphones can silence the whole plane… but never the baby on it.",
  },
];

export const FULL_NARRATION = SCENES.map((scene) => scene.narration).join("\n\n");
export const HAS_NARRATION = true;
