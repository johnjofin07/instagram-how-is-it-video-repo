# Episode 005 — "The Internet Is Lying on the Ocean Floor" · Build Plan

Implementation spec for the scene components. The script (`script.ts`) is
**locked** — do not reword narration (see §1.4). Everything below is the visual
layer.

**Definition of done:** `npx remotion studio` renders all 4 scenes with no
console errors, `npx tsc --noEmit` is clean, and the 4 QA stills pass the
safe-margin check in §6.3.

---

## 1. Hard constraints

### 1.1 Format
- Comp space is **1080×1920 @ 30fps** (`VIDEO` in `src/theme.ts`). All
  coordinates in this plan are comp-space pixels. The master renders at 2×.
- Reel must stay **under 60s**. Narration is 150 words ≈ 54–60s. If
  `timing.json` totals ≥ 59s, trim per the note at the top of `script.ts` —
  do not add scene padding.

### 1.2 Determinism
No `Math.random()` / `Date.now()` anywhere. Any scatter (marine snow, boat
grid) uses the seeded hash pattern already in `src/components/Background.tsx`
(`makeStars`) — copy that `h(n)` idiom.

### 1.3 Theming
Scenes read tokens via `useTheme()`. **Never** import `abyss` directly.
Episode-specific literal colors (silt brown, steel grey) live as exported
consts in `scenes/kit.tsx`, exactly like `KRAFT`/`INK` in
`004-netflix-delivery/scenes/kit.tsx`.

### 1.4 Do not touch the narration strings
`scripts/align.mjs` finds scene boundaries by matching each scene's **first 3
words** against the whisper transcript within ±10 words of a proportional
estimate. The current openers are distinct and safe:

| Scene | Opening words | Risk |
| --- | --- | --- |
| glass | "Cut one open" | clean |
| snap | "What cuts them" | clean |
| fix | "So how do" | clean |

Reword an opener and alignment can silently snap to the wrong word. If the
script must change, re-run `npm run produce` and check the `matched: true`
flags align.mjs logs.

---

## 2. File manifest

Create:
```
src/themes/abyss.ts                          new skin (§3)
src/episodes/005-undersea-cables/scenes/kit.tsx    episode SVG kit (§5)
src/episodes/005-undersea-cables/scenes/Hook.tsx   §7.1
src/episodes/005-undersea-cables/scenes/Glass.tsx  §7.2
src/episodes/005-undersea-cables/scenes/Snap.tsx   §7.3
src/episodes/005-undersea-cables/scenes/Fix.tsx    §7.4
src/episodes/005-undersea-cables/index.ts          manifest (§8.1)
src/episodes/005-undersea-cables/timing.json       GENERATED — stub first (§8.1)
```

Edit:
```
src/themes/index.tsx          register `abyss` in THEMES
src/themes/types.ts           add { kind: "abyss" } to BackgroundVariant
src/components/Background.tsx add the <Abyss/> variant renderer (§4)
src/episodes/index.ts         import + append to EPISODES
src/brand/Cover.tsx           add Cover005 (§8.4)
src/Root.tsx                  add <Still id="cover-005" .../>
```

Never hand-edit `timing.json` after `npm run produce` writes it.

---

## 3. The `abyss` skin — `src/themes/abyss.ts`

Deep-water dark skin. Concept: **the water column is the canvas** — near-black
blue-green, lighter at the very top (surface light) falling to black at the
seabed. Two signal colors carry the whole episode and never swap roles:

- **`accent` cyan = the light inside the glass.** Data, pulses, the fiber, the
  working highlight. Nothing else is cyan.
- **`second` amber = the surface world / human intervention.** Ships, the
  grapnel, hands, deck lights. Amber only ever appears where people are.

That split is the episode's whole visual argument: cold machine light on the
floor, warm human light on top. `warn` red is reserved *exclusively* for
breaks — it appears 3 times total (§7.1 f330, §7.3 f105, §7.3 f318).

Contrast on `bg` #07131C (measured): text 16.4:1 · textDim 8.1:1 · accent
11.0:1 · second 10.6:1 · good 10.1:1 · warn 6.8:1 · brand 12.9:1. `textFaint`
is 3.9:1 — inert chrome only, never information.

```ts
import type { ThemeSpec } from "./types";

export const abyss: ThemeSpec = {
  name: "abyss",

  bg: "#07131C",
  bgLifted: "#0E2432",
  background: { kind: "abyss" },

  line: "rgba(180, 214, 232, 0.24)",
  lineFaint: "rgba(180, 214, 232, 0.10)",
  text: "#E6F1F7",
  textDim: "#93AEBE",
  textFaint: "#5A7688",

  accent: "#38D9E8",
  accentDim: "#1B7F8C",
  accentGlow: "rgba(56, 217, 232, 0.28)",
  second: "#F5B944",
  secondDim: "rgba(245, 185, 68, 0.45)",
  good: "#3FD69A",
  warn: "#F87171",

  brand: "#8FE3F0",
  brandDim: "rgba(143, 227, 240, 0.45)",
  brandGlow: "rgba(143, 227, 240, 0.26)",

  card: "rgba(14, 36, 50, 0.92)",
  cardBorder: "rgba(180, 214, 232, 0.18)",
  cardShadow: "0 14px 40px rgba(0, 12, 20, 0.55)",

  vignette: "rgba(2, 8, 14, 0.72)",

  caption: {
    spoken: "rgba(234, 244, 249, 0.98)",
    unspoken: "rgba(234, 244, 249, 0.30)",
    halo: "0 2px 18px rgba(0, 10, 18, 0.9)",
    font: "mono",
    boxed: false,
  },

  // Heavier than delivery's 12/200/0.7 — things move through WATER. Slower
  // settle, no bounce. This is the episode's signature feel; keep it.
  motion: { damping: 18, stiffness: 130, mass: 1.1 },
};
```

Before finalizing, load the `design-for-ai:color` skill and sanity-check the
hues (CLAUDE.md requires this for any new skin). The values above are
contrast-verified but the skill may tighten the cyan/amber relationship.

---

## 4. Background variant `abyss` — `src/components/Background.tsx`

Add an `<Abyss glowY={...}/>` renderer alongside `Galaxy`/`Blueprint`/
`MapCanvas`/`DepotFloor`, following their exact shape (an `<AbsoluteFill>` +
one 1080×1920 `<svg>`, plus the shared accent-glow fill).

Four layers, back to front:

1. **Water column** — vertical gradient `#12384A` at y0 → `#07131C` at y900 →
   `#03090E` at y1920. This is what sells depth; nothing else needs to.
2. **Surface caustics** — 5 soft light shafts fanning from around x540,y-100
   down to y≈520. Thin skewed polygons, `fill="rgba(143,227,240,0.05)"`, each
   drifting horizontally by `Math.sin(frame * 0.006 + i) * 14`.
3. **Marine snow** — 60 seeded particles (reuse the `makeStars` hash, seed 23),
   r 1–3px, `fill="rgba(214,234,244,0.34)"`, drifting **downward** at
   `0.18px/frame` and wrapped with `% 1920`. Slow — it should read as silt
   falling, not stars.
4. **Seabed** — one silt-brown path across the bottom, crest around y1560,
   gently undulating (`Q` curve), `fill="#1A2A2E"` with a 2px
   `rgba(180,214,232,0.12)` top edge. Purely background: scene art draws its
   own seabed line where it needs one, so this is just depth cueing behind
   the caption zone.

Then the standard accent-glow `<AbsoluteFill>` at `opacity: 0.18` and the
existing shared vignette (already applied by `Background`).

---

## 5. Episode kit — `scenes/kit.tsx`

Mirror `004-netflix-delivery/scenes/kit.tsx`: exported color consts, then
small pure SVG components. Every component takes `style?: React.CSSProperties`
so scenes can absolutely position it.

```ts
export const SILT = "#1A2A2E";      // seabed
export const SILT_LIGHT = "#28403F";
export const SHEATH = "#20323E";    // cable outer plastic
export const STEEL = "#7C93A3";     // armor wire
export const COPPER = "#C07A4A";    // conductor
export const GEL = "#3B5060";       // filler
export const HULL = "#2A3A46";      // ship hull
```

| Component | Props | Draws |
| --- | --- | --- |
| `Cable` | `w`, `h?`, `broken?: number` (0=intact, 1=fully parted), `thickness?` | Horizontal cable: `SHEATH` body with a 2px `STEEL` highlight along the top edge and a 1px dark underline. When `broken > 0`, split at midpoint and translate the two halves apart by `broken * 90`px with a slight `±4°` rotation and frayed 3-line ends. |
| `CableSection` | `d` (diameter), `reveal` (0–1), `dim?: boolean` | Concentric cross-section, outside→in: sheath, 8 `STEEL` wire circles ringed at r=0.34d, `COPPER` tube, `GEL`, then the fiber bundle (8 dots, `accent`, r=0.012d). `reveal` gates rings in sequentially. `dim` drops everything but the core to `opacity 0.22`. |
| `FiberStrand` | `len`, `pulse: number` (0–1 position), `w?` | A 3px `accent` line with a travelling 40px `brandGlow` blob at `pulse`. |
| `Pulse` | `path: string`, `progress`, `count?`, `color?` | N dots evenly spaced along an SVG path via `getPointAtLength`-free math — use `<circle>` on an `<animateMotion>`-free manual param; simplest is a straight-line lerp since all our runs are horizontal. Keep it dumb. |
| `Ship` | `w`, `lights?: boolean` | Side-view silhouette: `HULL` hull, small superstructure, a stern A-frame gantry (needed for the FIX scene). `lights` adds two `second` glows. |
| `Trawler` | `w` | Ship + a trailing net (dashed arc with float dots). |
| `AnchorIcon` | `w` | Classic anchor, `STEEL`. |
| `Grapnel` | `w`, `taut?: boolean` | 5-prong drag hook on a line; `taut` straightens the line and adds a `second` glow. |
| `Island` | `w`, `dark?: boolean` | Small landmass with 3 building blips; `dark` kills the blip lights. |
| `Satellite` | `w` | Body + 2 panels, drawn in `textDim` (deliberately unglamorous). |
| `Chip` | `children`, `color?`, `style?` | Copy 004's `Chip`, restyled: `card` bg, `cardBorder`, mono 28px, `letterSpacing 0.06em`. |
| `Stamp` | `children`, `fontSize`, `rotate?`, `color?` | Copy 004's `Stamp`. Sans, 800 weight, tight tracking. This is the claim type. |
| `DepthGauge` | `h`, `progress` (0–1), `label?` | Vertical rule with ticks at 0/1000/2000/3000/4000 m and a travelling marker. Used only in FIX. |

---

## 6. Layout

### 6.1 Reserved chrome (do not draw scene art here)
- `SectionHeader` — y96, height ~36
- `Stepper` — y176, height ~60 (squares + labels)
- `Captions` — pinned `bottom: 420`, grows upward

### 6.2 The scene band
**All scene art lives in `y 300 → 1370`, `x 65 → 1015`.**
Working center is **(540, 835)**.

### 6.3 QA gate (CLAUDE.md safe margins)
No text or meaning-carrying shape may sit in:
- top 14% → `y < 269`
- sides 6% → `x < 65` or `x > 1015`
- bottom 35% → nothing below `y 1370` except the caption pill

Background gradient/silt may bleed anywhere. A cable *deliberately* runs off
both side edges — that's fine, it carries no text. Verify with:
`npm run still out/qa-005-<scene>.png --frame=N` at the frames listed per scene.

### 6.4 Vertical rhythm (keep consistent across scenes)
| Slot | y | Use |
| --- | --- | --- |
| Claim / stamp | 340–470 | the headline of the scene |
| Sub-chip | 500–560 | qualifier under the claim |
| Stage | 620–1180 | the diagram / animation |
| Closing chip | 1240–1340 | the scene's takeaway, must end **above 1370** |

---

## 7. Scene beat sheets

Frames are **provisional**, computed from the `seconds` estimates in
`script.ts`. After `npm run produce` writes `timing.json`, re-derive every beat
with the `%` column (see §9). Durations below: hook 420f, glass 360f,
snap 360f, fix 570f.

Motion defaults: use `useEnter(delay)` from `src/components/ui.tsx` for entries
(it already pulls `theme.motion`), `interpolate` with a cubic ease-out for
travel: `easing: (t) => 1 - Math.pow(1 - t, 3)`.

---

### 7.1 `Hook.tsx` — THE SEA FLOOR · 420f (14s) · stepIndex 0

> "The internet is lying on the floor of the ocean. Bundles of glass, as thick as a garden hose. Ninety-nine percent of the data between continents goes through one — and every couple of days, one snaps."

**Retention-critical: the claim must be legible by frame 9 (0.3s).** Nothing
may fade in ahead of it. Use `useEnter(2, { damping: 11 })` — an almost-instant
scale pop, not a fade.

| f | % | Beat |
| --- | --- | --- |
| 0 | 0 | Cable is **already** on screen — resting on the seabed line at y1150, running off both edges. No entrance animation. |
| 2–14 | 0–3% | `Stamp` at y360, 3 lines centered: "THE INTERNET" / "IS LYING ON THE" / "FLOOR OF THE OCEAN" — fontSize 62, `text`, with "FLOOR OF THE OCEAN" in `accent`. |
| 20–70 | 5–17% | First `FiberStrand` pulse runs left→right along the cable. Repeats every 45f for the rest of the scene. |
| 75–115 | 18–27% | Garden-hose comparison, right of center at (700, 900): `CableSection d={150}` next to a dashed circle of **identical** diameter labelled "garden hose". Both scale in. `Chip` under: "as thick as a garden hose". |
| 130–170 | 31–40% | Two continent silhouettes slide in from the far edges at y980, partially off-frame (they carry no text, so the 6% side rule doesn't apply). Cable now visibly spans between them. |
| 175–235 | 42–56% | `CountUp to={99}` at y470, fontSize 130, `accent`, mono, with a 70px "%" — plus `Chip` "of all data between continents" at y620. Pulses stream continuously. |
| 240–320 | 57–76% | Hold. Pulse cadence tightens to every 22f (traffic building). |
| **330** | **79%** | **THE SNAP.** Cable parts at x≈540: `broken` interpolates 0→1 over f330–348. Single `warn` flash (opacity 0→1→0 across 10f) at the break. All in-flight pulses stop dead at the gap edge and stack up. |
| 350–380 | 83–90% | `Chip` at y1280 (`warn` border): "every couple of days". |
| 380–420 | 90–100% | Hold on the broken cable, ends drifting apart another 12px. **This is the curiosity-loop image — do not resolve it.** |

QA still: **f=9** (claim legibility) and **f=345** (the snap).

---

### 7.2 `Glass.tsx` — THE GLASS · 360f (12s) · stepIndex 1

> "Cut one open — it's almost all armor. Inside, a few strands of glass, thinner than your hair. That's the internet — carrying more data than every internet satellite in orbit."

Dense scene, short duration. Resist adding a fifth idea.

| f | % | Beat |
| --- | --- | --- |
| 0–30 | 0–8% | `CableSection d={520}` centered at (540, 840), `reveal` 0→1. Reads as the cable turning to face camera. |
| 30–110 | 8–31% | Four leader-line labels pop in 20f apart, alternating left/right of the section, mono 26px `textDim`: "plastic" (f30) · "steel wire" (f50) · "copper" (f70) · "gel" (f90). Leader lines are 1.5px `lineFaint`. **Only four** — the real cable has more layers; four is what reads at this size. |
| 115–145 | 32–40% | Everything but the core drops to `opacity 0.22` (`dim` prop). `Stamp` y400: "almost all armor". |
| 150–200 | 42–56% | Magnifier inset: a circle (r 170) at (540, 840) scales in showing the 8 fiber dots enlarged. **Use an inset, not a camera zoom** — deterministic and cheaper. |
| 200–245 | 56–68% | Inside the inset, one fiber isolates as a vertical `accent` line, 3px wide. A human hair draws in beside it at 5px, `textDim`. `Chip` at y1240: "thinner than your hair". The hair being visibly *thicker* is the whole gag — keep the 3px/5px ratio exact. |
| 245–285 | 68–79% | `Stamp` y400 swaps to "that's the internet" (crossfade, 12f). Pulses fire down the isolated fiber. |
| 285–360 | 79–100% | Satellite comparison, bottom band: two horizontal bars growing from x180. Top bar `accent`, full width to x900, label "one cable". Bottom bar `textDim`, width ~140px only, label "every internet satellite" with a small `Satellite` glyph. Bars at y1230 and y1310 — **both must end above y1370.** No numbers; the length ratio is the argument. |

QA still: **f=130** (armor dim) and **f=340** (bars, bottom margin).

---

### 7.3 `Snap.tsx` — THE SNAP · 360f (12s) · stepIndex 2

> "What cuts them is us. Anchors. Fishing nets. You never notice — your data just reroutes down another cable. Unless your country only has one. A volcano cut Tonga's. Five weeks offline."

The reroute (f150–240) is the mechanism beat and the most satisfying moment —
give it room, cut elsewhere if you must.

| f | % | Beat |
| --- | --- | --- |
| 0–30 | 0–8% | Wide shot: seabed at y1150, **three** parallel cables at y1060 / y1150 / y1240 (the middle one is "yours"). Pulses running on all three. |
| 20–50 | 6–14% | `Ship` w=200 enters top at (600, 330). `Stamp` y400: "what cuts them is us". |
| 55–105 | 15–29% | Anchor drops from the ship on a chain, descending (600,400)→(600,1130) with ease-out. |
| **105** | **29%** | Anchor catches the middle cable → `broken` 0→1 over 12f, `warn` flash. Pulses on that cable die at the gap. |
| 110–150 | 31–42% | `Trawler` sweeps in from the left at y360 with its net trailing — a second cause, shown small and fast. `Chip` "anchors · fishing nets" at y500. |
| 150–240 | 42–67% | **REROUTE.** A pulse approaches the break, stops, then bends **down** to the third cable via a curved path and continues right without slowing. Repeat 3×, ~28f apart. `Chip` in `good` at y1300: "you never notice". |
| 240–300 | 67–83% | The two spare cables fade out (opacity→0 over 20f), leaving one cable running to a small `Island` at (820, 1090). `Stamp` y400 swaps to "unless you only have one". |
| **318** | **88%** | Volcano puff above the island (3 expanding `textDim` circles), the single cable breaks, `warn` flash, `Island dark` — its blip lights go out. |
| 330–360 | 92–100% | `Stamp` y1250 in `warn`, fontSize 60: "5 WEEKS OFFLINE". Ends at y≈1320 — clears the caption. |

QA still: **f=200** (reroute) and **f=350** (Tonga card, bottom margin).

---

### 7.4 `Fix.tsx` — THE FIX · 570f (19s) · stepIndex 3 (`allDone` on the stepper)

> "So how do you fix one, four kilometres down? A boat drags a giant hook along the sea floor, fishing blind, hauls both ends on deck — and a person welds the glass back together by hand. Sixty boats. For the whole planet. What system should I break down next?"

The longest scene and the payoff. Two images have to land: **fishing blind in
the dark**, and **a human hand splicing glass**. Everything else is transit.

| f | % | Beat |
| --- | --- | --- |
| 0–40 | 0–7% | `Ship` w=260 at (540, 330), `lights` on. `DepthGauge` down the left at x=130, y320→1180. Broken cable still on the seabed at y1160. `Stamp` y430: "four kilometres down". |
| 45–160 | 8–28% | Grapnel lowers from the ship on a line, y400→y1120, **slow** ease-in-out — this is the beat that sells depth. `CountUp to={4000}` on the gauge marker, mono 34px `second`, suffix " m". |
| 160–255 | 28–45% | Hook drags left→right along the seabed, x260→x820, kicking small silt puffs (3 seeded circles, opacity decaying). `Chip` y560: "fishing blind". Dashed `lineFaint` search arc trails behind it. |
| **255–270** | **45–47%** | **Snag.** Line goes taut (`Grapnel taut`), hook + cable end jerk up 20px, `second` glow pulse. |
| 270–350 | 47–61% | Both cut ends haul upward toward the ship — two cable ends rise y1120→y460 on curved paths. Optional authenticity detail if time allows: the first end parks on a small marker buoy at the surface while the second is recovered. |
| 350–370 | 61–65% | **Cut to the deck.** Hard cut, not a transition: everything above fades out over 8f and the deck view fades in over 8f. Amber-lit (`second` glow at 0.25) — the only warm-dominant frame in the episode. |
| 370–470 | 65–82% | Deck close-up centered at (540, 880): two cable ends entering from left and right, sheath stripped, **8 fiber pairs** exposed. Two simple gloved hand shapes (silhouette, `HULL` with a `second` rim light). Fibers fuse **one at a time**, 10f apart, each with a 4f white spark flash at the joint. `Stamp` y440: "by hand". This is the money shot — hold the last fusion for 15f. |
| 470–520 | 82–91% | Pull back. `CountUp to={60}` at y420, fontSize 120 `second`, plus 60 tiny `Ship` glyphs (w=42) in a 10×6 grid at y620–1000, popping in staggered 2f apart (seeded jitter of ±3px so it doesn't read as a spreadsheet). `Chip` y1080: "for the whole planet". |
| 520–570 | 91–100% | Grid fades to 0.3. Repaired cable redraws across y1180 and a pulse runs its full length in `accent`. Closing `Stamp` y1260, fontSize 46: "held together by sixty boats" — ends at y≈1330, clears the caption pill. |

QA still: **f=420** (the splice) and **f=545** (closing line, bottom margin).

---

## 8. Build order

**STATUS: §8.1 and §8.2 are DONE.** The skin, background variant, kit and all
four scenes are built and a full-length test render at 1710 frames completes
clean. What remains is §8.3 (narration + timing) and §8.4 (cover + QA).

Deviations from this plan, made after looking at rendered stills:
- `Cable` halves are drawn with square inner ends — rounded ones pinched at the
  midpoint and an intact cable looked pre-broken.
- Parted halves tilt 1.2°, not 4°. Rotating a 1200px bar about the break threw
  the far ends 42px and the whole sea floor looked hinged.
- `SeabedLine` fills to the bottom of frame; at 200px tall it read as a ledge
  floating above the background's own seabed.
- Caustic shafts use a fading gradient — a flat fill cut off in a hard line
  across the frame at y520.
- The deck (§7.4 f350) paints an opaque panel first. Dissolving over the water
  left the caustics visible and the cut never landed.
- Fleet stagger is 0.5f, not 2f: 60 ships x 2f ran past the end of the scene,
  so the grid never finished appearing.
- Hook scene: the claim and the 99% stat share one headline slot and crossfade,
  rather than stacking two blocks.

Second round of deviations, from a FULL-timeline frame sweep (render the
episode as a JPEG sequence, read every beat + transition — spot stills missed
all of these):
- Crossfade collisions: any two blocks sharing a screen slot must be hard-
  sequenced (out fully, ~6f gap, then in). The hook's claim/99% swap and the
  fix deck/fleet swap both superimposed at half-opacity before this.
- The grapnel line now hangs from a single `hookX`/`hookTop` source of truth
  and shrinks during the haul; the recovered ends hang FROM the hook in a V
  (they used to levitate on their own while the floor cable stayed put).
- The drag stops AT the cut end (x640), not past it.
- Snap heals the middle cable (240-254) before the volcano breaks it — it used
  to show the island's "only cable" already snapped from the anchor beat.
- The island sits ON its cable (was floating 40px above); volcano puffs rise
  from the island surface (were disconnected mid-water).
- Cable contrast: steel top edge 4px @ 0.85, accent core 4px @ 0.75 — at
  delivery scale the old values read as faint dark bars.
- Fleet grid renders inside `filter: brightness(2)` and end-dims to 0.45, not
  0.3 — HULL-colored ships were invisible on the water column.

Gotcha worth remembering: `RiseIn` spreads its `style` prop AFTER its own
`opacity`, so passing `opacity` to it silently disables the entrance gate. Put
the extra opacity on an inner `<div>`.

### 8.1 Wire the skeleton first (get it rendering before drawing anything)
1. `src/themes/abyss.ts` + register in `THEMES` + add `{ kind: "abyss" }` to
   `BackgroundVariant`.
2. `Background.tsx` — the `<Abyss/>` variant.
3. Stub `timing.json` so the episode loads before any audio exists:
   ```json
   { "sceneSeconds": [14, 12, 12, 19], "sceneCaptions": [[], [], [], []] }
   ```
4. Four placeholder scene components (just a `<Stamp>` with the scene name).
5. `index.ts` manifest — copy `004-netflix-delivery/index.ts` exactly, swapping
   slug `005-undersea-cables`, title `"The Internet Is Lying on the Ocean Floor"`,
   `theme: THEMES.abyss`, `audioPath: "episodes/005-undersea-cables/narration.mp3"`,
   `hasNarration` from `script.ts` (currently `false`).
6. Append to `EPISODES` in `src/episodes/index.ts`.

**Checkpoint:** `npm run studio` shows a `005-undersea-cables` composition,
57s long, dark water background, stepper reading SEA/GLASS/SNAP/FIX.

### 8.2 Kit, then scenes
Build `kit.tsx` (§5) against a scratch composition, then scenes **in narrative
order** — Hook first, since its `Cable`/`FiberStrand`/`CableSection` usage
defines the visual language the other three reuse.

### 8.3 Audio + timing
1. Record narration in the ElevenLabs **web UI** (`npm run tts` needs a paid
   plan): voice Brian "Relatable Everyman", **v3, speed 92, stability 26,
   similarity 75** — unchanged for voice consistency.
2. Save to `public/episodes/005-undersea-cables/narration.mp3`.
3. Set `HAS_NARRATION = true` in `script.ts`.
4. `npm run produce -- 005-undersea-cables`.
5. **Check the total.** If `timing.json` sums to ≥59s, trim per §1.1 and
   re-record rather than shipping a 61s "short".
6. Retune beats per §9.

### 8.4 Cover + QA
- `Cover005` in `src/brand/Cover.tsx` following the `Cover004` pattern, plus a
  `<Still id="cover-005">` in `Root.tsx`.
- Watch `out/005-undersea-cables/final.mp4` end to end before publishing —
  this is the QA gate, not optional.
- Update `CONTENT.md`: flip 005 to ✅ Produced with date, voice settings,
  duration, and skin.

---

## 9. Post-timing retune checklist

`align.mjs` will shift every scene duration. For each scene:

1. Read the real duration: `timing.json → sceneSeconds[i] * 30` frames.
2. Rescale every beat: `newFrame = round(pct * newDuration)` using the `%`
   column in §7.
3. **Then hand-check the tail of each scene** — per CLAUDE.md, late-scene
   elements are where drift bites. Specifically confirm:
   - Hook: the snap still lands at ~79% with ≥40f of hold after it.
   - Glass: both comparison bars are fully grown before the scene ends.
   - Snap: "5 WEEKS OFFLINE" has ≥25f on screen.
   - Fix: all 8 fusions complete before the pull-back at 82%.
4. Re-shoot the 8 QA stills listed in §7 and re-check §6.3 margins.

---

## 10. Deliberately out of scope

Cut from the script for the 60s limit; **do not smuggle them back in as
visuals** — they're the seed for a follow-up episode (see CONTENT.md backlog
"Cable cuts & the shark myth"):

- the shark-bite myth and Google's kevlar armoring
- cable-laying at walking pace; lying bare on the mud with no trench
- repeaters every ~50km on thousands of volts from a beach hut
- the 150–200 faults/year figure
