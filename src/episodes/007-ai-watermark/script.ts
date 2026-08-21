// Episode 007 — "Anthropic Is Watermarking Your Text".
// Tech-systems pillar. NEWS-PEGGED (Anthropic began watermarking Aug 2, 2026)
// — ship this one first; the hook's "since August" dies with the news cycle.
// Recorded take: 89.5s (the ≤90s ceiling holds, with 0.5s to spare).
//
// v2 hook framework (EPISODE-PLANS.md §0.7) — all five devices:
//   title hook   on-screen stamp by f9 ("ANTHROPIC IS WATERMARKING / YOUR TEXT")
//   visual hook  hook scene OPENS mid-sweep, words already developing
//   verbal hook  "Did you know…" — direct question
//   rehook       "one embarrassing flaw… already failing students" -> `catch`
//   interrupt    "Wait. Come closer." — umber veil, coin alone (~48% of `coin`)
//
// CTA IS ON-SCREEN ONLY (§0.7.4): the spoken "What system should I break down
// next?" was cut from the recording, so it must NOT appear in these strings —
// align.mjs would hunt for words the audio never says. The comment-bait CTA
// lives as a closing chip during `catch`'s allDone hold.
//
// Narration recorded via ElevenLabs web UI (Brian "Relatable Everyman", v3).
// The plan's [bracketed] v3 audio tags are performance directions for the web
// UI only and are deliberately ABSENT here: whisper never hears them and
// align.mjs matches the transcript against these exact strings.
// Scene `seconds` are estimates scaled to the 89.5s take; timing.json
// (align.mjs) is the truth.

import type { SceneData } from "../types";

export const STEPS = ["MARK", "LAW", "COIN", "COUNT", "CATCH"] as const;

export const SCENES: SceneData[] = [
  {
    id: "hook",
    label: "THE MARK",
    stepIndex: 0,
    seconds: 17,
    narration:
      "Did you know Anthropic has been watermarking your text? Since August, everything Claude writes carries a hidden signature. You can't see it. Copy-paste won't remove it. The trick is genius. But it has one embarrassing flaw — and it's already failing students.",
  },
  {
    id: "law",
    label: "THE LAW",
    stepIndex: 1,
    seconds: 16.5,
    narration:
      "A new law in Europe says: if a computer wrote something, people should be able to find out. So since August second, every new Claude model leaves a secret mark inside its own writing. Not just in Europe — everywhere.",
  },
  {
    id: "coin",
    label: "THE COIN",
    stepIndex: 2,
    seconds: 22,
    narration:
      "So… how do you hide a mark inside words? When Claude writes, it often has two words that both work. “The cat sat on the mat”… or the rug. Both fine. So it flips a coin to pick. Wait. Come closer. The coin is rigged. It lands on one side more often than it should.",
  },
  {
    id: "count",
    label: "THE COUNT",
    stepIndex: 3,
    seconds: 16,
    narration:
      "One rigged flip looks totally normal. But Claude writes hundreds of words — hundreds of rigged flips. And they add up. A detector that knows the trick counts them and goes: “Too many heads. No human writes like this. This was Claude.”",
  },
  {
    id: "catch",
    label: "THE CATCH",
    stepIndex: 4,
    seconds: 18,
    narration:
      "But the trick has weak spots. A short text? Not enough flips to count. Rewrite it in your own words? The mark washes away. And the official counting tool isn't even out yet. So that AI checker that failed someone's essay? It was guessing. There's the flaw.",
  },
];

export const FULL_NARRATION = SCENES.map((scene) => scene.narration).join("\n\n");
export const HAS_NARRATION = true;
