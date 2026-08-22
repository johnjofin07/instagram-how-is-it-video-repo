// Aligns whisper word timestamps to the 5 scenes and builds timed caption
// lines. Output: src/generated/timing.json — sceneSeconds + per-scene caption
// lines with word-level times (ms, relative to scene start).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { readdirSync } from "node:fs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const slug =
  process.argv[2] ??
  readdirSync(resolve(root, "src/episodes"))
    .filter((d) => /^\d/.test(d))
    .sort()
    .at(-1);
console.log(`Episode: ${slug}`);
const words = JSON.parse(
  readFileSync(resolve(root, `.cache/${slug}-whisper.json`), "utf8")
);

// Scene word counts from the narration in the episode's script.ts
const src = readFileSync(resolve(root, `src/episodes/${slug}/script.ts`), "utf8");
const narrations = [...src.matchAll(/narration:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g)].map(
  (m) => m[1]
);
const sceneWordCounts = narrations.map((n) => n.split(/\s+/).length);
const totalNarrWords = sceneWordCounts.reduce((a, b) => a + b, 0);

// Proper-noun casing: whisper lowercases names it doesn't know ("anthropic"),
// and captions are built from the transcript, so the name would render wrong
// on screen. script.ts is the source of truth for spelling, so restore casing
// from it. A word only counts as a proper noun if EVERY occurrence in the
// script is capitalized AND at least one of those is not sentence-initial —
// otherwise ordinary words that merely start a sentence ("The", "So") would
// get capitalized mid-line.
const properNouns = (() => {
  const capped = new Map(); // lower -> script casing
  const everLower = new Set();
  const midSentence = new Set();
  for (const n of narrations) {
    const toks = n.split(/\s+/);
    let startsSentence = true;
    for (const raw of toks) {
      const w = raw.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "");
      if (w) {
        const lower = w.toLowerCase();
        if (/^\p{Lu}/u.test(w)) {
          capped.set(lower, w);
          if (!startsSentence) midSentence.add(lower);
        } else {
          everLower.add(lower);
        }
      }
      startsSentence = /[.!?…]["”']?$/.test(raw);
    }
  }
  const out = new Map();
  for (const [lower, cased] of capped) {
    if (!everLower.has(lower) && midSentence.has(lower)) out.set(lower, cased);
  }
  return out;
})();

let recased = 0;
for (const w of words) {
  const core = w.text.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "");
  const fixed = properNouns.get(core.toLowerCase());
  if (fixed && core !== fixed) {
    w.text = w.text.replace(core, fixed);
    recased++;
  }
}
if (recased) console.log(`proper-noun casing restored on ${recased} word(s):`, [...properNouns.values()].join(", "));

// Find where each scene starts by matching the scene's first words against
// the whisper transcript (searching near the proportional estimate).
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const boundaries = []; // word index where each scene STARTS (scene 0 starts at 0)
let cum = 0;
for (let k = 0; k < sceneWordCounts.length - 1; k++) {
  cum += sceneWordCounts[k];
  const est = Math.round((words.length * cum) / totalNarrWords);
  const lead = narrations[k + 1].split(/\s+/).slice(0, 3).map(norm);
  let best = est;
  let found = false;
  // Two passes: an exact 3-word match wins over a looser 2-of-3 one, so an
  // earlier phrase that merely shares the first two words ("the bowl goes…"
  // vs "The bowl is…") can't steal the boundary.
  const lo = Math.max(1, est - 10);
  const hi = Math.min(words.length - 3, est + 10);
  const hit = (i, strict) =>
    norm(words[i].text) === lead[0] &&
    (strict
      ? norm(words[i + 1].text) === lead[1] && norm(words[i + 2].text) === lead[2]
      : norm(words[i + 1].text) === lead[1] || norm(words[i + 2].text) === lead[2]);
  for (const strict of [true, false]) {
    for (let i = lo; i <= hi && !found; i++) {
      if (hit(i, strict)) {
        best = i;
        found = true;
      }
    }
    if (found) break;
  }
  boundaries.push({ index: best, matched: found, firstWord: words[best].text });
}

const sceneRanges = [];
let startIdx = 0;
let startMs = 0;
for (let k = 0; k < sceneWordCounts.length; k++) {
  const endIdx = k < boundaries.length ? boundaries[k].index : words.length;
  // scene ends midway through the silence before the next scene's first word
  const endMs =
    k < boundaries.length
      ? (words[endIdx - 1].endMs + words[endIdx].startMs) / 2
      : words[words.length - 1].endMs + 1400; // tail on the last scene
  sceneRanges.push({ startIdx, endIdx, startMs, endMs });
  startIdx = endIdx;
  startMs = endMs;
}

// Group each scene's words into caption lines: break on big pauses, max 4
// words or ~26 chars per line.
const sceneCaptions = sceneRanges.map(({ startIdx, endIdx, startMs }) => {
  const lines = [];
  let line = null;
  for (let i = startIdx; i < endIdx; i++) {
    const w = words[i];
    const prev = i > startIdx ? words[i - 1] : null;
    const gap = prev ? w.startMs - prev.endMs : 0;
    const lineLen = line ? line.words.reduce((n, x) => n + x.t.length + 1, 0) : 0;
    if (!line || line.words.length >= 4 || lineLen + w.text.length > 26 || gap > 700) {
      line = { start: w.startMs - startMs, end: w.endMs - startMs, words: [] };
      lines.push(line);
    }
    line.words.push({ t: w.text, s: w.startMs - startMs, e: w.endMs - startMs });
    line.end = w.endMs - startMs;
  }
  // extend each line until the next one starts (no caption flicker)
  for (let i = 0; i < lines.length - 1; i++) lines[i].end = lines[i + 1].start;
  if (lines.length > 0) lines[lines.length - 1].end += 1200;
  return lines;
});

const sceneSeconds = sceneRanges.map((r) =>
  Number(((r.endMs - r.startMs) / 1000).toFixed(2))
);

mkdirSync(resolve(root, `src/episodes/${slug}`), { recursive: true });
writeFileSync(
  resolve(root, `src/episodes/${slug}/timing.json`),
  JSON.stringify({ sceneSeconds, sceneCaptions }, null, 1)
);

console.log("scene boundaries snapped to pauses:", boundaries);
console.log("sceneSeconds:", sceneSeconds, "total:", sceneSeconds.reduce((a, b) => a + b, 0).toFixed(1));
console.log("caption lines per scene:", sceneCaptions.map((c) => c.length));
