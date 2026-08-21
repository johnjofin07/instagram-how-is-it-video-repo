import React from "react";
import { interpolate } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";

// ============================================================== COLOR LAW ===
// Episode-literal colors (the `KRAFT`/`INK` pattern from 004). The skin
// (`blueprint`) is read-only — its graph paper IS the oscilloscope; these
// three hexes are the episode's entire visual argument:
//
//   NOISE  the world's sound. WARM. Always the aggressor, always from outside.
//   ANTI   the headphone's manufactured mirror. COOL. Always fired by the cup.
//   SUM    the result of the two added together. WHITE, and reserved for that
//          ONE meaning — so the `zero` flatline is the brightest frame of the
//          episode. Never use SUM for decoration.
//
// NOISE and ANTI NEVER swap roles. If you need a third "state" color, take it
// from the theme (good/warn), not from this list.
export const NOISE = "#F5A83C";
export const ANTI = "#3CC8F5";
export const SUM = "#FFFFFF";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// Seeded pseudo-random — the `makeStars` hash idiom from Background.tsx.
// Deterministic renders are a hard rule (no Math.random / Date.now).
export const rand = (i: number, seed: number, n: number): number => {
  const s = Math.sin((i + 1) * 127.1 + seed * 311.7 + n * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

const hexParts = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// Lerp between two #rrggbb strings — used for the NOISE→ANTI recolor on the
// flip, and for freezing air particles from NOISE to a dead grey.
export const mixHex = (a: string, b: string, t: number): string => {
  const A = hexParts(a);
  const B = hexParts(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * Math.max(0, Math.min(1, t))));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};

// ==================================================================== WAVE ===
// THE component of this episode. Everything — the incoming noise, the scope
// copy, the anti-noise, the flatline, the engine drone, the baby's cry — is
// this one thing with different props. Animate by PHASE OFFSET
// (`phase = -frame * omega`), which is deterministic and frame-exact.
//
// Anchoring: `x`/`y` are the LEFT END OF THE AXIS, not the svg's top-left.
// That means a caller says "put the axis at (100, 950)" and never has to do
// height arithmetic. The svg is absolutely positioned and its own height is
// derived from the amplitude.
//
// `jagged` accepts a boolean OR a 0–1 blend so a wave can *become* jagged
// without popping (a hard boolean flip was visible as a 1-frame snap).

export type WaveShape = {
  amp: number;
  freq: number;
  phase: number;
  jagged?: boolean | number;
  seed?: number;
};

const HARMONICS = 5;
const STEP = 4; // sample every 4px, per the plan

const jagAmount = (j: WaveShape["jagged"]): number =>
  j === true ? 1 : j === false || j === undefined ? 0 : j;

// Unit shape in [-1, 1]-ish. `jagged` mixes in seeded inharmonic partials, so
// the baby cry has an unpredictable-but-repeatable silhouette.
const unitAt = (x: number, s: WaveShape): number => {
  const fundamental = Math.sin(x * s.freq + s.phase);
  const j = jagAmount(s.jagged);
  if (j <= 0) return fundamental;

  const seed = s.seed ?? 1;
  let v = fundamental * 0.44;
  let norm = 0.44;
  for (let k = 0; k < HARMONICS; k++) {
    const mult = 1.9 + rand(k, seed, 1) * 5.2; // inharmonic multiplier
    const a = 0.52 / (1 + k * 0.6); // decaying partial
    const off = rand(k, seed, 2) * Math.PI * 2;
    const drift = 0.7 + rand(k, seed, 3) * 1.9; // partial travels at its own rate
    v += a * Math.sin(x * s.freq * mult + s.phase * drift + off);
    norm += a;
  }
  const jaggedUnit = (v / norm) * 1.28;
  return fundamental + (jaggedUnit - fundamental) * j;
};

const sampleAt = (x: number, s: WaveShape): number => s.amp * unitAt(x, s);

export const Wave: React.FC<{
  x: number; // left end of the axis
  y: number; // the axis itself
  w: number;
  amp: number;
  freq: number;
  phase: number;
  color: string;
  /** 0–1 erase sweep: amplitude is lerped to 0 from the left edge rightward. */
  flatten?: number;
  jagged?: boolean | number;
  seed?: number;
  /** Point-wise SUM with a second shape. Two exact opposites give a true
   *  flat line; any lag or shape mismatch shows up as real residual spikes. */
  add?: WaveShape;
  strokeWidth?: number; // 4px MINIMUM — 2px strokes vanished at delivery scale
  opacity?: number;
  glow?: number;
  style?: React.CSSProperties;
}> = ({
  x,
  y,
  w,
  amp,
  freq,
  phase,
  color,
  flatten = 0,
  jagged,
  seed,
  add,
  strokeWidth = 5,
  opacity = 1,
  glow = 0,
  style,
}) => {
  const base: WaveShape = { amp, freq, phase, jagged, seed };
  const span = (amp + (add?.amp ?? 0)) * 1.45 + 16;
  const h = Math.ceil(span * 2);
  const cy = h / 2;

  // Erase sweep. `soft` keeps the edge from being a hard vertical cliff; the
  // offset start means flatten=0 leaves the whole wave at full amplitude.
  const soft = Math.max(70, w * 0.18);
  const edge = -soft + flatten * (w + soft);

  let d = "";
  const emit = (px: number) => {
    const gate = Math.max(0, Math.min(1, (px - edge) / soft));
    const v = (sampleAt(px, base) + (add ? sampleAt(px, add) : 0)) * gate;
    d += `${d ? "L" : "M"}${px.toFixed(1)} ${(cy - v).toFixed(1)}`;
  };
  for (let px = 0; px < w; px += STEP) emit(px);
  emit(w);

  if (w <= STEP) return null;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        position: "absolute",
        left: x,
        top: y - cy,
        overflow: "visible",
        opacity,
        filter: glow > 0 ? `drop-shadow(0 0 ${glow}px ${color})` : undefined,
        ...style,
      }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================================ HEAD PROFILE ===
// Abstract side-view silhouette, facing RIGHT so the ear cup sits on the LEFT
// — the world (and its noise) is always stage-left in this episode. No face
// detail: no eye, no mouth, just a profile bump for the nose.
// The ear-cup centre is at (0.42w, 0.50h) of the rendered box; `h = 1.2 * w`.
export const EAR_ANCHOR = { x: 0.42, y: 0.5 } as const;

const HEAD_PATH =
  "M96 240C96 138 172 70 254 70C328 70 360 124 358 182C357 210 348 226 345 242" +
  "C342 254 352 262 346 272C340 282 324 280 320 292C316 306 324 318 308 328" +
  "C298 334 286 332 282 344C276 368 252 382 224 386L224 480L100 480L100 330" +
  "C97 300 96 268 96 240Z";

export const HeadProfile: React.FC<{
  w?: number;
  cupGlow?: boolean;
  style?: React.CSSProperties;
}> = ({ w = 440, cupGlow = false, style }) => {
  const theme = useTheme();
  return (
    <svg
      width={w}
      height={w * 1.2}
      viewBox="0 0 400 480"
      style={{ position: "absolute", overflow: "visible", ...style }}
    >
      <path d={HEAD_PATH} fill={theme.textDim} opacity="0.26" />
      <path
        d={HEAD_PATH}
        fill="none"
        stroke={theme.textDim}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* headband */}
      <path
        d="M152 178C130 92 202 40 272 42C330 44 362 84 366 128"
        fill="none"
        stroke={theme.textDim}
        strokeWidth="17"
        strokeLinecap="round"
      />
      {/* ear cup */}
      <circle cx="168" cy="240" r="64" fill={theme.bg} stroke={theme.textDim} strokeWidth="9" />
      <circle
        cx="168"
        cy="240"
        r="44"
        fill="none"
        stroke={cupGlow ? ANTI : theme.line}
        strokeWidth="7"
        style={cupGlow ? { filter: `drop-shadow(0 0 16px ${ANTI})` } : undefined}
      />
      <circle cx="168" cy="240" r="20" fill={cupGlow ? ANTI : theme.line} opacity={cupGlow ? 0.5 : 0.35} />
    </svg>
  );
};

// ================================================================= MIC DOT ===
// The outward-facing microphone: a dot on the cup shell with expanding
// listening rings. Rings are NOISE-coloured — they are the world arriving.
// They default to a 150 deg fan pointing UP/outward: full circles read as
// decorative orbits and cut straight through the ear cup behind them.
const arcPath = (c: number, r: number, dirDeg: number, arcDeg: number) => {
  const a0 = ((dirDeg - arcDeg / 2) * Math.PI) / 180;
  const a1 = ((dirDeg + arcDeg / 2) * Math.PI) / 180;
  const large = arcDeg > 180 ? 1 : 0;
  return `M${(c + r * Math.cos(a0)).toFixed(1)} ${(c + r * Math.sin(a0)).toFixed(1)}A${r} ${r} 0 ${large} 1 ${(c + r * Math.cos(a1)).toFixed(1)} ${(c + r * Math.sin(a1)).toFixed(1)}`;
};

export const MicDot: React.FC<{
  x: number;
  y: number;
  size?: number;
  ping: number; // 0-1, wraps
  reach?: number; // how far the rings travel, px
  dir?: number; // deg, direction the mic is listening (default: up)
  arc?: number; // deg of each ring
  style?: React.CSSProperties;
}> = ({ x, y, size = 40, ping, reach, dir = -90, arc = 150, style }) => {
  const theme = useTheme();
  const r = size / 2;
  const travel = reach ?? size * 2.6;
  const box = (r + travel + 8) * 2;
  const c = box / 2;
  return (
    <svg
      width={box}
      height={box}
      viewBox={`0 0 ${box} ${box}`}
      style={{ position: "absolute", left: x - c, top: y - c, overflow: "visible", ...style }}
    >
      {[0, 1, 2].map((i) => {
        const p = (((ping + i / 3) % 1) + 1) % 1;
        return (
          <path
            key={i}
            d={arcPath(c, r + 6 + p * travel, dir, arc)}
            fill="none"
            stroke={NOISE}
            strokeWidth="4"
            strokeLinecap="round"
            opacity={(1 - p) * 0.75}
          />
        );
      })}
      <circle cx={c} cy={c} r={r} fill={theme.bgLifted} stroke={theme.textDim} strokeWidth="4" />
      <circle cx={c} cy={c} r={r * 0.34} fill={theme.text} />
    </svg>
  );
};

// =============================================================== CHIP BADGE ===
// The processor inside the cup. Lights ANTI when it is doing the work.
export const ChipBadge: React.FC<{
  x: number;
  y: number;
  size?: number;
  lit?: number; // 0–1
  rotate?: number; // deg — the "recalculating" wobble
  style?: React.CSSProperties;
}> = ({ x, y, size = 90, lit = 0, rotate = 0, style }) => {
  const theme = useTheme();
  const pins = [0, 1, 2, 3];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        overflow: "visible",
        transform: `rotate(${rotate}deg)`,
        filter: lit > 0.05 ? `drop-shadow(0 0 ${10 + lit * 18}px ${ANTI})` : undefined,
        ...style,
      }}
    >
      {pins.map((i) => (
        <React.Fragment key={i}>
          <rect x={26 + i * 16} y="2" width="8" height="14" rx="3" fill={theme.textDim} />
          <rect x={26 + i * 16} y="84" width="8" height="14" rx="3" fill={theme.textDim} />
          <rect x="2" y={26 + i * 16} width="14" height="8" rx="3" fill={theme.textDim} />
          <rect x="84" y={26 + i * 16} width="14" height="8" rx="3" fill={theme.textDim} />
        </React.Fragment>
      ))}
      <rect
        x="14"
        y="14"
        width="72"
        height="72"
        rx="12"
        fill={theme.bgLifted}
        stroke={mixHex("#9aa7bf", ANTI, lit)}
        strokeWidth="5"
      />
      <rect x="32" y="32" width="36" height="36" rx="6" fill={ANTI} opacity={0.16 + lit * 0.74} />
    </svg>
  );
};

// =============================================================== SCOPE FRAME ===
// Turns the blueprint grid into an instrument: a brighter rect with corner
// ticks and a dashed centre axis. Any wave inside it reads as a measurement.
export const ScopeFrame: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ x, y, w, h, opacity = 1, style }) => {
  const theme = useTheme();
  const cy = h / 2;
  const tick = 34;
  const corners: Array<[number, number, number, number]> = [
    [0, 0, 1, 1],
    [w, 0, -1, 1],
    [0, h, 1, -1],
    [w, h, -1, -1],
  ];
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: "absolute", left: x, top: y, overflow: "visible", opacity, ...style }}
    >
      <rect x="2" y="2" width={w - 4} height={h - 4} rx="12" fill="rgba(7, 12, 26, 0.58)" stroke={theme.line} strokeWidth="3" />
      {corners.map(([cx, cyy, sx, sy], i) => (
        <path
          key={i}
          d={`M${cx + sx * tick} ${cyy + sy * 3}H${cx + sx * 12}Q${cx + sx * 3} ${cyy + sy * 3} ${cx + sx * 3} ${cyy + sy * 12}V${cyy + sy * tick}`}
          fill="none"
          stroke={theme.second}
          strokeWidth="5"
          opacity="0.62"
          strokeLinecap="round"
        />
      ))}
      <line x1="18" y1={cy} x2={w - 18} y2={cy} stroke={theme.lineFaint} strokeWidth="2" strokeDasharray="11 13" />
      {Array.from({ length: 11 }, (_, i) => 18 + ((w - 36) / 10) * i).map((tx, i) => (
        <line key={i} x1={tx} y1={cy - 7} x2={tx} y2={cy + 7} stroke={theme.lineFaint} strokeWidth="2" />
      ))}
    </svg>
  );
};

// ================================================================ PLANE ROW ===
// Minimal cabin cross-section: 3 seat glyphs (backrest + pan + pedestal, so
// they read as CHAIRS, not portholes), one window high on the wall, and an
// engine wedge at the left where the drone enters. The drone waves themselves
// are drawn OVER this by the scene, in the air space above the seats.
export const PLANE_RATIO = 400 / 900;
export const PlaneRow: React.FC<{
  x: number;
  y: number;
  w?: number;
  style?: React.CSSProperties;
}> = ({ x, y, w = 900, style }) => {
  const theme = useTheme();
  const seats = [150, 400, 650];
  return (
    <svg
      width={w}
      height={w * PLANE_RATIO}
      viewBox="0 0 900 400"
      style={{ position: "absolute", left: x, top: y, overflow: "visible", ...style }}
    >
      <rect x="14" y="14" width="872" height="372" rx="118" fill="rgba(9, 14, 28, 0.66)" stroke={theme.textDim} strokeWidth="5" opacity="0.85" />
      {/* engine, stage-left: where the drone comes from */}
      <path d="M0 152L52 128V272L0 248Z" fill={NOISE} opacity="0.3" />
      <path d="M0 152L52 128V272L0 248Z" fill="none" stroke={NOISE} strokeWidth="5" opacity="0.75" />
      {/* the one window, high on the wall */}
      <circle cx="792" cy="92" r="30" fill="rgba(60, 200, 245, 0.1)" stroke={theme.textDim} strokeWidth="5" />
      {/* cabin floor */}
      <line x1="80" y1="378" x2="820" y2="378" stroke={theme.lineFaint} strokeWidth="4" />
      {seats.map((sx) => (
        <g key={sx} fill={theme.textDim}>
          <rect x={sx} y="236" width="24" height="130" rx="12" opacity="0.62" />
          <rect x={sx} y="336" width="96" height="22" rx="11" opacity="0.62" />
          <rect x={sx + 44} y="356" width="16" height="22" rx="6" opacity="0.42" />
        </g>
      ))}
    </svg>
  );
};

// ================================================================ BABY CRY ===
// Deliberately abstract: a swaddled bundle (blanket + head circle, no face, no
// infant detail) and a fan of jagged wavelets. The fan points UP and OUT only —
// a full 360 star-burst read as a spider in the first render.
const CRY_RAYS = [-176, -150, -124, -98, -72, -46, -20, 6];
export const BabyCry: React.FC<{
  x: number;
  y: number;
  size?: number;
  burst: number; // 0-1
  style?: React.CSSProperties;
}> = ({ x, y, size = 92, burst, style }) => {
  const theme = useTheme();
  const box = 620;
  const c = box / 2;
  const r0 = size * 0.62;
  return (
    <svg
      width={box}
      height={box}
      viewBox={`0 0 ${box} ${box}`}
      style={{ position: "absolute", left: x - c, top: y - c, overflow: "visible", ...style }}
    >
      {CRY_RAYS.map((deg, i) => {
        const p = Math.max(0, Math.min(1, burst * 1.25 - i * 0.02));
        if (p <= 0.02) return null;
        const a = (deg * Math.PI) / 180;
        const len = r0 + p * 175;
        const ux = Math.cos(a);
        const uy = Math.sin(a);
        // zig-zag wavelet along the ray - jagged, not a smooth arc
        let d = "";
        const segs = 9;
        for (let s2 = 0; s2 <= segs; s2++) {
          const t = s2 / segs;
          const dist = r0 + t * (len - r0);
          const wob = (rand(i, 4, s2) - 0.5) * 28 * p * Math.sin(t * Math.PI);
          const px = c + ux * dist - uy * wob;
          const py = c + uy * dist + ux * wob;
          d += `${s2 === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`;
        }
        return (
          <path
            key={deg}
            d={d}
            fill="none"
            stroke={NOISE}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.35 + p * 0.6}
          />
        );
      })}
      {/* swaddled bundle: blanket + head. No face — channel style. */}
      <g style={{ filter: `drop-shadow(0 0 ${8 + burst * 20}px ${NOISE})` }}>
        <path
          d={`M${c - size * 0.32} ${c - size * 0.04}Q${c - size * 0.44} ${c + size * 0.52} ${c} ${c + size * 0.52}Q${c + size * 0.44} ${c + size * 0.52} ${c + size * 0.32} ${c - size * 0.04}Z`}
          fill={theme.bgLifted}
          stroke={NOISE}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <circle cx={c} cy={c - size * 0.26} r={size * 0.22} fill={theme.bgLifted} stroke={NOISE} strokeWidth="5" />
        <path
          d={`M${c - size * 0.26} ${c + size * 0.2}Q${c} ${c + size * 0.34} ${c + size * 0.26} ${c + size * 0.2}`}
          fill="none"
          stroke={NOISE}
          strokeWidth="4"
          opacity="0.8"
        />
      </g>
    </svg>
  );
};

// ============================================================ JAGGED GLYPH ===
// A tiny INLINE jagged wavelet — the "sound nothing can predict" mark. Sized to
// sit inside a `Chip` next to text (the hook's rehook chip: the baby, unnamed).
// Deliberately STATIC (no `frame` input): it has to be safe to show inside a
// frozen frame, and a 30px icon that wiggles just reads as a rendering fault.
export const JaggedGlyph: React.FC<{
  w?: number;
  h?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ w = 54, h = 30, color = NOISE, style }) => {
  const n = 24;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const env = Math.sin(t * Math.PI); // fades to nothing at both ends
    const v = (Math.sin(t * 13.5) * 0.5 + (rand(i, 8, 1) - 0.5) * 1.55) * env;
    d += `${i === 0 ? "M" : "L"}${(t * w).toFixed(1)} ${(h / 2 - v * (h / 2 - 3)).toFixed(1)}`;
  }
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ display: "inline-block", verticalAlign: "-0.34em", overflow: "visible", ...style }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="4" // 4px floor — thinner strokes vanished at delivery scale
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ============================================================ TEXT FURNITURE ===
// Local copies of the channel's Chip/Stamp idiom (006's kit) — episode folders
// stay self-contained; nothing shared is edited.
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
        border: `1.5px solid ${color ?? theme.cardBorder}`,
        boxShadow: theme.cardShadow,
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

export const Stamp: React.FC<{
  children: React.ReactNode;
  color?: string;
  fontSize?: number;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ children, color, fontSize = 44, rotate = -2, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "inline-block",
        padding: "16px 30px",
        border: `4px solid ${color ?? theme.accent}`,
        borderRadius: 5,
        background: "rgba(9, 14, 28, 0.92)",
        boxShadow: `0 0 36px ${color === SUM ? "rgba(255,255,255,0.22)" : theme.accentGlow}`,
        fontFamily: FONTS.mono,
        fontWeight: 800,
        fontSize,
        lineHeight: 1.12,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        textAlign: "center",
        color: theme.text,
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Small absolutely-positioned mono label (scope row names, +1/-1 callouts).
export const MonoTag: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  color?: string;
  size?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ x, y, children, color, size = 24, opacity = 1, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily: FONTS.mono,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "0.16em",
        color: color ?? theme.textDim,
        whiteSpace: "nowrap",
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// A hard-sequenced slot: one child at a time, fully out before the next is in
// (superimposed crossfades were a real bug in 005). Give each entry a window;
// the fades are inset so two entries can never share a frame.
export const slotOpacity = (frame: number, from: number, to: number): number =>
  interpolate(frame, [from, from + 12, to - 10, to], [0, 1, 1, 0], clamp);
