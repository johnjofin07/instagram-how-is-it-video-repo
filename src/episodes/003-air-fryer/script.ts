// Episode 003 — "There Is No Frying In Your Air Fryer".
// First everyday-machines episode; first `kitchen` skin.
// Narration recorded via ElevenLabs web UI (Brian v3, sp92/s26/sb75), 83s.
// Scene `seconds` are estimates; timing.json (align.mjs) is the truth.

import type { SceneData } from "../types";

export const STEPS = ["LIE", "FAN", "AIR", "CRISP", "YOU"] as const;

export const SCENES: SceneData[] = [
  {
    id: "hook",
    label: "THE LIE",
    stepIndex: 0,
    seconds: 10.5,
    narration:
      "There is no frying in your air fryer. Not a single drop. It's a small oven with a fan... and some of the best marketing in kitchen history.",
  },
  {
    id: "machine",
    label: "THE FAN",
    stepIndex: 1,
    seconds: 20.5,
    narration:
      "Open one up and here's all you find: a heating coil, and right behind it, a fan spinning at crazy speed. That's it. Your big oven has the same coil — but its air mostly just sits there. And still air is a terrible cook. It forms a lazy, cool blanket around your food, and heat has to slowly soak through it.",
  },
  {
    id: "air",
    label: "MOVING AIR",
    stepIndex: 2,
    seconds: 20.5,
    narration:
      "The fan destroys that blanket. It blasts two-hundred-degree air past every surface, over and over, stripping the cool layer away the instant it forms. Same temperature as your oven — but heat hits the food three times faster. That's the entire trick. It's not a new way of cooking. It's a hurricane in a bucket.",
  },
  {
    id: "crisp",
    label: "THE CRISP",
    stepIndex: 3,
    seconds: 19,
    narration:
      "So why does it feel fried? Because crispy isn't about oil — it's about speed. Blast the surface hot and fast, and the water steams off before the inside dries out. The outside browns, the inside stays soft. That teaspoon of oil you toss on? That's just there to carry heat and flavor. The wind does the frying.",
  },
  {
    id: "payoff",
    label: "YOU",
    stepIndex: 4,
    seconds: 13,
    narration:
      "Convection ovens have existed since the nineteen-forties. Nobody wanted a \"small fast oven.\" Then someone pointed the fan down, called it an air fryer... and sold a hundred million of them. What machine should I break down next?",
  },
];

export const FULL_NARRATION = SCENES.map((s) => s.narration).join("\n\n");

export const HAS_NARRATION = true;
