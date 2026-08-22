// Episode 013 — "Netflix Is a Delivery Company" (papersky remake of ep 004).
// The NARRATION IS UNCHANGED from 004 — same recording, same timing.json —
// so this is purely a visual redo: the muted `delivery` depot skin swapped for
// the bright cut-paper `papersky` diorama, plus the real Netflix mark as a
// paper cutout. Scene ids and ORDER must stay identical to 004's, because
// timing.json is indexed by scene position.

import type { SceneData } from "../types";

export const STEPS = ["STUDIO", "PACK", "SHIP", "DEPOT", "YOU"] as const;

export const SCENES: SceneData[] = [
  {
    id: "hook",
    label: "TONIGHT",
    stepIndex: 4, // start where the viewer is
    seconds: 11.46,
    narration:
      "Netflix already knows what your city will binge tonight — and it's already delivered it, to a building down your road. Netflix isn't a streaming company. It's a delivery company.",
  },
  {
    id: "pack",
    label: "THE PACKING",
    stepIndex: 1,
    seconds: 22.04,
    narration:
      "Here's the operation. A studio hands Netflix one giant master file. Netflix repacks it into every box size there is... from glorious 4K, down to potato quality. And the packing list is custom for every single title. Cartoons squeeze into tiny boxes. Grainy action films fight back — they need the big ones.",
  },
  {
    id: "ship",
    label: "THE PARCELS",
    stepIndex: 2,
    seconds: 22,
    narration:
      "Every box is then chopped into thousands of tiny parcels — about four seconds of video each. Your TV is the one ordering them. Before every single parcel, it checks your wifi... and picks a size. Strong signal? Send the 4K. Someone starts a video call? It quietly orders smaller parcels — and you never see a buffering wheel.",
  },
  {
    id: "depot",
    label: "OPEN CONNECT",
    stepIndex: 3,
    seconds: 23.24,
    narration:
      "But the genius part: those parcels don't ship from some faraway cloud. Netflix builds free mini-warehouses, and gives them to internet providers. It's called Open Connect. Every night, while you sleep, each warehouse stocks up on what its neighborhood will binge tomorrow. That's how Netflix knew. Your show was on the shelf... before you ever asked.",
  },
  {
    id: "payoff",
    label: "PRESS PLAY",
    stepIndex: 4,
    seconds: 15.15,
    narration:
      "So when you press play tonight, nothing crosses the ocean. The warehouse down the road just hands over parcel one. You're not streaming from the internet... you're streaming from the neighborhood. What system should I break down next?",
  },
];

export const FULL_NARRATION = SCENES.map((s) => s.narration).join("\n\n");

export const HAS_NARRATION = true;
