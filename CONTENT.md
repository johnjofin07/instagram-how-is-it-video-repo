# Content log & backlog

Single source of truth for what this channel has made and what's planned.
**Check the episode log before proposing or scripting any topic — no repeats.**
Update this file whenever an episode ships or an idea is added/rejected.

## Episode log

| #   | Slug                      | Topic                                                                            | Pillar           | Status      | Produced   | Published | Notes                                                                                                                                                        |
| --- | ------------------------- | -------------------------------------------------------------------------------- | ---------------- | ----------- | ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 001 | `001-netflix`             | How Netflix works (encoding ladder, adaptive streaming, Open Connect)            | Tech system      | ✅ Produced | 2026-08-17 | not yet   | Voice: Brian v3 (sp92/s26/sb75) · 89s · final at `out/001-netflix/final.mp4` · SUPERSEDED by 004 (retention remake) — keep unpublished                        |
| 002 | `002-google-maps-traffic` | Google Maps traffic (phones as speed probes, prediction, Berlin handcart hack)   | Tech system      | 🚀 published | 2026-08-17 | 2026-08-18 ~22:00 | Voice: Brian v3 (same settings) · 107s · first LIGHT skin (`maps` theme, cute cartoon cars) · final at `out/002-google-maps-traffic/final.mp4` · published with pre-lift captions (bottom 226) — source of the 5s-cliff retention data |
| 003 | `003-air-fryer`           | Air fryer (convection, boundary-layer blanket, why the crisp, marketing history) | Everyday machine | ✅ Produced | 2026-08-19 | not yet   | Voice: Brian v3 (same settings) · 89s · first machines-pillar episode · `kitchen` skin · v2 retention hook: v1 negation opener re-scripted claim-first ("hurricane in a bucket" on screen at 0.07s + vortex/rattle animation on the fryer), hook-only re-record spliced onto v1 tail at 8.63s (v1 audio kept as `narration-v1.mp3`) · final at `out/003-air-fryer/final.mp4` |
| 004 | `004-netflix-delivery`    | Netflix is a delivery company (remake of 001: same system, hook-first)           | Tech system      | ✅ Produced | 2026-08-19 | not yet   | Retention remake of 001 after ep-002's 5s-cliff data: claim on screen at 0.3s, `delivery` skin (parcel-depot metaphor), 94s. Voice: Brian v3 (same settings) · final at `out/004-netflix-delivery/final.mp4` (re-rendered with lifted captions) + cover.png + post.md  |
| 005 | `005-undersea-cables`     | Undersea cables (what's in one, why they break, how they're repaired)           | Tech system      | ✍️ Scripted | —          | not yet   | First sub-60s episode (141 words ≈ 51–57s) — the 4-scene structure IS the length constraint. New `abyss` skin (deep water column; cyan = light in the glass, amber = human/surface world, red only ever a break). Scenes built + full test render clean; NOT yet voiced — needs narration.mp3 then `npm run produce`. Build spec: `src/episodes/005-undersea-cables/plan.md` |

Status meanings: `💡 idea` → `✍️ scripted` → `🎙 voiced` → `✅ produced` → `🚀 published` (+ date).

**Sign-off (channel constant):** every episode ends with the per-pillar CTA —
"What **machine** should I break down next?" (machines pillar) / "What
**system** should I break down next?" (tech pillar).

## Backlog (curiosity-ranked, hooks pre-written)

Interleave pillars when scheduling (tech → machine → tech...) so the channel
establishes its two-lane identity. Hooks are specific surprising claims — never
"have you ever wondered".

**Retention rules (learned from ep-002's Instagram data, Aug 2026 — viewers
drop in the first 5s; avg watch = 8s, but whoever survives ~10s watches to the
end):** the surprising claim must be ON SCREEN as text by ~0.5s and fully
spoken by ~2s; open the curiosity loop by second 3; never open with negations
or setup ("X doesn't have..." → save debunks for after the claim); put the most
shareable story asset in the hook, not buried mid-video; keep total length as
tight as the story allows.

### Tech systems pillar

1. **UPI** — "When you pay the chai wala, no money actually moves. Not for hours." NPCI switch, banks settle in batches. Stepper: tap → NPCI → your bank → their bank → settlement. Strong India resonance + finance crossover. _Leading candidate for 003._
2. **WhatsApp delivery** — "WhatsApp delivers 100 billion messages a day... and can't open a single one." E2E encryption as lockboxes; blue-tick journey maps to stepper.
3. **Undersea cables** — ✍️ SCRIPTED + BUILT as `005-undersea-cables` (see episode log). ⚠️ Don't schedule right after Netflix — put a machines episode between 004 and 005.
   - **Cable cuts & the shark myth** (spin-off, from 005's cutting-room floor) — "Everyone blamed sharks for cutting the internet. Sharks have caused almost none of it." The 150–200 faults a year, anchors and trawlers doing ~2/3 of it, Google armoring a cable against sharks anyway, cable-laying at walking pace, lying bare on the mud with no trench, repeaters every ~50km running on thousands of volts pushed out from a hut on a beach. Enough material for a full episode — only schedule it well after 005 ships.
4. **Spotify shuffle** — "Spotify made shuffle LESS random... because true randomness felt broken." Humans perceive real randomness as patterns.
5. **Telemetry** — _angle TBD, too abstract as-is; needs a concrete carrier system._ Options: (a) F1 — "An F1 car streams over a million data points a second — the pit wall often knows something broke before the driver feels it." (b) Your phone — "Your apps filed hundreds of reports about you today. Here's what's in them." F1 is the more visual/animatable pick; phone angle is more relatable + privacy comment-bait.
6. **AI agent harness** ("Hermes and harness") — "The AI never touches your computer. It only writes text — something else does everything." Model as brain-in-a-jar; the harness is the messenger (Hermes) that carries its words out into the world as actions and carries results back. Loop maps perfectly to stepper: prompt → model writes → harness executes → result returns → repeat. Keep the word "harness" out of the hook — lead with the surprising claim, use Hermes as a mid-episode metaphor, not the title.
7. **AI text watermarking** — "Claude just started signing everything it writes — in a code made of the words it *didn't* pick." Aug 2026: Anthropic began watermarking Claude's text output (EU AI Act Art. 50), using the SynthID-Text approach. Mechanism: at each token the model has several equally-good next words; a secret key + the preceding words bias which one it picks. Any single choice looks normal — across a few hundred words the choices form a statistical fingerprint only a detector with the key can see. Survives copy-paste and some editing. Stepper: model picks a word → secret key tilts the dice → pattern accumulates → detector scores the text. Killer ending (comment-bait + honesty beat): it *fails* on short passages, heavy paraphrasing, older models and screenshots — so "AI detectors" that flunk students are still guessing. Strong topical + education/teacher crossover; ⚠️ ship soon while it's news. Verify current detector-API status before scripting.

### Everyday machines pillar

8. **Black box** — "The only part of a plane built to survive the crash... is a box designed to tell you why it happened." Orange, tail-mounted, survives 3,400g.
9. **Microwave** — "Your microwave has dead zones — that's the real reason the plate spins." Standing waves; why metal sparks; the door mesh.
10. **Noise-cancelling headphones** — "Your headphones don't block noise. They fight it — with anti-noise." Destructive interference; waves cancelling animates beautifully.
11. **Elevator dispatching** — "The close-door button probably does nothing. But the elevator is running an algorithm smarter than you think." Placebo buttons + dispatch logic; comment-bait ending.

## Rejected / avoid

- Reddit-story reels, AI-girl content, kids' AI cartoons — platform-policy and monetization dead ends (researched Aug 2026).
- Anything requiring IP imitation (cloned character voices, other channels' mascots).
