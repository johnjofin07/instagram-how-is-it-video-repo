# Zack style — experimental script mode

A second house style for scripts, reverse-engineered from 5 viral zackdfilms
reels (profiled 2026-08-21, raw data in `analysis/video-by-zackdfilms-*.md`).
STRUCTURE ONLY — never reuse his wording, imagery, or examples (CLAUDE.md
no-IP rule). We're testing this on a few episodes against our default style
and judging by retention. Log every attempt in the experiment log below.

## The formula (all 4 of his short explainers share this)

1. **32–38s, 84–104 words.** No intro, no outro.
2. **Zero silence.** One unbroken narration stream — no pause ≥250ms in any
   of the four. Ours run 2–9% silence. (Partly editing: breaths cut out.)
3. **Hook starts inside the mechanism and never names the topic.** Opens on
   a conditional/temporal clause — "When the…", "As you…", "If you…" — as if
   the explanation is already underway. The VISUAL introduces the subject;
   the words are at step 1. No "did you know", no topic sentence.
4. **Chain-link causality (the core device).** End of clause N becomes the
   subject of clause N+1: "…push tiny currents through the metal → as those
   currents move, the pan resists them → that resistance becomes heat."
   Long chained sentences (median 16–21 words vs our 5–6), glued with
   and/which/that/meaning/so. You can't drop out mid-chain.
5. **Zero questions.** In all five videos. Never ask — show.
6. **≤1 number per video.** Concreteness from sensory nouns (loaded springs,
   movie-theater nachos), not stats.
7. **Exactly one "but" pivot at 38–78%,** then escalate.
8. **End cold on the peak image.** Most extreme concrete consequence, full
   stop. No summary, no on-video CTA (CTA goes in the post caption). On IG
   loop the ending crashes straight into the hook.
9. **154–181 wpm** (ours: 130–154). Fast AND continuous.

His 143s story video shares 4, 7, 8 — the formula scales to long form.

## Writing a script in this mode

- Budget ~90–110 words total (our recorded pace ≈150 wpm → 35–45s).
- Draft the causal chain first as arrows (A → B → C → payoff), then prose it
  with the chain-link rule: repeat the previous clause's object as the next
  clause's subject.
- Hook = the first link of the chain, mid-action, topic unnamed. Scene 1's
  visual carries the reveal.
- One "but" roughly two-thirds in. Everything after it escalates.
- Last line = the single most extreme concrete image in the episode. Delete
  any sentence after it.
- Strip rhetorical questions (allow at most one, only if it IS the pivot).
- Max one number; convert the rest to physical comparisons.
- After TTS: trim inter-sentence gaps in the MP3 before `npm run produce`
  (align.mjs matches words not silences, so the pipeline is safe; caption
  line-breaks key off pauses, so spot-check them).

## Verifying a draft

Record/TTS it, then:

    npm run analyze -- --episode <slug>
    npm run analyze -- --compare <slug> --against video-by-zackdfilms-dchds1ullua

Targets: 0–2% silence, 1–2 beats, ≥155 wpm, median sentence ≥12w, 0–1
questions, one pivot, runtime ≤45s.

## Caveats

- n=5 hand-picked winners, no control group — this is his house style, not
  proven causation. The 90-day retention data decides, not this doc.
- His 3D animation never rests; zero-pause narration may feel breathless over
  calmer motion graphics. Watch the QA cut before committing.
- Chain-link prose fights our stepper/scene structure (his videos have no
  chapters). Scene boundaries still work — align.mjs finds them by words —
  but scene labels may need to feel lighter.

## Experiment log

| episode | mode | notes / retention result |
| --- | --- | --- |
| 011-shazam | zack-style | Built 2026-08-21, v2 same day (real-Shazam-app cold open — owner-approved logo exception; comprehension note below). 39.3s comp / 37.9s narration · 113w · **179 wpm** · **0% silence** · 1 beat · 0 questions · one "but" at 77%. Compare vs `video-by-zackdfilms-dchds1ullua`: pace +13, runtime +0.3s, silence 0 vs 0, beats 1 vs 1 — the closest structural match we have produced. Deviations logged: **no on-screen CTA** (rule 8 under test; CTA moved to the post caption), and the shared stepper was re-centred (x140–940) at the same time, so this episode is not a clean control for chrome layout. Retention: _pending_. |
| 012-airplane-toilet | zack-style | Built 2026-08-21, v2 + v3 same day (v3 = `papersky` cut-paper diorama skin — red plane / white clouds / sky-blue papers; plane-dive opening; paper hand). 43.5s comp / 42.1s narration · 114w · **163 wpm** · **2% silence** (3 pauses) · 1 beat · 0 questions · one "but" at 63%. Slightly over the 35–38s reference length. Same **no on-screen CTA** deviation. Retention: _pending_. |

### Production notes from the first two builds

- **Gap-trimming works and is required.** Both takes came out of the web UI at
  13–19% silence by a −42dB gate; capping every internal pause at 120ms landed
  011 at 0% and 012 at 2% on `analyze`'s ≥250ms measure, with no audible
  clipping. align.mjs matched all boundaries afterwards (it keys on words).
  Untrimmed takes are kept as `narration-untrimmed.mp3` next to each episode.
- **Hard cuts need `chrome.instantEnter`.** The shared header/stepper fade in
  over ~0.5s on every `Sequence`, which reads as the chrome blinking out at
  each zack-mode cut. `Episode.chrome.instantEnter` (added 2026-08-21) skips
  that fade; the default is unchanged, so 001–010 are untouched.
- **Zack rule 3 ("the words never name the topic; the VISUAL introduces the
  subject") failed comprehension on the first cuts of both episodes** — the
  owner reported viewers couldn't tell what either was about. Both v2 openings
  now make the SUBJECT itself the first visual (the real Shazam app screen;
  a labelled airplane) while narration stays zack-mode. If retention holds,
  that's the amendment to rule 3: open mid-action ON THE RECOGNIZABLE SUBJECT,
  not on the abstract mechanism.
- **Channel changes made during these builds (apply everywhere):** captions
  are now a bordered card + bold sans on every skin (mono captions are banned
  — owner rule, see memory), and scene art z-orders ABOVE the header/stepper
  (Root.tsx), so oversized props and zooms cross the chrome instead of
  sliding under it.
- **Continuity across a hard cut is manual.** Any value a scene animates must
  start at the previous scene's END value, not at zero — 011's constellation
  visibly retracted at the map→match cut until scene 2's `links` was started at
  0.69 instead of 0.42. Check every carried-over value at each cut.
