# Episodes 007–010 — Build Plans

Self-contained build specs for the next four episodes. Each topic section has
everything needed to build that episode alone: the locked narration (as an
ElevenLabs-ready script), the `script.ts` scene split, the skin/design spec,
the episode SVG kit, and scene-by-scene direction with beat tables.

**Execution model: 5 Opus subagents in parallel** — see §0.0 for the roles,
file-ownership matrix, and phase gates. Every agent must read §0 (global
rules) + its own assignment + the "deviations" lists in
`src/episodes/005-undersea-cables/plan.md` §8 — those are hard-won lessons
(crossfade collisions, entrance-gate gotchas, contrast at delivery scale) that
apply to every episode. `006-black-box` is the freshest reference
implementation: copy its chrome offsets, manifest shape, and cover pattern.

Scripts are **LOCKED (v2 — re-locked 2026-08-20)** — reworked around the hook
framework in §0.7 (title hook + visual hook + verbal hook + rehook + pattern
interrupt) with simpler wording ("cold spots" not "dead zones", "dummy" not
"placebo"). Do not reword narration. If a recorded take runs long, use the
per-episode trim list, then re-record.

> **STATUS — THIS IS NOW A RETROFIT PLAN.** Phases A–C of the original build
> are DONE: all four episodes compile with real kits, scenes, and covers,
> built against the v1 scripts. The work remaining is retrofitting the v2
> scripts and design changes into the built scenes. Every section below has
> been updated in place to v2 — the scene tables and beat tables ARE the
> current spec. Execution model for the retrofit: §0.7.3.

---

## 0. Global rules (apply to all four episodes)

### 0.0 Parallel execution — 5 subagents, ownership & phases

The four episodes are independent EXCEPT for five shared files. The split
below makes the parallel phase conflict-free: **Agent F owns every shared
file; Agents 1–4 never touch a file outside their own episode folder.**

| Agent | Owns | Deliverable |
| --- | --- | --- |
| **F — Foundations & Integration** | `src/themes/inkwell.ts`, `src/themes/lobby.ts`, `src/themes/index.tsx`, `src/themes/types.ts` (no changes expected — both new skins use `plain`), `src/episodes/index.ts`, `src/Root.tsx`, `src/brand/Cover.tsx` | Phase A: both new skins + all four episode skeletons compiling. Phase C: all four covers, cross-episode QA, CONTENT.md updates. |
| **1 — Watermark** | `src/episodes/007-ai-watermark/**` only | kit + 5 scenes per §007 |
| **2 — Microwave** | `src/episodes/008-microwave/**` only | kit + 5 scenes per §008 |
| **3 — Headphones** | `src/episodes/009-noise-cancel/**` only | kit + 4 scenes per §009 |
| **4 — Elevator** | `src/episodes/010-elevator/**` only | kit + 5 scenes per §010 |

**Phase A — Agent F alone (serial, ~one pass).** Create `inkwell` + `lobby`
(load `design-for-ai:color` once, validate both palettes in the same pass),
register them in `THEMES`; then for EACH of the four episodes: folder,
`script.ts` (narration from this plan, `HAS_NARRATION = false`), stub
`timing.json` (sceneSeconds from the scene tables, empty captions),
placeholder scenes (a `Stamp` with the scene name), `index.ts` manifest
(copy 006's; slugs/titles/themes/steps from each episode header), and the
`EPISODES` + `Root.tsx` registrations. **Gate: `npx tsc --noEmit` clean and
all four compositions visible in studio with correct steppers.** Nothing else
starts until this lands.

**Phase B — Agents 1–4 in parallel.** Each replaces its placeholders with the
real kit + scenes. Hard rules: (a) never edit outside your episode folder —
if a shared component seems to need a change, copy the pattern into your kit
instead and report the finding; (b) skins/tokens are read-only — episode
literals go in your `kit.tsx`; (c) chrome offsets: copy 006's lowered-chrome
pattern into your scenes; (d) finish with your episode's QA stills (§0.5.2)
and `npx tsc --noEmit`. If running as isolated worktrees, each agent's diff
must contain ONLY its episode folder — anything else fails review.

**Phase C — Agent F again (serial).** Merge/review the four diffs, add
`Cover007–010` + Stills (the one shared-file step left), run the batch QA
still pass across all episodes, and update `CONTENT.md` statuses to
✍️ Scripted/built. Audio recording (web UI, manual) and `npm run produce`
happen per episode AFTER Phase C — followed by each episode's post-timing
retune (§0.5.4), which can again run as four parallel agents with the same
ownership rules.

### 0.1 Format & pipeline
- Comp space **1080×1920 @ 30fps**; all coordinates below are comp-space px.
  Delivery is handled by `npm run produce` (supersampled master → 1440×2560).
- Pipeline per episode: build scenes with a stubbed `timing.json` → record
  narration in the **ElevenLabs web UI** (free tier blocks library voices via
  API — verified 2026-08-20) → save to
  `public/episodes/<slug>/narration.mp3` → `npm run produce -- <slug>`.
- **Voice (channel constant, never change):** Brian "Relatable Everyman",
  model **v3**, speed **92**, stability **26**, similarity **75**.
- The `[bracketed]` tags in each ElevenLabs script are v3 audio tags — paste
  them with the text into the web UI. They are performance directions only:
  **`script.ts` narration strings must be the same text WITHOUT the tags**
  (whisper never hears the tags, and align.mjs matches transcript words
  against `script.ts`).

### 0.2 Alignment (do not break this)
`scripts/align.mjs` finds scene boundaries by matching each scene's **first 3
words** against the whisper transcript. Every scene split below was checked
for distinct openers — if you reword an opener, alignment can silently snap to
the wrong word. After `npm run produce`, confirm the `matched: true` flags in
its log.

### 0.3 Safe margins (QA gate — CLAUDE.md is the authority)
- Top: no text `y < 269`. Use the **lowered chrome** pattern from 005/006:
  header at y≈280, stepper at y≈352 (read `006-black-box` scenes for the
  current implementation — do NOT copy the old y96/y176 shared-Chrome layout).
- Sides: no text `x < 65`; in the band `y 1186–1788` text must end `x ≤ 940`
  (IG action rail). Non-text art may bleed to the edges; IG crops `x<35` and
  `x>1047` on-device.
- Bottom: captions sit at `bottom: 420` (pill bottom = y1500, exactly on YT's
  line). Scene-closing headlines/chips must end **above y≈1370**.
- Scene art band: **y 440 → 1370, x 65 → 1015** (text ≤ 940 in the rail band).
  Working center ≈ (540, 900).
- Vertical rhythm: claim/stamp 450–590 · sub-chip 610–670 · stage 700–1180 ·
  closing chip 1240–1340.

### 0.4 Determinism & theming
- No `Math.random()` / `Date.now()`. Scatter uses the seeded `makeStars` hash
  idiom from `src/components/Background.tsx`.
- Scenes read tokens via `useTheme()` — never import a skin directly.
  Episode-literal colors live as exported consts in that episode's
  `scenes/kit.tsx` (the `KRAFT`/`INK` pattern from 004).
- New skins (007's `inkwell`, 010's `lobby`): implement every `ThemeSpec`
  token, register in `THEMES`, and **load the `design-for-ai:color` skill
  before finalizing hex values** (CLAUDE.md requirement). Both new skins use
  `background: { kind: "plain" }` deliberately — zero `Background.tsx`
  changes; atmosphere comes from the scene kits. 008 and 009 reuse existing
  skins entirely.
- No IP imitation: episode 007 names Anthropic/Claude in narration (fine —
  it's news) but draw **no logos** (no Anthropic wordmark, no Claude spark).
  Represent Claude as a neutral rounded "AI chip" glyph from the kit.

### 0.5 QA (definition of done, per episode)
1. `npx tsc --noEmit` clean; studio renders all scenes without console errors.
2. QA stills listed per scene pass §0.3 margins (batch them in one pass).
3. After produce: **full-timeline JPEG-sequence sweep** — render the episode
   as a frame sequence and read every beat AND every transition. Spot stills
   miss broken motion (this caught 7 bugs in 005).
4. Post-timing retune: rescale every beat via its `%` column to the real
   `timing.json` durations, then hand-check each scene's TAIL (late elements
   are where drift bites).
5. Watch `out/<slug>/final.mp4` end to end. Then update `CONTENT.md`.
6. Cover still: `Cover00N` in `src/brand/Cover.tsx` + `<Still>` in `Root.tsx`.

### 0.6 Numbering & publishing order
Sequential build numbering: 007 watermark · 008 microwave · 009 headphones ·
010 elevator. **Ship 007 first** — its hook is news-pegged ("since August")
and dies after the news cycle. Then interleave for publishing: a machines
episode next (008), and put 005 (tech, produced) between machines episodes as
needed.

### 0.7 Hook framework — the v2 retention devices (2026-08-20)

Every episode carries five devices. When retrofitting, verify each one lands
exactly as specced in that episode's section:

1. **Title hook** — the f0–9 `Stamp`. Near-instant pop (damping ~11), no
   fade-ahead. Text per episode section.
2. **Visual hook** — frame 0 opens **mid-action on the episode's money
   visual**, never on a build-up. The viewer must see something already
   happening before they can blink.
3. **Verbal hook** — the first spoken sentence: a claim or a direct question.
4. **Rehook** — one line at the END of the hook scene (~8–12s in, right at
   the retention cliff) that opens a loop paid off in the **final** scene, so
   the loop spans the whole video.
5. **Pattern interrupt** — ONE hard tonal/visual break at 45–60% of runtime:
   whisper + dim/blackout/stillness/direct address. Deliberately a different
   flavor per episode so the channel doesn't feel formulaic.

| Ep | Verbal hook | Rehook (→ payoff scene) | Pattern interrupt (~where) |
| --- | --- | --- | --- |
| 007 | "Did you know…" question | "one embarrassing flaw… already failing students" → `catch` | "Wait. [whispers] Come closer." — stage dims to deep umber, coin alone (~48%) |
| 008 **[v3]** | claim ("your microwave can make real lightning — all it takes is a fork"; no spoken deferral — the "saved for last" chip holds the loop open → `spark`, so the MAIN hook is the video-long loop) | cold spots + "the real reason the plate spins" → `waves`/`spin` (mid-video engine; deliberate deviation from the pay-off-in-final rule — the main hook covers that job) | "Don't believe me?" challenge + snap cut to the cheese proof (~50%) |
| 009 | direct question | "the one sound they can never erase" → the baby | **literal silence**: narration stops, SUM flatlines, ~60f of total stillness (~55%) |
| 010 | "It's a dummy" | "works for exactly one person — wait till you see who" → firefighter key | "[whispers] look —" hard cut to the buttonless brass wall (~55%) |

#### 0.7.3 Retrofit execution — same 5 agents, same ownership matrix (§0.0)

- **Phase R1 — Agent F alone (serial).** Rework `src/themes/inkwell.ts` to
  the cream/brown "Claude desk" palette — §007.3 holds the v2 tokens,
  **already contrast-validated, copy them verbatim**. Nothing else in shared
  files changes. Gate: `npx tsc --noEmit` clean; 007 renders in studio on the
  light skin (its scenes will look broken/washed — fixing that is Phase R2,
  Agent 1's job).
- **Phase R2 — Agents 1–4 in parallel.** Each agent, own episode folder ONLY:
  (a) update `script.ts` narration strings to the v2 text **minus the
  bracketed v3 tags** (§0.1 rule); scene ids, order, and manifests are
  unchanged; (b) apply its episode's beat-table changes — every changed
  row/table below is marked **[v2]**; (c) 007 additionally retunes every
  scene's colors/contrast to the light skin (§007.3 v2 + §007.4 kit consts);
  (d) re-run the episode's QA stills (§0.5.2) + `npx tsc --noEmit`.
- **Phase R3 — Agent F (serial).** Covers: 007's cover adopts the new skin +
  title; 008/010 cover text changes (§008.6/§010.6). Cross-episode QA still
  batch. `CONTENT.md`: update the four titles/hooks to v2.
- **After audio lands (manual, per episode):** save MP3 →
  `npm run produce -- <slug>` → post-timing retune by `%` (§0.5) → full
  JPEG-sequence sweep → watch `final.mp4`. Openers changed in all four
  episodes — confirm `matched: true` for every scene in the align log.
- ⚠ 009 `zero` scene: the pattern interrupt is ~2s of narration silence
  mid-scene. align.mjs finds scene STARTS (unaffected), but confirm the
  caption builder doesn't render an empty karaoke line across the gap.

#### 0.7.4 CTA is on-screen only (v2)

The spoken "What system/machine should I break down next?" line was CUT from
all four recordings. **Remove it from every `script.ts` narration string**
(align would otherwise hunt for words that are never spoken in the final
scene). The comment-bait CTA survives as a closing `Chip` shown during each
final scene's end hold (`allDone` stepper beat): "what system should I break
down next? ↓" (007) / "what machine should I break down next? ↓" (008–010).
Styling: theme `card` chip, `textDim`, ends above y1370. Final scenes lose
~2s of audio — the post-timing retune (§0.5.4) absorbs it, but check each
final scene's tail beats still fit.

---
---

# EPISODE 007 — AI Text Watermarking

**"Anthropic Is Watermarking Your Text"**

| | |
| --- | --- |
| Slug | `007-ai-watermark` |
| Pillar | Tech system (CTA: "What **system** should I break down next?") |
| Skin | **`inkwell` v2 — cream/brown "Claude desk"** (light editorial / heat-develop reveal; §007.3) |
| Length | ~220 words ≈ **83–88s** (deliberately over 60s: ELI5 pacing spends the buffer AFTER the 10s retention cliff) |
| Stepper | `MARK / LAW / COIN / COUNT / CATCH` |
| Urgency | ⚠️ News-pegged (Aug 2, 2026). Build this one first. |

## 007.1 ElevenLabs script (copy-paste, v3 tags included)

```
Did you know Anthropic has been watermarking your text? [pause] Since August, everything Claude writes carries a hidden signature. You can't see it. Copy-paste won't remove it. [curious] The trick is genius. But it has one embarrassing flaw — [pause] and it's already failing students.

A new law in Europe says: if a computer wrote something, people should be able to find out. So since August second, every new Claude model leaves a secret mark inside its own writing. Not just in Europe — [pause] everywhere.

So… how do you hide a mark inside words? When Claude writes, it often has two words that both work. "The cat sat on the mat"… or the rug. Both fine. So it flips a coin to pick. [pause] Wait. [whispers] Come closer. The coin is rigged. [pause] It lands on one side more often than it should.

One rigged flip looks totally normal. But Claude writes hundreds of words — hundreds of rigged flips. And they add up. [excited] A detector that knows the trick counts them and goes: "Too many heads. No human writes like this. [pause] This was Claude."

But the trick has weak spots. A short text? Not enough flips to count. Rewrite it in your own words? The mark washes away. And the official counting tool isn't even out yet. [pause] So that AI checker that failed someone's essay? [amused] It was guessing. [pause] There's the flaw.
```

**[v2] No spoken CTA** — the audio ends on "There's the flaw." The CTA is
on-screen only (§0.7.4): closing `Chip` during the end hold, "what system
should I break down next? ↓".

If a take runs ≥ 90s, trim in order: "There's the flaw." (−2) · "Not just in
Europe — everywhere." → "And not just in Europe." (−2). Re-record; never ship
over 90s. Recording note: if the "Did you know" opener comes out chirpy,
prefix `[curious]`.

## 007.2 `script.ts` scene split (narration = tag-free text above)

| id | label | step | ~sec | opener (align-safe) |
| --- | --- | --- | --- | --- |
| `hook` | THE MARK | 0 | ~14 | "Did you know" **[v2]** |
| `law` | THE LAW | 1 | 15 | "A new law" |
| `coin` | THE COIN | 2 | 22 | "So how do" |
| `count` | THE COUNT | 3 | 17.5 | "One rigged flip" |
| `catch` | THE CATCH | 4 | 19.5 | "But the trick" |

## 007.3 Design language — the `inkwell` skin **[v2 — cream/brown Claude desk]**

**Concept: Anthropic's own cream-and-brown identity as a warm writing desk —
invisible ink on cream paper that DEVELOPS under a warm scan lamp** (like
lemon-juice writing over a flame). The hidden watermark glows in Claude's own
terracotta: the signature is literally Claude-colored. Two-signal split, never
blurred:

- **`accent` fired clay = the watermark itself.** The hidden mark, the
  developed words, the detector's findings. Nothing else is clay.
- **`second` dark bronze = the picking mechanism.** The coin, the word-choice
  chips, the tally. Bronze is the *cause*, clay is the *evidence*.
- `warn` deep red appears exactly twice (the "NOT RELEASED" band, the failed
  essay grade) — always as a shape with text on it, never a bare color cue
  (it's the accent's hue neighbor). `brand` holds the TRUE Claude terracotta
  #D97757 — **large glyph fills only, never text** (2.7:1).
- **No IP imitation (§0.4 still binding):** the palette evokes Claude; the
  actual Anthropic starburst/wordmark stays out. The AI glyph is an original
  terracotta rounded tile with a blinking text-caret (see §007.4).

```ts
// src/themes/inkwell.ts — v2 tokens, ALREADY validated with design-for-ai:color
// (WCAG on bg/card/paper + deuteranopia L* separation). Copy verbatim.
export const inkwell: ThemeSpec = {
  name: "inkwell",
  bg: "#F0EEE6", bgLifted: "#FAF9F5",        // Anthropic ivory / cream
  background: { kind: "plain" },
  line: "rgba(43,37,25,0.25)", lineFaint: "rgba(43,37,25,0.10)",
  text: "#2B2519",       // warm espresso ink — 13.1:1 on bg
  textDim: "#6C665A",    // 4.9:1
  textFaint: "#736C5A",  // ~4.2:1 — real info lives in faint type, keep ≥4:1
  accent: "#A94E28",     // fired clay — 4.8:1, text-safe on all 3 surfaces
  accentDim: "#C08059",  // mid clay — shared Chrome draws the stepper progress
                         // line in this token; a pale tint vanishes on cream
  accentGlow: "rgba(217,119,87,0.35)",  // true Claude #D97757 as the bloom
  second: "#75530E",     // dark bronze (~6:1; L*≈38 vs clay L*≈44 — CB-safe)
  secondDim: "rgba(227,179,65,0.50)",
  good: "#3E7B3E", warn: "#8C1D18",  // warn at L*30.7 — 7 below bronze, CB-safe
  brand: "#D97757",      // real Claude terracotta — LARGE FILLS ONLY, never text
  brandDim: "#EFC9B8", brandGlow: "rgba(217,119,87,0.28)",
  card: "#FFFFFF", cardBorder: "rgba(43,37,25,0.14)",
  cardShadow: "0 12px 32px rgba(60,52,40,0.18)",  // hue-shifted taupe, never black
  vignette: "rgba(90,74,52,0.20)",
  caption: { spoken: "rgba(35,29,20,0.98)", unspoken: "rgba(35,29,20,0.30)",
             halo: "none", font: "mono", boxed: true, radius: 14 }, // light skin → boxed pill
  motion: { damping: 15, stiffness: 170, mass: 0.9 },  // keep the editorial snap
};
```

Kit-level bright colors (fill-only, never text): coin gold `#E3B341` (1.7:1 —
always with a bronze rim), kraft text-bars `#D4A27F`. The PI blackout beat
dims the stage to **deep umber** (`rgba(43,31,20,…)`), not pure black —
hue-shifted like every shadow in this skin.

## 007.4 Episode kit — `scenes/kit.tsx`

```ts
// [v2] the whole world is light now — paper is the near-white surface ON cream
export const PAPER = "#FCFAF4";      // document card fill
export const PAPER_LINE = "#D4A27F"; // fake text bars on paper (kraft)
export const INK = "#2B2519";        // text on paper (matches theme.text)
export const COIN_GOLD = "#E3B341";  // coin face fill — FILL ONLY, never text
export const COIN_EDGE = "#75530E";  // coin rim / weighted side (theme.second)
export const UMBER_DIM = "rgba(43,31,20,0.88)"; // PI dim veil — never pure black
```

**[v2] Component updates:** `UVSweep` becomes a **warm scan-lamp band** —
`accentGlow` core → transparent edges, lamp glyph (not a UV torch) at its
top; words it passes DEVELOP into clay ink (`accent` on PAPER = 5.3:1 — the
old dark-skin accent-on-paper caveat is gone). `DocCard` revealed words render
in `accent` with an `accentGlow` bloom. `ChipGlyph` is now a `brand`-terracotta
rounded tile with a blinking text-caret bar inside (2f blink) — evokes "AI
that writes"; still NO starburst, NO wordmark.

| Component | Props | Draws |
| --- | --- | --- |
| `DocCard` | `w`, `h`, `lines` (count), `revealed?: number[]` | A `PAPER` rounded card filled with `PAPER_LINE` text bars (seeded widths). Indices in `revealed` render as short `accent`-glowing word blocks instead of grey bars. The core prop of the episode. |
| `WordChip` | `children`, `active?: boolean`, `ghost?: boolean` | Word in a rounded chip: `card` bg, mono 34px; `active` = `second` border + slight scale; `ghost` = opacity 0.35. |
| `Coin` | `size`, `spin` (0–1), `face: "H"\|"T"`, `rigged?: boolean` | Gold coin, `scaleX = cos(spin·π·N)` flip illusion. `rigged` shows a visible weight crescent (`COIN_EDGE`) on one inner edge and a faint `second` glow on landing. |
| `UVSweep` | `x` (band center), `w?` | Vertical violet gradient band (`accentGlow` core → transparent edges) with a torch glyph at its top. Words it passes switch to revealed state. |
| `Tally` | `value`, `label?` | Mono counter card, `second` digits; ticks up with a 2f scale pop per increment. |
| `ChipGlyph` | `size` | The neutral AI subject: rounded square, `brand` outline, 4 pin stubs per side, a small spark-free "C-dot" center. NO real logos. |
| `LawCard` | `w` | Paragraph-icon card with a ribbon seal; used once (law scene). |
| `Chip` / `Stamp` | | Copy from `004-netflix-delivery/scenes/kit.tsx`, restyle to tokens. |

## 007.5 Scene direction

Motion default: `useEnter(delay)` for entries; travel eases
`(t) => 1 - Math.pow(1 - t, 3)`. Frames provisional (sec×30); retune by `%`.

### hook — THE MARK · ~420f **[v2 — restructured: open ON the money shot]**
> "Did you know Anthropic has been watermarking your text?…"

| f | % | Beat |
| --- | --- | --- |
| 0–9 | 0–2% | **Title hook legible by f9:** `Stamp` y460, 2 lines: "ANTHROPIC IS WATERMARKING" / "YOUR TEXT" — 58px, espresso; "YOUR TEXT" in `accent` clay. Near-instant pop (damping 11), no fade-ahead. |
| 0 | 0 | **Visual hook — the reveal is ALREADY HAPPENING:** a full `DocCard` (w 700, h 420) at (540, 950) with the scan lamp mid-sweep at x≈480, ~8 words already developed clay, more igniting as it moves. `ChipGlyph` size 90 docked top-left, caret blinking. |
| 10–110 | 2–26% | Sweep completes x→840; ~14 total words developed, held dimly lit (0.5). `Chip` y620: "a hidden signature". |
| 120–200 | 29–48% | Lamp shuts off — marks fade back into ordinary kraft bars over 25f. "You can't see it" lands on an ordinary-looking doc. |
| 210–290 | 50–69% | Copy-paste beat: doc duplicates with offset (12px shadow jump), paste "thunk" scale; a brief lamp re-flash shows the marks persisted on the copy. `Chip` y1280: "copy-paste won't remove it". |
| 300–420 | 71–100% | **Rehook:** `Stamp` swap y1260 (hard-sequence): "ONE EMBARRASSING FLAW" — "FLAW" in `warn`; small `Chip` under: "already failing students". Hold the ordinary doc behind it. |

QA stills: **f9** (claim + mid-sweep — BOTH hooks in one frame), **f160** (marks fading).

### law — THE LAW · ~450f
> "A new law in Europe says…"

| f | % | Beat |
| --- | --- | --- |
| 0–40 | 0–9% | `LawCard` at (380, 850) scales in. `Stamp` y470: "if a computer wrote it," / "people can find out" (two lines, 46px, second line `accent`). |
| 60–140 | 13–31% | Date stamp slams in at (700, 850): "AUG 2" in a `second`-bordered square, 8° rotation, with a 4f overshoot. `Chip` under: "the rule kicked in". |
| 150–260 | 33–58% | Simple dotted world map (seeded dot grid, `textDim`) rises into the stage band. A `accentGlow` ripple expands from the Europe cluster. |
| 270–360 | 60–80% | Ripple keeps expanding past the map edges until ALL dots tint `accent` (staggered by distance, 0.3f/dot). `Stamp` swap (hard-sequence, 6f gap — no crossfade collision): "NOT JUST EUROPE." |
| 360–450 | 80–100% | Closing `Chip` y1290: "every new Claude model, everywhere". Hold. |

QA still: **f320** (world tint mid-stagger).

### coin — THE COIN · ~660f (the mechanism; give it room)
> "So… how do you hide a mark inside words?…"

| f | % | Beat |
| --- | --- | --- |
| 0–50 | 0–8% | Sentence builds centered y800, mono 44px: "The cat sat on the" + a blank slot `▁▁▁`. |
| 50–110 | 8–17% | Two `WordChip`s drop to y950: "mat" and "rug", side by side, both neutral. `Chip` y620: "both work". |
| 120–210 | 18–32% | `Coin` size 200 at (540, 1120) flips (spin 0→1 over 55f), lands **H** → "mat" chip activates (`second` border), flies up into the slot. Sentence completes. |
| 220–300 | 33–45% | Repeat fast ×2 at half scale (new sentence fragments slide through the same slots) — establishes "this happens for every word". |
| 310–400 | 47–61% | **[v2] PATTERN INTERRUPT.** On "Wait." a `UMBER_DIM` veil drops over EVERYTHING in ≤4f (hard, not a fade); the coin alone scales up to 320 centered (540, 900), lamplit, and rotates to profile — the `COIN_EDGE` weight crescent visible. `Stamp` y470: "THE COIN IS RIGGED", 60px, `COIN_GOLD` on the umber ground. Matches "Wait. [whispers] Come closer." — let it sit ≥40f. Veil lifts with the next beat. |
| 410–540 | 62–82% | Ten rapid flips in a row across the stage (coin mini-instances, 12f apart): 7 land H, 3 land T. Each H leaves a small `accent` tick mark floating where it landed. |
| 550–660 | 83–100% | The tick marks drift into a neat row y1260. Closing `Chip`: "more often than it should". |

QA stills: **f360** (rigged reveal), **f500** (flip run).

### count — THE COUNT · ~525f
> "One rigged flip looks totally normal…"

| f | % | Beat |
| --- | --- | --- |
| 0–60 | 0–11% | One lone word-bar with a single `accent` tick at (540, 850). `Stamp` y470: "one flip? invisible." |
| 70–200 | 13–38% | Zoom-out illusion (scale the group 1→0.28 while a full word-grid fades in around it): a 16×22 grid of word dots fills the stage. Picked words (~40%, seeded) carry faint `accent`. Individually invisible — together a *visible drift* of violet. |
| 210–300 | 40–57% | `UVSweep` passes over the grid; `Tally` at (790, 560) counts up with each lit word it crosses, 0→214, `second` digits. |
| 310–400 | 59–76% | Verdict card slides up y1240 (hard-sequenced): mono, typed letter-by-letter 2f/char: "TOO MANY HEADS." then "NO HUMAN WRITES LIKE THIS." |
| 410–525 | 78–100% | Final line stamps in `accent`, 54px: "THIS WAS CLAUDE." — the detector literally speaks; hold ≥50f. Ends y≈1330. |

QA stills: **f180** (grid drift readable?), **f470** (verdict, bottom margin).

### catch — THE CATCH · ~585f (comment-bait payoff)
> "But the trick has weak spots…"

| f | % | Beat |
| --- | --- | --- |
| 0–140 | 0–24% | Weak spot #1: a tiny 3-line `DocCard` (w 320) at (300, 800). `Tally` beside it counts 0→6, then shows "?" and shrugs (2° wobble). `Chip`: "too few flips". |
| 150–290 | 26–50% | Weak spot #2 at (540, 800): a marked doc's glowing words scramble (letters reshuffle 1f/char) into new grey bars — the `accent` glow dissolves to nothing over 40f. `Chip`: "rewritten = washed away". Hard-sequence #1 out before #2 in. |
| 300–390 | 51–67% | Weak spot #3 at (780, 800): the torch glyph in a box, `warn` diagonal band across it: "NOT RELEASED YET". |
| 400–500 | 68–85% | Cut to a mock essay card, big red "AI: 98%" grade slapped on it (`warn`, 10° rotation). Beat of silence. |
| 500–585 | 85–100% | `Stamp` y1260, 56px: "IT WAS GUESSING." — then hard-sequence to "THERE'S THE FLAW." (`warn`, callback to the hook's rehook stamp). Stepper flips `allDone`; **[v2]** on-screen CTA chip (§0.7.4) fades in for the hold. |

QA stills: **f250** (wash-away mid-dissolve), **f540** (closer, margins).

## 007.6 Cover idea **[v2]**
Cream `inkwell` v2 bg; a near-white doc card center; warm scan-lamp band
frozen mid-sweep with 3 words developed in clay; title "ANTHROPIC IS
WATERMARKING YOUR TEXT" in espresso stamp type, "YOUR TEXT" in clay.

---
---

# EPISODE 008 — Microwave Cold Spots

**"Your Microwave Has Cold Spots"**

| | |
| --- | --- |
| Slug | `008-microwave` |
| Pillar | Everyday machine (CTA: "What **machine** should I break down next?") |
| Skin | **REUSE `kitchen`** (003 air-fryer) — same room of the house, zero new theme work. Episode identity comes from the kit's heat-map palette. |
| Length | ~134 words ≈ **56–59s** (sub-60 is a hard requirement — owner call 2026-08-21; trim words, never pacing) |
| Stepper | `FORK / WAVES / SPIN / DOOR / SPARK` **[v3]** |

## 008.1 ElevenLabs script (copy-paste, v3 tags included)

```
Your microwave can make real lightning — [pause] all it takes is a fork. [curious] And the same waves that spark it leave cold spots in your food. [pause] That's the real reason the plate spins.

Inside, invisible waves bounce between the metal walls — and get stuck. Hot spots here. Cold spots there. [pause] Always the same places.

The hot spots can't move. So your food does. The plate drags every bite through them. [pause] Don't believe me? [curious] Take the plate out and microwave a tray of cheese — it melts in stripes.

And that mesh on the door? Light slips through the tiny holes — so you can watch. The waves? Too big. [pause] To them, it's a solid wall.

[amused] Now — about that fork. Its sharp edges squeeze the waves into tiny lightning bolts. Real, indoor lightning. [pause] Maybe don't test that one.
```

**[v2] No spoken CTA** — audio ends on "Maybe don't test that one." CTA is
the on-screen chip (§0.7.4). The v3 sub-60 pass already applied the deep
trims ("Actual bolts, in your kitchen", "We'll get to that", "ice cold, no
matter how long you cook" — the ice-cold descriptor moved to an on-screen
`COLD` chip). Last-resort trim if the take still lands ≥ 59s: "Real, indoor
lightning." → "Indoor lightning." (−1).

## 008.2 `script.ts` scene split

| id | label | step | ~sec | opener |
| --- | --- | --- | --- | --- |
| `hook` | THE FORK **[v3]** | 0 | ~14 | "Your microwave can" |
| `waves` | THE WAVES | 1 | ~9 | "Inside, invisible waves" |
| `spin` | THE SPIN | 2 | ~14 | "The hot spots" |
| `door` | THE DOOR | 3 | ~11 | "And that mesh" |
| `spark` | THE SPARK | 4 | ~10 | "Now — about that" **[v2]** |

## 008.3 Design language

Read `src/themes/kitchen.ts` and use its tokens as-is. The episode's own
language is a **thermal-camera overlay** living in kit consts:

```ts
export const HOT = "#FF6B4A";        // heat lobes (never use theme.warn for heat)
export const HOT_CORE = "#FFD166";   // lobe centers
export const COLD = "#4AA3FF";       // cold spots
export const STEEL = "#8E9BA6";      // microwave body
export const CAVITY = "#1E262CEE";   // cutaway interior (dark stage inside the light skin)
```

Rules: heat is ALWAYS the HOT→HOT_CORE pair, cold is ALWAYS `COLD` — the
hot/cold split is the episode's argument, keep `theme.warn` for the fork
danger beat only. The cutaway interior is deliberately dark so wave graphics
glow against it (light-skin scenes stage dark content in cards — see how
`maps` handled dark panels).

## 008.4 Episode kit

| Component | Props | Draws |
| --- | --- | --- |
| `MicrowaveBody` | `w`, `open?: boolean`, `cutaway?: boolean` | Front view: `STEEL` shell, door with mesh window, keypad strip. `cutaway` swaps the door for the dark `CAVITY` interior. THE recurring set piece — every scene stages inside or on it. |
| `StandingWave` | `w`, `phase`, `frozen?: boolean` | A horizontal wave that bounces between two wall lines; when `frozen`, it stops travelling and pulses amplitude in place (that IS the concept — animate travel→freeze once, in waves scene). |
| `HeatLobes` | `w`, `h`, `on` (0–1) | 3×2 blobs of `HOT`→`HOT_CORE` radial gradients at fixed positions with `COLD` gaps between. Fixed positions must match across scenes 1–3 (export the coordinates as a const). |
| `Turntable` | `size`, `angle` | Glass plate ellipse + roller ring. |
| `FoodPlate` | `size`, `bites: number[]` (heat 0–1 per bite) | A plate of 8 food chunks that tint from grey → HOT as they pass lobes. |
| `CheeseTray` | `w`, `melt` (0–1) | Tray of cheese shreds; `melt` reveals molten stripes exactly under the lobe positions const. |
| `MeshZoom` | `size`, `waveScale` | Circular magnifier over the mesh: hexagonal hole grid; a small `accent` squiggle (light) passes through a hole; a big `HOT` wave arc bounces off. The size contrast is the whole gag — keep light squiggle ≤ hole width, wave arc ≥ 6× hole width. |
| `ForkSpark` | `size`, `strike` (0–1) | Fork silhouette; at `strike`, 3 jagged bolt paths flash `HOT_CORE`→white from the tine tips, 4f each. |

## 008.5 Scene direction

### hook — THE FORK · 428f **[v3.1 — full-stage cavity cold open, zoom-out reveal, cold-spots rehook]**
Beats below are synced to the recorded v3 take (timing.json scene 0):
"real lightning" f63–115 · "a fork" f164–180 · "cold spots" f247–272 ·
"that's the real reason the plate spins" f346–428.
| f | % | Beat |
| --- | --- | --- |
| 0–9 | 0–2% | `Stamp` y450: "YOUR MICROWAVE MAKES" / "REAL LIGHTNING" — "REAL LIGHTNING" in `theme.warn`. Instant pop. |
| 0 | 0 | **Visual hook — full-stage cavity, mid-strike:** dark `CavityStage` (same geometry `spark` returns to — the loop closes at the same scale), big `ForkSpark` (size 320, boltCount 3) through the roof, `FieldLines` already crowding the tines, faint `HeatLobes` behind. FIRST BOLT at f2; strikes f2/f30/f66/f84/f103 under "make real lightning", one last crack f166 on "a fork". Every hit: 1f white cavity flash + deterministic stage shake (±6px, gated by the strike envelope). Never a full-screen strobe. |
| 168–192 | 39–45% | **Zoom-out match cut** as the narration pivots ("And the same waves…"): the whole stage shrinks onto the cutaway `MicrowaveBody`'s cavity rect with the cross-fade riding the move (kept to 24f — slower reads as a glitch). The chaos lives inside the box on your counter. `HeatLobes` fade up in the diorama cavity as "waves" lands (f194–222). `warn` `Chip` y612 "lightning — saved for last" (f202–246) alone holds the loop open until `spark` — no spoken deferral. |
| 246–272 | 57–64% | **Rehook:** stamp hard-swaps to "YOUR MICROWAVE HAS" / "COLD SPOTS" ("COLD SPOTS" in `COLD` — deliberately parallel lead). The cold bites are heat-floored to 0.19 pre-swap, so their ice styling + pulsing `COLD` rings snap on WITH the swap. |
| 264–350 | 62–82% | Hot bites glow up for contrast (f270–330). `COLD` `Chip` y612: "ice cold — no matter how long" (f264–350; the narration dropped the descriptor for time, the chip carries it). |
| 350–428 | 82–100% | "that's the real reason the plate spins": Turntable begins its first slow rotation — freeze after 30° (f350–420). Closing `Chip` y1262: "so why does it spin?" (f368+). **Loop: WHY does spinning matter? → `spin`.** |

QA stills: **f2** (bolt + field lines mid-strike), **f104** (strike burst + stamp), **f184** (zoom cross-fade), **f260** (cold reveal), **f400** (spin chip margins).

### waves — THE WAVES · ~300f
| f | % | Beat |
| --- | --- | --- |
| 0–70 | 0–23% | Interior only (cutaway fills stage). `StandingWave` travels left→right, reflects off the right wall, comes back. |
| 70–130 | 23–43% | Reflected wave meets incoming wave → `frozen` mode: the combined wave stops travelling, pulses in place. This transition is the episode's physics moment — make the freeze land on the word "stuck" if the timing allows (check timing.json captions). |
| 140–220 | 47–73% | The frozen wave's peaks bloom into `HeatLobes` (peaks → HOT blobs, nulls → COLD gaps). `Chip` pair: "hot spots here" (at a lobe) / "cold spots there" (at a gap). |
| 230–300 | 77–100% | Grid overlay snaps on with distance ticks: "always the same places". Hold the map. |

QA still: **f180** (lobes born from wave peaks — the mechanism must read).

### spin — THE SPIN · ~390f (money shot: cheese stripes)
| f | % | Beat |
| --- | --- | --- |
| 0–110 | 0–28% | Same lobe map. `Turntable` + `FoodPlate` rotate slowly (0.25°/f); bites tint HOT one by one as each sweeps through a lobe. `Stamp` y470: "the food moves instead". |
| 120–150 | 31–38% | **[v2] PATTERN INTERRUPT:** hard snap cut (≤2f, no ease) to "experiment mode" — turntable yanked out of the cavity, `Stamp` y470 swap: "DON'T BELIEVE ME?" in `COLD` on a `CAVITY`-dark card. Direct-address beat; sync to "Don't believe me?". |
| 160–300 | 41–77% | `CheeseTray` slides in, static. `melt` 0→1: molten stripes grow ONLY under the lobe positions — the invisible map becomes visible in food. Sync stripe growth to "melts in stripes". |
| 310–390 | 79–100% | The lobe overlay fades IN over the finished stripes — perfect registration, 20f hold. Closing `Chip` y1290: "the cold spots, photographed" **[v2]**. |

QA stills: **f250** (stripes mid-melt), **f360** (overlay registration).

### door — THE DOOR · ~330f
| f | % | Beat |
| --- | --- | --- |
| 0–60 | 0–18% | Full `MicrowaveBody` returns; camera-less zoom: `MeshZoom` magnifier scales up over the door window to fill the stage. |
| 70–160 | 21–48% | Light beat: a thin `accent` squiggle sails through a hexagonal hole, continues out, becomes a small eye glyph — "so you can watch". |
| 170–260 | 52–79% | Wave beat: a fat `HOT` arc approaches the same holes and flattens against them, rebounding — repeat twice. `Stamp` y470: "TOO BIG TO FIT". |
| 270–330 | 82–100% | Pull the magnifier back; the mesh glints once. `Chip` y1280: "a window to you. a wall to them." |

QA still: **f210** (size contrast legible at delivery scale — fatten strokes if not).

### spark — THE SPARK · ~360f (danger + on-screen CTA)
| f | % | Beat |
| --- | --- | --- |
| 0–50 | 0–14% | Interior. `ForkSpark` fork lowers in on a slight arc — **[v2]** the SAME fork glyph from the hook's rehook tease (loop closes visually). Matches [amused] "Now — about that fork." |
| 60–140 | 15–35% | Wave lines crowd toward the tine tips (field-line convergence: 6 `lineFaint` paths bending in), tips glow `HOT_CORE`. |
| 150–230 | 37–57% | `strike`: 3 bolt flashes off the tines, 10f apart, each with a 1f white frame. `Stamp` y470: "INDOOR LIGHTNING", `warn`. |
| 240–320 | 59–79% | `Chip` y1240, `warn` border: "maybe don't test that one". Fork retreats. |
| 320–360 | 89–100% | End hold: stepper `allDone`; microwave hums, lobes gently pulsing; **[v2]** on-screen CTA chip (§0.7.4) "what machine should I break down next? ↓". |

QA stills: **f180** (strike), **f340** (CTA chip margins).

## 008.6 Cover idea **[v2]**
Kitchen skin; cutaway microwave with the cheese-stripe tray glowing inside;
title "YOUR MICROWAVE HAS COLD SPOTS", "COLD SPOTS" in `COLD`.

---
---

# EPISODE 009 — Noise-Cancelling Headphones

**"Silence, Manufactured"**

| | |
| --- | --- |
| Slug | `009-noise-cancel` |
| Pillar | Everyday machine (CTA: "What **machine** should I break down next?") |
| Skin | **REUSE `blueprint`** — the graph-paper grid IS an oscilloscope. Zero new theme work; the kit turns the grid into a scope with wave colors. |
| Length | ~130 words ≈ **48–52s** (shortest episode yet — waves need no words) |
| Stepper | `NOISE / FLIP / ZERO / LIMIT` |

## 009.1 ElevenLabs script (copy-paste, v3 tags included)

```
How does your headphones' noise cancelling actually work? [pause] They fight noise… with more noise. They shout back at the world — and that makes silence. [pause] By the end of this, you'll know the one sound they can never erase.

Tiny microphones on the outside hear the noise before you do. A chip copies the sound wave — [pause] then flips it upside down.

It plays that flipped wave into your ear. Peak meets dip. Plus one meets minus one. [whispers] Listen. [pause] Zero. The air at your eardrum just… stops moving. The noise wasn't blocked — [pause] it was erased.

But the chip can only fight noise it can predict. Engine hum? Easy — it never changes. A crying baby? Too sudden — gone before the anti-noise fires. [amused] That's why headphones can silence the whole plane… [pause] but never the baby on it.
```

**[v2] No spoken CTA** — audio ends on "but never the baby on it." CTA is the
on-screen chip (§0.7.4). No trim list needed — comfortably under 60s. Do NOT
pad; short is a feature. The ~2s dead-air after "Listen." is engineered in
the zero scene, not the voice take — a normal pause in the recording is fine.
Recording note: if the question opener comes out chirpy, prefix `[curious]`.

## 009.2 `script.ts` scene split

| id | label | step | ~sec | opener |
| --- | --- | --- | --- | --- |
| `hook` | THE FIGHT | 0 | ~11 | "How does your" **[v2]** |
| `flip` | THE FLIP | 1 | 8.5 | "Tiny microphones on" |
| `zero` | THE ZERO | 2 | 14 | "It plays that" |
| `limit` | THE LIMIT | 3 | 19 | "But the chip" |

## 009.3 Design language

Read `src/themes/blueprint.ts`; use as-is. Wave color law (kit consts):

```ts
export const NOISE = "#F5A83C";   // the world's noise — warm, aggressive
export const ANTI = "#3CC8F5";    // the anti-noise — cool, manufactured
export const SUM = "#FFFFFF";     // the combined wave / the flatline
```

NOISE and ANTI never swap. `SUM` white is reserved for the resulting wave
only — the flatline moment must be the brightest thing in the episode. All
waves are 4px strokes minimum (2px vanished at delivery scale in 005).

**Motion note:** waves animate by phase offset (`Math.sin(x·k + frame·ω)`),
which is deterministic — build ONE `Wave` component and drive everything
through it. This episode lives or dies on wave quality; budget most of the
kit time there.

## 009.4 Episode kit

| Component | Props | Draws |
| --- | --- | --- |
| `Wave` | `w`, `amp`, `freq`, `phase`, `color`, `flatten?` (0–1), `jagged?: boolean` | THE component. Sine path sampled at 4px steps; `flatten` lerps amplitude→0 left-to-right (the erase); `jagged` adds seeded harmonics (the baby cry — unpredictable shape). |
| `HeadProfile` | `w`, `cupGlow?: boolean` | Side-view head silhouette (`textDim` fill, neutral — no face detail) wearing a headphone; the ear cup is a ring that can glow `ANTI`. |
| `MicDot` | `size`, `ping` (0–1) | Small mic circle on the cup exterior with an expanding listening ring. |
| `ChipBadge` | `size` | Tiny processor square inside the cup; lights when "thinking". |
| `ScopeFrame` | `w`, `h` | A brighter rect + center axis line over the blueprint grid — frames any wave demo as an instrument reading. |
| `PlaneRow` | `w` | Minimal cabin cross-section: 3 seat arcs, one window, engine drone lines entering from the left. |
| `BabyCry` | `size`, `burst` (0–1) | Star-burst of `jagged` wavelets from a small bundle glyph. Keep it abstract/cute — no detailed infant. |

## 009.5 Scene direction

### hook — THE FIGHT · ~225f
| f | % | Beat |
| --- | --- | --- |
| 0–9 | 0–4% | `Stamp` y470: "FIGHTS NOISE" / "WITH MORE NOISE" — line 2 in `ANTI`. Instant. |
| 0 | 0 | `HeadProfile` (w 520) already center-stage; a NOISE wave streams in from the left edge toward the ear, animating. |
| 60–130 | 27–58% | An ANTI wave fires OUT of the ear cup, leftward, meeting the noise head-on at x≈400 — where they overlap, both dim and a short `SUM` flat segment appears. Don't explain — just show the collision. |
| 140–240 | 42–73% | Hold the standoff: noise pushing in, anti-noise pushing out, flat segment shimmering between. **Loop: how does shouting make silence?** |
| 250–330 | 76–100% | **[v2] Rehook:** `Chip` y1280, `NOISE`-tinted border: "one sound they can never erase" — a tiny `jagged` wavelet icon inside the chip (the baby, unnamed). Hard-sequence in; hold. Scene extends to ~330f for the longer v2 hook narration. |

QA stills: **f9**, **f180**, **f300** (rehook chip margins).

### flip — THE FLIP · ~255f
| f | % | Beat |
| --- | --- | --- |
| 0–60 | 0–24% | Zoom state: ear cup fills stage-left; `MicDot` pings twice on its outer shell. NOISE wave arrives at the mic. |
| 70–140 | 27–55% | `ChipBadge` lights; the wave is drawn INTO a `ScopeFrame` at (620, 800) — a copy traces on the scope in NOISE color. |
| 150–210 | 59–82% | **The flip:** the scope copy mirrors vertically around the axis line (scaleY 1→−1 over 18f, ease-out) and recolors NOISE→ANTI on the way. Sync to "flips it upside down". |
| 210–255 | 82–100% | The flipped ANTI wave slides out of the scope toward the ear canal. Hold. |

QA still: **f170** (mid-flip, both colors visible).

### zero — THE ZERO · ~420f (the money shot of the whole episode)
| f | % | Beat |
| --- | --- | --- |
| 0–80 | 0–19% | Big `ScopeFrame` fills the stage. NOISE wave on top half, ANTI wave on bottom half, sliding toward each other vertically. Labels: "+1" at a noise peak, "−1" at the anti dip (mono, 30px). |
| 90–170 | 21–40% | **Superposition:** the two waves merge onto the center axis; where they meet, a `SUM` wave appears with tiny amplitude, shrinking as alignment completes. Peak-meets-dip callouts flash at 3 alignment points. |
| 180–260 | 43–62% | **[v2] PATTERN INTERRUPT — literal silence.** `SUM` flatlines completely — one white horizontal line, **~60f of total stillness** (extended from 20f; the narration itself stops after "[whispers] Listen."). `Stamp` y470: a bare "0", 130px, `SUM` white. NOTHING else moves — no drift, no pulse, captions hold dark. The stillness IS the interrupt. |
| 270–340 | 64–81% | Cut wide to the head: ear canal inset shows air particles (12 seeded dots) that stop jittering and freeze. `Chip`: "the air just stops moving". |
| 340–420 | 81–100% | Closing `Stamp` y1260: "NOT BLOCKED. ERASED." — "ERASED" in `ANTI`. |

QA stills: **f210** (flatline + 0), **f390** (closer margins).

### limit — THE LIMIT · ~570f (payoff + CTA)
| f | % | Beat |
| --- | --- | --- |
| 0–90 | 0–16% | Split stage: top half a steady NOISE sine labeled "engine hum", bottom half its ANTI twin locked on, `SUM` flat between. `good` check chip: "predictable = erasable". |
| 100–200 | 18–35% | **The baby breaks it:** a `jagged` burst cuts across the top half. The ANTI wave visibly lags — its copy arrives 12f late and misaligned; the `SUM` line spikes wherever they mismatch. |
| 210–290 | 37–51% | Chip badge "recalculating" wobble; another jagged burst, another miss. `Chip`, `warn` border: "too sudden". |
| 300–430 | 53–75% | `PlaneRow` scene: engine drone lines from the left get erased mid-air (flatten sweeping right, `ANTI` shimmer) — the cabin goes visually quiet… |
| 440–510 | 77–89% | …then `BabyCry` bursts from a seat, its jagged wavelets sailing straight through the quiet zone untouched. This is the shareable image — plane silent, baby loud. Hold 30f. |
| 510–570 | 89–100% | Closing `Chip` y1280: "the plane: silenced. the baby: never." Stepper `allDone`; **[v2]** on-screen CTA chip (§0.7.4) for the hold. |

QA stills: **f150** (lag mismatch readable), **f470** (baby burst), **f550** (margins).

## 009.6 Cover idea
Blueprint grid; giant NOISE and ANTI waves interlocking dead-center with a
white flat segment between; title "SILENCE, MANUFACTURED".

---
---

# EPISODE 010 — Elevator Dispatching

**"The Close Button In Your Elevator Is a Dummy"**

| | |
| --- | --- |
| Slug | `010-elevator` |
| Pillar | Everyday machine (CTA: "What **machine** should I break down next?") |
| Skin | **NEW — `lobby`** (light marble + brass; the channel's third light skin) |
| Length | ~165 words ≈ **60–63s**; trim list below if a take exceeds 63s |
| Stepper | `BUTTON / RULE / SORT / TIMER / DOORS` |

## 010.1 ElevenLabs script (copy-paste, v3 tags included)

```
The close button in your elevator? [pause] It's a dummy. A fake. Pressing it does nothing — the elevator ignores you, because it already has a plan. [whispers] And you're part of it. [pause] The button does work, though… for exactly one person. [curious] Wait till you see who.

An elevator follows one simple rule: pick a direction, and finish it. Collect everyone going up. Then turn around and collect everyone going down. Never zig-zag — [pause] zig-zagging leaves people stranded.

Fancy buildings go further. You type your floor in the lobby, and a computer sorts the people — everyone heading to nearby floors gets packed into the same car. [pause] Which is why — [whispers] look — some elevators have no buttons inside at all.

So why does the close button exist? By law, the doors must stay open long enough for a wheelchair. The button can't skip that timer. [pause] And the one person it truly works for? [pause] A firefighter, with a key.

[amused] So next time the doors shut right after you press it… [pause] they were closing anyway.
```

**[v2] No spoken CTA** — audio ends on "they were closing anyway." CTA is the
on-screen chip (§0.7.4). The delivery-van simile is CUT from the narration —
**cut the van beat in the sort scene with it** (see §010.5). Trim list if
≥ 63s: "A fake." (−1) · "Wait till you see who." (−2).

## 010.2 `script.ts` scene split

| id | label | step | ~sec | opener (⚠ scenes 4/5 both start "So" — distinct at 3 words, verify `matched: true` in align log) |
| --- | --- | --- | --- | --- |
| `hook` | THE BUTTON | 0 | ~14 | "The close button" **[v2]** |
| `rule` | THE RULE | 1 | 11.5 | "An elevator follows" |
| `sort` | THE SORT | 2 | ~15.5 | "Fancy buildings go" (van line cut **[v2]**) |
| `timer` | THE TIMER | 3 | 15 | "So why does" |
| `doors` | THE DOORS | 4 | 8.5 | "So next time" |

## 010.3 Design language — the `lobby` skin

**Concept: a hotel-lobby cutaway — warm marble, brass fittings, and one cool
"machine intelligence" color drawing the plan over it.** The split that
carries the episode:

- **`accent` deep teal = the algorithm.** Route lines, the dispatcher's plan,
  destination groupings, timers. The invisible intelligence.
- **`second`/`brand` brass = the physical machine & the human ritual.**
  Buttons, doors, the car, the firefighter key. Everything you can touch.
- Teal thinks, brass moves. The hook's joke is brass (pressing) being ignored
  by teal (the plan); the ending is the same shot resolved.

```ts
// src/themes/lobby.ts — verify with design-for-ai:color; light skins need
// the maps-skin treatment (dark text, white cards, boxed captions).
export const lobby: ThemeSpec = {
  name: "lobby",
  bg: "#EFEBE3", bgLifted: "#FFFFFF",
  background: { kind: "plain" },
  line: "rgba(45,40,32,0.25)", lineFaint: "rgba(45,40,32,0.10)",
  text: "#26221B", textDim: "#6E6758", textFaint: "#A29A88",
  accent: "#0F766E", accentDim: "#5EA9A2", accentGlow: "rgba(15,118,110,0.18)",
  second: "#B08A3E", secondDim: "rgba(176,138,62,0.45)",
  good: "#15803D", warn: "#C2410C",
  brand: "#8A6D2F", brandDim: "rgba(138,109,47,0.45)", brandGlow: "rgba(176,138,62,0.22)",
  card: "#FFFFFF", cardBorder: "rgba(45,40,32,0.14)",
  cardShadow: "0 10px 30px rgba(40,32,18,0.14)",
  vignette: "rgba(72,62,44,0.20)",
  caption: { spoken: "rgba(28,24,17,0.98)", unspoken: "rgba(28,24,17,0.30)",
             halo: "0 1px 10px rgba(255,255,255,0.85)", font: "sans",
             boxed: true, radius: 14 },
  // Elevator physics: heavy, damped, zero bounce — doors glide.
  motion: { damping: 20, stiffness: 150, mass: 1.0 },
};
```

Contrast caution: teal #0F766E on #EFEBE3 is ~4.9:1 — fine for the ≥28px type
this channel uses, but run the color skill's validator; darken toward #0B5D57
if any teal text drops below 24px.

## 010.4 Episode kit

```ts
export const MARBLE = "#E4DFD4";   // wall panels
export const SHAFT = "#2B2620";    // shaft interior (the dark stage)
export const STEEL_DOOR = "#C8C2B4";
```

| Component | Props | Draws |
| --- | --- | --- |
| `BuildingSection` | `w`, `h`, `floors` (default 8), `shafts` (1–3) | Cutaway: `MARBLE` floor slabs, dark `SHAFT` columns, floor numbers in mono `textFaint` on the left. THE set piece for rule/sort. |
| `Car` | `w`, `dir?: "up"\|"down"\|null`, `riders?: string[]` (colors) | Brass-trimmed cab in a shaft; direction triangle above; rider dots visible through a front slit. |
| `Rider` | `size`, `color`, `floor?` | A person as a dot-with-shoulders (no faces), colored by DESTINATION. Floor badge optional. Destination colors: export a 4-color const (teal/plum/olive/rust — must survive the light bg, validate). |
| `DoorPanel` | `w`, `open` (0–1), `withButton?: boolean` | Close-up brass door pair sliding on `open`; below, the button plate. |
| `CloseButton` | `size`, `pressed` (0–1), `dead?: boolean` | The star of the show: brass `>|<` button; `pressed` = inset shadow + ring flash; `dead` = the ring flash goes `textFaint` instead of `accent` (the machine didn't hear it). |
| `TimerArc` | `size`, `t` (0–1) | `accent` arc around the button plate counting down; unaffected by presses. |
| `Kiosk` | `w`, `typed?: string` | Lobby destination keypad on a stand; screen shows the typed floor and an assigned car letter ("→ CAR B"). |
| `FireKey` | `size`, `turned` (0–1) | Brass fire-service keyhole + key; `turned` rotates 90° with a `second` glow. |
| `RouteLine` | `path`, `draw` (0–1) | 3px `accent` dashed line the dispatcher "thinks" with. |

## 010.5 Scene direction

### hook — THE BUTTON · ~420f **[v2 — press at f0 + firefighter rehook]**
| f | % | Beat |
| --- | --- | --- |
| 0–9 | 0–2% | `Stamp` y470: "THE CLOSE BUTTON" / "IS FAKE" — "FAKE" in `second` brass. Instant pop. |
| 0 | 0 | **Visual hook — already mid-press:** `DoorPanel` (w 640) center-stage, doors open, `CloseButton` size 150 below with the hand-cursor ALREADY pressing at f0 — the `dead` grey ring flash fires by f6. |
| 30–130 | 7–31% | Two more presses, 25f apart — every press flashes `dead`. The doors don't react. Comic timing: press, beat, press-press. |
| 140–230 | 33–55% | Behind the doors, `RouteLine`s draw across a faint building outline — the machine is busy thinking. `Chip` y620: "it already has a plan". |
| 240–310 | 57–74% | One route line bends to END at this door — "and you're part of it". |
| 320–420 | 76–100% | **Rehook:** `Stamp` swap y1250 (hard-sequence): "IT WORKS FOR EXACTLY ONE PERSON" — "ONE PERSON" in `accent` teal; a small keyhole glyph beside it (the firefighter, unnamed). Hold. **Loop: who?** |

QA stills: **f9** (stamp + mid-press), **f200**, **f380** (rehook margins).

### rule — THE RULE · ~345f
| f | % | Beat |
| --- | --- | --- |
| 0–50 | 0–14% | `BuildingSection` (8 floors, 1 shaft) fills the stage. `Rider`s waiting on floors 2, 5, 7 (up-arrows) and 6, 3 (down-arrows). |
| 50–170 | 14–49% | `Car` starts at floor 1, `dir "up"`: rises and collects 2 → 5 → 7 in order, each rider hopping in with a 6f pop. `Stamp` y470: "PICK A DIRECTION. FINISH IT." |
| 180–260 | 52–75% | At the top, direction triangle flips; car descends collecting 6 → 3. `good` chip: "nobody skipped". |
| 270–345 | 78–100% | **Ghost comparison:** a 40%-opacity ghost car replays zig-zag (1→5→2→7…), and one waiting rider on 6 blinks `warn` and taps their foot as the ghost passes them twice. `Chip`, `warn` border: "zig-zag = stranded". Hard-sequence the ghost AFTER the real run. |

QA stills: **f140** (collect-up), **f320** (ghost + stranded rider).

### sort — THE SORT · ~525f (the system beat; longest scene)
| f | % | Beat |
| --- | --- | --- |
| 0–70 | 0–13% | Lobby view: `Kiosk` at (340, 900), 6 `Rider`s queuing, each colored by destination. First rider types "12" → kiosk answers "→ CAR B", their dot adopts the B-group color ring. |
| 80–220 | 15–42% | Rapid-fire: remaining riders type; `RouteLine`s draw from each rider to one of three car doors (A/B/C) — same-destination colors converge on the same door. The SORT visual: order emerges from the tangle. |
| 230–330 | 44–63% | Cut to `BuildingSection` (3 shafts): Car A takes floors 3–5 riders, Car B floors 11–12, Car C floors 18–20 — three clean express runs, no shared stops. `Stamp` y470: "SORTED LIKE PARCELS". |
| ~~340–430~~ | — | **[v2] CUT — the van simile is out of the narration.** Remove the delivery-van beat entirely; let the 3-shaft express-runs shot breathe longer instead. |
| 340–440 | 74–94% | **[v2] PATTERN INTERRUPT:** on "[whispers] look —" hard cut (≤2f) to the inside-car shot: a blank brass wall where the button panel would be. Nothing moves for 20f. `Chip` y1280: "no buttons inside at all". Slightly eerie is correct. |
| 440–470 | 94–100% | Hold the wall. |

QA stills: **f180** (route convergence), **f400** (buttonless wall). Scene
shortens to ~470f (van line cut from audio) — re-derive from timing.json.

### timer — THE TIMER · ~450f
| f | % | Beat |
| --- | --- | --- |
| 0–60 | 0–13% | Back to the `DoorPanel` close-up. `Stamp` y470: "so why does it exist?" |
| 60–180 | 13–40% | `TimerArc` sweeps around the button plate (3s countdown). A wheelchair glyph rolls through the open doors at its own pace; the arc politely waits — presses during this window flash `dead`. `Chip`: "the law holds the door". |
| 190–270 | 42–60% | Press montage: 5 rapid presses, arc utterly unmoved. The comedy IS the stillness — do not let the arc even wobble. |
| 280–380 | 62–84% | **The one real user (rehook payoff):** `FireKey` appears beside the plate, `turned` 0→1; the ring flash goes `accent` for the first time in the episode and the doors SNAP shut in 6f (every other door move is ≥20f — the speed contrast is the payoff). `Stamp`: "the one person: a firefighter" — **[v2]** same keyhole glyph as the hook's rehook stamp (loop closes visually). |
| 390–450 | 87–100% | Hold on the shut doors, key still turned. |

QA stills: **f120** (arc + wheelchair), **f330** (key snap).

### doors — THE DOORS · ~255f (comment-bait + CTA)
| f | % | Beat |
| --- | --- | --- |
| 0–80 | 0–31% | Replay of the hook shot: finger presses the button once… |
| 80–130 | 31–51% | …and the doors close immediately after. A `TimerArc` ghost at 15% opacity shows it had just hit zero anyway. |
| 140–200 | 55–78% | `Stamp` y1250: "THEY WERE CLOSING ANYWAY." — 52px, ends above y1370. |
| 200–255 | 78–100% | Stepper `allDone`; **[v2]** on-screen CTA chip (§0.7.4) over the hold on the smug little button. |

QA still: **f230** (closer + CTA chip margins).

## 010.6 Cover idea **[v2]**
`lobby` skin; giant brass close-door button dead-center with a grey `dead`
ring flash; title "IT DOES NOTHING" in the stamp type; tiny teal route lines
in the corners.

---

## Appendix — build order

**Phases A–C (greenfield) are DONE.** Current order is the retrofit (§0.7.3):

1. **Phase R1 (Agent F, serial):** `inkwell` v2 palette (§007.3, verbatim).
   Gate: tsc clean.
2. **Phase R2 (Agents 1–4, parallel):** own episode folder ONLY — v2
   narration in `script.ts` (tag-free, **no CTA line**, §0.7.4), every
   **[v2]**-marked beat/table change in this doc, 007 full light-skin
   contrast retune, QA stills batch, tsc clean.
3. **Phase R3 (Agent F, serial):** covers (007 new skin/title, 008/010 new
   text), cross-episode QA still batch, `CONTENT.md` v2 titles.
4. **Per episode, after R3 (manual + agent):** v2 narration recorded in the
   web UI (§0.1) → `HAS_NARRATION = true` → `npm run produce -- <slug>` →
   confirm `matched: true` for ALL scenes (openers changed in every episode)
   → retune beats by `%` → full-timeline JPEG sweep → watch `final.mp4` →
   publish prep. The four retunes can run as parallel agents under the same
   ownership rules.
