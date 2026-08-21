# Script anatomy — 007-ai-watermark

_our episode · public/episodes/007-ai-watermark/narration.mp3 · whisper base.en_

## Vitals

| metric | value |
| --- | --- |
| runtime | 89.3s |
| words | 224 |
| average pace | **150 wpm** |
| pace swing (fastest 5s vs slowest) | 109 wpm |
| sentences | 24 (3.7s each) |
| sentence length | median 9w, p90 18w, longest 21w |
| speech beats | 2 (44.7s each) |
| silence | 1.9s across 5 pauses (2.1% of runtime) |
| "you" per 100 words | 2.2 |
| numbers per 100 words | 2.2 |
| questions per 100 words | 0.9 |

## Hook (first 3s)

> Did you know anthropic has been watermarking

- opening type: **question**
- 7 words in 3s (140 wpm)
- first breath at 2.7s

## Pacing curve (5s buckets)

```
   0s  144 wpm █████████████████████
   5s  156 wpm ███████████████████████
  10s  132 wpm ███████████████████
  15s  132 wpm ███████████████████
  20s  180 wpm ██████████████████████████
  25s  144 wpm █████████████████████
  30s  144 wpm █████████████████████
  35s  168 wpm █████████████████████████
  40s  144 wpm █████████████████████
  45s  144 wpm █████████████████████
  50s  144 wpm █████████████████████
  55s  144 wpm █████████████████████
  60s  180 wpm ██████████████████████████
  65s  156 wpm ███████████████████████
  70s  144 wpm █████████████████████
  75s  156 wpm ███████████████████████
  80s  192 wpm ████████████████████████████
  85s   83 wpm ████████████
```

Fastest at 80s (192), slowest at 85s (83).

## Beat map

Every run of speech between real breaths — the structural skeleton.

- **0–15s** (36w, 144 wpm) — Did you know anthropic has been watermarking your text? Since August, everything Claude writes carries a hidden signature. You can't see it. Copy paste won't remove it. The trick is genius. But it has one embarrassing
- **15.7–89.3s** (188w, 153 wpm) — flaw. And it's already failing students. A new law in Europe says if a computer wrote something, people should be able to find out. So since August 2nd, every new Claude model leaves a secret mark inside its own writing, not just in Europe, everywhere. So how do you hide a mark inside words? When Claude writes, it often has two words that both work. The cat sat on the mat, or the rug, both fine. So it flips a coin to pick. Wait, come closer. The coin is rigged. It lands on one side more often than it should. One rigged flip looks totally normal. But Claude writes hundreds of words, hundreds of rigged flips, and they add up. A detector that knows the trick counts them and goes, too many heads, no human writes like this. This was Claude. But the trick has weak spots, a short text, not enough flips to count. Rewrite it in your own words, the mark washes away, and the official counting tool isn't even out yet. So that AI checker that failed someone's essay, it was guessing. There's the flaw.

## Turn markers

Where the script re-hooks (curiosity gaps, reversals, payoffs).

- 12.9s (14% in) — "but"
- 47.8s (54% in) — "wait"
- 57.8s (65% in) — "but"
- 71.3s (80% in) — "but"

## Questions asked

- 0s (0% in) — Did you know anthropic has been watermarking your text?
- 34s (38% in) — So how do you hide a mark inside words?

## Claim density (per 10s)

```
   0s  4 ████████████████████
  10s  4 ████████████████████
  20s  1 █████
  30s  2 ██████████
  40s  4 ████████████████████
  50s  3 ███████████████
  60s  2 ██████████
  70s  2 ██████████
  80s  2 ██████████
```

## Transcript

Did you know anthropic has been watermarking your text? Since August, everything Claude writes carries a hidden signature. You can't see it. Copy paste won't remove it. The trick is genius. But it has one embarrassing flaw. And it's already failing students. A new law in Europe says if a computer wrote something, people should be able to find out. So since August 2nd, every new Claude model leaves a secret mark inside its own writing, not just in Europe, everywhere. So how do you hide a mark inside words? When Claude writes, it often has two words that both work. The cat sat on the mat, or the rug, both fine. So it flips a coin to pick. Wait, come closer. The coin is rigged. It lands on one side more often than it should. One rigged flip looks totally normal. But Claude writes hundreds of words, hundreds of rigged flips, and they add up. A detector that knows the trick counts them and goes, too many heads, no human writes like this. This was Claude. But the trick has weak spots, a short text, not enough flips to count. Rewrite it in your own words, the mark washes away, and the official counting tool isn't even out yet. So that AI checker that failed someone's essay, it was guessing. There's the flaw.
