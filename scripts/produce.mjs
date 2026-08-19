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
  // crf 15: high-bitrate upload master — platforms re-encode, so feed them a
  // rich source (default crf starves dark gradients → banding after IG's pass).
  // scale 2 renders 2160×3840; final.mp4 downscales to the 1440×2560 delivery
  // spec (supersampled = sharper than rendering 1440 natively).
  `npx remotion render src/index.ts ${slug} "out/${slug}/raw.mp4" --scale 2 --crf 15 --color-space bt709 --overwrite`,
  "3/4 Rendering video (2160×3840 master)"
);
run(
  // 1440×2560 is the upload spec for BOTH platforms (Meta's recommended Reels
  // resolution; ≥1440p also gets YouTube's VP9 codec tier). bt709 tv-range
  // tags must be reasserted here because scaling re-encodes the stream.
  `npx remotion ffmpeg -i "out/${slug}/raw.mp4" -vf "scale=1440:2560:flags=lanczos" -c:v libx264 -crf 15 -preset slow -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart -y "out/${slug}/final.mp4"`,
  "4/4 Downscaling to 1440×2560 delivery + faststart"
);

console.log(`\n✅ Done: out/${slug}/final.mp4 — watch it before publishing.`);
