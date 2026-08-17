// Transcribes public/audio/narration.mp3 with whisper.cpp to get word-level
// timestamps. Output: .cache/whisper-captions.json (array of {text, startMs,
// endMs} per word). Run once per new narration: `node scripts/transcribe.mjs`
import whisperPkg from "@remotion/install-whisper-cpp";
const { installWhisperCpp, downloadWhisperModel, transcribe } = whisperPkg;

// Merge whisper tokens into words with ms timestamps.
// A token starting with a space begins a new word.
const tokensToWords = (whisperOutput) => {
  const words = [];
  for (const seg of whisperOutput.transcription ?? []) {
    for (const tok of seg.tokens ?? []) {
      const text = tok.text ?? "";
      if (text.startsWith("[_") || text.trim() === "") continue;
      const from = tok.offsets?.from ?? 0;
      const to = tok.offsets?.to ?? from;
      if (text.startsWith(" ") || words.length === 0) {
        words.push({ text: text.trim(), startMs: from, endMs: to });
      } else {
        const w = words[words.length - 1];
        w.text += text;
        w.endMs = to;
      }
    }
  }
  return words.filter((w) => w.text.length > 0);
};
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { readdirSync } from "node:fs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Episode slug: first CLI arg, else the latest episode folder
const slug =
  process.argv[2] ??
  readdirSync(resolve(root, "src/episodes"))
    .filter((d) => /^\d/.test(d))
    .sort()
    .at(-1);
console.log(`Episode: ${slug}`);
const whisperPath = resolve(root, ".cache/whisper");
const wavPath = resolve(root, `.cache/${slug}-16k.wav`);
mkdirSync(resolve(root, ".cache"), { recursive: true });

const WHISPER_VERSION = "1.5.5";
const MODEL = "base.en";

console.log("Installing whisper.cpp (cached after first run)...");
await installWhisperCpp({ to: whisperPath, version: WHISPER_VERSION });
await downloadWhisperModel({ model: MODEL, folder: whisperPath });

console.log("Converting mp3 → 16kHz wav...");
execSync(
  `npx remotion ffmpeg -i "${resolve(root, `public/episodes/${slug}/narration.mp3`)}" -ar 16000 -ac 1 -y "${wavPath}"`,
  { cwd: root, stdio: "pipe" }
);

console.log("Transcribing...");
const whisperOutput = await transcribe({
  inputPath: wavPath,
  whisperPath,
  whisperCppVersion: WHISPER_VERSION,
  model: MODEL,
  tokenLevelTimestamps: true,
});

const captions = tokensToWords(whisperOutput);
writeFileSync(
  resolve(root, `.cache/${slug}-whisper.json`),
  JSON.stringify(captions, null, 2)
);
console.log(
  `Saved ${captions.length} timed words → .cache/${slug}-whisper.json`
);
