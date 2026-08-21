import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";

// Episode-local kit for 007 "Anthropic Is Watermarking Your Text".
//
// [v2] THE WORLD IS LIGHT NOW. The `inkwell` skin flipped from a dark violet
// editor to a cream-and-brown writing desk, so every "glow = bright thing on
// dark ground" instinct from v1 is inverted here:
//
//   * A glow on cream is a WARM BLOOM, not light emission. Revealed watermark
//     words are drawn in theme.accent (fired clay, 5.3:1 on PAPER) with
//     theme.accentGlow as a soft halo BEHIND them. Never a bright fill.
//   * The "UV torch" is now a WARM SCAN LAMP (`ScanLamp` + `LampGlyph`): words
//     it passes DEVELOP into clay ink, like lemon-juice writing over a flame.
//   * Strokes got fatter. 2-3px lines that read fine on the dark skin vanish
//     on cream at delivery scale (the channel learned this in 005).
//
// NEVER use these as text or thin strokes — they fail contrast by design:
//   theme.brand #D97757 (2.7:1) · theme.accentDim #C08059 (2.8:1) ·
//   COIN_GOLD #E3B341 (1.7:1) · PAPER_LINE kraft #D4A27F (2.0:1).
// They are glyph bodies, tints, coin faces and fake text bars. Anything a
// viewer must READ uses theme.text / textDim / accent / second / warn, or
// sits on a dark plate (the pattern-interrupt stamp is the one such case).
//
// Everything here is deterministic: scatter uses the seeded hash idiom from
// src/components/Background.tsx (no Math.random / Date.now anywhere).

// [v2] the whole world is light — PAPER is the near-white surface ON cream
export const PAPER = "#FCFAF4"; // document card fill
export const PAPER_LINE = "#D4A27F"; // fake text bars on paper (kraft) — FILL ONLY
export const PAPER_EDGE = "#E0D2BE"; // paper card border (warm tan)
export const INK = "#2B2519"; // text on paper (matches theme.text)
export const COIN_GOLD = "#E3B341"; // coin face fill — FILL ONLY, never text
export const COIN_EDGE = "#75530E"; // coin rim / weighted side (theme.second)
export const UMBER_DIM = "rgba(43, 31, 20, 0.88)"; // PI dim veil — never pure black

// Every card in this episode casts the same hue-shifted taupe shadow. Pure
// black shadows on cream read as dirt.
export const PAPER_SHADOW = "0 14px 34px rgba(60, 52, 40, 0.20)";

// The scan lamp's own gradient stops: true Claude terracotta at alphas the
// token set does not carry. Episode-local per the "literals live in the kit"
// rule.
export const LAMP_CORE = "rgba(217, 119, 87, 0.46)";
export const LAMP_MID = "rgba(217, 119, 87, 0.17)";
export const LAMP_EDGE = "rgba(217, 119, 87, 0.0)";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Seeded pseudo-random — the makeStars hash from Background.tsx.
export const hash = (i: number, n: number, seed = 7) => {
  const s = Math.sin((i + 1) * 127.1 + seed * 311.7 + n * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

// Hard-sequence helper. Two blocks that share a screen slot must never
// crossfade (005's bug): fade one fully out, leave ~6f, then fade the next in.
export const gate = (frame: number, inAt: number, outAt?: number, fade = 10) => {
  const i = interpolate(frame, [inAt, inAt + fade], [0, 1], clamp);
  const o = outAt == null ? 1 : interpolate(frame, [outAt, outAt + fade], [1, 0], clamp);
  return i * o;
};

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// --------------------------------------------------------------- Chip / Stamp
export const Chip: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, color, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "inline-block",
        padding: "10px 22px",
        borderRadius: 7,
        background: theme.card,
        // [v2] the 0.14-alpha cardBorder disappeared against cream; chips get
        // the stronger `line` token when they carry no signal color.
        border: `2.5px solid ${color ?? theme.line}`,
        boxShadow: PAPER_SHADOW,
        fontFamily: FONTS.mono,
        fontSize: 25,
        letterSpacing: "0.13em",
        color: color ?? theme.textDim,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// [v2] A stamp is now a light plate: white card, signal-colored rule, espresso
// type. `bg`/`textColor` exist for exactly one beat — the pattern interrupt,
// where the stamp has to sit on the umber veil in COIN_GOLD.
export const Stamp: React.FC<{
  children: React.ReactNode;
  color?: string;
  textColor?: string;
  bg?: string;
  fontSize?: number;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ children, color, textColor, bg, fontSize = 44, rotate = -2, style }) => {
  const theme = useTheme();
  const edge = color ?? theme.accent;
  return (
    <div
      style={{
        display: "inline-block",
        padding: "16px 30px",
        // 4px read as a hairline on cream at delivery scale
        border: `5px solid ${edge}`,
        borderRadius: 5,
        background: bg ?? theme.card,
        boxShadow: PAPER_SHADOW,
        fontFamily: FONTS.mono,
        fontWeight: 800,
        fontSize,
        lineHeight: 1.12,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        textAlign: "center",
        color: textColor ?? theme.text,
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ------------------------------------------------------------------- DocCard
// The core prop. A PAPER card of kraft text bars; indices listed in `revealed`
// are the watermarked word choices and DEVELOP into clay ink under the lamp.
export type DocWord = {
  i: number;
  line: number;
  x: number;
  y: number;
  w: number;
  h: number;
};

// Deterministic word layout, shared by DocCard and by the scenes that need to
// know where each word sits (the lamp decides what it has passed).
export const docWords = (w: number, h: number, lines: number, seed = 3): DocWord[] => {
  const pad = Math.max(20, Math.round(w * 0.055));
  const lh = (h - pad * 2) / lines;
  const bh = Math.max(8, Math.min(22, lh * 0.34));
  const gap = Math.max(9, bh * 0.85);
  const out: DocWord[] = [];
  let i = 0;
  for (let l = 0; l < lines; l++) {
    // last line of a paragraph runs short — the tell that says "prose"
    const lineW = (w - pad * 2) * (l === lines - 1 ? 0.62 : 1);
    let x = pad;
    let k = 0;
    for (;;) {
      const bw = Math.round(lineW * (0.1 + hash(i, k, seed) * 0.15));
      if (x + bw > pad + lineW) break;
      out.push({ i, line: l, x, y: pad + l * lh + (lh - bh) / 2, w: bw, h: bh });
      x += bw + gap;
      i += 1;
      k += 1;
    }
  }
  return out;
};

export const DocCard: React.FC<{
  w: number;
  h: number;
  lines: number;
  /** indices (into docWords) that carry the hidden mark */
  revealed?: number[];
  /** develop strength per marked word: a constant, or a function of the index */
  reveal?: number | ((i: number) => number);
  /** 0..1 — fraction of words drawn (the typing-on effect) */
  typed?: number;
  /** 0..1 — marked words reshuffle into new kraft bars (the rewrite beat) */
  scramble?: number;
  seed?: number;
  style?: React.CSSProperties;
}> = ({ w, h, lines, revealed, reveal = 1, typed = 1, scramble = 0, seed = 3, style }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const words = docWords(w, h, lines, seed);
  const marks = new Set(revealed ?? []);
  const shown = Math.round(Math.max(0, Math.min(1, typed)) * words.length);
  const s = Math.max(0, Math.min(1, scramble));
  const glowOf = (i: number) => {
    const g = typeof reveal === "function" ? reveal(i) : reveal;
    return Math.max(0, Math.min(1, g));
  };

  return (
    <div
      style={{
        position: "absolute",
        width: w,
        height: h,
        background: PAPER,
        borderRadius: 14,
        border: `3px solid ${PAPER_EDGE}`,
        boxShadow: PAPER_SHADOW,
        overflow: "hidden",
        ...style,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
        {words.map((word) => {
          if (word.i >= shown) return null;
          const marked = marks.has(word.i);
          const glow = marked ? glowOf(word.i) : 0;
          // the reshuffle: bars wobble sideways and resize to a new width
          const wob = marked ? Math.sin(s * Math.PI) : 0;
          // 2f reshuffle jitter — deterministic (frame-derived), never random
          const jx = wob * (hash(word.i, Math.floor(frame / 2), seed + 9) - 0.5) * 30;
          const dx = wob * (hash(word.i, 2, seed + 5) - 0.5) * 34 + jx;
          const bw = marked
            ? Math.max(34, word.w + (hash(word.i, 3, seed + 5) - 0.5) * 58 * s)
            : word.w;
          const x = word.x + dx;
          return (
            <g key={word.i}>
              {/* [v2] the bloom sits BEHIND the developed word — on cream a
                  glow is warmth spreading through the paper, not emission */}
              {glow > 0.02 ? (
                <>
                  <rect
                    x={x - 14}
                    y={word.y - 11}
                    width={bw + 28}
                    height={word.h + 22}
                    rx={(word.h + 22) / 2}
                    fill={theme.accentGlow}
                    opacity={glow * 0.42}
                  />
                  <rect
                    x={x - 7}
                    y={word.y - 5}
                    width={bw + 14}
                    height={word.h + 10}
                    rx={(word.h + 10) / 2}
                    fill={theme.accentGlow}
                    opacity={glow * 0.7}
                  />
                </>
              ) : null}
              <rect
                x={x}
                y={word.y}
                width={bw}
                height={word.h}
                rx={word.h / 2}
                fill={PAPER_LINE}
                opacity={0.9}
              />
              {/* the developed ink itself: fired clay, 5.3:1 on PAPER */}
              {glow > 0.02 ? (
                <rect
                  x={x}
                  y={word.y}
                  width={bw}
                  height={word.h}
                  rx={word.h / 2}
                  fill={theme.accent}
                  opacity={glow}
                />
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ------------------------------------------------------------------ WordChip
export const WordChip: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  ghost?: boolean;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, active = false, ghost = false, size = 34, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "inline-block",
        padding: `${Math.round(size * 0.38)}px ${Math.round(size * 0.82)}px`,
        borderRadius: 10,
        background: theme.card,
        border: `3.5px solid ${active ? theme.second : theme.line}`,
        boxShadow: active ? `${PAPER_SHADOW}, 0 0 30px ${theme.secondDim}` : PAPER_SHADOW,
        fontFamily: FONTS.mono,
        fontSize: size,
        fontWeight: active ? 800 : 500,
        letterSpacing: "0.06em",
        color: active ? theme.second : theme.text,
        opacity: ghost ? 0.42 : 1,
        transform: `scale(${active ? 1.06 : 1})`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------- Coin
// The picking mechanism. `spin` 0..1 drives a scaleX flip illusion; `rigged`
// exposes the weight crescent that makes the coin land one way too often.
// [v2] gold FACE with a bronze rim: on cream the old bronze-face coin sank
// into the background, and gold alone has no edge definition.
export const Coin: React.FC<{
  size: number;
  spin: number;
  face: "H" | "T";
  rigged?: boolean;
  /** 0..1 — turn toward profile so the weight reads as mass, not decoration */
  tilt?: number;
  flips?: number;
  glow?: number;
  style?: React.CSSProperties;
}> = ({ size, spin, face, rigged = false, tilt = 0, flips = 6, glow = 0, style }) => {
  const theme = useTheme();
  const c = Math.cos(Math.max(0, Math.min(1, spin)) * Math.PI * flips);
  const spinning = spin > 0 && spin < 1;
  const sx = (spinning ? Math.max(0.08, Math.abs(c)) : 1) * (1 - tilt * 0.46);
  const shown: "H" | "T" = spinning ? (c >= 0 ? "H" : "T") : face;

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `scaleX(${sx})`,
        filter: glow > 0 ? `drop-shadow(0 0 ${24 * glow}px ${theme.secondDim})` : undefined,
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
        <circle cx="50" cy="50" r="47" fill={COIN_EDGE} />
        <circle cx="50" cy="50" r="41" fill={COIN_GOLD} />
        <circle cx="50" cy="50" r="35" fill="none" stroke={COIN_EDGE} strokeWidth="3.5" opacity="0.75" />
        {rigged ? (
          <g>
            {/* the weight: a crescent of extra metal hugging one inner rim */}
            <path
              d="M50 9 A41 41 0 0 1 50 91 A47 47 0 0 0 50 9 Z"
              fill={COIN_EDGE}
              opacity="0.96"
            />
            <path
              d="M50 9 A41 41 0 0 1 50 91"
              fill="none"
              stroke={INK}
              strokeWidth="3.5"
              opacity="0.5"
            />
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={74 + Math.abs(i - 1.5) * 2}
                y1={36 + i * 10}
                x2={86 - Math.abs(i - 1.5) * 2}
                y2={36 + i * 10}
                stroke={COIN_GOLD}
                strokeWidth="3"
                opacity="0.55"
              />
            ))}
          </g>
        ) : null}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={FONTS.mono}
          fontWeight="800"
          fontSize="44"
          fill={INK}
        >
          {shown}
        </text>
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------- LampGlyph
// [v2] The detector's WARM SCAN LAMP (was a UV torch). A shaded desk lamp with
// a hot rim and a warm cone — the thing that develops invisible ink, not a
// thing that emits violet. Its own component so the "not released yet" beat in
// Catch shows the exact same object the sweep carries.
export const LampGlyph: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 120,
  style,
}) => {
  const theme = useTheme();
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 120 96" style={style}>
      {/* stem + knuckle */}
      <rect x="54" y="0" width="12" height="18" rx="5" fill={theme.accent} />
      <circle cx="60" cy="18" r="8" fill={theme.accent} />
      {/* shade — a large terracotta fill, which `brand` is allowed to be */}
      <path
        d="M20 22 H100 L114 62 H6 Z"
        fill={theme.brand}
        stroke={theme.accent}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* the hot rim */}
      <rect x="8" y="56" width="104" height="11" rx="5.5" fill={COIN_GOLD} />
      <rect x="8" y="56" width="104" height="11" rx="5.5" fill="none" stroke={theme.accent} strokeWidth="3" />
      {/* the warm cone it throws */}
      <path d="M10 70 L28 96 H92 L110 70 Z" fill={theme.accentGlow} opacity="0.85" />
    </svg>
  );
};

// ------------------------------------------------------------------ ScanLamp
// [v2] was UVSweep. A warm gradient band that travels across the page; the
// scene decides which words it has passed (they DEVELOP into clay ink).
export const ScanLamp: React.FC<{
  x: number; // band center, comp-space px
  top: number;
  height: number;
  w?: number;
  opacity?: number;
  lamp?: boolean;
  style?: React.CSSProperties;
}> = ({ x, top, height, w = 210, opacity = 1, lamp = true, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top,
        width: w,
        height,
        opacity,
        pointerEvents: "none",
        // soft ends: a hard-edged rectangle read as a panel where the band
        // overhung the text block
        maskImage: "linear-gradient(180deg, transparent 0%, #000 7%, #000 93%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(180deg, transparent 0%, #000 7%, #000 93%, transparent 100%)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${LAMP_EDGE} 0%, ${LAMP_MID} 28%, ${LAMP_CORE} 43%, ${LAMP_CORE} 57%, ${LAMP_MID} 72%, ${LAMP_EDGE} 100%)`,
        }}
      />
      {/* the filament line: clay, 5:1 on paper — a hairline vanished here */}
      <div
        style={{
          position: "absolute",
          left: w / 2 - 3.5,
          top: 0,
          width: 7,
          height,
          background: theme.accent,
          opacity: 0.8,
          boxShadow: `0 0 26px 8px ${theme.accentGlow}`,
        }}
      />
      {lamp ? (
        <LampGlyph size={120} style={{ position: "absolute", left: w / 2 - 60, top: -84 }} />
      ) : null}
    </div>
  );
};

// --------------------------------------------------------------------- Tally
export const Tally: React.FC<{
  /** pass the RAW (fractional) counter — Tally floors it and pops on each tick */
  value: number;
  label?: string;
  text?: string; // override the digits (e.g. "?")
  w?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ value, label, text, w = 240, color, style }) => {
  const theme = useTheme();
  const shown = Math.floor(value);
  const frac = value - shown;
  // pop only while the counter is actually moving (a settled integer has frac 0)
  const pop = frac > 0.0001 ? 1 + 0.13 * Math.max(0, 1 - frac * 8) : 1;
  const tint = color ?? theme.second;
  return (
    <div
      style={{
        position: "absolute",
        width: w,
        padding: "14px 20px 18px",
        borderRadius: 10,
        background: theme.card,
        border: `4px solid ${tint}`,
        boxShadow: PAPER_SHADOW,
        textAlign: "center",
        ...style,
      }}
    >
      {label ? (
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 20,
            letterSpacing: "0.22em",
            color: theme.textDim,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: FONTS.mono,
          fontWeight: 800,
          fontSize: 66,
          lineHeight: 1.1,
          color: tint,
          fontVariantNumeric: "tabular-nums",
          transform: `scale(${pop})`,
        }}
      >
        {text ?? shown.toLocaleString("en-US")}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------- ChipGlyph
// [v2] The neutral AI subject: an original terracotta tile with a little paper
// screen and a BLINKING TEXT CARET — "an AI that writes". Deliberately generic
// silicon. NO starburst, NO wordmark, NO mascot: §0.4 "no IP imitation" is a
// policy requirement, not taste.
//
// The caret blinks on a 24f cycle (14f lit / 10f dark) with 2f ramps — a 2f
// on/off toggle strobes at 15Hz and reads as noise, not as a cursor.
export const ChipGlyph: React.FC<{ size: number; style?: React.CSSProperties }> = ({
  size,
  style,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const t = frame % 24;
  const caret =
    t < 2 ? t / 2 : t < 14 ? 1 : t < 16 ? 1 - (t - 14) / 2 : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      {/* pin stubs — clay, so they hold their own against the terracotta body */}
      {[0, 1, 2].map((i) => {
        const p = 30 + i * 20;
        return (
          <g key={i} fill={theme.accent}>
            <rect x={p - 5} y="0" width="10" height="12" rx="4" />
            <rect x={p - 5} y="88" width="10" height="12" rx="4" />
            <rect x="0" y={p - 5} width="12" height="10" rx="4" />
            <rect x="88" y={p - 5} width="12" height="10" rx="4" />
          </g>
        );
      })}
      {/* the body */}
      <rect
        x="8"
        y="8"
        width="84"
        height="84"
        rx="20"
        fill={theme.brand}
        stroke={theme.accent}
        strokeWidth="5"
      />
      {/* the little page it writes on */}
      <rect x="24" y="26" width="52" height="48" rx="10" fill={PAPER} stroke={theme.accent} strokeWidth="4" />
      <rect x="33" y="38" width="26" height="6" rx="3" fill={theme.accentDim} />
      <rect x="33" y="51" width="16" height="6" rx="3" fill={theme.accentDim} />
      {/* the caret */}
      <rect x="53" y="47" width="7" height="15" rx="2" fill={theme.accent} opacity={caret} />
    </svg>
  );
};

// ------------------------------------------------------------------- LawCard
// A statute: paragraph block + wax seal with ribbon tails. Used once.
export const LawCard: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => {
  const theme = useTheme();
  const h = Math.round(w * 1.25);
  return (
    <svg width={w} height={h} viewBox="0 0 300 375" style={style}>
      <rect x="8" y="8" width="284" height="359" rx="16" fill={PAPER} stroke={PAPER_EDGE} strokeWidth="5" />
      <rect x="36" y="42" width="128" height="14" rx="7" fill={theme.accent} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect
          key={i}
          x="36"
          y={82 + i * 26}
          width={i === 6 ? 128 : 228 - (i % 3) * 34}
          height="10"
          rx="5"
          fill={PAPER_LINE}
        />
      ))}
      <rect x="36" y="272" width="150" height="10" rx="5" fill={PAPER_LINE} opacity="0.7" />
      {/* wax seal + ribbon */}
      <path d="M212 296 L212 358 L228 344 L244 358 L244 296 Z" fill={COIN_GOLD} stroke={COIN_EDGE} strokeWidth="4" />
      <circle cx="228" cy="292" r="34" fill={COIN_GOLD} stroke={COIN_EDGE} strokeWidth="5" />
      <circle cx="228" cy="292" r="21" fill="none" stroke={COIN_EDGE} strokeWidth="4" opacity="0.85" />
      <circle cx="228" cy="292" r="7" fill={COIN_EDGE} />
    </svg>
  );
};

// ----------------------------------------------------------------- WorldDots
// Coarse equirectangular dot map (40 x 17 cells). Not in §007.4's table — the
// law scene needs a world and a scene-local copy would have been worse.
// `wave` is the ripple radius in grid cells, measured from `origin`.
const WORLD = [
  "..........#####...####..........#####...",
  "....###########..###.###....############",
  "...############...##..#####.############",
  "....##########.....######..#############",
  ".....########.......#####..#############",
  "......######.........####.###.#########.",
  ".......#####........#######.##.#######..",
  "........####........#######..####.####..",
  "..........##........########.###..###...",
  "...........####.....#######.......####..",
  "............####....######.........####.",
  "............####....#####...........##..",
  ".............###....#####.......#####...",
  ".............###.....####.......######..",
  "..............##.....###........#####...",
  "..............##................#..#....",
  "..............#.........................",
];

export const WORLD_COLS = 40;
export const WORLD_ROWS = WORLD.length;
export const WORLD_EUROPE: [number, number] = [21, 3.5];

export const WorldDots: React.FC<{
  w: number;
  wave?: number; // ripple radius, in grid cells
  origin?: [number, number];
  rings?: boolean;
  style?: React.CSSProperties;
}> = ({ w, wave = 0, origin = WORLD_EUROPE, rings = true, style }) => {
  const theme = useTheme();
  const cell = w / WORLD_COLS;
  const h = cell * WORLD_ROWS;
  const dots: React.ReactNode[] = [];
  for (let r = 0; r < WORLD_ROWS; r += 1) {
    const row = WORLD[r];
    for (let c = 0; c < WORLD_COLS; c += 1) {
      if (row[c] !== "#") continue;
      const d = Math.hypot(c - origin[0], r - origin[1]);
      // 0.3f/dot stagger baked in as a soft edge on the expanding wave
      const tint = Math.max(0, Math.min(1, (wave - d) / 2.6));
      const cx = (c + 0.5) * cell;
      const cy = (r + 0.5) * cell;
      dots.push(
        <g key={`${r}-${c}`}>
          {/* [v2] 0.45 alpha was a ghost on cream */}
          <circle cx={cx} cy={cy} r={cell * 0.26} fill={theme.textDim} opacity={0.75 * (1 - tint)} />
          {tint > 0 ? (
            <circle
              cx={cx}
              cy={cy}
              r={cell * (0.26 + tint * 0.1)}
              fill={theme.accent}
              opacity={0.45 + tint * 0.55}
            />
          ) : null}
        </g>,
      );
    }
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={style}>
      {rings && wave > 0
        ? [0, 1, 2].map((i) => {
            const rr = (wave - i * 3.4) * cell;
            if (rr <= 0) return null;
            return (
              <circle
                key={i}
                cx={(origin[0] + 0.5) * cell}
                cy={(origin[1] + 0.5) * cell}
                r={rr}
                fill="none"
                stroke={theme.accent}
                strokeWidth="5"
                opacity={Math.max(0, 0.55 - i * 0.15 - rr / (w * 1.4))}
              />
            );
          })
        : null}
      {dots}
    </svg>
  );
};

// ---------------------------------------------------------------- TickMark
// The detector's evidence: one clay tick per rigged flip that landed heads.
export const TickMark: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 34,
  style,
}) => {
  const theme = useTheme();
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" style={style}>
      <path
        d="M6 18 L14 26 L28 8"
        fill="none"
        stroke={theme.accent}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
