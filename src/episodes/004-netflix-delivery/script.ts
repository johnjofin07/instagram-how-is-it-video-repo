// Episode 004 — "Netflix Is a Delivery Company" (retention-first remake of
// ep 001, which stays untouched as the galaxy-skin original).
// Retention-first structure: the surprising claim is on screen by 0.3s and
// fully spoken by ~4s; the curiosity loop ("how does it know?") pays off in
// the depot scene. One metaphor carries every scene: Netflix as a shipping
// company (master file = factory original, encodes = box sizes, chunks =
// parcels, Open Connect = the local warehouse, player = the one ordering).
// Narration to record via ElevenLabs web UI (Brian v3, sp92/s26/sb75), ~90s.
// Scene `seconds` are estimates; timing.json (align.mjs) is the truth.

import type { SceneData } from "../types";

export const STEPS = ["STUDIO", "PACK", "SHIP", "DEPOT", "YOU"] as const;

export const SCENES: SceneData[] = [
  {
    id: "hook",
    label: "TONIGHT",
    stepIndex: 4, // start where the viewer is
    seconds: 11.5,
    narration:
      "Netflix already knows what your city will binge tonight — and it's already delivered it, to a building down your road. Netflix isn't a streaming company. It's a delivery company.",
  },
  {
    id: "pack",
    label: "THE PACKING",
    stepIndex: 1,
    seconds: 20.5,
    narration:
      "Here's the operation. A studio hands Netflix one giant master file. Netflix repacks it into every box size there is... from glorious 4K, down to potato quality. And the packing list is custom for every single title. Cartoons squeeze into tiny boxes. Grainy action films fight back — they need the big ones.",
  },
  {
    id: "ship",
    label: "THE PARCELS",
    stepIndex: 2,
    seconds: 23,
    narration:
      "Every box is then chopped into thousands of tiny parcels — about four seconds of video each. Your TV is the one ordering them. Before every single parcel, it checks your wifi... and picks a size. Strong signal? Send the 4K. Someone starts a video call? It quietly orders smaller parcels — and you never see a buffering wheel.",
  },
  {
    id: "depot",
    label: "OPEN CONNECT",
    stepIndex: 3,
    seconds: 22,
    narration:
      "But the genius part: those parcels don't ship from some faraway cloud. Netflix builds free mini-warehouses, and gives them to internet providers. It's called Open Connect. Every night, while you sleep, each warehouse stocks up on what its neighborhood will binge tomorrow. That's how Netflix knew. Your show was on the shelf... before you ever asked.",
  },
  {
    id: "payoff",
    label: "PRESS PLAY",
    stepIndex: 4,
    seconds: 15,
    narration:
      "So when you press play tonight, nothing crosses the ocean. The warehouse down the road just hands over parcel one. You're not streaming from the internet... you're streaming from the neighborhood. What system should I break down next?",
  },
];

export const FULL_NARRATION = SCENES.map((s) => s.narration).join("\n\n");

export const HAS_NARRATION = true;
