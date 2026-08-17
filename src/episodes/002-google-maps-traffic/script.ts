// Episode 002 — "How Google Maps Knows About Traffic".
// Narration recorded via ElevenLabs web UI (Brian v3, sp92/s26/sb75), 106s.
// Scene `seconds` are estimates; timing.json (align.mjs) is the truth.

import type { SceneData } from "../types";

export const STEPS = ["YOU", "PHONES", "BRAIN", "MAP", "ROUTE"] as const;

export const SCENES: SceneData[] = [
  {
    id: "hook",
    label: "THE SENSOR",
    stepIndex: 0,
    seconds: 12.5,
    narration:
      "Google doesn't have cameras on the road. No sensors under the asphalt. The traffic sensor... is you. And it once got fooled by a man with a handcart.",
  },
  {
    id: "probes",
    label: "SPEED PROBES",
    stepIndex: 1,
    seconds: 27,
    narration:
      "Right now, every phone with Google Maps open is quietly reporting two things: where it is, and how fast it's moving. Anonymously, every few seconds. One phone means nothing. But millions of phones on the same road? That's a live speed map of the entire city. Phones moving at sixty? Green. Phones crawling at five? That road turns red.",
  },
  {
    id: "brain",
    label: "PREDICTION",
    stepIndex: 2,
    seconds: 26,
    narration:
      "But live speeds are only half of it. Google blends today's traffic with years of history — how this exact road behaves on a rainy Tuesday at 6 PM. That's how it predicts the jam before you reach it... and quietly reroutes you around it. And here's the loop: by rerouting thousands of drivers, Maps doesn't just avoid traffic. It reshapes it.",
  },
  {
    id: "handcart",
    label: "BERLIN 2020",
    stepIndex: 3,
    seconds: 25,
    narration:
      "Which brings us to Berlin, 2020. An artist named Simon Weckert loaded ninety-nine phones into a little handcart... and went for a slow walk down an empty street. Ninety-nine cars moving at walking speed. Google saw a traffic jam. The street turned dark red — and real drivers got rerouted away from a completely empty road.",
  },
  {
    id: "payoff",
    label: "YOU",
    stepIndex: 4,
    seconds: 15.5,
    narration:
      "So next time Maps says heavy traffic ahead — nobody's watching the road. Thousands of strangers' phones are just... moving slowly. You're not reading the traffic. You are the traffic. What should I break down next?",
  },
];

export const FULL_NARRATION = SCENES.map((s) => s.narration).join("\n\n");

export const HAS_NARRATION = true;
