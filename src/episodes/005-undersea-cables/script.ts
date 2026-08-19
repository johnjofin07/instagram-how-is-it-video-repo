// Episode 005 — "The Internet Is Lying on the Ocean Floor".
// Tech-systems pillar. HARD CONSTRAINT: finished reel must stay under 60s.
// Measured pace from 003/004 is 2.5-2.8 words/sec, so the narration budget is
// ~150 words — that's what drives the 4-scene structure (003/004 used 5).
// Retention-first per CONTENT.md: claim on screen at ~0.3s, fully spoken by
// ~2.5s; the loop ("every couple of days, one snaps") opens at ~11s and pays
// off in `fix`. Deliberately a break-and-repair drama, not an infrastructure
// tour, so it doesn't rhyme with 004's "nothing crosses the ocean".
// Narration to record via ElevenLabs web UI (Brian v3, sp92/s26/sb75), ~57s.
// Scene `seconds` are estimates; timing.json (align.mjs) is the truth.
// TRIMMED 2026-08-19 to 141 words (was 150) to stay safely under 60s with
// the v3 [pause] tags. If a take STILL lands over 60s, next trims in order:
// "For the whole planet." (fix, -4), "thinner than your hair" -> "thinner
// than hair" (glass, -1) — then re-lock and re-record.

import type { SceneData } from "../types";

export const STEPS = ["SEA", "GLASS", "SNAP", "FIX"] as const;

export const SCENES: SceneData[] = [
  {
    id: "hook",
    label: "THE SEA FLOOR",
    stepIndex: 0,
    seconds: 13.5,
    narration:
      "The internet is lying on the floor of the ocean. Bundles of glass, thick as a garden hose. Ninety-nine percent of the data between continents goes through one — and every couple of days, one snaps.",
  },
  {
    id: "glass",
    label: "THE GLASS",
    stepIndex: 1,
    seconds: 10.5,
    narration:
      "Cut one open — it's almost all armor. Inside, strands of glass, thinner than your hair. That's the internet — more data than every internet satellite in orbit.",
  },
  {
    id: "snap",
    label: "THE SNAP",
    stepIndex: 2,
    seconds: 12,
    narration:
      "What cuts them is us. Anchors. Fishing nets. You never notice — your data reroutes down another cable. Unless your country only has one. A volcano cut Tonga's. Five weeks offline.",
  },
  {
    id: "fix",
    label: "THE FIX",
    stepIndex: 3,
    seconds: 17.5,
    narration:
      "So how do you fix one, four kilometres down? A boat drags a giant hook, fishing blind, hauls both ends on deck — and a person welds the glass back together by hand. Sixty boats. For the whole planet. What system should I break down next?",
  },
];

export const FULL_NARRATION = SCENES.map((s) => s.narration).join("\n\n");

export const HAS_NARRATION = true;
