# Episode 006 — "Engineers Try to Destroy the Black Box" · Build Plan

Implementation storyboard for the final 145-word narration. This document is
the visual contract; create `script.ts` from the scene boundaries in §2 without
rewording the narration after audio is recorded.

Episode number is **006** because `005-undersea-cables` already exists in the
workspace, even though it is not registered yet.

**Definition of done:** the composition renders at 1080×1920/30fps with no
console errors, `npx tsc --noEmit` passes, the first claim is readable by frame
9, the finished audio is under 60 seconds, all QA stills pass the safe-margin
check, and `out/006-black-box/final.mp4` is watched end to end.

---

## 1. Creative direction

The episode is a **destruction-test story**, not a tour of aviation trivia.
The recorder remains the same object throughout the first four scenes while
the world around it changes: impact rig → press → fire → deep water → aircraft
tail → ocean search → investigation lab.

Two retention peaks drive the edit:

1. **0–3s:** the contradiction — engineers approve the design by trying to
   destroy it.
2. **~14–18s:** the reveal — most of the recorder may be ruined; only the
   crash-survivable memory has to preserve its data.

Visual hierarchy:

- safety orange = the physical recorder and test labels;
- cyan = information that must survive (audio, telemetry, memory);
- red = destructive force, used only at the four test impacts;
- green = successful recovery and the safer next flight, used only at the end.

Do not lead with “black boxes are orange.” That familiar fact is supporting
information in scene 4, not the promise of the video.

---

## 2. Locked narration and scene boundaries

Provisional timing totals **57 seconds**. `timing.json` becomes the source of
truth after the narration is generated and aligned.

```ts
export const STEPS = ["TEST", "MEMORY", "RECORD", "FIND", "REBUILD"] as const;

export const SCENES: SceneData[] = [
  {
    id: "hook",
    label: "THE TEST",
    stepIndex: 0,
    seconds: 14,
    narration:
      "To approve this black box, engineers try to destroy it. They hit its memory with 3,400 times gravity, crush it under 2.3 tonnes, burn it at 1,100 degrees, then expose it to the pressure six kilometres underwater.",
  },
  {
    id: "memory",
    label: "THE MEMORY",
    stepIndex: 1,
    seconds: 7,
    narration:
      "And here’s the twist: most of the box can be destroyed. Only the memory has to survive.",
  },
  {
    id: "recorders",
    label: "THE RECORDERS",
    stepIndex: 2,
    seconds: 12,
    narration:
      "A plane carries two recorders. One captures cockpit audio. The other logs speed, altitude, controls, and hundreds of aircraft systems. Each stores its data in protected memory near the tail.",
  },
  {
    id: "locate",
    label: "THE SEARCH",
    stepIndex: 3,
    seconds: 6,
    narration:
      "If it sinks, a beacon pings to help search teams find the bright-orange recorder.",
  },
  {
    id: "rebuild",
    label: "THE REBUILD",
    stepIndex: 4,
    seconds: 18,
    narration:
      "Investigators sync the recovered audio and data, rebuilding the final moments second by second. The black box doesn’t tell them why the plane crashed. It preserves the clues — so they can find out, and help prevent the next one. What machine should I break down next?",
  },
];
```

The first three words of every non-hook scene are unique and safe for
`align.mjs`: “And here’s the” · “A plane carries” · “If it sinks” ·
“Investigators sync the”.

---

## 3. File manifest

Create:

```text
src/themes/flightlab.ts
src/episodes/006-black-box/script.ts
src/episodes/006-black-box/timing.json       # stub, then generated
src/episodes/006-black-box/index.ts
src/episodes/006-black-box/scenes/kit.tsx
src/episodes/006-black-box/scenes/Hook.tsx
src/episodes/006-black-box/scenes/Memory.tsx
src/episodes/006-black-box/scenes/Recorders.tsx
src/episodes/006-black-box/scenes/Locate.tsx
src/episodes/006-black-box/scenes/Rebuild.tsx
```

Edit:

```text
src/themes/index.tsx              # register flightlab
src/episodes/index.ts             # register episode 006 after 005 is wired
src/brand/Cover.tsx               # Cover006
src/Root.tsx                      # cover-006 Still
CONTENT.md                        # only when status changes
```

No `BackgroundVariant` change is required. `flightlab` uses the existing
`plain` background; the low-contrast laboratory grid belongs in `kit.tsx`.

---

## 4. `flightlab` theme

Industrial charcoal with safety orange and oscilloscope cyan. Use boxless mono
captions. Motion should be fast and heavy, with almost no bounce.

```ts
export const flightlab: ThemeSpec = {
  name: "flightlab",
  bg: "#0D1217",
  bgLifted: "#172029",
  background: { kind: "plain" },
  line: "rgba(169, 187, 201, 0.25)",
  lineFaint: "rgba(169, 187, 201, 0.11)",
  text: "#F1F5F7",
  textDim: "#9AAAB6",
  textFaint: "#586873",
  accent: "#FF7A1A",
  accentDim: "#9A430E",
  accentGlow: "rgba(255, 122, 26, 0.30)",
  second: "#54D6E8",
  secondDim: "rgba(84, 214, 232, 0.45)",
  good: "#55D68A",
  warn: "#FF4D4D",
  brand: "#FF7A1A",
  brandDim: "#9A430E",
  brandGlow: "rgba(255, 122, 26, 0.30)",
  card: "rgba(23, 32, 41, 0.94)",
  cardBorder: "rgba(169, 187, 201, 0.19)",
  cardShadow: "0 16px 42px rgba(0, 0, 0, 0.48)",
  vignette: "rgba(0, 0, 0, 0.72)",
  caption: {
    spoken: "rgba(241, 245, 247, 0.98)",
    unspoken: "rgba(241, 245, 247, 0.30)",
    halo: "0 2px 18px rgba(0, 0, 0, 0.95)",
    font: "mono",
    boxed: false,
  },
  motion: { damping: 22, stiffness: 260, mass: 0.65 },
};
```

Before implementation, run a contrast check on the final palette. The
`design-for-ai:color` skill referenced by `CLAUDE.md` was unavailable while
this plan was written, so this palette is a proposed starting point rather
than a completed color review.

---

## 5. Layout and shared animation rules

Composition space is 1080×1920 at 30fps.

- Reserved chrome: y96–236.
- Scene art: **x65–1015, y300–1370**.
- Primary headline: y340–500.
- Main diagram/test stage: y570–1160.
- Closing takeaway: y1220–1340.
- Nothing meaningful below y1370 except shared captions.

All impact motion is deterministic. Never use `Math.random()` or CSS keyframe
animation. Derive everything from `useCurrentFrame()` with clamped
`interpolate()` calls.

Use these transition personalities consistently:

- test changes: 3–5 frame hard cuts or shutter wipes;
- physical travel: cubic ease-out, no bounce;
- headline entry: `useEnter(2, { damping: 11 })`;
- impact shake: a fixed six-frame lookup array, not random jitter;
- data motion: constant-speed linear interpolation;
- final safe-flight motion: slow ease-out with no shake.

Complex SVG artwork should stay static. Animate a wrapper’s opacity/transform
instead of rebuilding paths. Hoist arrays, paths, and the impact-shake lookup
to module scope; memoize only seeded particle collections.

---

## 6. Episode SVG kit

`scenes/kit.tsx` contains small pure components, all accepting
`style?: React.CSSProperties` where positioning is useful.

| Component | Important props | Purpose |
| --- | --- | --- |
| `LabGrid` | `opacity?` | Perspective floor/grid plus two dim overhead light bars. Background only. |
| `Recorder` | `w`, `damage`, `cutaway`, `beaconOn?` | Bright-orange flight recorder. `damage` dents/discolors the outside; `cutaway` reveals chassis and memory unit. |
| `MemoryUnit` | `w`, `glow`, `layers?` | Compact crash-survivable memory module. Optional rings: metal shell, heat barrier, memory board. |
| `TestReadout` | `value`, `unit`, `label`, `status?` | Large tabular test number. Status flips TESTING → DATA OK. |
| `Press` | `gap`, `force` | Top/bottom hydraulic plates; recorder deformation is controlled separately. |
| `FlameEnvelope` | `intensity` | 10–14 deterministic flame paths around the recorder; never cover the readout. |
| `AircraftSide` | `w`, `tailGlow?`, `flightProgress?` | Neutral generic airliner silhouette with no manufacturer-specific details. |
| `AudioWave` | `progress`, `intensity?` | Deterministic waveform revealed with an SVG clip path. |
| `DataBus` | `progress`, `rows?` | Cyan telemetry lanes and travelling packets; default rows are speed, altitude, controls, systems. |
| `Beacon` | `pulse`, `rings?` | Orange recorder with cyan sonar rings and a small `PING` tag. |
| `Timeline` | `progress`, `synced?` | Shared playhead linking audio waveform and telemetry events. |
| `Chip` | `children`, `color?`, `style?` | Compact mono label matching the dark lab skin. |
| `Stamp` | `children`, `fontSize`, `color?`, `rotate?` | Large claim typography. |

Avoid a generic “black box” rectangle. The recognizable details are the
safety-orange case, white reflective stripes, rounded reinforced corners,
connector plate, and cylindrical underwater locator beacon.

---

## 7. Scene beat sheets

Frames are provisional. Percentages are authoritative after audio alignment.

### 7.1 `Hook.tsx` — THE TEST · 420f · step 0

> “To approve this black box ... six kilometres underwater.”

The recorder is visible at frame 0. The scene is one continuous test bay with
hard lighting changes, so it feels like a gauntlet rather than four unrelated
infographics.

| Frame | % | Animation beat |
| --- | ---: | --- |
| 0 | 0 | Recorder already clamped at (540, 870). `LabGrid` behind it. Small chip: `BLACK BOX QUALIFICATION`. |
| 2–12 | 0–3 | Main stamp scales in at y350: `TO APPROVE IT,` / **`TRY TO DESTROY IT`**. Fully legible by f9. |
| 35–70 | 8–17 | Clamp arms lock. Readout wakes from dashes to `TEST 01`. Headline shrinks to a persistent top claim. |
| 70–125 | 17–30 | **IMPACT:** recorder shoots 230px into a stop, six-frame shake, one red flash. Readout counts rapidly to `3,400 G`; cyan memory glow remains steady. |
| 125–195 | 30–46 | **CRUSH:** hard cut to hydraulic plates. Gap closes; outer case deforms 8%, bolts pop outward, readout `2.3 TONNES`. Memory silhouette does not deform. |
| 195–285 | 46–68 | **FIRE:** plates wipe into a furnace frame. Flames wrap the recorder, case darkens at edges, readout climbs to `1,100°C`. Use orange/yellow fire; reserve red for the initial flare only. |
| 285–390 | 68–93 | **PRESSURE:** furnace shutters close and reopen as a blue pressure chamber. Depth scale counts 0→`6,000 m`; tiny bubbles compress and disappear. Recorder compresses by only 1–2px. |
| 390–420 | 93–100 | Four test badges stack at y1220: `IMPACT · CRUSH · FIRE · DEPTH`. All switch to `DATA OK` in cyan. Hold into the cut. |

Sound-design opportunities: clamp click, single bass impact, hydraulic groan,
fire whoosh, deep pressure rumble. Keep all below narration.

QA stills: **f9** (hook readability), **f110** (3,400 G), **f250** (fire),
**f390** (depth and bottom margin).

### 7.2 `Memory.tsx` — THE MEMORY · 210f · step 1

> “And here’s the twist ... memory has to survive.”

This is the conceptual payoff to the torture sequence.

| Frame | % | Animation beat |
| --- | ---: | --- |
| 0–25 | 0–12 | Match cut from the pressure chamber to the same battered recorder on a black lab table. No entrance animation. |
| 25–80 | 12–38 | Stamp at y360: `MOST OF THE BOX` / `CAN BE DESTROYED`. Outer shell splits; connector board, power supply, and chassis drift outward and dim. |
| 80–125 | 38–60 | Camera pushes into the surviving memory unit. Debris continues past frame edges; center stays perfectly stable. |
| 125–175 | 60–83 | Three protective rings reveal outside-in: `METAL SHELL` → `HEAT BARRIER` → `MEMORY`. Only the inner board is cyan. |
| 175–210 | 83–100 | Closing stamp at y1225: **`ONLY THE MEMORY MUST SURVIVE`**. All debris fades to 12%; memory glow expands once, then holds. |

QA stills: **f70** (destruction), **f195** (memory claim).

### 7.3 `Recorders.tsx` — THE RECORDERS · 360f · step 2

> “A plane carries two recorders ... near the tail.”

| Frame | % | Animation beat |
| --- | ---: | --- |
| 0–35 | 0–10 | Generic side-view aircraft draws on from nose to tail at y860. Two orange memory markers are already faintly visible near the tail. |
| 35–85 | 10–24 | Markers pull forward into two side-by-side recorder cards: `CVR` left, `FDR` right. Card count stamp: `TWO RECORDERS`. |
| 85–155 | 24–43 | Left/CVR activates: cockpit microphone icon, pilot/radio waveform, warning chime spikes. Label: `VOICES + ALARMS`. |
| 155–250 | 43–69 | Right/FDR activates: speed, altitude, control position, engine and system lanes stream into memory. Counter rapidly rises to `100s OF SIGNALS`; do not show an exact universal parameter count. |
| 250–310 | 69–86 | Both streams collapse into their cyan memory cores. Cards shrink and travel back toward the tail markers. |
| 310–360 | 86–100 | Aircraft fills the stage again. Tail receives a restrained orange glow; chip at y1240: `MOST CRASH-SURVIVABLE AREA`. Hold for the scene cut. |

QA stills: **f125** (CVR), **f220** (FDR), **f340** (tail placement).

### 7.4 `Locate.tsx` — THE SEARCH · 180f · step 3

> “If it sinks ... bright-orange recorder.”

| Frame | % | Animation beat |
| --- | ---: | --- |
| 0–30 | 0–17 | Hard vertical wipe from aircraft night sky to dark water. Orange recorder falls from y320 toward y1040, slowly tumbling. |
| 30–70 | 17–39 | It settles at y1080. A narrow surface-search vessel/receiver silhouette appears at y370; no warm human accent is introduced. |
| 70–140 | 39–78 | Beacon activates. Three cyan rings expand every 26f; a dotted return line reaches the receiver. Small `PING` tag flashes in sync, never faster than once per second. |
| 105–150 | 58–83 | Stamp at y390: `WHY IT'S BRIGHT ORANGE`. Recorder saturation rises while the surrounding seabed dims. |
| 150–180 | 83–100 | Receiver reticle locks; line turns green. Chip at y1250: `SIGNAL FOUND`. Hold for 20f. |

QA stills: **f115** (orange contrast + sonar), **f165** (safe margins).

### 7.5 `Rebuild.tsx` — THE REBUILD · 540f · step 4/all done

> “Investigators sync ... break down next?”

The final scene changes the energy from destructive to precise. No more
camera shake.

| Frame | % | Animation beat |
| --- | ---: | --- |
| 0–45 | 0–8 | Investigation lab: recovered memory plugs into a reader at center. Two empty horizontal panels appear: audio above, flight data below. |
| 45–150 | 8–28 | Audio waveform draws left→right; telemetry events populate underneath. Their playheads begin offset by 70px. |
| 150–220 | 28–41 | On “sync,” lower timeline slides until warning spikes align. A single shared cyan playhead crosses both. Stamp: `SECOND BY SECOND`. |
| 220–300 | 41–56 | Each aligned event adds one piece to a minimal flight-path reconstruction: heading, altitude, control input, warning. The path draws without showing a literal crash. |
| 300–360 | 56–67 | On “doesn’t tell them why,” a large `CAUSE` field remains `?`. Stamp underneath: **`EVIDENCE, NOT A VERDICT`**. This is a deliberate pause, not a failure state. |
| 360–430 | 67–80 | Evidence cards connect with thin lines into a chain of events. The question mark resolves to `INVESTIGATE`, not a fake one-click answer. |
| 430–490 | 80–91 | Lab panels fold into the outline of a clean aircraft. It travels along a green ascending path. Closing stamp at y390: `MAKE THE NEXT FLIGHT SAFER`. |
| 490–540 | 91–100 | Aircraft holds at y890. CTA appears at y1240: `WHAT MACHINE SHOULD I BREAK DOWN NEXT?` All five stepper nodes remain complete. |

QA stills: **f190** (timeline synchronization), **f335** (evidence claim),
**f510** (CTA and bottom margin).

---

## 8. Build order

1. Create `flightlab.ts`, register it, and validate text/accent contrast.
2. Create `script.ts`, stub timing, placeholder scenes, `index.ts`, and register
   the episode. Stub timing:

   ```json
   { "sceneSeconds": [14, 7, 12, 6, 18], "sceneCaptions": [[], [], [], [], []] }
   ```

3. Build `kit.tsx` and a temporary kit-sheet composition if needed.
4. Build `Hook.tsx` first and render f9 before doing anything else. The hook
   must work as a still with the sound off.
5. Build `Memory.tsx`; verify the shell-to-memory match cut.
6. Build `Recorders.tsx`, then reuse `Recorder`/`MemoryUnit` in `Locate.tsx`.
7. Build `Rebuild.tsx` last because it consumes `AudioWave`, `DataBus`, and
   `Timeline` primitives established earlier.
8. Add `Cover006`. Cover concept: battered orange recorder inside test clamps,
   headline **`THEY TRY TO DESTROY IT`**. Do not use crash imagery.
9. Generate narration with Brian v3 at speed 92, stability 26, similarity 75;
   save to `public/episodes/006-black-box/narration.mp3`.
10. Set `HAS_NARRATION = true`, run `npm run produce -- 006-black-box`, and
    retime every beat using §9.

---

## 9. Post-audio retiming

For every scene:

1. Calculate `realFrames = round(timing.sceneSeconds[i] * 30)`.
2. Convert each beat using `round(percentage * realFrames)`.
3. Hand-align the four test impacts to the actual nouns/numbers, not merely
   their proportional positions.
4. Preserve minimum holds:
   - opening claim: 24f after it becomes readable;
   - `ONLY THE MEMORY MUST SURVIVE`: 28f;
   - `EVIDENCE, NOT A VERDICT`: 25f;
   - final CTA: 35f.
5. If total narration is 59s or longer, shorten pauses/re-record. Do not speed
   the whole render or cut the final CTA below 35f.

---

## 10. Verification checklist

- `npx tsc --noEmit`
- Studio scrub at 0.25×: no one-frame flashes at scene boundaries.
- Render the 13 QA stills listed in §7 and inspect all four safe margins.
- Confirm no meaning relies on color alone: every orange/cyan/red/green state
  also has a label, shape, or motion cue.
- Confirm no exact aircraft brand, accident, airline, or cockpit likeness is
  depicted.
- Confirm fire/depth particles are deterministic across two renders.
- Confirm the torture-test sequence is intense but not graphic: no passengers,
  casualties, wreckage, or real crash footage.
- Watch `out/006-black-box/final.mp4` with sound, muted, and once on a phone.
- Update `CONTENT.md` only when the episode becomes scripted/voiced/produced.

---

## 11. Facts the visuals may show

Safe to visualize because they are supported by the cited specifications used
for the script:

- 3,400g impact shock;
- 5,000lb static crush, rounded to 2.3 tonnes;
- 1,100°C high-temperature fire;
- deep-sea pressure equivalent to roughly 20,000ft / 6km;
- separate cockpit-voice and flight-data recorders;
- crash-survivable memory, usually installed near the tail;
- an underwater acoustic locator beacon.

Do not invent a universal layer stack, universal parameter count, or a claim
that the recorder alone determines probable cause. The cutaway in scene 2 is a
generic explanatory diagram, not a manufacturer-specific engineering drawing.

Primary references:

- [Honeywell HFR5 crash-survivability specification](https://aerospace.honeywell.com/content/dam/aerobt/en/documents/learn/products/recorders-and-transmitters/datasheet/C61-1595-000-001_HFR5_CVR-datasheet.pdf)
- [NTSB overview of cockpit-voice and flight-data recorders](https://www.ntsb.gov/news/Pages/cvr_fdr.aspx)
