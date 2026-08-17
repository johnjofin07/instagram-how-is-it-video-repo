# How's It — animated engineering explainers

Programmatic reels built with [Remotion](https://remotion.dev). One folder per
episode; shared visual system. Episode 001: **How Netflix Works**.

## Commands

```sh
npm install                      # once
npm run studio                   # live preview — every episode appears as a composition
npm run produce                  # narration.mp3 → synced final MP4 (latest episode)
npm run produce -- 001-netflix   # ...or a specific episode
npm run tts                      # ElevenLabs API narration (paid plan only)
```

## New episode checklist

1. Copy the shape of `src/episodes/001-netflix/`: `script.ts` (narration + scenes data), `scenes/*.tsx`, `index.ts` manifest
2. Register it in `src/episodes/index.ts`
3. Generate narration (ElevenLabs web UI, house voice settings in CLAUDE.md) → `public/episodes/<slug>/narration.mp3`
4. `npm run produce` → whisper transcribes, scenes/captions auto-sync, renders `out/<slug>/final.mp4`
5. Watch it fully, then publish

## Structure

- `src/episodes/<NNN-slug>/` — everything specific to one episode (script data, scene components, generated timing)
- `src/components/` — shared: Background (galaxy), Chrome (header + stepper), Captions (word-synced karaoke), ui primitives
- `src/theme.ts` — the channel's visual system
- `scripts/` — pipeline: transcribe → align → produce (+ tts for paid ElevenLabs)
- `out/<slug>/final.mp4` — final deliverable (faststart; `raw.mp4` beside it is pre-remux)

## Secrets

Copy `.env.example` → `.env`, add `ELEVENLABS_API_KEY`. Never commit `.env`.
# instagram-how-is-it-video-repo
