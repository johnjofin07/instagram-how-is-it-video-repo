import React from "react";
import { useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";

// Episode-local cartoon kit: the air fryer (closed + cutaway), fan, coil,
// fries, circulating-air particles, the cool-air blanket, steam.
// All deterministic (no randomness).

export const INK = "#3B2F26"; // outlines — warm charcoal, not black
export const SHELL = "#3A4048"; // appliance body — cool charcoal
export const SHELL_DARK = "#2C3138";
export const CHAMBER = "#FDF6EA"; // interior cavity
export const TRAY = "#59616B";
export const FRY_PALE = "#F2DCA4";
export const FRY_GOLD = "#C98A3B";

// deterministic pseudo-random
export const h = (i: number, n: number) => {
  const s = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// mix two hex colors (for fry browning)
export const mixHex = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const m = pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.min(1, Math.max(0, t))));
  return `#${m.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

// ------------------------------------------------------------------- fan <g>
export const Fan: React.FC<{
  cx: number;
  cy: number;
  r: number;
  angle: number;
  color?: string;
}> = ({ cx, cy, r, angle, color = SHELL_DARK }) => (
  <g transform={`rotate(${angle} ${cx} ${cy})`}>
    {[0, 90, 180, 270].map((a) => (
      <ellipse
        key={a}
        cx={cx}
        cy={cy - r * 0.55}
        rx={r * 0.3}
        ry={r * 0.55}
        fill={color}
        transform={`rotate(${a + 18} ${cx} ${cy})`}
      />
    ))}
    <circle cx={cx} cy={cy} r={r * 0.22} fill={INK} />
    <circle cx={cx} cy={cy} r={r * 0.09} fill="#B9AFA2" />
  </g>
);

// ------------------------------------------------------------------ coil <g>
export const Coil: React.FC<{
  x: number; // left edge
  y: number;
  w: number;
  glow: number; // 0 cold → 1 glowing
}> = ({ x, y, w, glow }) => {
  const theme = useTheme();
  const n = 6;
  const step = w / n;
  const pts = Array.from({ length: n + 1 }, (_, i) => `${x + i * step},${y + (i % 2 === 0 ? 0 : 16)}`);
  const d = `M ${pts.join(" L ")}`;
  return (
    <g>
      {glow > 0.02 ? (
        <path d={d} fill="none" stroke={theme.accentGlow} strokeWidth={20} strokeLinecap="round" opacity={glow} />
      ) : null}
      <path d={d} fill="none" stroke="#8B7C6C" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={theme.accent} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={glow} />
    </g>
  );
};

// ----------------------------------------------------------------- fries <g>
// A row of fries standing in the basket, tips tilted. color = browning stage.
export const Fries: React.FC<{
  cx: number;
  baseY: number; // y of the tray they stand on
  color: string;
  scale?: number;
}> = ({ cx, baseY, color, scale = 1 }) => (
  <g transform={`translate(${cx} ${baseY}) scale(${scale})`}>
    {[-2, -1, 0, 1, 2].map((i) => {
      const hgt = 64 + h(i + 9, 1) * 22;
      const tilt = (i / 2) * 9 + (h(i + 9, 2) - 0.5) * 6;
      return (
        <g key={i} transform={`translate(${i * 30} 0) rotate(${tilt})`}>
          <rect x={-9} y={-hgt} width={18} height={hgt} rx={7} fill={color} stroke={INK} strokeWidth={2.5} />
        </g>
      );
    })}
  </g>
);

// ------------------------------------------------------- circulating air <g>
// Comet particles orbiting an ellipse (the convection loop). grow ramps them
// in; speed is cycles per frame.
export const AirLoop: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  count?: number;
  speed?: number;
  grow?: number; // 0..1 master opacity/scale ramp
  color?: string;
}> = ({ cx, cy, rx, ry, count = 9, speed = 0.006, grow = 1, color }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const c = color ?? theme.accent;
  if (grow <= 0.01) return null;
  return (
    <g opacity={grow}>
      {Array.from({ length: count }, (_, i) => {
        const t = ((frame * speed * (0.8 + h(i, 4) * 0.4) + i / count) % 1 + 1) % 1;
        const th = t * Math.PI * 2;
        const px = cx + rx * Math.cos(th);
        const py = cy + ry * Math.sin(th);
        const th2 = th - 0.42;
        const qx = cx + rx * Math.cos(th2);
        const qy = cy + ry * Math.sin(th2);
        return (
          <g key={i} opacity={0.45 + h(i, 5) * 0.5}>
            <path d={`M ${qx} ${qy} Q ${cx + rx * Math.cos(th - 0.21)} ${cy + ry * Math.sin(th - 0.21)} ${px} ${py}`} fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" opacity={0.5} />
            <circle cx={px} cy={py} r={6} fill={c} />
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------ cool-air blanket <g>
// Dashed blue outline hugging the food. After shredAt, segments fly outward
// and fade (the fan stripping the boundary layer). shredAt < 0 = never.
export const Blanket: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  shredAt?: number;
  appearAt?: number;
}> = ({ cx, cy, rx, ry, shredAt = -1, appearAt = 0 }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const segs = 14;
  return (
    <g>
      {Array.from({ length: segs }, (_, i) => {
        const th = (i / segs) * Math.PI * 2;
        const inT = Math.min(1, Math.max(0, (frame - appearAt - i * 1.5) / 12));
        if (inT <= 0) return null;
        const trigger = shredAt >= 0 ? shredAt + h(i, 6) * 26 : Infinity;
        const d = Math.max(0, frame - trigger);
        const fly = d * (2.4 + h(i, 7) * 3);
        const op = d > 0 ? Math.max(0, 1 - d / 22) : inT;
        if (op <= 0) return null;
        const nx = Math.cos(th);
        const ny = Math.sin(th);
        const px = cx + (rx + fly) * nx;
        const py = cy + (ry + fly * (ry / rx)) * ny;
        const tx = -ny * 24;
        const ty = nx * 24 * (ry / rx);
        return (
          <line
            key={i}
            x1={px - tx}
            y1={py - ty}
            x2={px + tx}
            y2={py + ty}
            stroke={theme.second}
            strokeWidth={10}
            strokeLinecap="round"
            opacity={op * 0.8}
            transform={d > 0 ? `rotate(${d * (h(i, 8) - 0.5) * 14} ${px} ${py})` : undefined}
          />
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------- steam <g>
export const Steam: React.FC<{
  x: number;
  y: number;
  start?: number;
  count?: number;
  rise?: number;
  color?: string;
}> = ({ x, y, start = 0, count = 6, rise = 130, color }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const c = color ?? theme.textFaint;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const t = (((frame - start) * 0.011 * (0.8 + h(i, 9) * 0.5) + h(i, 10)) % 1 + 1) % 1;
        const px = x + (h(i, 11) - 0.5) * 90 + Math.sin(t * 6 + i) * 14;
        const py = y - t * rise;
        return <circle key={i} cx={px} cy={py} r={4 + t * 7} fill={c} opacity={Math.sin(Math.PI * t) * 0.55} />;
      })}
    </g>
  );
};

// --------------------------------------------------------- cutaway air fryer
// Cross-section: shell, fan at the top, coil under it, fries on the tray.
// Chamber ellipse for AirLoop/Blanket overlays: cx 220, cy 280, rx ~130, ry ~100.
// Extra <g> overlays go through children (rendered inside the chamber, above
// the fries).
export const Cutaway: React.FC<{
  w?: number;
  spin?: number; // fan angle in degrees
  coilGlow?: number;
  fryColor?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ w = 440, spin = 0, coilGlow = 0, fryColor = FRY_PALE, style, children }) => (
  <svg width={w} height={(w * 500) / 440} viewBox="0 0 440 500" style={style}>
    {/* shell */}
    <rect x="24" y="14" width="392" height="452" rx="52" fill={SHELL} />
    <rect x="44" y="34" width="352" height="412" rx="38" fill={CHAMBER} />
    {/* feet */}
    <rect x="86" y="466" width="64" height="18" rx="8" fill={SHELL_DARK} />
    <rect x="290" y="466" width="64" height="18" rx="8" fill={SHELL_DARK} />
    {/* fan housing + fan + coil */}
    <rect x="44" y="34" width="352" height="52" fill={SHELL_DARK} opacity="0.12" />
    <Fan cx={220} cy={86} r={44} angle={spin} />
    <Coil x={100} y={148} w={240} glow={coilGlow} />
    {/* basket tray (perforated) + fries */}
    <rect x="74" y="388" width="292" height="11" rx="5" fill={TRAY} />
    {[110, 160, 210, 260, 310].map((x) => (
      <circle key={x} cx={x} cy={393.5} r="2.6" fill={CHAMBER} />
    ))}
    <Fries cx={220} baseY={388} color={fryColor} />
    {children}
  </svg>
);

// ---------------------------------------------------------- closed air fryer
// Cute front view. reveal (0..1) ghosts the shell so the guts show through.
export const Fryer: React.FC<{
  w?: number;
  reveal?: number;
  style?: React.CSSProperties;
}> = ({ w = 260, reveal = 0, style }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={w} height={(w * 300) / 260} viewBox="0 0 260 300" style={style}>
      {/* ghost guts (visible as the shell fades) */}
      {reveal > 0.02 ? (
        <g opacity={reveal}>
          <Fan cx={130} cy={70} r={30} angle={frame * 3} />
          <Coil x={62} y={112} w={136} glow={reveal * 0.8} />
          <Fries cx={130} baseY={232} color={FRY_PALE} scale={0.62} />
        </g>
      ) : null}
      {/* body */}
      <g opacity={1 - reveal * 0.72}>
        <rect x="18" y="10" width="224" height="264" rx="44" fill={SHELL} />
        {/* window */}
        <rect x="52" y="40" width="156" height="92" rx="26" fill="#1F2429" />
        <rect x="62" y="48" width="52" height="20" rx="10" fill="#454E58" opacity="0.9" />
        {/* dial + drawer */}
        <circle cx="130" cy="168" r="17" fill={SHELL_DARK} stroke="#59616B" strokeWidth="3" />
        <line x1="130" y1="168" x2="130" y2="155" stroke="#B9AFA2" strokeWidth="4" strokeLinecap="round" />
        <rect x="48" y="206" width="164" height="10" rx="5" fill={SHELL_DARK} />
        <rect x="96" y="222" width="68" height="14" rx="7" fill={SHELL_DARK} />
      </g>
      {/* feet */}
      <rect x="52" y="274" width="44" height="14" rx="7" fill={SHELL_DARK} />
      <rect x="164" y="274" width="44" height="14" rx="7" fill={SHELL_DARK} />
    </svg>
  );
};

// ------------------------------------------------------------- headline
// Scene headline — deliberately NOT the caption look (captions are
// sentence-case bold sans in a pill): uppercase, heavier, letterspaced,
// no box. Accent words via nested <span style={{color}}>.
export const Headline: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        fontFamily: FONTS.sans,
        fontWeight: 900,
        fontSize: 54,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        lineHeight: 1.2,
        color: theme.text,
        padding: "0 48px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// -------------------------------------------------------------- chip label
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
        borderRadius: 999,
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

// ------------------------------------------------------------- counter line
// Warm counter-top the appliances sit on.
export const Counter: React.FC<{ y: number }> = ({ y }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        height: 26,
        background: "#E3D5BC",
        borderTop: `4px solid ${theme.lineFaint}`,
        borderRadius: 3,
      }}
    />
  );
};
