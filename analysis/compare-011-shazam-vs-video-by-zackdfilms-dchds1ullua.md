# 011-shazam  vs  video-by-zackdfilms-dchds1ullua

| metric | ours | reference | delta | |
| --- | ---: | ---: | ---: | --- |
| pace (wpm) | 179 | 166 | +13 | ▲ high |
| pace swing (wpm) | 73 | 61 | +12 | ok |
| runtime (s) | 37.9 | 37.6 | +0.3 | ok |
| sec / sentence | 6.3 | 5.4 | +0.9 | ▲ high |
| median sentence (w) | 17.5 | 16 | +1.5 | ok |
| longest sentence (w) | 28 | 22 | +6 | ▲ high |
| beats | 1 | 1 | 0 | ok |
| sec / beat | 37.9 | 37.6 | +0.3 | ok |
| silence (% runtime) | 0 | 0 | 0 | ok |
| hook words in 3s | 10 | 9 | +1 | ok |
| "you" / 100w | 2.7 | 2.9 | -0.2 | ok |
| numbers / 100w | 1.8 | 1 | +0.8 | ok |
| questions / 100w | 0 | 0 | 0 | ok |
| turn markers / 100w | 1.8 | 1.9 | -0.1 | ok |

## Hooks side by side

**Ours** (claim) — The second you hit that button, your phone stops hearing

**Reference** (claim) — If you spin a magnet under a cast-iron pan,

## Structural rhythm

```
  t     ours          reference
   0s  180 ███████████    168 ██████████
   5s  204 ████████████   156 █████████
  10s  132 ████████       144 ████████
  15s  192 ███████████    168 ██████████
  20s  180 ███████████    156 █████████
  25s  180 ███████████    168 ██████████
  30s  168 ██████████     180 ███████████
  35s  205 ████████████   205 ████████████
```

## Where the reference re-hooks

- 38% in — "but"
- 38% in — "instead"

Ours:

- 47% in — "until"
- 78% in — "but"

## What to change

- **pace (wpm)**: ours is above the reference by 13 — higher = more urgent; too high and it stops landing.
- **sec / sentence**: ours is above the reference by 0.9 — shorter = faster idea turnover.
- **longest sentence (w)**: ours is above the reference by 6 — a long sentence mid-reel is a drop-off.
