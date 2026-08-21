# 012-airplane-toilet  vs  video-by-zackdfilms-dchds1ullua

| metric | ours | reference | delta | |
| --- | ---: | ---: | ---: | --- |
| pace (wpm) | 163 | 166 | -3 | ok |
| pace swing (wpm) | 72 | 61 | +11 | ok |
| runtime (s) | 42.1 | 37.6 | +4.5 | ok |
| sec / sentence | 6 | 5.4 | +0.6 | ok |
| median sentence (w) | 14 | 16 | -2 | ok |
| longest sentence (w) | 32 | 22 | +10 | ▲ high |
| beats | 1 | 1 | 0 | ok |
| sec / beat | 42.1 | 37.6 | +4.5 | ▲ high |
| silence (% runtime) | 2 | 0 | +2 | ok |
| hook words in 3s | 10 | 9 | +1 | ok |
| "you" / 100w | 2.6 | 2.9 | -0.3 | ok |
| numbers / 100w | 1.8 | 1 | +0.8 | ok |
| questions / 100w | 0 | 0 | 0 | ok |
| turn markers / 100w | 1.8 | 1.9 | -0.1 | ok |

## Hooks side by side

**Ours** (claim) — The moment you press that flush button, a valve snaps

**Reference** (claim) — If you spin a magnet under a cast-iron pan,

## Structural rhythm

```
  t     ours          reference
   0s  180 ███████████    168 ██████████
   5s  168 ██████████     156 █████████
  10s  144 ████████       144 ████████
  15s  168 ██████████     168 ██████████
  20s  156 █████████      156 █████████
  25s  204 ████████████   168 ██████████
  30s  132 ████████       180 ███████████
  35s  156 █████████      205 ████████████
  40s  144 ████████           
```

## Where the reference re-hooks

- 38% in — "but"
- 38% in — "instead"

Ours:

- 63% in — "but"
- 81% in — "until"

## What to change

- **longest sentence (w)**: ours is above the reference by 10 — a long sentence mid-reel is a drop-off.
