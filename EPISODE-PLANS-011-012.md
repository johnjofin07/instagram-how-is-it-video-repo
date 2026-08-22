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
| Length | **v4: 150 words ≈ 55–58s** (v3 was 114w / 43.5s — see §012.1-v4) |
| Stepper | `VALVE / BOWL / GROUND / TANK` |

## 012.1-v4 ElevenLabs script — **CURRENT** (comprehension rewrite, 2026-08-22)

v3 (below, §012.1-v3) was produced but never published — it read as abstract: the mechanism word was
never spoken, there was no home-toilet baseline to be surprised by, and no
curiosity loop was ever opened. v4 keeps zack mode and fixes exactly that.

> [confident] A plane toilet doesn't flush with water. It flushes with air.
> Press flush, and a valve opens a pipe to the sky, where the air is far
> thinner than in the cabin — so cabin air stampedes down that pipe, taking
> everything with it at three hundred miles an hour. And none of it leaves
> the plane. The bowl is coated so slick that nothing sticks, so instead of
> gallons of water, one cup of blue disinfectant rinses it clean, and the
> waste slams into a sealed tank in the plane's belly. [slower] But on the ground, the air
> outside is just as thick as inside — nothing rushes, so a roaring pump
> under the plane makes the suction instead. That tank never opens in flight.
> Every flush from everyone on board rides under your feet, sloshing, and it
> only leaves through a truck at the gate.

146 words. **≈54s at the v3 take's 163 wpm; ≈58s if the take drifts to 150
wpm** — this is the one risk in v4, so check the raw take's length before
trimming gaps and use the trim list if it lands over ~54s.

**Trim list (in order, worth 12 words / ~4.5s):** "from everyone on board" →
"on board" · "roaring" · "far" (far thinner) · "blue" (blue disinfectant) · "And" (none of
it leaves).

### What changed and why (the script-optimising devices)

| # | v3 | v4 | device |
| --- | --- | --- | --- |
| 1 | "The moment you press that flush button, a valve snaps open — and behind it is the sky, with barely any air." | "An airplane toilet flushes at three hundred miles an hour" | **Claim-first hook (option A).** Subject + surprise spoken inside 2s, matches the title, and spends the one number where it works hardest. The first v4 draft opened on a negation ("doesn't flush with water") — banned by the retention rules, replaced. Amends ZACK rule 3 the same way 011/012 v2 did: open ON the recognizable subject. |
| 2 | thin sky implied to do the work | "the air is far thinner than in the cabin — so cabin air stampedes down that pipe" | **States the physics once, plainly.** Thick air moves toward thin air; that is the whole episode and v3 never said it. |
| 3 | — | "and whatever goes down it rides right under your seat for the rest of the flight" | **REHOOK (option R3), front-loaded at ~6s** instead of the scene-1 tail (~19s was past the 8–12s cliff). Opens the loop everyone actually wonders about — *where does it go?* — and scene 4 pays it off with the truck. v3 answered a question it never asked. |
| 4 | "That rushing air scrubs a bowl slicker than a nonstick pan — so one cup of blue liquid replaces gallons of water" | "The bowl is coated so slick that nothing sticks, so instead of gallons of water, one cup of blue disinfectant rinses it clean" | **Unmuddles the beat.** v3 fused air-scouring and the coating into one loose image, and "blue liquid" was never identified (the first v4 draft kept that — owner flagged it as confusing). Now: the coating is why no water is needed, the liquid is named, and its job (rinse) is stated. |
| 5 | "a roaring pump fakes the sky" | "a roaring pump under the plane makes the suction instead" | **Says what the machine does.** "Fakes the sky" only parses if you already decoded "sky = vacuum". |
| 6 | "every flush rides beneath your feet, sloshing, and lands when you do" | "It stays sealed under the floor, sloshing, until a truck pulls up at the gate and drains the whole flight's worth." | **Cold end is the rehook payoff:** "under your seat" moved up into the hook, so scene 4 spends its line on the lavatory truck — a thing viewers have seen from the window. |

Unchanged from zack mode: one "but" pivot (**65%**, target 38–78%), **0
questions**, **1 number**, cold ending, **no on-screen CTA** (Z.4 — the A/B is
still running; CTA lives in the post caption).

### Scene deltas this rewrite implies (not yet built)

The four existing scenes still carry the narration — the beat tables in §012.5
hold, but these need adding once the v4 take lands and boundaries realign:

1. **`valve`** — grows 14.5s → ~22.5s. Add (a) a **title stamp at f0–9**:
   "300 MPH" / "FLUSH" (v3 has no stamp per Z.1; comprehension overrides it
   here — the `SpeedTicker` can now spool 0→300 under the stamp instead of
   waiting for the pipe beat), (b) a **rehook beat at ~f120–220**: the paper
   plane's cabin cutaway with a seat row, and the belly tank glowing under
   it — chip "UNDER YOUR SEAT" / "ALL FLIGHT" — BEFORE the hand presses
   flush on "Press flush", (c) the valve snap + stampede then run as v3 but
   the ticker is already at 300, so the pipe beat is pure motion. Rescale by
   % per §0.5.
2. **`bowl`** — no new art. The slick-coating gleam sweep now has narration
   pointing at it; keep `CupVsGallons` synced to "one cup … gallons".
3. **`ground`** — no change. Narration now names the pump's job.
4. **`tank`** — the **service truck at the gate** IS the scene now: the
   descent/touchdown compresses into the first ~40%; on "until a truck" a
   papercraft truck rolls in under the belly, hose to the tank on "drains",
   BLUE level drops to empty over the last ~60f. Cold end holds on the
   emptied tank + truck. The hook's seat-row/tank cutaway returns here (loop
   closes visually, like 010's keyhole).

---

## 012.1-v3 ElevenLabs script (superseded 2026-08-22 — kept for reference)

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

**[v4 — 2026-08-22]**

| id | label | step | ~sec | opener (first 3 words — align keys) |
| --- | --- | --- | --- | --- |
| `valve` | THE VALVE | 0 | ~22.5 | "An airplane toilet" |
| `bowl` | THE BOWL | 1 | ~13 | "The bowl is" |
| `ground` | THE GROUND | 2 | ~10 | "But on the" |
| `tank` | THE TANK | 3 | ~10 + hold | "That tank never" |

All four openers now diverge at **word 1** ✓ (v3's "That rushing…" /
"That tank…" only diverged at word 2). `HAS_NARRATION = false` until
the take lands. Manifest: `theme: THEMES.papersky` (v3 re-skin — the
`flightlab` line here is stale), `chrome: { headerTop: 280, stepperTop: 352,
instantEnter: true }`.

## 012.3 Design language (v3 `papersky` law — unchanged in v4; the colour table below is the flightlab-era original, see `kit.tsx` for the live constants)

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

## 012.4 Episode kit — `scenes/kit.tsx` **[v4 — icon objects, 2026-08-22]**

Objects are Fluent Emoji flat glyphs from `src/icons/registry.json`,
recolored to the paper law and rigged per piece (CLAUDE.md icon rule).
Hand-drawn SVG survives only for geometry: pipes, arrows, liquid, the hull
ring, and the side-view `PaperPlane` (its window row is the dive target).

| Component | Source | Draws |
| --- | --- | --- |
| `Lavatory` | `toilet` | The toilet: rim + pedestal in METAL, tank + bowl white, INTERIOR bowl cavity, RUSH flush pill on the tank top, INK valve flap at the pedestal foot, optional pipe stub (`pipe.to`, icon units) with a RUSH `pulse`. Landmarks in `LAV` (icon units): `bowl`, `drain`, `button`, `wall` (the gleam/ribbon path). |
| `HandPress` | `backhand-index-pointing-down` | Paper-skin hand; fingertip at `HAND_TIP × size`. |
| `Droplet` | `droplet` | BLUE drop — bowl contents in S1, "nothing sticks" in S2. |
| `Buckets` | `bucket` ×6 | "Gallons" — white buckets, METAL rims, stack in / fall away. |
| `PaperCup` | hand-drawn | One cup of BLUE; `tilt` + `level` for the pour. |
| `SeatRow` | `seat` + `bust-in-silhouette` ×5 | Seat row with passengers; `highlight` rings one seat in RUSH. |
| `PlaneCutaway` | `PaperPlane` (near wall + near wing removed) + `SeatRow` + `toilet` | **The half-cut plane seen from outside** — one object for the rehook (S1), the belly zoom (S2) and the gate drain (S4): opening in the fuselage side, cabin floor, seat row with passengers, the lavatory at the back with its pipe down to the sealed tank under the floor (paper-wave liquid, hatch on the underside). `highlightSeat`/`lit` (arrow into the tank), `glow`, `flash`, `sealed`, `hatchOpen`, `pulse` (RUSH dash lav → tank), `onGround`. Landmarks in `CUT` (PLANE_VB units). Owner direction 2026-08-22: show the whole plane and zoom into the belly rather than a ring cross-section. |
| `ServiceTruck` | `delivery-truck` (flipped) | The lavatory truck: white box, METAL_DARK cab, INK wheels; `load` fills the box BLUE_DEEP. `TRUCK_NOSE` = hose port. |
| `PaperCloud` | `cloud` | Two white paper layers. |
| `Chip` / `Stamp` | — | White paper labels, bold sans. `Stamp` = the f0 title card (RUSH number + noun). |
| `ValveVoid` | hand-drawn + `cloud` | The window onto the sky at altitude: navy overhead → sky blue below, a cloud far beneath, six lonely air dots (owner: the plain navy panel did not read as "outside"). |
| `AirField`, `PumpUnit`, `SkyStage`, `SetPanel`, `PaperPlane` (now with `nearWing` / `windows` / `cut` props) | hand-drawn | unchanged from v3. |

## 012.5 Scene direction **[v4 — retimed to the 2026-08-22 take; timing.json sceneSeconds 20.62 / 13.30 / 10.64 / 11.41]**

Frame numbers are scene-local and keyed to whisper word starts (see
`timing.json`). Hard cuts only (Z.2).

### valve — THE VALVE · 619f
| f | % | Beat |
| --- | --- | --- |
| 0–124 | 0–20% | **EXT.** `SkyStage` + four `PaperCloud`s, `PaperPlane` in cruise (nose left). `Stamp` "300 MPH / FLUSH" pops f0–9 at y440 — the claim is on screen before it is spoken. On "300" (f61): three RUSH speed lines trail the tail, gone by f124. |
| 125–275 | 20–44% | **REHOOK — hard cut.** `PlaneCutaway` w900 (the half-cut plane from outside), camera eases in 1→1.4 on the opening f125–190. f158–176 seat #3 lights (`highlightSeat=2`, `lit`) with a RUSH arrow down through the floor into the tank; f186–206 the tank `glow`s. Chip "UNDER YOUR SEAT" (RUSH) f182 at y1138; chip "FOR THE WHOLE FLIGHT" f226 at y1222. |
| 276–619 | 45–100% | **INT — hard cut on "Press"** with a 10f punch-in (0.86→1). INTERIOR `SetPanel`; `AirField` cabin (left, dense), METAL hull strip, `ValveVoid` (right). `Lavatory` (unit 13) with its pipe stub running through the hull into the void. `HandPress` already descending at the cut; press lands f290 on "flush", releases to 0.3, leaves f332–356. Valve snaps f314–336 ("valve opens"). Void reveals f346–392 ("to the sky"). Chips "THICK AIR" (f401, over the cabin) / "THIN AIR" (f411, over the void) on "far thinner"; fade f530–548. ★ **Stampede** from f478 ("stampedes"): `AirField` sink = bowl, streaks ramp to f540, pipe RUSH pulse f500+, cabin density 0.92→0.55 over f560–619. Three `Droplet`s in the bowl are dragged down the drain f556–606 ("everything in the bowl goes with it"). |

### bowl — THE BOWL · 399f
| f | % | Beat |
| --- | --- | --- |
| 0–100 | 0–25% | INTERIOR panel, `Lavatory` big (unit 17, x110 y600), valve open, white gleam chasing `LAV.wall` continuously. f30/52/74 three `Droplet`s fall onto the bowl wall and slide straight off into the bottom ("nothing sticks"). |
| 108–170 | 27–43% | `Buckets` stack in (f108–140) at x660 y600, chip "GALLONS" y836; they tumble away f131–170 ("instead of gallons of water"). |
| 168–272 | 42–68% | `PaperCup` pops where the buckets were (f168), chip "ONE CUP" (BLUE_DEEP); carries over to the bowl f186–214, tilts to −62° f205–232, BLUE stream into the bowl f212–254; BLUE ribbon laid around the wall f224–262 ("rinses it clean"); cup fades f256–272. |
| 272–399 | 68–100% | **Hard cut to the WHOLE plane** (`PlaneCutaway` w880 at (100, 720), sky + clouds). A RUSH `pulse` runs from the lavatory down its pipe into the tank f276–350 while the camera zooms 1→3.6 into the belly (origin = tank centre) f284–336. Slam flash f333–352, fill 0→0.55 f334–372, hatch seals f348–356, slosh from f338. Hold on the full-frame tank. |

### ground — THE GROUND · 319f
| f | % | Beat |
| --- | --- | --- |
| 0–96 | 0–30% | **Pivot — hard cut on "But."** `PaperPlane` `onGround` at the gate (y478), tarmac band y640–700, jet bridge. INTERIOR cutaway panel y720–1260: cabin `AirField` left / hull / outside `AirField` right at EQUAL density, idle drift only. Small `Lavatory` (unit 5.5) at the left end of a 46px pipe that runs along the panel floor to the `PumpUnit` (x690 y1060 w280). **No orange anywhere.** |
| 96–123 | 30–39% | Chips "THICK AIR" over both sides (f96 left, f114 right) on "just as thick as inside" — scene 1's pair, now identical. |
| 186–268 | 58–84% | `PumpUnit` spins up f186–216 ("roaring pump"), shakes; a VOID pocket grows back along the pipe from the pump f198–268, RUSH streaks inside the pipe only (f196+). |
| 246–319 | 77–100% | Chip "PUMP-MADE SUCTION" (RUSH) y1282 on "makes the suction". Pump holds at full roar to the cut. |

### tank — THE TANK · 342f (cold end)
| f | % | Beat |
| --- | --- | --- |
| 0–95 | 0–28% | `PlaneCutaway` w760 at (40, 660) in descent (pitch −2°, bob), fill 0.6, slosh; two clouds. Chip "NEVER OPENS IN FLIGHT" y470 f22–31 (on "never"), holds to f176. Tank flash f104–124 ("sealed"). |
| 95–180 | 28–53% | Ground rises f95–168 to the wheel line (y≈913); gear out from f130; one bigger swell on "sloshing" (f146–180); touchdown f168 (3px bump, bob stops), pitch levels f150–170, slosh settles f170–210. |
| 185–262 | 54–77% | `ServiceTruck` (170px, facing left) rolls in from x1150 to x740 — behind the tail, clear of the opening — on "a truck pulls up at the gate". Chip fades f176–188. Camera (ground + plane + truck in one group) eases in 1→1.4 around (600, 880) f236–262. |
| 244–342 | 71–100% | Hose draws from `TRUCK_NOSE` to the underside hatch (`CUT.hatch`) f244–258; hatch swings open f246–258 — the one time it does; tank drains 0.6→0.02 and the truck box fills BLUE_DEEP f258–306, BLUE_DEEP dashes running down the hose. **Cold end (Z.4):** hold f306–342 on the half-cut plane, emptied tank, full truck. No CTA chip. |

QA sweep 2026-08-22: full-timeline sequence at 0.25 (pre-cutaway build) +
0.5/0.6-scale stills at f200 / f300 / f430 / f520 / f969 / f1560 / f1660, then
a frame sweep of the delivered final.mp4. Chips/stamps all inside
x65–940, nothing below y1330; captions clear.

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

---

## 013 — Netflix Is a Delivery Company · zack mode (`013-netflix-papersky`)

Papersky re-skin of 004, re-scripted 2026-08-22 as zack-style A/B entry #3.
Scenes are already built and re-timed; only the take is missing. Full spec
and experiment row in `ZACK-STYLE.md`; v1 (004's 94s narration) preserved in
the episode folder as `*.v1.*`.

### 013.1 ElevenLabs v3 script — **RECORDED 2026-08-22** (take `netflix-new-v2`)

Voice Brian · v3 · speed 92 · stability ~26 · similarity 75. Paste as ONE
paragraph — a line break is a pause in v3. No `[pause]` anywhere; the em dash
and colon are gone from the text for the same reason.

> [curious] Netflix runs a warehouse at the end of your street, and tonight's
> show is already on its shelf. [intrigued] That shelf gets stocked like any
> parcel, one enormous file, repacked into every box size, from glorious 4K
> [amused] down to potato. [eager] Each box is chopped into four-second parcels,
> and your TV orders them one at a time, picking a smaller box whenever your
> wifi gets busy. [leaning in] But those parcels never travel far, because
> Netflix hands that warehouse to your internet provider for free, and every
> night it fills up with what your neighborhood will watch tomorrow.
> [delighted] So the show you pressed play on was stocked before you even knew
> you wanted it.

110 words · target 37–43s · curious → intrigued → amused → eager → leaning
in → delighted. The arc rises through the mechanism and drops to a
conspiratorial register on the "but" pivot, then lifts for the cold end — the
same shape 012 v4 used (excited → curious → whisper → mischievous), tuned
curious-first because this episode's hook is a discovery, not a stunt.

**Reading notes for the take**
- Zero silence target (0–2% on `analyze`). The chain words carry the
  continuity: land "shelf." straight into "That shelf", "potato." straight
  into "Each box", "busy." straight into "But".
- If v3 still breathes at the sentence ends, generate 2–3 takes and pick the
  one with the fewest gaps rather than re-tagging — the gap-trim pass caps
  every pause at 120ms anyway.
- Tags are hints, not guarantees, in v3. If a tag is spoken aloud (it
  happens on the free-form ones), swap it for the closest stock tag:
  `[intrigued]`→`[curious]`, `[eager]`→`[excited]`, `[leaning in]`→`[whispers]`,
  `[delighted]`→`[laughs]` (tagged before "So", not after).
- Save the raw take as `narration-untrimmed.mp3`, the trimmed one as
  `narration.mp3`, both in `public/episodes/013-netflix-papersky/`.

**Take result:** raw 41.8s with 6 pauses ≥250ms (biggest 0.66s after
"shelf" and "potato" — v3 still breathes at full stops even with the tags);
capped at 120ms → 39.8s, 0 pauses. `analyze`: 168 wpm, 0% silence, 1 beat,
pivot 61%, claim opener. All four boundaries aligned first pass; sceneSeconds
[6.18, 9.64, 8.37, 11.1, 5.8]. None of the free-form tags were spoken aloud.
