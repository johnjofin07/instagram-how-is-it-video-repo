import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";

// Episode 005 kit — deep-sea SVG primitives. Subject-literal colors live here
// (silt, steel, copper); everything semantic comes from the theme.

export const SILT = "#1A2A2E";
export const SILT_LIGHT = "#28403F";
export const SHEATH = "#2E4757"; // cable outer plastic
export const STEEL = "#7C93A3"; // armor wire
export const COPPER = "#C07A4A"; // conductor
export const GEL = "#3B5060"; // filler
export const HULL = "#34495A"; // ship hull

// Seeded scatter — renders must be deterministic (no Math.random).
export const hash = (i: number, seed: number, n: number) => {
  const s = Math.sin((i + 1) * 127.1 + seed * 311.7 + n * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

// ------------------------------------------------------------------- cable
// Horizontal cable lying on the floor. `broken` parts it at the midpoint.
export const Cable: React.FC<{
  w: number;
  thickness?: number;
  broken?: number; // 0 = intact, 1 = fully parted
  glow?: boolean;
  style?: React.CSSProperties;
}> = ({ w, thickness = 26, broken = 0, glow = false, style }) => {
  const theme = useTheme();
  const half = w / 2;
  const gap = broken * 90;
  const tilt = broken * 1.2;

  const End: React.FC<{ side: -1 | 1 }> = ({ side }) => (
    // frayed fibers poking out of a parted end
    <g opacity={broken > 0.15 ? 1 : 0}>
      {[-6, 0, 6].map((dy, i) => (
        <line
          key={i}
          x1={side === -1 ? half - gap : half + gap}
          y1={thickness / 2 + dy}
          x2={side === -1 ? half - gap - 16 - i * 4 : half + gap + 16 + i * 4}
          y2={thickness / 2 + dy * 1.9}
          stroke={theme.accentDim}
          strokeWidth="2"
        />
      ))}
    </g>
  );

  return (
    <svg width={w} height={thickness + 40} style={{ overflow: "visible", ...style }}>
      {[-1, 1].map((side) => (
        <g
          key={side}
          transform={`translate(${side === -1 ? -gap : gap} 0) rotate(${side * tilt} ${half} ${thickness / 2})`}
        >
          <rect
            x={side === -1 ? 0 : half}
            y={0}
            width={half}
            height={thickness}
            fill={SHEATH}
          />
          <rect
            x={side === -1 ? 0 : half}
            y={2}
            width={half}
            height={4}
            rx={2}
            fill={STEEL}
            opacity={0.85}
          />
          <rect
            x={side === -1 ? 0 : half}
            y={thickness - 5}
            width={half}
            height={3}
            rx={1.5}
            fill="#0A1620"
            opacity={0.7}
          />
          {glow ? (
            <rect
              x={side === -1 ? 0 : half}
              y={thickness / 2 - 2}
              width={half}
              height={4}
              fill={theme.accentDim}
              opacity={0.75}
            />
          ) : null}
        </g>
      ))}
      <End side={-1} />
      <End side={1} />
    </svg>
  );
};

// ----------------------------------------------------------- cross-section
// Concentric cutaway. `reveal` gates the rings outside-in; `dim` mutes
// everything but the fiber core (the "almost all armor" beat).
export const CableSection: React.FC<{
  d: number; // diameter
  reveal?: number; // 0-1
  dim?: number; // 0-1, how much to mute the armor
  style?: React.CSSProperties;
}> = ({ d, reveal = 1, dim = 0, style }) => {
  const theme = useTheme();
  const r = d / 2;
  const armor = 1 - dim * 0.78;
  const ring = (at: number) => interpolate(reveal, [at, at + 0.18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} style={{ overflow: "visible", ...style }}>
      <circle cx={r} cy={r} r={r * 0.98} fill={SHEATH} opacity={ring(0) * armor} />
      <circle
        cx={r}
        cy={r}
        r={r * 0.98}
        fill="none"
        stroke={theme.line}
        strokeWidth="2"
        opacity={ring(0) * armor}
      />
      {/* armor wires */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={r + Math.cos(a) * r * 0.68}
            cy={r + Math.sin(a) * r * 0.68}
            r={r * 0.075}
            fill={STEEL}
            opacity={ring(0.18) * armor}
          />
        );
      })}
      <circle cx={r} cy={r} r={r * 0.46} fill={COPPER} opacity={ring(0.36) * armor} />
      <circle cx={r} cy={r} r={r * 0.34} fill={GEL} opacity={ring(0.54) * armor} />
      {/* the fiber bundle — never dimmed, this is the point */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={r + Math.cos(a) * r * 0.15}
            cy={r + Math.sin(a) * r * 0.15}
            r={Math.max(2, r * 0.028)}
            fill={theme.accent}
            opacity={ring(0.72)}
          />
        );
      })}
    </svg>
  );
};

// -------------------------------------------------------------- light pulse
// Dots travelling along a horizontal run. `t` is a 0-1 phase; dots wrap.
export const Pulse: React.FC<{
  w: number;
  y?: number;
  t: number;
  count?: number;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ w, y = 0, t, count = 3, color, size = 9, style }) => {
  const theme = useTheme();
  const c = color ?? theme.accent;
  return (
    <svg width={w} height={size * 4} style={{ overflow: "visible", ...style }}>
      {Array.from({ length: count }, (_, i) => {
        const p = (t + i / count) % 1;
        return (
          <g key={i}>
            <line
              x1={p * w - 46}
              y1={y}
              x2={p * w}
              y2={y}
              stroke={c}
              strokeWidth={size * 0.5}
              strokeLinecap="round"
              opacity={0.35}
            />
            <circle cx={p * w} cy={y} r={size / 2} fill={c} />
          </g>
        );
      })}
    </svg>
  );
};

// ------------------------------------------------------------ fiber strand
export const FiberStrand: React.FC<{
  len: number;
  pulse: number; // 0-1 position of the light
  w?: number;
  vertical?: boolean;
  color?: string;
  style?: React.CSSProperties;
}> = ({ len, pulse, w = 3, vertical = false, color, style }) => {
  const theme = useTheme();
  const c = color ?? theme.accent;
  const at = pulse * len;
  return (
    <svg
      width={vertical ? w * 12 : len}
      height={vertical ? len : w * 12}
      style={{ overflow: "visible", ...style }}
    >
      <line
        x1={vertical ? w * 6 : 0}
        y1={vertical ? 0 : w * 6}
        x2={vertical ? w * 6 : len}
        y2={vertical ? len : w * 6}
        stroke={c}
        strokeWidth={w}
        opacity={0.45}
        strokeLinecap="round"
      />
      <circle
        cx={vertical ? w * 6 : at}
        cy={vertical ? at : w * 6}
        r={w * 2.6}
        fill={c}
        opacity={pulse > 0 && pulse < 1 ? 1 : 0}
      />
    </svg>
  );
};

// -------------------------------------------------------------------- ship
export const Ship: React.FC<{
  w: number;
  lights?: boolean;
  gantry?: boolean;
  style?: React.CSSProperties;
}> = ({ w, lights = false, gantry = false, style }) => {
  const theme = useTheme();
  const h = w * 0.46;
  return (
    <svg width={w} height={h} viewBox="0 0 200 92" style={{ overflow: "visible", ...style }}>
      {/* hull */}
      <path d="M 8 48 L 192 48 L 172 78 L 30 78 Z" fill={HULL} />
      <path d="M 8 48 L 192 48 L 190 54 L 10 54 Z" fill={STEEL} opacity={0.35} />
      {/* superstructure */}
      <rect x="112" y="20" width="46" height="28" rx="3" fill={HULL} />
      <rect x="120" y="27" width="9" height="9" fill={lights ? theme.second : STEEL} opacity={0.9} />
      <rect x="134" y="27" width="9" height="9" fill={lights ? theme.second : STEEL} opacity={0.9} />
      {/* stern A-frame gantry — the repair ships have one */}
      {gantry ? (
        <path
          d="M 26 48 L 34 16 M 58 48 L 46 16 M 34 16 L 46 16"
          stroke={STEEL}
          strokeWidth="4"
          fill="none"
        />
      ) : null}
      {lights ? (
        <ellipse cx="100" cy="52" rx="96" ry="20" fill={theme.second} opacity={0.12} />
      ) : null}
    </svg>
  );
};

export const Trawler: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 200 124" style={{ overflow: "visible", ...style }}>
    <path d="M 12 40 L 176 40 L 158 66 L 30 66 Z" fill={HULL} />
    <rect x="104" y="16" width="38" height="24" rx="3" fill={HULL} />
    {/* trailing net */}
    <path d="M 20 58 Q 62 104, 146 112" stroke={STEEL} strokeWidth="3" fill="none" opacity={0.75} />
    <path d="M 20 58 Q 74 82, 150 92" stroke={STEEL} strokeWidth="3" fill="none" opacity={0.55} />
    {[
      [66, 94],
      [98, 104],
      [130, 110],
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="4" fill={STEEL} opacity={0.7} />
    ))}
  </svg>
);

export const AnchorIcon: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => (
  <svg width={w} height={w * 1.15} viewBox="0 0 80 92" style={{ overflow: "visible", ...style }}>
    <circle cx="40" cy="12" r="9" fill="none" stroke={STEEL} strokeWidth="6" />
    <line x1="40" y1="21" x2="40" y2="78" stroke={STEEL} strokeWidth="7" strokeLinecap="round" />
    <line x1="18" y1="34" x2="62" y2="34" stroke={STEEL} strokeWidth="6" strokeLinecap="round" />
    <path
      d="M 10 56 Q 12 82, 40 82 Q 68 82, 70 56"
      fill="none"
      stroke={STEEL}
      strokeWidth="7"
      strokeLinecap="round"
    />
  </svg>
);

// ----------------------------------------------------------------- grapnel
export const Grapnel: React.FC<{
  w: number;
  taut?: boolean;
  style?: React.CSSProperties;
}> = ({ w, taut = false, style }) => {
  const theme = useTheme();
  return (
    <svg width={w} height={w * 1.1} viewBox="0 0 80 88" style={{ overflow: "visible", ...style }}>
      {taut ? <circle cx="40" cy="52" r="34" fill={theme.second} opacity={0.16} /> : null}
      <line x1="40" y1="0" x2="40" y2="30" stroke={STEEL} strokeWidth="5" />
      <circle cx="40" cy="34" r="7" fill={STEEL} />
      {[-1, -0.5, 0, 0.5, 1].map((k, i) => (
        <path
          key={i}
          d={`M 40 38 L ${40 + k * 26} 66 Q ${40 + k * 32} 78, ${40 + k * 20} 80`}
          fill="none"
          stroke={taut ? theme.second : STEEL}
          strokeWidth="5"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
};

// ------------------------------------------------------------------ island
export const Island: React.FC<{
  w: number;
  dark?: boolean;
  style?: React.CSSProperties;
}> = ({ w, dark = false, style }) => {
  const theme = useTheme();
  return (
    <svg width={w} height={w * 0.5} viewBox="0 0 200 100" style={{ overflow: "visible", ...style }}>
      <path d="M 6 82 Q 42 34, 100 30 Q 158 34, 194 82 Z" fill={SILT_LIGHT} />
      {[
        [72, 62],
        [100, 54],
        [128, 62],
      ].map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="12"
          height="20"
          fill={dark ? SILT : theme.second}
          opacity={dark ? 1 : 0.95}
        />
      ))}
    </svg>
  );
};

export const Satellite: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => {
  const theme = useTheme();
  return (
    <svg width={w} height={w * 0.56} viewBox="0 0 100 56" style={{ overflow: "visible", ...style }}>
      <rect x="40" y="18" width="20" height="20" rx="3" fill={theme.textDim} />
      <rect x="6" y="22" width="28" height="12" fill={theme.textFaint} />
      <rect x="66" y="22" width="28" height="12" fill={theme.textFaint} />
      <line x1="50" y1="18" x2="50" y2="6" stroke={theme.textDim} strokeWidth="3" />
    </svg>
  );
};

// ------------------------------------------------------------- depth gauge
export const DepthGauge: React.FC<{
  h: number;
  progress: number; // 0-1
  style?: React.CSSProperties;
}> = ({ h, progress, style }) => {
  const theme = useTheme();
  const ticks = [0, 1000, 2000, 3000, 4000];
  return (
    <svg width={150} height={h} style={{ overflow: "visible", ...style }}>
      <line x1="14" y1="0" x2="14" y2={h} stroke={theme.lineFaint} strokeWidth="3" />
      {ticks.map((t, i) => {
        const y = (i / (ticks.length - 1)) * h;
        return (
          <g key={t}>
            <line x1="4" y1={y} x2="24" y2={y} stroke={theme.textFaint} strokeWidth="2" />
            <text
              x="34"
              y={y + 8}
              fill={theme.textFaint}
              fontFamily={FONTS.mono}
              fontSize="21"
              letterSpacing="1"
            >
              {t === 0 ? "0" : `${t / 1000}k`}
            </text>
          </g>
        );
      })}
      <line
        x1="4"
        y1={progress * h}
        x2="24"
        y2={progress * h}
        stroke={theme.second}
        strokeWidth="5"
      />
    </svg>
  );
};

// ------------------------------------------------------------------- stamp
// Big-beat headline. Channel constant (mono uppercase, tilted, accent border)
// dressed for the abyss skin — lit glass on dark water, not paper.
export const Stamp: React.FC<{
  children: React.ReactNode;
  color?: string;
  fontSize?: number;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ children, color, fontSize = 44, rotate = -2, style }) => {
  const theme = useTheme();
  const c = color ?? theme.accent;
  return (
    <div
      style={{
        display: "inline-block",
        padding: "16px 34px",
        border: `4px solid ${c}`,
        borderRadius: 14,
        background: "rgba(7, 19, 28, 0.82)",
        fontFamily: FONTS.mono,
        fontWeight: 700,
        fontSize,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: theme.text,
        whiteSpace: "nowrap",
        transform: `rotate(${rotate}deg)`,
        boxShadow: `0 0 44px ${theme.accentGlow}, ${theme.cardShadow}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

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
        borderRadius: 10,
        background: theme.card,
        border: `1.5px solid ${color ?? theme.cardBorder}`,
        boxShadow: theme.cardShadow,
        fontFamily: FONTS.mono,
        fontSize: 25,
        letterSpacing: "0.14em",
        color: color ?? theme.textDim,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Seabed line a scene draws for itself (the Background's seabed sits lower,
// behind the captions).
export const SeabedLine: React.FC<{ y: number; style?: React.CSSProperties }> = ({ y, style }) => {
  const theme = useTheme();
  return (
    <svg
      width={1080}
      height={900}
      style={{ position: "absolute", left: 0, top: y, ...style }}
    >
      <path
        d="M 0 40 Q 210 18, 430 34 Q 700 52, 1080 26 L 1080 900 L 0 900 Z"
        fill={SILT}
        opacity={0.9}
      />
      <path
        d="M 0 40 Q 210 18, 430 34 Q 700 52, 1080 26"
        fill="none"
        stroke={theme.lineFaint}
        strokeWidth="2"
      />
    </svg>
  );
};

// Silt puff kicked up by the dragging hook.
export const SiltPuff: React.FC<{
  x: number;
  y: number;
  age: number; // frames since spawn
  style?: React.CSSProperties;
}> = ({ x, y, age, style }) => {
  const life = interpolate(age, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (age < 0 || life >= 1) return null;
  return (
    <svg width={200} height={140} style={{ position: "absolute", left: x - 100, top: y - 100, ...style }}>
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={100 + (i - 1) * 22}
          cy={100 - life * 26 - i * 6}
          r={14 + life * (30 + i * 8)}
          fill={SILT_LIGHT}
          opacity={(1 - life) * 0.34}
        />
      ))}
    </svg>
  );
};

// A frame-driven repeating phase, e.g. pulses every `period` frames.
export const usePhase = (period: number, offset = 0) => {
  const frame = useCurrentFrame();
  return (((frame + offset) % period) / period + 1) % 1;
};
