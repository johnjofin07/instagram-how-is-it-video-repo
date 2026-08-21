# 009-noise-cancel  vs  010-elevator

| metric | ours | reference | delta | |
| --- | ---: | ---: | ---: | --- |
| pace (wpm) | 130 | 154 | -24 | ▼ low |
| pace swing (wpm) | 84 | 84 | 0 | ok |
| runtime (s) | 61.4 | 65.5 | -4.1 | ok |
| sec / sentence | 2.8 | 2.8 | 0 | ok |
| median sentence (w) | 5 | 6 | -1 | ok |
| longest sentence (w) | 14 | 15 | -1 | ok |
| beats | 3 | 5 | -2 | ok |
| sec / beat | 20.5 | 13.1 | +7.4 | ▲ high |
| silence (% runtime) | 4.1 | 9.3 | -5.2 | ▼ low |
| hook words in 3s | 6 | 9 | -3 | ▼ low |
| "you" / 100w | 3 | 4.2 | -1.2 | ▼ low |
| numbers / 100w | 3.8 | 1.8 | +2 | ▲ high |
| questions / 100w | 2.3 | 1.8 | +0.5 | ok |
| turn markers / 100w | 2.3 | 2.4 | -0.1 | ok |

## Hooks side by side

**Ours** (question) — How does your headphones' noise canceling

**Reference** (question) — The close button in your elevator? It's a dummy!

## Structural rhythm

```
  t     ours          reference
   0s   96 ██████         180 ███████████
   5s  144 ████████       168 ██████████
  10s  108 ██████         120 ███████
  15s  132 ████████       132 ████████
  20s  180 ███████████    144 ████████
  25s  144 ████████       144 ████████
  30s  108 ██████         132 ████████
  35s   96 ██████         204 ████████████
  40s  132 ████████       132 ████████
  45s  156 █████████      132 ████████
  50s  120 ███████        192 ███████████
  55s  120 ███████        180 ███████████
  60s                     156 █████████
```

## Where the reference re-hooks

- 23% in — "wait"
- 62% in — "which is why"
- 70% in — "so why"
- 92% in — "next time"

Ours:

- 5% in — "actually"
- 73% in — "but"
- 98% in — "but"

## What to change

- **pace (wpm)**: ours is below the reference by 24 — higher = more urgent; too high and it stops landing.
- **silence (% runtime)**: ours is below the reference by 5.2 — breath is what makes a beat land.
- **hook words in 3s**: ours is below the reference by 3 — the whole video is decided here.
- **"you" / 100w**: ours is below the reference by 1.2 — direct address keeps the viewer implicated.
- **numbers / 100w**: ours is above the reference by 2 — concrete numbers beat adjectives.
