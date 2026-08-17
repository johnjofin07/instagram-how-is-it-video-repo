// Generates narration audio via ElevenLabs with character-level timestamps.
// Usage: put ELEVENLABS_API_KEY in .env (or the environment), then `npm run tts`.
// Writes public/audio/narration.mp3 and public/audio/alignment.json.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Minimal .env loader (no dependency needed)
const envPath = resolve(root, ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY || API_KEY === "paste_your_key_here") {
  console.error("Missing ELEVENLABS_API_KEY. Copy .env.example to .env and add your key.");
  process.exit(1);
}

const VOICE_ID = "gPPH6SLdL8XSX6GNJ40G";

// Episode slug: first CLI arg, else the latest episode folder
import { readdirSync } from "node:fs";
const slug =
  process.argv[2] ??
  readdirSync(resolve(root, "src/episodes"))
    .filter((d) => /^\d/.test(d))
    .sort()
    .at(-1);
console.log(`Episode: ${slug}`);

// Narration comes from the episode's script.ts
const scriptTs = readFileSync(resolve(root, `src/episodes/${slug}/script.ts`), "utf8");
const narrations = [...scriptTs.matchAll(/narration:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g)].map((m) =>
  m[1].replace(/\\"/g, '"')
);
if (narrations.length === 0) {
  console.error("Could not extract narration from src/script.ts");
  process.exit(1);
}
const text = narrations.join("\n\n");
console.log(`Narration: ${text.split(/\s+/).length} words, ${narrations.length} scenes`);

const res = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`,
  {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.75,
        style: 0.2,
        use_speaker_boost: true,
      },
    }),
  }
);

if (!res.ok) {
  console.error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  process.exit(1);
}

const data = await res.json();
writeFileSync(
  resolve(root, `public/episodes/${slug}/narration.mp3`),
  Buffer.from(data.audio_base64, "base64")
);
writeFileSync(
  resolve(root, `public/episodes/${slug}/alignment.json`),
  JSON.stringify(data.alignment ?? data.normalized_alignment ?? null, null, 2)
);

const align = data.alignment ?? data.normalized_alignment;
const duration = align ? align.character_end_times_seconds.at(-1) : null;
console.log(`Saved public/episodes/${slug}/narration.mp3${duration ? ` (${duration.toFixed(1)}s)` : ""}`);
console.log(`\nNext: npm run produce -- ${slug}`);
