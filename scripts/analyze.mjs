// Script anatomy analyzer. Takes any video/audio (a reference reel that
// performed well, or one of our own episodes), transcribes it with the same
// whisper.cpp setup produce.mjs uses, and writes a structural profile:
// pacing curve, pause/beat map, sentence rhythm, hook shape, hook-and-payoff
// markers. The point is to copy STRUCTURE, never words — see CLAUDE.md
// ("No IP imitation ... Original content only").
//
//   node scripts/analyze.mjs <file|folder> [...]   profile reference clips
//   node scripts/analyze.mjs --episode <slug>      profile one of our episodes
//   node scripts/analyze.mjs --compare <a> --against <b>   diff two profiles
//
// <a>/<b> are a profile name, an analysis/*.json path, or an episode slug.
// Profiles land in analysis/<name>.json plus a readable analysis/<name>.md.
import whisperPkg from "@remotion/install-whisper-cpp";
const { installWhisperCpp, downloadWhisperModel, transcribe } = whisperPkg;

import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, extname, resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const whisperPath = resolve(root, ".cache/whisper");
const analysisDir = resolve(root, "analysis");

const WHISPER_VERSION = "1.5.5";
const MEDIA_EXT = new Set([
  ".mp4", ".mov", ".mkv", ".webm", ".m4v", ".avi",
  ".mp3", ".wav", ".m4a", ".aac", ".flac", ".ogg",
]);

// ---------------------------------------------------------------- cli args
const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};
const has = (name) => argv.includes(`--${name}`);
// Positional inputs = everything that is not a flag or a flag's value.
const VALUE_FLAGS = new Set(["model", "episode", "compare", "against", "label"]);
const inputs = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith("--")) {
    if (VALUE_FLAGS.has(a.slice(2))) i++;
    continue;
  }
  inputs.push(a);
}
const MODEL = flag("model") ?? "base.en";
const FORCE = has("force");

// ------------------------------------------------------------- transcribing
// Same token→word merge as transcribe.mjs: a token starting with a space
// begins a new word. Punctuation stays attached, which is what lets us
// segment sentences below.
const tokensToWords = (whisperOutput) => {
  const words = [];
  for (const seg of whisperOutput.transcription ?? []) {
    for (const tok of seg.tokens ?? []) {
      const text = tok.text ?? "";
      const t = text.trim();
      if (text.startsWith("[_") || t === "") continue;
      // music/noise annotations, not speech
      if (/^[\[(♪*]/.test(t) || /[\])♪]$/.test(t) && /music|applause|laugh|noise/i.test(t)) continue;
      if (/^\[.*\]$/.test(t) || /^\(.*\)$/.test(t) || t === "♪") continue;
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

let whisperReady = false;
const ensureWhisper = async () => {
  if (whisperReady) return;
  await installWhisperCpp({ to: whisperPath, version: WHISPER_VERSION });
  await downloadWhisperModel({ model: MODEL, folder: whisperPath });
  whisperReady = true;
};

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

// Extract audio → 16kHz mono wav, then transcribe. Cached in .cache/ keyed by
// name + mtime + size so re-running on the same clip is instant.
const wordsFor = async (mediaPath, name) => {
  const st = statSync(mediaPath);
  const key = `${name}-${Math.round(st.mtimeMs)}-${st.size}`;
  const cachePath = resolve(root, `.cache/analyze-${key}.json`);
  if (existsSync(cachePath) && !FORCE) {
    console.log(`  cached transcript → ${cachePath.replace(root + "/", "")}`);
    return JSON.parse(readFileSync(cachePath, "utf8"));
  }

  mkdirSync(resolve(root, ".cache"), { recursive: true });
  const wavPath = resolve(root, `.cache/analyze-${key}.wav`);
  console.log("  extracting audio → 16kHz wav...");
  try {
    execSync(
      `npx remotion ffmpeg -i "${mediaPath}" -vn -ar 16000 -ac 1 -y "${wavPath}"`,
      { cwd: root, stdio: "pipe" }
    );
  } catch (e) {
    const msg = (e.stderr?.toString() || e.message || "").slice(-400);
    throw new Error(`ffmpeg failed on ${mediaPath} (no audio track?)\n${msg}`);
  }

  await ensureWhisper();
  console.log(`  transcribing with ${MODEL}...`);
  const out = await transcribe({
    inputPath: wavPath,
    whisperPath,
    whisperCppVersion: WHISPER_VERSION,
    model: MODEL,
    tokenLevelTimestamps: true,
  });
  const words = tokensToWords(out);
  writeFileSync(cachePath, JSON.stringify(words, null, 2));
  console.log(`  ${words.length} timed words`);
  return words;
};

// ------------------------------------------------------------- the analysis
const TERMINAL = /[.!?…]["”'’)]*$/;
// Phrases that re-open a curiosity gap or land a payoff. Matched as word
// sequences; longest wins when several overlap.
const PIVOTS = [
  "but here", "here's the", "here is the", "the twist", "turns out",
  "the problem is", "the catch", "which means", "which is why", "the reason",
  "the thing is", "so instead", "and that's why", "that's the trick",
  "so why", "here's why", "except", "actually", "instead", "next time",
  "wait", "until", "but", "now",
];
const NUMBERISH = /(^|[^a-z])(\d|one|two|three|four|five|six|seven|eight|nine|ten|hundred|thousand|million|billion|trillion)/i;

const clean = (w) => w.replace(/[^\p{L}\p{N}'’-]/gu, "").toLowerCase();
const median = (arr) => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const pct = (arr, p) => {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
};
const r1 = (n) => Math.round(n * 10) / 10;

const analyze = (words, meta) => {
  const startMs = words[0].startMs;
  const endMs = words[words.length - 1].endMs;
  const durationSec = (endMs - startMs) / 1000;
  const at = (w) => (w.startMs - startMs) / 1000; // seconds from first word
  const transcript = words.map((w) => w.text).join(" ");

  // --- sentences. Whisper punctuates; if it didn't, fall back to pauses.
  const punctuated = words.filter((w) => TERMINAL.test(w.text)).length;
  const usePunct = punctuated >= Math.max(3, words.length / 40);
  const sentences = [];
  let cur = [];
  for (let i = 0; i < words.length; i++) {
    cur.push(words[i]);
    const next = words[i + 1];
    const gap = next ? next.startMs - words[i].endMs : Infinity;
    const ends = usePunct ? TERMINAL.test(words[i].text) : gap >= 400;
    if (ends || !next) {
      sentences.push({
        startSec: r1(at(cur[0])),
        endSec: r1((cur[cur.length - 1].endMs - startMs) / 1000),
        words: cur.length,
        text: cur.map((w) => w.text).join(" "),
      });
      cur = [];
    }
  }
  const sentLens = sentences.map((s) => s.words);

  // --- pacing curve, 5s buckets
  const BUCKET = 5;
  const wpmCurve = [];
  for (let lo = 0; lo < durationSec; lo += BUCKET) {
    const hi = Math.min(durationSec, lo + BUCKET);
    // a sliver of a bucket at the tail would read as a fake 0-wpm dead spot
    if (hi - lo < 1.5 && wpmCurve.length) break;
    const n = words.filter((w) => at(w) >= lo && at(w) < hi).length;
    wpmCurve.push({ tSec: lo, wpm: Math.round(n / ((hi - lo) / 60)) });
  }

  // --- pauses & beats. A beat is a run of speech between real breaths;
  // these are the edit points a viral reel is actually built out of.
  const pauses = [];
  for (let i = 0; i < words.length - 1; i++) {
    const gap = words[i + 1].startMs - words[i].endMs;
    if (gap >= 250) pauses.push({ atSec: r1((words[i].endMs - startMs) / 1000), ms: Math.round(gap) });
  }
  const BEAT_GAP = 450;
  const beats = [];
  let beat = [words[0]];
  for (let i = 1; i < words.length; i++) {
    if (words[i].startMs - words[i - 1].endMs >= BEAT_GAP) {
      beats.push(beat);
      beat = [];
    }
    beat.push(words[i]);
  }
  beats.push(beat);
  const beatList = beats
    .filter((b) => b.length)
    .map((b) => ({
      startSec: r1(at(b[0])),
      endSec: r1((b[b.length - 1].endMs - startMs) / 1000),
      words: b.length,
      wpm: Math.round(
        b.length / (Math.max(0.4, (b[b.length - 1].endMs - b[0].startMs) / 1000) / 60)
      ),
      text: b.map((w) => w.text).join(" "),
    }));

  // --- hook
  const first = (sec) => words.filter((w) => at(w) < sec).map((w) => w.text).join(" ");
  const hook3 = first(3);
  const hookWords = words.filter((w) => at(w) < 3).length;
  const firstSentence = sentences[0]?.text ?? "";
  const openingType = /\?$/.test(firstSentence.trim())
    ? "question"
    : NUMBERISH.test(firstSentence.split(/\s+/).slice(0, 6).join(" "))
      ? "stat"
      : /^(you|your|imagine|watch|look|try|stop|never|don't)\b/i.test(firstSentence.trim())
        ? "second-person / imperative"
        : "claim";

  // --- density markers
  const lower = transcript.toLowerCase();
  const per100 = (n) => r1((n / words.length) * 100);
  const youCount = words.filter((w) => ["you", "your", "you're", "yours", "youre"].includes(clean(w.text))).length;
  const NUM_WORDS = new Set([
    "zero","one","two","three","four","five","six","seven","eight","nine","ten",
    "eleven","twelve","twenty","thirty","forty","fifty","sixty","seventy","eighty",
    "ninety","hundred","thousand","million","billion","trillion","half","twice","double",
  ]);
  const numCount = words.filter(
    (w) => /\d/.test(w.text) || NUM_WORDS.has(clean(w.text))
  ).length;
  const questions = sentences
    .filter((s) => /\?/.test(s.text))
    .map((s) => ({ atSec: s.startSec, pos: Math.round((s.startSec / durationSec) * 100) / 100, text: s.text }));
  // Match pivot phrases as word sequences, not substrings — plain indexOf
  // finds "but" inside "button".
  const normWords = words.map((w) => clean(w.text));
  const pivotHits = [];
  for (const phrase of PIVOTS) {
    const seq = phrase.split(" ").map((x) => x.replace(/[^a-z']/g, ""));
    for (let i = 0; i + seq.length <= normWords.length; i++) {
      let ok = true;
      for (let k = 0; k < seq.length; k++) {
        const a = normWords[i + k];
        // "here's" survives clean() as "here's"; compare loosely on apostrophes
        if (a.replace(/'/g, "") !== seq[k].replace(/'/g, "")) { ok = false; break; }
      }
      if (!ok) continue;
      pivotHits.push({ phrase, atSec: r1(at(words[i])), pos: Math.round((at(words[i]) / durationSec) * 100) / 100, wordIndex: i });
    }
  }
  pivotHits.sort((a, b) => a.wordIndex - b.wordIndex || b.phrase.length - a.phrase.length);
  // keep the longest phrase when several match the same spot ("but here" > "but")
  const claimed = new Set();
  const pivots = [];
  for (const h of pivotHits) {
    const span = h.phrase.split(" ").length;
    let overlap = false;
    for (let k = 0; k < span; k++) if (claimed.has(h.wordIndex + k)) overlap = true;
    if (overlap) continue;
    for (let k = 0; k < span; k++) claimed.add(h.wordIndex + k);
    pivots.push({ phrase: h.phrase, atSec: h.atSec, pos: h.pos });
  }
  pivots.sort((a, b) => a.atSec - b.atSec);

  // --- claim density per 10s window
  const claimsPer10s = [];
  for (let t = 0; t < durationSec; t += 10) {
    claimsPer10s.push({
      tSec: t,
      sentences: sentences.filter((s) => s.startSec >= t && s.startSec < t + 10).length,
    });
  }

  return {
    name: meta.name,
    source: meta.source,
    kind: meta.kind,
    model: MODEL,
    durationSec: r1(durationSec),
    words: words.length,
    wpm: Math.round(words.length / (durationSec / 60)),
    hook: {
      text3s: hook3,
      wordsIn3s: hookWords,
      wpm3s: Math.round(hookWords / 0.05),
      firstSentence,
      openingType,
      timeToFirstPauseSec: pauses.length ? pauses[0].atSec : r1(durationSec),
    },
    sentences: {
      count: sentences.length,
      meanWords: r1(sentLens.reduce((a, b) => a + b, 0) / Math.max(1, sentLens.length)),
      medianWords: median(sentLens),
      p90Words: pct(sentLens, 90),
      shortest: Math.min(...sentLens),
      longest: Math.max(...sentLens),
      secondsPerSentence: r1(durationSec / Math.max(1, sentences.length)),
      list: sentences,
    },
    pacing: {
      curve: wpmCurve,
      fastest: wpmCurve.reduce((a, b) => (b.wpm > a.wpm ? b : a), wpmCurve[0]),
      slowest: wpmCurve.reduce((a, b) => (b.wpm < a.wpm ? b : a), wpmCurve[0]),
      swing: Math.max(...wpmCurve.map((b) => b.wpm)) - Math.min(...wpmCurve.map((b) => b.wpm)),
    },
    silence: {
      pauseCount: pauses.length,
      totalPauseSec: r1(pauses.reduce((a, p) => a + p.ms, 0) / 1000),
      pausePctOfRuntime: r1((pauses.reduce((a, p) => a + p.ms, 0) / 1000 / durationSec) * 100),
      longest: pauses.reduce((a, p) => (p.ms > (a?.ms ?? 0) ? p : a), null),
      list: pauses,
    },
    beats: { count: beatList.length, meanSec: r1(durationSec / Math.max(1, beatList.length)), list: beatList },
    density: {
      questionsPer100w: per100(questions.length),
      youPer100w: per100(youCount),
      numbersPer100w: per100(numCount),
      pivotsPer100w: per100(pivots.length),
    },
    questions,
    pivots,
    claimsPer10s,
    transcript,
  };
};

// ------------------------------------------------------------- the report
const bar = (v, max, width = 28) =>
  "█".repeat(Math.max(0, Math.round((v / Math.max(1, max)) * width)));

const report = (p) => {
  const L = [];
  L.push(`# Script anatomy — ${p.name}`);
  L.push("");
  L.push(`_${p.kind} · ${p.source} · whisper ${p.model}_`);
  L.push("");
  L.push("## Vitals");
  L.push("");
  L.push("| metric | value |");
  L.push("| --- | --- |");
  L.push(`| runtime | ${p.durationSec}s |`);
  L.push(`| words | ${p.words} |`);
  L.push(`| average pace | **${p.wpm} wpm** |`);
  L.push(`| pace swing (fastest 5s vs slowest) | ${p.pacing.swing} wpm |`);
  L.push(`| sentences | ${p.sentences.count} (${p.sentences.secondsPerSentence}s each) |`);
  L.push(`| sentence length | median ${p.sentences.medianWords}w, p90 ${p.sentences.p90Words}w, longest ${p.sentences.longest}w |`);
  L.push(`| speech beats | ${p.beats.count} (${p.beats.meanSec}s each) |`);
  L.push(`| silence | ${p.silence.totalPauseSec}s across ${p.silence.pauseCount} pauses (${p.silence.pausePctOfRuntime}% of runtime) |`);
  L.push(`| "you" per 100 words | ${p.density.youPer100w} |`);
  L.push(`| numbers per 100 words | ${p.density.numbersPer100w} |`);
  L.push(`| questions per 100 words | ${p.density.questionsPer100w} |`);
  L.push("");
  L.push("## Hook (first 3s)");
  L.push("");
  L.push(`> ${p.hook.text3s}`);
  L.push("");
  L.push(`- opening type: **${p.hook.openingType}**`);
  L.push(`- ${p.hook.wordsIn3s} words in 3s (${p.hook.wpm3s} wpm)`);
  L.push(`- first breath at ${p.hook.timeToFirstPauseSec}s`);
  L.push("");
  L.push("## Pacing curve (5s buckets)");
  L.push("");
  L.push("```");
  const maxWpm = Math.max(...p.pacing.curve.map((b) => b.wpm));
  for (const b of p.pacing.curve) {
    L.push(`${String(b.tSec).padStart(4)}s ${String(b.wpm).padStart(4)} wpm ${bar(b.wpm, maxWpm)}`);
  }
  L.push("```");
  L.push("");
  L.push(`Fastest at ${p.pacing.fastest.tSec}s (${p.pacing.fastest.wpm}), slowest at ${p.pacing.slowest.tSec}s (${p.pacing.slowest.wpm}).`);
  L.push("");
  L.push("## Beat map");
  L.push("");
  L.push("Every run of speech between real breaths — the structural skeleton.");
  L.push("");
  for (const b of p.beats.list) {
    L.push(`- **${b.startSec}–${b.endSec}s** (${b.words}w, ${b.wpm} wpm) — ${b.text}`);
  }
  L.push("");
  if (p.pivots.length) {
    L.push("## Turn markers");
    L.push("");
    L.push("Where the script re-hooks (curiosity gaps, reversals, payoffs).");
    L.push("");
    for (const v of p.pivots) L.push(`- ${v.atSec}s (${Math.round(v.pos * 100)}% in) — "${v.phrase}"`);
    L.push("");
  }
  if (p.questions.length) {
    L.push("## Questions asked");
    L.push("");
    for (const q of p.questions) L.push(`- ${q.atSec}s (${Math.round(q.pos * 100)}% in) — ${q.text}`);
    L.push("");
  }
  L.push("## Claim density (per 10s)");
  L.push("");
  L.push("```");
  const maxC = Math.max(...p.claimsPer10s.map((c) => c.sentences));
  for (const c of p.claimsPer10s) {
    L.push(`${String(c.tSec).padStart(4)}s ${String(c.sentences).padStart(2)} ${bar(c.sentences, maxC, 20)}`);
  }
  L.push("```");
  L.push("");
  L.push("## Transcript");
  L.push("");
  L.push(p.transcript);
  L.push("");
  return L.join("\n");
};

// ------------------------------------------------------------- compare mode
const loadProfile = (ref) => {
  const candidates = [
    resolve(root, ref),
    resolve(analysisDir, ref),
    resolve(analysisDir, `${ref}.json`),
    resolve(analysisDir, `${slugify(ref)}.json`),
  ];
  for (const c of candidates) {
    if (existsSync(c) && c.endsWith(".json")) return JSON.parse(readFileSync(c, "utf8"));
  }
  throw new Error(
    `No profile for "${ref}". Run: node scripts/analyze.mjs --episode ${ref}   (or point at analysis/<name>.json)`
  );
};

const compare = (mine, ref) => {
  const rows = [
    ["pace (wpm)", mine.wpm, ref.wpm, 12, "higher = more urgent; too high and it stops landing"],
    ["pace swing (wpm)", mine.pacing.swing, ref.pacing.swing, 20, "flat delivery is the #1 retention leak"],
    ["runtime (s)", mine.durationSec, ref.durationSec, 8, ""],
    ["sec / sentence", mine.sentences.secondsPerSentence, ref.sentences.secondsPerSentence, 0.8, "shorter = faster idea turnover"],
    ["median sentence (w)", mine.sentences.medianWords, ref.sentences.medianWords, 2, ""],
    ["longest sentence (w)", mine.sentences.longest, ref.sentences.longest, 5, "a long sentence mid-reel is a drop-off"],
    ["beats", mine.beats.count, ref.beats.count, 3, ""],
    ["sec / beat", mine.beats.meanSec, ref.beats.meanSec, 0.8, ""],
    ["silence (% runtime)", mine.silence.pausePctOfRuntime, ref.silence.pausePctOfRuntime, 4, "breath is what makes a beat land"],
    ["hook words in 3s", mine.hook.wordsIn3s, ref.hook.wordsIn3s, 2, "the whole video is decided here"],
    ['"you" / 100w', mine.density.youPer100w, ref.density.youPer100w, 1, "direct address keeps the viewer implicated"],
    ["numbers / 100w", mine.density.numbersPer100w, ref.density.numbersPer100w, 1.5, "concrete numbers beat adjectives"],
    ["questions / 100w", mine.density.questionsPer100w, ref.density.questionsPer100w, 1, ""],
    ["turn markers / 100w", mine.density.pivotsPer100w, ref.density.pivotsPer100w, 1.5, "re-hooks; without them the middle sags"],
  ];
  const L = [];
  L.push(`# ${mine.name}  vs  ${ref.name}`);
  L.push("");
  L.push("| metric | ours | reference | delta | |");
  L.push("| --- | ---: | ---: | ---: | --- |");
  const notes = [];
  for (const [label, a, b, tol, why] of rows) {
    const d = r1(a - b);
    const off = Math.abs(d) > tol;
    L.push(`| ${label} | ${a} | ${b} | ${d > 0 ? "+" : ""}${d} | ${off ? (d > 0 ? "▲ high" : "▼ low") : "ok"} |`);
    if (off && why) notes.push(`- **${label}**: ours is ${d > 0 ? "above" : "below"} the reference by ${Math.abs(d)} — ${why}.`);
  }
  L.push("");
  L.push("## Hooks side by side");
  L.push("");
  L.push(`**Ours** (${mine.hook.openingType}) — ${mine.hook.text3s}`);
  L.push("");
  L.push(`**Reference** (${ref.hook.openingType}) — ${ref.hook.text3s}`);
  L.push("");
  if (mine.hook.openingType !== ref.hook.openingType) {
    L.push(`Different opening move: reference opens with a **${ref.hook.openingType}**, ours with a **${mine.hook.openingType}**.`);
    L.push("");
  }
  L.push("## Structural rhythm");
  L.push("");
  L.push("```");
  const n = Math.max(mine.pacing.curve.length, ref.pacing.curve.length);
  const maxW = Math.max(...[...mine.pacing.curve, ...ref.pacing.curve].map((b) => b.wpm));
  L.push("  t     ours          reference");
  for (let i = 0; i < n; i++) {
    const a = mine.pacing.curve[i];
    const b = ref.pacing.curve[i];
    L.push(
      `${String(i * 5).padStart(4)}s ${String(a?.wpm ?? "").padStart(4)} ${bar(a?.wpm ?? 0, maxW, 12).padEnd(12)}  ${String(b?.wpm ?? "").padStart(4)} ${bar(b?.wpm ?? 0, maxW, 12)}`
    );
  }
  L.push("```");
  L.push("");
  L.push("## Where the reference re-hooks");
  L.push("");
  L.push(
    ref.pivots.length
      ? ref.pivots.map((v) => `- ${Math.round(v.pos * 100)}% in — "${v.phrase}"`).join("\n")
      : "_none detected_"
  );
  L.push("");
  L.push("Ours:");
  L.push("");
  L.push(
    mine.pivots.length
      ? mine.pivots.map((v) => `- ${Math.round(v.pos * 100)}% in — "${v.phrase}"`).join("\n")
      : "_none detected — the middle has no re-hook_"
  );
  L.push("");
  if (notes.length) {
    L.push("## What to change");
    L.push("");
    L.push(...notes);
    L.push("");
  }
  return L.join("\n");
};

// ------------------------------------------------------------------ driver
const writeProfile = (p) => {
  mkdirSync(analysisDir, { recursive: true });
  const j = join(analysisDir, `${p.name}.json`);
  const m = join(analysisDir, `${p.name}.md`);
  writeFileSync(j, JSON.stringify(p, null, 2));
  writeFileSync(m, report(p));
  console.log(`  → analysis/${p.name}.json`);
  console.log(`  → analysis/${p.name}.md`);
};

const profileEpisode = async (slug) => {
  const mp3 = resolve(root, `public/episodes/${slug}/narration.mp3`);
  if (!existsSync(mp3)) throw new Error(`No narration at ${mp3.replace(root + "/", "")}`);
  console.log(`Episode ${slug}`);
  const words = await wordsFor(mp3, slug);
  const p = analyze(words, { name: slug, source: `public/episodes/${slug}/narration.mp3`, kind: "our episode" });
  writeProfile(p);
  return p;
};

const isUrl = (x) => /^https?:\/\//i.test(x);

// Download audio-only via yt-dlp. Returns [{path, title}]. A profile or
// playlist URL yields up to --limit items (default 6). Instagram usually
// gates even public reels behind login — pass --cookies to use the Chrome
// session; YouTube/TikTok public URLs work anonymously.
const downloadUrl = (url) => {
  const dir = resolve(root, ".cache/refs");
  mkdirSync(dir, { recursive: true });
  const limit = flag("limit") ?? "6";
  const cookies = has("cookies") ? "--cookies-from-browser chrome" : "";
  console.log(`Fetching ${url} (up to ${limit} item(s))...`);
  let out;
  try {
    out = execSync(
      `yt-dlp -f "bestaudio/best" --no-warnings ${cookies} --playlist-end ${limit} ` +
        `-o "${dir}/%(id)s.%(ext)s" --no-overwrites ` +
        `--print "after_move:%(filepath)s\t%(title)s\t%(id)s" --print "%(filepath)s\t%(title)s\t%(id)s" --no-simulate "${url}"`,
      { stdio: ["ignore", "pipe", "pipe"] }
    ).toString();
  } catch (e) {
    const msg = (e.stderr?.toString() || e.message || "").slice(-500);
    const hint = /login|cookies|rate|403|401/i.test(msg)
      ? "\nHint: this host gates downloads — retry with --cookies (uses your Chrome login)."
      : "";
    throw new Error(`yt-dlp failed on ${url}\n${msg}${hint}`);
  }
  const seen = new Map();
  for (const line of out.split("\n")) {
    const [path, title, id] = line.split("\t");
    // titles like "Video by <account>" repeat across a profile — suffix the id
    if (path && existsSync(path))
      seen.set(path, `${title ?? basename(path)}${id ? `-${id}` : ""}`);
  }
  if (!seen.size) throw new Error(`yt-dlp produced no files for ${url}`);
  return [...seen].map(([path, title]) => ({ path, title }));
};

const profileMedia = async (path, labelOverride) => {
  const abs = resolve(process.cwd(), path);
  const name = labelOverride ?? flag("label") ?? slugify(basename(abs, extname(abs)));
  console.log(`Reference ${name}  (${abs})`);
  const words = await wordsFor(abs, name);
  const p = analyze(words, { name, source: abs, kind: "reference clip" });
  writeProfile(p);
  return p;
};

const resolveProfile = async (ref) => {
  try {
    return loadProfile(ref);
  } catch (e) {
    // an episode slug we haven't profiled yet — do it now
    if (existsSync(resolve(root, `public/episodes/${ref}/narration.mp3`))) return profileEpisode(ref);
    throw e;
  }
};

const main = async () => {
  const cmp = flag("compare");
  if (cmp) {
    const against = flag("against");
    if (!against) throw new Error("--compare <a> needs --against <b>");
    const a = await resolveProfile(cmp);
    const b = await resolveProfile(against);
    const out = compare(a, b);
    mkdirSync(analysisDir, { recursive: true });
    const f = join(analysisDir, `compare-${a.name}-vs-${b.name}.md`);
    writeFileSync(f, out);
    console.log(out);
    console.log(`\n→ analysis/${basename(f)}`);
    return;
  }

  const ep = flag("episode");
  if (ep) {
    await profileEpisode(ep);
    return;
  }

  if (!inputs.length) {
    console.log(
      [
        "Usage:",
        "  node scripts/analyze.mjs <file|folder|url> [...]     profile reference clip(s)",
        "     (urls need yt-dlp; a profile/playlist url takes the first --limit items, default 6;",
        "      Instagram needs --cookies — uses your Chrome login)",
        "  node scripts/analyze.mjs --episode <slug>            profile one of our episodes",
        "  node scripts/analyze.mjs --compare <a> --against <b> diff two profiles",
        "",
        "Flags: --model base.en|small.en  --label <name>  --limit <n>  --cookies  --force",
        "       use --model small.en for reference clips with background music",
      ].join("\n")
    );
    return;
  }

  for (const input of inputs) {
    if (isUrl(input)) {
      for (const item of downloadUrl(input)) {
        await profileMedia(item.path, slugify(item.title));
      }
      continue;
    }
    const abs = resolve(process.cwd(), input);
    if (!existsSync(abs)) {
      console.error(`skip: ${input} not found`);
      continue;
    }
    if (statSync(abs).isDirectory()) {
      const files = readdirSync(abs).filter((f) => MEDIA_EXT.has(extname(f).toLowerCase()));
      if (!files.length) console.error(`skip: no media in ${input}`);
      for (const f of files) await profileMedia(join(abs, f));
    } else {
      await profileMedia(abs);
    }
  }
};

main().catch((e) => {
  console.error(`\n${e.message}`);
  process.exit(1);
});
