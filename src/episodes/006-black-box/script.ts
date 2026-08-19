// Episode 006 — "Engineers Try to Destroy the Black Box".
// Everyday-machines pillar. Retention structure: a destruction-test gauntlet
// in the hook, then the second reveal that only the memory must survive.

import type { SceneData } from "../types";

export const STEPS = ["TEST", "MEMORY", "RECORD", "FIND", "REBUILD"] as const;

export const SCENES: SceneData[] = [
  {
    id: "hook",
    label: "THE TEST",
    stepIndex: 0,
    seconds: 14,
    narration:
      "To approve a black box, engineers try to destroy it. They hit its memory with 3,400 times gravity. Crush it under 2.3 tonnes. Burn it at 1,100 degrees. Then expose it to the pressure six kilometres underwater.",
  },
  {
    id: "memory",
    label: "THE MEMORY",
    stepIndex: 1,
    seconds: 7,
    narration:
      "But here’s the twist: most of the box can be destroyed. Only the memory has to survive.",
  },
  {
    id: "recorders",
    label: "THE RECORDERS",
    stepIndex: 2,
    seconds: 12,
    narration:
      "A plane carries two recorders. One captures cockpit audio. The other logs speed, altitude, controls, and hundreds of aircraft systems. The data is protected near the tail.",
  },
  {
    id: "locate",
    label: "THE SEARCH",
    stepIndex: 3,
    seconds: 6,
    narration:
      "If it sinks, a beacon pings through the water, helping search teams find the bright-orange recorder.",
  },
  {
    id: "rebuild",
    label: "THE REBUILD",
    stepIndex: 4,
    seconds: 18,
    narration:
      "Investigators sync the audio and data, rebuilding the final moments second by second. The black box doesn’t explain the crash. It preserves the clues — so investigators can find the cause, and help prevent the next one. What machine should I break down next?",
  },
];

export const FULL_NARRATION = SCENES.map((scene) => scene.narration).join("\n\n");
export const HAS_NARRATION = true;
