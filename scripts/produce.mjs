// One-command production: narration.mp3 → synced, player-ready MP4.
// Usage: npm run produce [-- <episode-slug>]   (defaults to latest episode)
// Steps: transcribe (whisper) → align scenes/captions → render → faststart remux.
import { execSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const slug =
  process.argv[2] ??
  readdirSync(resolve(root, "src/episodes"))
    .filter((d) => /^\d/.test(d))
    .sort()
    .at(-1);

const run = (cmd, label) => {
  console.log(`\n▶ ${label}`);
  execSync(cmd, { cwd: root, stdio: "inherit" });
};

const audio = resolve(root, `public/episodes/${slug}/narration.mp3`);
if (!existsSync(audio)) {
  console.error(`Missing ${audio} — generate the narration first.`);
  process.exit(1);
}

console.log(`Producing episode: ${slug}`);
run(`node scripts/transcribe.mjs ${slug}`, "1/4 Transcribing narration (whisper)");
run(`node scripts/align.mjs ${slug}`, "2/4 Aligning scenes + captions to voice");
run(
  `npx remotion render src/index.ts ${slug} "out/${slug}/raw.mp4" --overwrite`,
  "3/4 Rendering video"
);
run(
  `npx remotion ffmpeg -i "out/${slug}/raw.mp4" -c:v copy -c:a aac -b:a 192k -ac 2 -movflags +faststart -y "out/${slug}/final.mp4"`,
  "4/4 Remuxing (faststart, player-friendly)"
);

console.log(`\n✅ Done: out/${slug}/final.mp4 — watch it before publishing.`);
