import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";

// Episode 011 kit — the whole episode plays out inside one stage panel so the
// metaphor's stars never compete with the galaxy skin's background starfield.
// Background = ambience at the frame edges; inside the panel, we own every dot.

// ── Semantic color law ────────────────────────────────────────────────────
export const STAR = "#EAF2FF"; // a surviving loud point
export const LINK = "rgba(125,211,252,0.75)"; // constellation lines (second)
export const LINK_FAINT = "rgba(125,211,252,0.34)"; // wrong-song links on the wall
export const LOCK = "#e50914"; // the match flare — ONLY at the moment of match
export const HAZE = "rgba(245,168,60,0.35)"; // crowd noise, the one warm color

// Stage panel geometry, comp space (§0.3 working band: y440–1370, x65–1015)
export const PANEL = { x: 120, y: 460, w: 840, h: 880 } as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Deterministic hash — the makeStars idiom from Background.tsx. No Math.random.
export const rnd = (i: number, n: number, seed: number) => {
  const s = Math.sin((i + 1) * 127.1 + seed * 311.7 + n * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

export type Pt = { x: number; y: number };

// The song's constellation (normalized to the panel). Hand-authored so the
// shape reads as intentional; the scatter around it is seeded.
export const SONG_STARS: Pt[] = [
  { x: 0.18, y: 0.22 },
  { x: 0.31, y: 0.4 },
  { x: 0.46, y: 0.28 },
  { x: 0.58, y: 0.47 },
  { x: 0.42, y: 0.61 },
  { x: 0.26, y: 0.68 },
  { x: 0.7, y: 0.34 },
  { x: 0.8, y: 0.55 },
  { x: 0.64, y: 0.72 },
  { x: 0.5, y: 0.83 },
  { x: 0.33, y: 0.86 },
  { x: 0.86, y: 0.2 },
];
export const SONG_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [1, 4], [2, 6],
  [6, 11], [6, 7], [7, 8], [8, 3], [8, 9], [9, 10], [10, 5],
];

// The hummed tune — a visibly different shape, and one star fewer.
export const HUM_STARS: Pt[] = [
  { x: 0.7, y: 0.22 },
  { x: 0.88, y: 0.38 },
  { x: 0.5, y: 0.38 },
  { x: 0.34, y: 0.52 },
  { x: 0.16, y: 0.42 },
  { x: 0.16, y: 0.6 },
  { x: 0.42, y: 0.74 },
  { x: 0.66, y: 0.6 },
  { x: 0.6, y: 0.88 },
];
export const HUM_EDGES: [number, number][] = [
  [0, 1], [1, 7], [7, 2], [2, 0], [2, 3], [3, 4], [4, 5], [5, 6], [6, 8], [6, 3],
];

// ── SoundMap — the stage every scene lives inside ─────────────────────────
export const SoundMap: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        position: "absolute",
        left: PANEL.x,
        top: PANEL.y,
        width: PANEL.w,
        height: PANEL.h,
        background: theme.bgLifted,
        border: `2px solid ${theme.line}`,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: theme.cardShadow,
        ...style,
      }}
    >
      {/* faint pitch (y) / time (x) axis ticks — this is a map, not a void */}
      <svg width={PANEL.w} height={PANEL.h} style={{ position: "absolute", inset: 0 }}>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line
            key={`v${i}`}
            x1={(PANEL.w / 8) * i}
            y1={0}
            x2={(PANEL.w / 8) * i}
            y2={PANEL.h}
            stroke={theme.lineFaint}
            strokeWidth={2}
          />
        ))}
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={(PANEL.h / 8) * i}
            x2={PANEL.w}
            y2={(PANEL.h / 8) * i}
            stroke={theme.lineFaint}
            strokeWidth={2}
          />
        ))}
      </svg>
      {children}
    </div>
  );
};

// ── PointField — THE component ────────────────────────────────────────────
// Seeded scatter of sound-points. `landed` (0–1) reveals them in seeded order
// (the rain); `dim` fades the survivors-that-aren't toward nothing; `drown`
// kills them from the panel floor upward (the haze); `stars` are promoted to
// full STARs with a glow.
export const PointField: React.FC<{
  count: number;
  seed: number;
  landed?: number;
  dim?: number;
  drown?: number; // 0–1 waterline: points below it are gone
  stars?: Pt[];
  starIgnite?: number; // 0–1 across the whole star set, staggered internally
  starBloom?: number; // extra glow (the crowd scene)
  twinkle?: boolean;
  dotColor?: string; // crowd-noise points are warm; sound-map points are neutral
}> = ({
  count,
  seed,
  landed = 1,
  dim = 0,
  drown = 0,
  stars = [],
  starIgnite = 0,
  starBloom = 0,
  twinkle = true,
  dotColor,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const revealed = Math.round(count * landed);

  return (
    <svg width={PANEL.w} height={PANEL.h} style={{ position: "absolute", inset: 0 }}>
      {/* the crowd of quiet points */}
      {Array.from({ length: count }, (_, i) => {
        if (i >= revealed) return null;
        const px = 26 + rnd(i, 1, seed) * (PANEL.w - 52);
        const py = 26 + rnd(i, 2, seed) * (PANEL.h - 52);
        const r = 3.2 + rnd(i, 3, seed) * 2.4;
        // A 2-frame white tick as each point lands. Only while the rain is
        // actually falling — otherwise the last index stays lit forever.
        const fresh = landed < 0.999 && revealed - i > 0 && revealed - i <= 2 ? 1 : 0;
        const below = 1 - py / PANEL.h; // 1 at the floor
        const drowned = drown > 0 && below < drown ? 1 : 0;
        const tw = twinkle ? 0.15 * Math.sin(frame / 11 + rnd(i, 4, seed) * 9) : 0;
        const o = (0.5 + rnd(i, 5, seed) * 0.35 + tw) * (1 - dim) * (1 - drowned);
        if (o <= 0.01) return null;
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={fresh ? r * 1.6 : r}
            fill={fresh ? STAR : dotColor ?? theme.textDim}
            opacity={fresh ? 1 : o}
          />
        );
      })}

      {/* the survivors */}
      {stars.map((s, i) => {
        const ig = interpolate(starIgnite, [i * 0.045, i * 0.045 + 0.35], [0, 1], clamp);
        if (ig <= 0.001) return null;
        const px = s.x * PANEL.w;
        const py = s.y * PANEL.h;
        const tw = twinkle ? 0.12 * Math.sin(frame / 9 + i * 2.1) : 0;
        const r = (5 + 5 * ig) * (1 + starBloom * 0.4);
        // A real glow, not a flat alpha disc — at reel scale the disc read as a
        // dull grey blob against the panel.
        const glow = (12 + 20 * ig + starBloom * 26) * (1 + tw);
        return (
          <g key={`s${i}`}>
            {/* the dark halo the star punches through the haze */}
            {starBloom > 0 ? (
              <circle cx={px} cy={py} r={r * 3.6} fill={theme.bg} opacity={starBloom * 0.9} />
            ) : null}
            <g style={{ filter: `drop-shadow(0 0 ${glow}px rgba(234,242,255,${0.5 + starBloom * 0.4}))` }}>
              <circle cx={px} cy={py} r={r} fill={STAR} opacity={ig} />
            </g>
          </g>
        );
      })}
    </svg>
  );
};

// ── Constellation — stroke-dash reveal between star coords ────────────────
export const Constellation: React.FC<{
  stars: Pt[];
  edges: [number, number][];
  progress: number; // 0–1
  color?: string;
  opacity?: number;
  width?: number;
}> = ({ stars, edges, progress, color = LINK, opacity = 1, width = 4 }) => (
  <svg width={PANEL.w} height={PANEL.h} style={{ position: "absolute", inset: 0 }}>
    {edges.map(([a, b], i) => {
      const p = interpolate(progress, [i / edges.length * 0.6, i / edges.length * 0.6 + 0.4], [0, 1], clamp);
      if (p <= 0.001) return null;
      const x1 = stars[a].x * PANEL.w;
      const y1 = stars[a].y * PANEL.h;
      const x2 = stars[b].x * PANEL.w;
      const y2 = stars[b].y * PANEL.h;
      const len = Math.hypot(x2 - x1, y2 - y1);
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - p)}
          opacity={opacity}
        />
      );
    })}
  </svg>
);

// ── MapWall — the hunt through millions of wrong constellations ───────────
export const CELL_W = PANEL.w / 3;
export const CELL_H = 150;
export const WALL_ROWS = Math.ceil(PANEL.h / CELL_H) + 2;

// Wall-local y of a cell at a given scroll offset. The scene needs this to fly
// the locked cell up onto the song's constellation, so both must agree.
export const wallCellY = (row: number, offset: number) =>
  ((row * CELL_H - (offset % CELL_H) + CELL_H * WALL_ROWS) % (CELL_H * WALL_ROWS)) - CELL_H;

// A seeded bank of 12 wrong shapes, recycled down the columns.
const wallCell = (bank: number) => {
  const pts: Pt[] = Array.from({ length: 5 }, (_, i) => ({
    x: 0.2 + rnd(i, 1, bank * 7 + 3) * 0.6,
    y: 0.2 + rnd(i, 2, bank * 7 + 3) * 0.6,
  }));
  const edges: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]];
  return { pts, edges };
};

export const MapWall: React.FC<{
  offset: number; // scroll position in px (grows = scrolls up)
  lockCell?: number | null; // row index (centre column) of the cell that flares
  lockProgress?: number;
  // The matched cell draws the SONG's shape, not its own — that identity is
  // the whole point of the beat, and the scene flies this cell up onto it.
  lockPts?: Pt[];
  lockEdges?: [number, number][];
  opacity?: number;
  drain?: number; // 0–1 fades cells away column by column
}> = ({
  offset,
  lockCell = null,
  lockProgress = 0,
  lockPts,
  lockEdges,
  opacity = 1,
  drain = 0,
}) => {
  const rows = WALL_ROWS;
  return (
    <svg width={PANEL.w} height={PANEL.h} style={{ position: "absolute", inset: 0, opacity }}>
      {Array.from({ length: 3 }, (_, col) =>
        Array.from({ length: rows }, (_, row) => {
          const idx = col * 97 + row;
          const bank = idx % 12;
          const isLock = lockCell !== null && col === 1 && row === lockCell;
          const { pts, edges } =
            isLock && lockPts && lockEdges
              ? { pts: lockPts, edges: lockEdges }
              : wallCell(bank);
          const y = wallCellY(row, offset);
          const x = col * CELL_W;
          const gone = interpolate(drain, [col * 0.22, col * 0.22 + 0.4], [1, 0], clamp);
          if (gone <= 0.01) return null;
          // Wrong shapes fill the cell; the MATCHED cell is drawn at the same
          // uniform scale the scene flies it away at, so the viewer sees the
          // identical shape rather than a squashed lookalike.
          const mapX = isLock
            ? (v: number) => CELL_W / 2 + (v - 0.5) * PANEL.w * (CELL_H / PANEL.h)
            : (v: number) => v * CELL_W;
          const mapY = isLock
            ? (v: number) => CELL_H / 2 + (v - 0.5) * CELL_H
            : (v: number) => v * CELL_H;
          const c = isLock ? LOCK : LINK_FAINT;
          const sc = isLock ? 1 + lockProgress * 0.12 : 1;
          return (
            <g
              key={`${col}-${row}`}
              transform={`translate(${x + CELL_W / 2} ${y + CELL_H / 2}) scale(${sc}) translate(${-CELL_W / 2} ${-CELL_H / 2})`}
              opacity={(isLock ? 1 : 0.85) * gone}
            >
              {edges.map(([a, b], i) => (
                <line
                  key={i}
                  x1={mapX(pts[a].x)}
                  y1={mapY(pts[a].y)}
                  x2={mapX(pts[b].x)}
                  y2={mapY(pts[b].y)}
                  stroke={c}
                  strokeWidth={isLock ? 5 : 4}
                />
              ))}
              {pts.map((p, i) => (
                <circle
                  key={i}
                  cx={mapX(p.x)}
                  cy={mapY(p.y)}
                  r={isLock ? 7 : 4.5}
                  fill={isLock ? LOCK : "rgba(234,242,255,0.45)"}
                />
              ))}
              {isLock && lockProgress > 0 ? (
                <circle
                  cx={CELL_W / 2}
                  cy={CELL_H / 2}
                  r={70 * lockProgress}
                  fill="none"
                  stroke={LOCK}
                  strokeWidth={3}
                  opacity={1 - lockProgress}
                />
              ) : null}
            </g>
          );
        })
      )}
    </svg>
  );
};

// ── ListenRing — generic listening pulse (no Shazam logo; no-IP rule) ──────
export const ListenRing: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={PANEL.w} height={PANEL.h} style={{ position: "absolute", inset: 0 }}>
      {[0, 1, 2].map((i) => {
        const p = ((frame / 46 + i / 3) % 1);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={(24 + p * 190) * scale}
            fill="none"
            stroke={LINK}
            strokeWidth={4}
            opacity={(1 - p) * 0.6}
          />
        );
      })}
      <circle cx={x} cy={y} r={13 * scale} fill={STAR} opacity={0.9} />
    </svg>
  );
};

// ── WaveStream — a live waveform ribbon (seeded harmonics, deterministic) ──
export const WaveStream: React.FC<{
  amp: number;
  y: number;
  seed?: number;
  wobble?: number; // the hum is wobblier than the record
  tip?: number; // 0–1 tips the ribbon vertical as it rains into the map
  opacity?: number;
}> = ({ amp, y, seed = 5, wobble = 0, tip = 0, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const N = 90;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = t * PANEL.w;
    const env = Math.sin(t * Math.PI); // fade at both ends
    const a =
      Math.sin(t * 17 + frame * 0.19 + seed) * 0.55 +
      Math.sin(t * 41 - frame * 0.13 + seed * 2) * 0.3 +
      Math.sin(t * 7 + frame * 0.07) * 0.35 +
      (wobble ? Math.sin(t * 3.1 + frame * 0.05) * wobble * 0.9 : 0);
    pts.push(`${x},${y + a * amp * env}`);
  }
  return (
    <svg
      width={PANEL.w}
      height={PANEL.h}
      style={{
        position: "absolute",
        inset: 0,
        opacity: opacity * (1 - tip),
        transform: `perspective(900px) rotateX(${tip * 78}deg)`,
        transformOrigin: `center ${y}px`,
      }}
    >
      <polyline points={pts.join(" ")} fill="none" stroke={STAR} strokeWidth={4} strokeLinejoin="round" opacity={0.9} />
      <polyline points={pts.join(" ")} fill="none" stroke={LINK} strokeWidth={12} strokeLinejoin="round" opacity={0.22} />
    </svg>
  );
};

// ── HazeTide — warm crowd noise rising from the panel floor ───────────────
export const HazeTide: React.FC<{ level: number }> = ({ level }) => {
  const frame = useCurrentFrame();
  if (level <= 0.001) return null;
  const h = PANEL.h * level;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: h,
          background: `linear-gradient(180deg, transparent 0%, ${HAZE} 46%, rgba(245,168,60,0.4) 100%)`,
        }}
      />
      <svg width={PANEL.w} height={PANEL.h} style={{ position: "absolute", inset: 0 }}>
        {/* seeded scream spikes — the haze never rests */}
        {Array.from({ length: 26 }, (_, i) => {
          const sx = rnd(i, 1, 61) * PANEL.w;
          const phase = (frame * (0.9 + rnd(i, 2, 61)) + i * 31) % 120;
          const spike = Math.max(0, Math.sin((phase / 120) * Math.PI)) * (30 + rnd(i, 3, 61) * 70);
          const base = PANEL.h - h + 8;
          if (base - spike > PANEL.h) return null;
          return (
            <line
              key={i}
              x1={sx}
              y1={base}
              x2={sx}
              y2={base - spike}
              stroke="rgba(255,196,120,0.55)"
              strokeWidth={3}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
};

// ── ShazamPhone — the cold open's phone, mid-listen ───────────────────────
// Draws the actual Shazam app moment: blue screen, white pulsing button with
// the double-hook S logo, listening rings already expanding at f0.
// ⚠ Deliberate no-IP-rule exception: the real Shazam logo is drawn here by
// owner decision (2026-08-21) — comprehension beat the house rule. Do not
// "fix" this back to a generic glyph; see CONTENT.md episode log.
export const SHAZAM_BLUE = "#0088FF";
export const SHAZAM_BLUE_DEEP = "#0353C7";

// The supplied app icon (public/episodes/011-shazam/shazam-icon.png). The
// blue disc sits inset in the 500px image, so we clip to a circle just inside
// the disc edge — any background in the file never shows.
export const ShazamIcon: React.FC<{ size: number; ring?: boolean }> = ({
  size,
  ring = true,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 999,
      overflow: "hidden",
      border: ring ? `${Math.max(3, size * 0.03)}px solid rgba(255,255,255,0.95)` : "none",
      boxShadow: "0 10px 44px rgba(0,20,60,0.45)",
      // the file's S is punched out as transparency — white behind it makes
      // the glyph white, exactly the real icon
      background: "#FFFFFF",
    }}
  >
    <Img
      src={staticFile("episodes/011-shazam/shazam-icon.png")}
      style={{
        width: "125%",
        height: "125%",
        marginLeft: "-12.5%",
        marginTop: "-12.5%",
        display: "block",
      }}
    />
  </div>
);

export const ShazamPhone: React.FC<{
  w?: number; // phone body width
  tap?: number; // 0–1 one-shot tap ripple on the button
}> = ({ w = 400, tap = 0 }) => {
  const frame = useCurrentFrame();
  const h = w * 2.05;
  const btn = w * 0.44;
  const pulse = 1 + 0.05 * Math.sin(frame / 8);
  return (
    <div style={{ position: "absolute", width: w, height: h }}>
      {/* body */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: w * 0.14,
          background: "#0b0b14",
          border: "3px solid rgba(148,163,200,0.5)",
          boxShadow: "0 24px 80px rgba(0,0,10,0.6)",
        }}
      />
      {/* screen — the app's blue */}
      <div
        style={{
          position: "absolute",
          left: w * 0.045,
          top: w * 0.045,
          right: w * 0.045,
          bottom: w * 0.045,
          borderRadius: w * 0.1,
          overflow: "hidden",
          background: `radial-gradient(ellipse 130% 90% at 50% 18%, ${SHAZAM_BLUE} 0%, ${SHAZAM_BLUE_DEEP} 78%)`,
        }}
      >
        {/* listening rings — already expanding at f0 (Z.1) */}
        <svg width={w} height={h} style={{ position: "absolute", left: -w * 0.045, top: -w * 0.045 }}>
          {[0, 1, 2].map((i) => {
            const p = (frame / 52 + i / 3) % 1;
            return (
              <circle
                key={i}
                cx={w / 2}
                cy={h * 0.44}
                r={btn * (0.55 + p * 1.5)}
                fill="none"
                stroke="rgba(255,255,255,0.65)"
                strokeWidth={3.5}
                opacity={(1 - p) * 0.55}
              />
            );
          })}
          {/* tap ripple on "hit that button" */}
          {tap > 0.01 && tap < 0.99 ? (
            <circle
              cx={w / 2}
              cy={h * 0.44}
              r={btn * (0.55 + tap * 0.7)}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={5}
              opacity={1 - tap}
            />
          ) : null}
        </svg>
        {/* the button — the app icon itself, pulsing */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: `${((h * 0.44) / (h - w * 0.09)) * 100}%`,
            transform: `translate(-50%, -50%) scale(${pulse * (tap > 0.01 && tap < 0.5 ? 0.94 : 1)})`,
          }}
        >
          <ShazamIcon size={btn} />
        </div>
        {/* the app's prompt line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: h * 0.62,
            textAlign: "center",
            fontFamily:
              '-apple-system, "SF Pro Display", "Segoe UI", Helvetica, Arial, sans-serif',
            fontWeight: 700,
            fontSize: w * 0.062,
            letterSpacing: "0.01em",
            color: "rgba(255,255,255,0.94)",
          }}
        >
          Tap to Shazam
        </div>
      </div>
      {/* speaker notch */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: w * 0.055,
          transform: "translateX(-50%)",
          width: w * 0.26,
          height: w * 0.028,
          borderRadius: 999,
          background: "rgba(148,163,200,0.4)",
        }}
      />
    </div>
  );
};
