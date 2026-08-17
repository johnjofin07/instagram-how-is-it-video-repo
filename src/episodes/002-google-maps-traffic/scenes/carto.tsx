import React from "react";
import { useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";

// Episode-local cartoon kit: cute side-view cars, top-down cars, roads,
// signal rings, the handcart. All deterministic (no randomness).

// Playful subject palette for car bodies — picked at similar Lab lightness so
// no car visually dominates.
export const CAR_COLORS = ["#4E8FD9", "#4FAE8E", "#E2846B", "#C99441", "#9C88CE"];

export const INK = "#2A343C"; // wheels/outlines — hue-shifted, not black
export const GLASS = "#E9F4FB";

export type Face = "happy" | "grumpy" | "worried";

// ---------------------------------------------------------------- side view
export const Car: React.FC<{
  color: string;
  w?: number;
  face?: Face;
  flip?: boolean; // faces left instead of right
  style?: React.CSSProperties;
}> = ({ color, w = 160, face, flip = false, style }) => {
  const frame = useCurrentFrame();
  const wheelSpin = frame * 14;
  const eyeY = face === "worried" ? 30 : 31;
  return (
    <svg
      width={w}
      height={(w * 100) / 160}
      viewBox="0 0 160 100"
      style={{ transform: flip ? "scaleX(-1)" : undefined, ...style }}
    >
      {/* cabin */}
      <rect x="36" y="12" width="76" height="40" rx="16" fill={color} />
      {/* body */}
      <rect x="6" y="40" width="148" height="36" rx="15" fill={color} />
      {/* window */}
      <rect x="46" y="19" width="56" height="26" rx="9" fill={GLASS} />
      <line x1="76" y1="19" x2="76" y2="45" stroke={color} strokeWidth="5" />
      {/* face in the windshield */}
      {face ? (
        <g>
          <circle cx="60" cy={eyeY} r="4.4" fill={INK} />
          <circle cx="70" cy={eyeY} r="4.4" fill={INK} />
          {face === "happy" ? (
            <path d="M57 38 Q65 44 73 38" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : face === "grumpy" ? (
            <>
              <line x1="54" y1="22" x2="63" y2="26" stroke={INK} strokeWidth="3" strokeLinecap="round" />
              <line x1="76" y1="26" x2="85" y2="22" stroke={INK} strokeWidth="3" strokeLinecap="round" />
              <path d="M58 41 Q65 37 72 41" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <ellipse cx="65" cy="41" rx="4.5" ry="5.5" fill={INK} />
          )}
        </g>
      ) : null}
      {/* headlight + taillight */}
      <circle cx="150" cy="50" r="5" fill="#FFE9A8" />
      <rect x="4" y="46" width="6" height="9" rx="3" fill="#E2846B" />
      {/* wheels */}
      {[40, 120].map((cx) => (
        <g key={cx} transform={`rotate(${wheelSpin} ${cx} 78)`}>
          <circle cx={cx} cy="78" r="16" fill={INK} />
          <circle cx={cx} cy="78" r="7" fill="#B9C4CC" />
          <line x1={cx - 6} y1="78" x2={cx + 6} y2="78" stroke={INK} strokeWidth="2.5" />
        </g>
      ))}
    </svg>
  );
};

// ---------------------------------------------------------------- top view
export const TopCar: React.FC<{
  color: string;
  w?: number;
  angle?: number; // 0 = pointing right
  style?: React.CSSProperties;
}> = ({ color, w = 58, angle = 0, style }) => (
  <svg
    width={w}
    height={(w * 32) / 58}
    viewBox="0 0 58 32"
    style={{ transform: `rotate(${angle}deg)`, ...style }}
  >
    {/* wheel nubs */}
    {[
      [11, 1],
      [43, 1],
      [11, 27],
      [43, 27],
    ].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="10" height="4" rx="2" fill={INK} />
    ))}
    <rect x="2" y="3" width="54" height="26" rx="11" fill={color} />
    <rect x="32" y="7" width="10" height="18" rx="4" fill={GLASS} />
    <rect x="12" y="7" width="12" height="18" rx="4" fill={GLASS} opacity="0.7" />
  </svg>
);

// -------------------------------------------------------- side-view street
export const SideRoad: React.FC<{ y: number; height?: number }> = ({ y, height = 96 }) => {
  const theme = useTheme();
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, height }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#DFE5E8",
          borderTop: `4px solid ${theme.lineFaint}`,
          borderBottom: `4px solid ${theme.lineFaint}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 5,
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.95) 0 46px, transparent 46px 92px)",
        }}
      />
    </div>
  );
};

// --------------------------------------------------------- signal ping rings
export const SignalRings: React.FC<{
  x: number;
  y: number;
  color?: string;
  period?: number;
  size?: number;
  phase?: number;
}> = ({ x, y, color, period = 46, size = 54, phase = 0 }) => {
  const theme = useTheme();
  const frame = useCurrentFrame() + phase;
  const c = color ?? theme.accent;
  return (
    <svg
      width={size * 2}
      height={size * 2}
      style={{ position: "absolute", left: x - size, top: y - size, pointerEvents: "none" }}
    >
      {[0, 0.5].map((off, i) => {
        const t = ((frame / period + off) % 1 + 1) % 1;
        return (
          <circle
            key={i}
            cx={size}
            cy={size}
            r={6 + t * (size - 8)}
            fill="none"
            stroke={c}
            strokeWidth={3.5 - t * 2}
            opacity={(1 - t) * 0.8}
          />
        );
      })}
    </svg>
  );
};

// ------------------------------------------------------------ phone (small)
export const Phone: React.FC<{ w?: number; glow?: boolean; style?: React.CSSProperties }> = ({
  w = 34,
  glow = true,
  style,
}) => {
  const theme = useTheme();
  const h = (w * 62) / 34;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: w * 0.22,
        background: INK,
        padding: w * 0.09,
        boxShadow: glow ? `0 0 ${w * 0.5}px ${theme.accentGlow}` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: w * 0.14,
          background: `linear-gradient(160deg, #DDEBF7 0%, #C9E3F4 55%, #CFE9D8 100%)`,
        }}
      />
    </div>
  );
};

// ------------------------------------------------- the little red handcart
// A walker pulling a wagon stacked with glowing phones. Bobs as it walks;
// legs swing. Scale/position via the wrapping style.
export const HandcartWalker: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const frame = useCurrentFrame();
  const step = Math.sin(frame / 5);
  const bob = Math.abs(step) * 5;
  return (
    <div style={{ position: "relative", width: 360, height: 220, ...style }}>
      {/* walker */}
      <svg
        width="120"
        height="200"
        viewBox="0 0 120 200"
        style={{ position: "absolute", left: 0, bottom: 0, transform: `translateY(${-bob}px)` }}
      >
        <circle cx="58" cy="42" r="24" fill="#F2C9A8" />
        <path d="M34 40 Q58 8 84 38 L80 26 Q58 6 38 26 Z" fill={INK} />
        {/* torso */}
        <rect x="42" y="64" width="34" height="62" rx="15" fill="#4E8FD9" />
        {/* pulling arm back to the cart */}
        <line x1="70" y1="84" x2="112" y2="112" stroke="#F2C9A8" strokeWidth="12" strokeLinecap="round" />
        {/* legs */}
        <line x1="52" y1="124" x2={52 - step * 16} y2="176" stroke={INK} strokeWidth="13" strokeLinecap="round" />
        <line x1="66" y1="124" x2={66 + step * 16} y2="176" stroke={INK} strokeWidth="13" strokeLinecap="round" />
      </svg>
      {/* wagon */}
      <svg
        width="240"
        height="150"
        viewBox="0 0 240 150"
        style={{ position: "absolute", left: 106, bottom: -4, transform: `translateY(${-bob * 0.4}px)` }}
      >
        {/* handle */}
        <line x1="8" y1="42" x2="52" y2="86" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        {/* tub */}
        <rect x="44" y="78" width="176" height="44" rx="10" fill="#D93025" />
        <rect x="44" y="78" width="176" height="10" rx="5" fill="#B3261E" />
        {/* wheels */}
        <g transform={`rotate(${frame * 9} 78 132)`}>
          <circle cx="78" cy="132" r="15" fill={INK} />
          <circle cx="78" cy="132" r="6" fill="#B9C4CC" />
        </g>
        <g transform={`rotate(${frame * 9} 186 132)`}>
          <circle cx="186" cy="132" r="15" fill={INK} />
          <circle cx="186" cy="132" r="6" fill="#B9C4CC" />
        </g>
      </svg>
      {/* phone stack riding in the tub */}
      <div
        style={{
          position: "absolute",
          left: 158,
          bottom: 66,
          display: "flex",
          gap: 5,
          transform: `translateY(${-bob * 0.4}px)`,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <Phone key={i} w={26} style={{ transform: `rotate(${(i - 1.5) * 5}deg)` }} />
        ))}
      </div>
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
        fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
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
