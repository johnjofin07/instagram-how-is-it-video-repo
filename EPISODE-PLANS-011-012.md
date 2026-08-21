# Episodes 011–012 — Build Plans (ZACK-STYLE experiment)

Self-contained build specs for the first two **zack-style** episodes:
**011 Shazam** (tech) and **012 Airplane Toilet** (machine). Same document
contract as `EPISODE-PLANS.md`: everything needed to build each episode alone —
locked narration, `script.ts` scene split, skin/kit spec, and scene-by-scene
beat tables.

**Read first:** `EPISODE-PLANS.md` §0 (global rules — format, alignment, safe
margins, determinism, QA) **still applies in full**, EXCEPT §0.7 (hook
framework), which §Z below replaces for these two episodes. Also read
`ZACK-STYLE.md` (the mode contract) and the deviations list referenced in
EPISODE-PLANS §0. `006-black-box` remains the reference implementation for
manifest shape, lowered chrome, and cover pattern.

Scripts are **LOCKED (zack v3 / v2, locked 2026-08-21)** — they were engineered
word-by-word to the zack format checks (word count, pivot position, chain-link,
≤1 number). Do not reword narration; use the per-episode trim list only if a
take runs long.

---

## Z. Zack-mode global rules (replaces EPISODE-PLANS §0.7 for 011–012)

These two episodes A/B the `ZACK-STYLE.md` formula against the default style.
The five v2 retention devices (title stamp, rehook, pattern interrupt, etc.)
**do not apply**. In their place:

### Z.1 The cold open (replaces title hook + verbal hook)
- **NO title `Stamp`.** Zack rule 3: the words never name the topic; the
  VISUAL introduces the subject. Frame 0 opens **mid-action on the mechanism**
  — something is already moving before the viewer can blink (011: the
  waveform is already streaming; 012: the finger is already pressing).
- The narration's first clause is temporal ("The second you…", "The moment
  you…") and is already step 1 of the chain. No setup beat, no fade-in — the
  first visual state must read instantly at f0.

### Z.2 Zero silence → zero rest
- Narration is one unbroken stream. The animation must match it: **no scene
  may coast** — something meaningful moves in every 30f window. No long holds
  except the single cold-end hold (Z.4).
- Scene transitions are **hard cuts or match cuts**, never crossfades — there
  is no audio pause to hide a dissolve in. Cut ON a chain-link word (the beat
  tables mark each cut word).
- No `stillFrames` anywhere. The stepper pulse never quiets.

### Z.3 The "but" pivot (replaces pattern interrupt)
- Each script has exactly one "but", and it gets exactly one **visual snap**:
  a hard state-flip of the stage within ≤6f of the spoken "but" (011: the map
  wipes; 012: cut to the ground, everything still). No whispers, blackouts,
  or direct address — those are default-mode devices; here the pivot is
  structural, not theatrical.

### Z.4 The cold ending (⚠ deliberate deviation from §0.7.4 / CONTENT.md)
- The video ends **on the peak image, full stop**: ~30–40f hold on the final
  visual, then done. **NO on-screen CTA chip.** This intentionally breaks the
  "CTA chip in the end hold" channel constant — ZACK-STYLE.md rule 8 is part
  of what's being tested; the per-pillar CTA moves to the **post caption**.
  Log this deviation with the experiment result in ZACK-STYLE.md.
- Stepper still runs `allDone` for the hold (the stepper concept is a channel
  constant and stays).
- On IG loop the last frame crashes into f0 — check the loop seam reads as a
  deliberate smash cut for both episodes (it does if Z.1 is honored: both
  f0 states are mid-action).

### Z.5 Zack production steps (additions to the §0.1 pipeline)
1. TTS in the ElevenLabs web UI, same voice constants (Brian v3, sp92/s26/sb75).
2. **Trim inter-sentence gaps in the MP3 before `npm run produce`** (target
   0–2% silence; align.mjs matches words, not silences — safe).
3. After produce: `npm run analyze -- --episode <slug>` and
   `-- --compare <slug> --against video-by-zackdfilms-dchds1ullua`.
   Targets: 0–2% silence · ≥155 wpm · one pivot · 0 questions · ≤45s.
4. Caption line-breaks key off pauses — after gap-trimming, **spot-check the
   karaoke lines** aren't merged into over-long lines that overflow x940.
5. Add the episode's row to the **ZACK-STYLE.md experiment log** at produce
   time; fill the retention column when data lands.

### Z.6 Motion personality (fun, but disciplined)
Zack's animation "never rests" — but per the frontend-design pass, spend the
boldness in ONE place per episode (its **signature beat**, marked ★ in the
scene tables) and keep everything else quiet and precise:
- **011's signature: the star ignition** — a thousand points dying to leave a
  dozen burning stars. Everything else in the episode is calm geometry.
- **012's signature: the particle stampede** — dense air visibly rushing into
  emptiness. Everything else is clean cutaway diagrams.
- Springs: entrances snappy (damping 10–13) to match the narration pace;
  ambient motion continuous but small (≤3px drift). Every effect must be
  deterministic (seeded scatter via the `makeStars` hash idiom — no
  `Math.random()`).

### Z.7 Shared-component change: CENTER THE STEPPER (Agent F, Phase A)
The chrome currently reads left-aligned because its container is asymmetric
(`left: 65, right: 140`). New channel look: **centered**.
- In `src/components/Chrome.tsx`, change the container of BOTH
  `SectionHeader` and `Stepper` from `left: 65, right: 140` to
  **`left: 140, right: 140`** (defaults). That spans x140–940 — width 800,
  centered exactly on x=540 — and still satisfies every margin rule (x≥65;
  right edge ON the x940 line that the YT 140px reserve drives).
- Nothing else changes: the squares row keeps `space-between`, the labels row
  keeps its first-left / last-right / middle-center alignment — symmetric
  margins alone center the whole assembly. Label fit check: 5 steps × 120px
  = 600 < 800 ✓.
- This changes the shared default, so ANY future re-render of an old episode
  picks it up — that's intended (new channel look), but re-QA stills if you
  re-render 001–004. Already-rendered `final.mp4`s are untouched.
- QA still after the change: any scene at its stepper-entrance frame; confirm
  label/counter and squares read centered and clear x65/x940.

### Z.8 Execution model — 3 agents (same ownership discipline as §0.0)

| Agent | Owns | Deliverable |
| --- | --- | --- |
| **F — Foundations & Integration** | `src/components/Chrome.tsx` (Z.7 only), `src/episodes/index.ts`, `src/Root.tsx`, `src/brand/Cover.tsx`, `CONTENT.md`, `ZACK-STYLE.md` | Phase A: stepper centered + both episode skeletons compiling (script.ts, stub timing.json, placeholder scenes, manifests, registrations). Phase C: both covers, cross-episode QA, log updates. |
| **1 — Shazam** | `src/episodes/011-shazam/**` only | kit + 4 scenes per §011 |
| **2 — Toilet** | `src/episodes/012-airplane-toilet/**` only | kit + 4 scenes per §012 |

No new skins → no `src/themes/` work at all. Phase gates identical to §0.0:
Phase A gates on `npx tsc --noEmit` clean + both compositions in studio with
correct centered steppers; Phase B agents never leave their episode folder;
Phase C is Agent F's cover + QA batch. Audio (manual web UI) + produce +
post-timing retune per episode after Phase C.

---
---

# EPISODE 011 — Shazam

**"Every Song Is a Constellation"**

| | |
| --- | --- |
| Slug | `011-shazam` |
| Pillar | Tech system (CTA in **post caption** only — Z.4) |
| Mode | **zack-style** (first tech-pillar attempt — log in ZACK-STYLE.md) |
| Skin | **`galaxy` — reuse as-is.** The starfield background IS the metaphor; zero theme work. |
| Length | ~113 words ≈ **44–46s** (zack target ≤45s narration) |
| Stepper | `MAP / MATCH / CROWD / HUM` |

## 011.1 ElevenLabs script (copy-paste; minimal tags — zack mode is one flat drive)

> [confident] The second you hit that button, your phone stops hearing music
> and starts drawing it — every sound in the room becomes a point on a map,
> and only the loudest points survive as stars. Those stars form a
> constellation no other song shares, and your phone hunts through millions
> of constellations until it finds the one that matches — before the chorus
> even ends. A screaming crowd can't hide the song, because the phone already
> threw everything quiet away — and the stars burn louder than any scream.
> [slower] But hum the tune yourself, and every star lands somewhere new —
> the map matches nothing, and the machine stares at a song no one has ever
> recorded.

Trim list if the take runs >46s (in order): "even" (chorus even ends) ·
"already" (phone already threw) · "somewhere new" → "elsewhere".

## 011.2 `script.ts` scene split

| id | label | step | ~sec | opener (first 3 words — align keys) |
| --- | --- | --- | --- | --- |
| `map` | THE MAP | 0 | ~13.5 | "The second you" |
| `match` | THE MATCH | 1 | ~11.5 | "Those stars form" |
| `crowd` | THE CROWD | 2 | ~9 | "A screaming crowd" |
| `hum` | THE HUM | 3 | ~11.5 + hold | "But hum the" |

All four openers distinct ✓. `HAS_NARRATION = false` until the take lands.
Manifest: copy 006's shape — `theme: THEMES.galaxy`,
`chrome: { headerTop: 280, stepperTop: 352 }`.

## 011.3 Design language

`galaxy` skin **unchanged**. Semantic color law (kit consts, not theme edits):

```ts
export const STAR = "#EAF2FF";                    // a surviving loud point
export const LINK = "rgba(125,211,252,0.75)";     // constellation lines (theme.second family)
export const LOCK = "#e50914";                    // the match flare (theme.accent)
export const HAZE = "rgba(245,168,60,0.35)";      // crowd noise — warm, rises from below
```

STAR/LINK are the song. LOCK appears ONLY at the moment of match (and its
absence in `hum` is the ending). HAZE is the only warm color in the episode.

**Contrast rule (critical):** the metaphor plays out on a `SoundMap` stage
panel (`bgLifted` fill, `line` border, radius 8) so metaphor stars never
compete with the background starfield. Background galaxy = ambience at the
frame edges only; inside the panel, the episode owns every dot. Stage panel:
x120–960, y460–1340 (working area per §0.3).

**Motion:** galaxy springs (d16/s160) for panel/chips; star ignition and
flares use snappier local springs (d11). Ambient: unmatched stars twinkle
±0.15 opacity on seeded phase offsets — the "never rests" texture (Z.6).

## 011.4 Episode kit — `scenes/kit.tsx`

| Component | Props | Draws |
| --- | --- | --- |
| `SoundMap` | `w`, `h` | The stage panel: lifted rect, faint pitch/time axis ticks. Every scene lives inside it. |
| `PointField` | `count`, `seed`, `litIds`, `dim` (0–1) | THE component. Seeded scatter of sound-points; `litIds` promotes points to STARs (size 10→16, glow), `dim` fades the rest. One field drives S1's rain, ignition, and S4's re-scatter (new `seed`). |
| `Constellation` | `stars`, `progress` (0–1), `color` | Draws LINK lines between star coords, stroke-dash reveal. 4px stroke min (§ delivery-scale rule). |
| `MapWall` | `speed`, `flare?: number` | The hunt: 3 columns of faint mini-constellations (16px stars, `lineFaint` links) scrolling upward behind/below the song's constellation; `flare` locks one cell and lights it LOCK. Cells from a seeded bank of 12 shapes, recycled. |
| `ListenRing` | `x`, `y`, `phase` | Expanding concentric rings (generic listening pulse — NO Shazam logo, no-IP rule). |
| `WaveStream` | `w`, `amp` | A live audio waveform ribbon (seeded harmonics, phase-driven — deterministic). Used only in S1's cold open. |
| `HazeTide` | `level` (0–1) | Warm HAZE gradient rising from the panel floor; carries seeded flickering micro-spikes (the screams). |

## 011.5 Scene direction

### map — THE MAP · ~405f
| f | % | Beat |
| --- | --- | --- |
| 0 | 0 | **Cold open, mid-action (Z.1):** `WaveStream` already streaming across the panel, `ListenRing` already pulsing at center. Nothing enters — it's all already moving at f0. |
| 20–90 | 5–22% | On "starts drawing it": the waveform ribbon tips vertical and **rains into the `SoundMap`** — each ripple lands as a point (`PointField` populating, ~140 points over 70f, seeded order). |
| 100–210 | 25–52% | Map fills dense. Points shimmer at landing (2f white tick each) — continuous motion, no rest. |
| 220–300 | 54–74% | ★ **SIGNATURE — star ignition.** On "only the loudest": `dim` sweeps 0→0.85 across the field (all points fade toward `textFaint`) while 12 `litIds` flare to STAR size+glow, slightly staggered (3f apart, seeded order). The panel goes from crowded to constellation in ~60f. |
| 310–405 | 77–100% | The 12 stars twinkle; first `Constellation` links begin stroke-revealing between the nearest pairs (pre-echo of S2). **Cut to `match` ON "Those"** — hard cut, links half-drawn. |

QA stills: **f0** (cold open must read instantly), **f260** (mid-ignition), **f380**.

### match — THE MATCH · ~345f
| f | % | Beat |
| --- | --- | --- |
| 0–60 | 0–17% | Links complete (`Constellation` progress → 1). The constellation contracts to the panel's top third — making room below. |
| 60–240 | 17–70% | **The hunt:** `MapWall` scrolls under it, accelerating (speed ramps 1→3 over 120f). Faint wrong-shape constellations stream past; the song's constellation holds still above, like a wanted poster. Continuous, hypnotic motion. |
| 240–290 | 70–84% | On "finds the one": one wall cell **flares LOCK**, scroll slams to a stop (6f decel), the cell scales up and overlays the song constellation — stars snap 1:1 onto each other (spring d11). |
| 290–345 | 84–100% | Locked: merged constellation pulses once in LOCK, then settles back to STAR/LINK with a LOCK halo. **Cut to `crowd` ON "A screaming"**. |

QA stills: **f180** (wall scroll readable, wrong shapes obviously wrong), **f265** (lock-on).

### crowd — THE CROWD · ~275f
| f | % | Beat |
| --- | --- | --- |
| 0–80 | 0–29% | `HazeTide` floods up from the panel floor (level 0→0.55) with flickering scream-spikes. Every remaining dim point it passes **drowns** (fades to zero). |
| 80–190 | 29–69% | Haze keeps climbing to ~0.75, lapping at the stars — but on "stars burn louder", each star's glow blooms +40% and punches a clean dark halo through the haze. The 12 stars are untouched, everything else is gone. |
| 190–275 | 69–100% | Constellation re-pulses its LOCK halo through the haze (the match still holds). Haze churns continuously (seeded flicker — no rest). **Cut to `hum` ON "But"** — and Z.3 fires: |

QA stills: **f120** (haze vs star contrast — check at delivery scale), **f250**.

### hum — THE HUM · ~355f (cold end)
| f | % | Beat |
| --- | --- | --- |
| 0–6 | 0–2% | **Pivot snap (Z.3):** within 6f of "But" — haze gone, map wiped clean, silence of color. Same panel, empty. |
| 6–110 | 2–31% | The same tune, hummed: a smaller, wobblier `WaveStream` rains a NEW `PointField` (different `seed`) — points land in visibly different places. |
| 110–200 | 31–56% | New star ignition (smaller, 9 stars) — but a ghost of the ORIGINAL constellation fades in at 25% opacity, misaligned: no star lands on a ghost star. Links draw between the new stars: a different shape entirely. |
| 200–280 | 56–79% | `MapWall` scrolls behind — slower this time, no flare — then drains away cell by cell. On "matches nothing": scroll stops. Empty wall. |
| 280–355 | 79–100% | **Cold end (Z.4):** the lone new constellation drifts (≤3px) in the dark panel, unmatched, ghost faded out. Stepper `allDone`. Hold ~40f on the peak image: *a song no one has ever recorded.* NO CTA chip. Loop seam: this dark drifting frame smash-cuts into f0's streaming waveform ✓. |

QA stills: **f4** (pivot snap), **f150** (ghost misalignment readable), **f330** (cold-end margins).

## 011.6 Cover idea
Galaxy starfield; ONE bright constellation dead-center (STAR dots, LINK
lines) with a LOCK-red flare on a single star; title **"EVERY SONG IS A
CONSTELLATION"**. Badge EP.011 pattern per `Cover.tsx` convention.

---
---

# EPISODE 012 — Airplane Toilet

**"The 300 MPH Flush"**

| | |
| --- | --- |
| Slug | `012-airplane-toilet` |
| Pillar | Everyday machine (CTA in **post caption** only — Z.4) |
| Mode | **zack-style** (first machines-pillar attempt — log in ZACK-STYLE.md) |
| Skin | **`flightlab` — reuse as-is** (006's aviation test-lab; zero theme work). |
| Length | ~114 words ≈ **45–47s** |
| Stepper | `VALVE / BOWL / GROUND / TANK` |

## 012.1 ElevenLabs script (copy-paste)

> [confident] The moment you press that flush button, a valve snaps open —
> and behind it is the sky, with barely any air. The crowded cabin air rushes
> toward that emptiness, dragging everything down the pipe at three hundred
> miles per hour. That rushing air scrubs a bowl slicker than a nonstick pan
> — so one cup of blue liquid replaces gallons of water — and everything
> slams into a sealed tank in the plane's belly. [slower] But on the ground,
> the outside air is just as thick as the inside — nothing rushes — so a
> roaring pump fakes the sky until takeoff. That tank never opens in flight —
> every flush rides beneath your feet, sloshing, and lands when you do.

Trim list if the take runs >47s (in order): "with barely any air" → "with
almost no air" (no gain — skip) · "just as thick as the inside" → "just as
thick" · "sloshing," (keep if at all possible — it's the texture word).

## 012.2 `script.ts` scene split

| id | label | step | ~sec | opener (first 3 words — align keys) |
| --- | --- | --- | --- | --- |
| `valve` | THE VALVE | 0 | ~15.5 | "The moment you" |
| `bowl` | THE BOWL | 1 | ~13 | "That rushing air" |
| `ground` | THE GROUND | 2 | ~10 | "But on the" |
| `tank` | THE TANK | 3 | ~7 + hold | "That tank never" |

Distinct openers ✓ ("That rushing…" / "That tank…" diverge at word 2 —
verified against align.mjs's 3-word window). `HAS_NARRATION = false` until
the take lands. Manifest: `theme: THEMES.flightlab`,
`chrome: { headerTop: 280, stepperTop: 352 }`.

## 012.3 Design language

`flightlab` skin **unchanged**. Semantic color law (kit consts):

```ts
export const AIR = "#F1F5F7";                    // air particles (theme.text white — the medium)
export const RUSH = "#FF7A1A";                   // moving-air energy: streaks, arrows (theme.accent)
export const BLUE = "#54D6E8";                   // the blue liquid, and ONLY the liquid (theme.second)
export const VOID = "#05080B";                   // the near-empty sky behind the valve
```

RUSH orange means "air in motion" everywhere (streaks, stampede trails, pump
intake); when nothing rushes (S3 open), there is NO orange on screen — the
pivot is legible in color alone. BLUE never labels anything but liquid. VOID
is darker than `bg` — emptiness reads as a hole in the world.

**Motion:** flightlab is already the snappiest skin (d22/s260) — right for
zack pace. The particle system is the one bold element (Z.6); diagrams around
it are clean 3–4px line work on the blueprint grid, like 006.

## 012.4 Episode kit — `scenes/kit.tsx`

| Component | Props | Draws |
| --- | --- | --- |
| `AirField` | `w`, `h`, `density` (0–1), `flow` ({x,y} px/f), `drainTo?` ({x,y}) | THE component. Seeded particle field (2–3px AIR dots, count = density·N); `flow` drifts them; `drainTo` accelerates them toward a sink point with RUSH trail streaks as they speed up. Drives the stampede, the stillness, and the pump. Deterministic: positions = seeded hash + frame·flow, wrapped. |
| `LavCutaway` | `w`, `valveOpen` (0–1) | Side cutaway: bowl profile, flush button, valve flap at the drain, pipe stub. 4px `line` strokes; bowl interior slightly lifted. |
| `ValveVoid` | `w`, `h` | The VOID panel behind the valve — near-black, 4–5 lonely AIR dots drifting (the thin sky). |
| `PipeRun` | `path`, `progress` | Pipe polyline from bowl to belly; `progress` sends a RUSH pulse down it. |
| `CupVsGallons` | `phase` (0–1) | One small BLUE cup vs a stacked tower of grey gallon jugs; phase collapses/fades the tower, cup stays. |
| `BellyTank` | `w`, `fill` (0–1), `slosh` (deg) | Fuselage cross-section: cabin floor line, seat glyphs above, sealed tank below; `fill` liquid level in BLUE, `slosh` tilts the liquid surface with a 2-lobe wave. |
| `PumpUnit` | `spin` (0–1) | Ground vacuum pump: rotor circle with blur arcs, intake horn on the pipe; `spin` drives rotor speed + a 1px whole-unit shake (the roar). |
| `SpeedTicker` | `value` | Small mono readout that spools 0→300 (the episode's one number, shown once, S1 only). |

## 012.5 Scene direction

### valve — THE VALVE · ~465f
| f | % | Beat |
| --- | --- | --- |
| 0 | 0 | **Cold open, mid-action (Z.1):** finger glyph already ON the flush button, press landing AT f0 (like 010's press-at-f0); `LavCutaway` center-stage, `AirField` at density 0.9 filling the cabin side, already drifting. |
| 0–25 | 0–5% | `valveOpen` 0→1, spring d10 — the flap SNAPS. Behind it, `ValveVoid` revealed: near-black, almost no dots. Dense here, empty there — the whole physics in one frame. |
| 30–140 | 6–30% | Beat of imbalance: cabin dots crowd against the valve mouth; the void's 4 dots drift alone. A thin `line` divider labels nothing — the contrast IS the label. |
| 140–330 | 30–71% | ★ **SIGNATURE — the stampede.** `AirField` gets `drainTo` = valve mouth: every particle accelerates toward it, RUSH streaks growing with speed, funneling down the pipe stub. Bowl contents (3 abstract shapes) get dragged along. `SpeedTicker` spools 0→300 near the pipe, synced to hit 300 on "three hundred". |
| 330–465 | 71–100% | Full river: particles + RUSH streaks pouring through the pipe in a continuous laminar band. Density in the cabin visibly drops. **Cut to `bowl` ON "That rushing"** — mid-river, no settle. |

QA stills: **f0** (press must read instantly), **f45** (dense/void contrast), **f230** (stampede), **f420**.

### bowl — THE BOWL · ~385f
| f | % | Beat |
| --- | --- | --- |
| 0–110 | 0–29% | Zoom state: bowl interior fills the stage. RUSH streaks sweep the bowl wall in an arc; a white gleam highlight chases each sweep (the "slicker than nonstick" shine). Match cut: the river from S1 continues into this scene's streaks. |
| 110–230 | 29–60% | `CupVsGallons` at stage right: tower of grey jugs vs one BLUE cup. On "one cup": the cup tips a BLUE ribbon around the bowl; on "gallons of water": the jug tower collapses/fades (phase 0→1, staggered 4f). |
| 230–385 | 60–100% | The stage slides DOWN the `PipeRun` (camera translate, ~90f) into the belly: `BellyTank` reveals, RUSH pulse arrives via `progress`, contents slam in (impact: tank border flashes `bgLifted`→`line`, 4f), hatch glyph seals with a 2-frame clunk-drop. **Cut to `ground` ON "But"** — and Z.3 fires: |

QA stills: **f60** (gleam sweep), **f170** (cup vs jugs margins), **f350** (tank slam).

### ground — THE GROUND · ~295f
| f | % | Beat |
| --- | --- | --- |
| 0–6 | 0–2% | **Pivot snap (Z.3):** hard cut. Plane silhouette AT THE GATE (ground line, jet bridge glyph). Cutaway shows `AirField` BOTH sides of the hull at equal density 0.9 — and zero flow. **No orange anywhere.** After 90 seconds of rushing, stillness is the shock. |
| 6–90 | 2–31% | Hold the broken rule: both fields idle-drift only (±1px). Dots near the open valve do nothing — nowhere to go. |
| 90–210 | 31–71% | `PumpUnit` spins up (spin 0→1 over 30f): rotor blurs, unit shakes, and a `drainTo` sink at the pump intake **hollows out the pipe section only** — a man-made pocket of VOID grows inside the pipe, RUSH streaks reappearing at the intake. The sky, faked. |
| 210–295 | 71–100% | Pump holds at full roar (continuous shake + rotor blur — no rest); the fake-void pocket holds empty against the dense field. **Cut to `tank` ON "That tank"**. |

QA stills: **f3** (pivot snap — verify the no-orange read), **f150** (pump + fake void).

### tank — THE TANK · ~265f (cold end)
| f | % | Beat |
| --- | --- | --- |
| 0–90 | 0–34% | Wide `BellyTank` cross-section: seat glyphs + passenger dots above the floor line, filled tank below (fill ~0.6). The plane pitches down 2° (whole-stage rotate) — descent. `slosh` swings gently (±4°, 50f period). |
| 90–190 | 34–72% | Ground line rises outside the hull windows; slosh continues — BLUE surface wave is the only bold motion. On "sloshing": one slightly bigger swell (+2°). |
| 190–265 | 72–100% | **Cold end (Z.4):** touchdown — 3px vertical bump, slosh settles over ~30f to near-still. Hold ~35f on the peak image: passengers above, tank below their feet, both arrived. Stepper `allDone`. NO CTA chip. Loop seam: still cross-section smash-cuts into f0's button press ✓. |

QA stills: **f100** (slosh + descent), **f245** (cold-end margins — nothing below y1370).

## 012.6 Cover idea
Flightlab blueprint grid; big lavatory cutaway with the valve open onto a
black void, RUSH streaks funneling in; title **"THE 300 MPH FLUSH"**.
Badge EP.012.

---

## Appendix — build order & ship notes

1. Phase A (Agent F): Z.7 stepper centering → skeletons → gate.
2. Phase B (Agents 1–2 parallel): kits + scenes, own folder only.
3. Phase C (Agent F): covers, batch QA stills, CONTENT.md → 🏗 built.
4. Per episode: record (web UI) → **trim gaps** → produce → analyze compare →
   post-timing retune by % → JPEG-sequence sweep → watch final.mp4 →
   CONTENT.md ✅ + ZACK-STYLE.md experiment-log row.
5. **Publishing:** these are A/B probes — do NOT ship both back-to-back;
   interleave with default-style episodes (003/004/005/006 are produced and
   waiting) so the retention comparison has a control next to it. 011 is
   tech, 012 is machine — they slot into the pillar rotation as-is.
