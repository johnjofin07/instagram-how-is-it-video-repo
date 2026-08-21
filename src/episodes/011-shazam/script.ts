// Episode 011 — "Every Song Is a Constellation".
// Tech pillar, ZACK-STYLE mode (see ZACK-STYLE.md + EPISODE-PLANS-011-012.md §Z).
// No title stamp, no verbal hook, no on-screen CTA: the visual introduces the
// subject, the narration is already step 1 of the chain, and the video ends
// cold on the peak image. Narration is LOCKED (zack v3, 2026-08-21) and
// matches the recorded take word for word — align.mjs snaps scene boundaries
// to each scene's first three words, so never reword an opener.

import type { SceneData } from "../types";

export const STEPS = ["MAP", "MATCH", "CROWD", "HUM"] as const;

export const SCENES: SceneData[] = [
  {
    id: "map",
    label: "THE MAP",
    stepIndex: 0,
    seconds: 11.4,
    narration:
      "The second you hit that button, your phone stops hearing music and starts drawing it — every sound in the room becomes a point on a map, and only the loudest points survive as stars.",
  },
  {
    id: "match",
    label: "THE MATCH",
    stepIndex: 1,
    seconds: 9.4,
    narration:
      "Those stars form a constellation no other song shares, and your phone hunts through millions of constellations until it finds the one that matches — before the chorus even ends.",
  },
  {
    id: "crowd",
    label: "THE CROWD",
    stepIndex: 2,
    seconds: 7.6,
    narration:
      "A screaming crowd can't hide the song, because the phone already threw everything quiet away — and the stars burn louder than any scream.",
  },
  {
    id: "hum",
    label: "THE HUM",
    stepIndex: 3,
    seconds: 10.5,
    narration:
      "But hum the tune yourself, and every star lands somewhere new — the map matches nothing, and the machine stares at a song no one has ever recorded.",
  },
];

export const FULL_NARRATION = SCENES.map((scene) => scene.narration).join("\n\n");
export const HAS_NARRATION = true;
