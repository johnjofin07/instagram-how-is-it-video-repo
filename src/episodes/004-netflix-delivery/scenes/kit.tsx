import React from "react";
import { useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";

// Episode-local cartoon kit: kraft cartons, parcels, the conveyor, the depot
// warehouse, houses. All deterministic (no randomness). Kraft tones sit ~same
// Lab lightness as the maps episode's car palette — warm cargo on the skin's
// cool concrete canvas.

export const KRAFT = "#C9A876"; // carton face
export const KRAFT_DARK = "#AD8A58"; // carton shading
export const KRAFT_LINE = "#7C6237"; // carton edges
export const LABEL = "#F8F4EA"; // label patch
export const INK = "#25313A"; // outlines — hue-shifted slate, not black
export const CONCRETE = "#D9DFE4"; // walls, belts

// ------------------------------------------------------------------- carton
// A kraft box with red tape down the middle and a label patch. The episode's
// core prop — box size IS the metaphor for video quality.
export const Carton: React.FC<{
  w?: number;
  label?: string;
  tape?: string;
  open?: boolean; // top flaps up
  style?: React.CSSProperties;
}> = ({ w = 120, label, tape, open = false, style }) => {
  const theme = useTheme();
  const t = tape ?? theme.brand;
  return (
    <svg width={w} height={w} viewBox="0 0 120 120" style={style}>
      {open ? (
        <>
          <polygon points="12,40 3,12 36,38" fill={KRAFT_DARK} stroke={KRAFT_LINE} strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="108,40 117,12 84,38" fill={KRAFT_DARK} stroke={KRAFT_LINE} strokeWidth="2.5" strokeLinejoin="round" />
        </>
      ) : null}
      <rect x="10" y="38" width="100" height="72" rx="7" fill={KRAFT} stroke={KRAFT_LINE} strokeWidth="3" />
      {/* closed-lid crease */}
      {!open ? <line x1="10" y1="56" x2="110" y2="56" stroke={KRAFT_LINE} strokeWidth="2.5" opacity="0.55" /> : null}
      {/* tape stripe */}
      <rect x="52" y="38" width="16" height="72" fill={t} opacity="0.92" />
      {/* label patch */}
      {label ? (
        <>
          <rect x="16" y="72" width={label.length > 3 ? 66 : 46} height="26" rx="4" fill={LABEL} stroke={KRAFT_LINE} strokeWidth="2" />
          <text
            x={16 + (label.length > 3 ? 33 : 23)}
            y="90"
            textAnchor="middle"
            fontFamily={FONTS.mono}
            fontWeight="700"
            fontSize="17"
            fill={INK}
          >
            {label}
          </text>
        </>
      ) : null}
    </svg>
  );
};

// ------------------------------------------------------------------- parcel
// A tiny sealed chunk — red tape cross so it reads as "Netflix cargo" at 30px.
export const Parcel: React.FC<{ w?: number; style?: React.CSSProperties }> = ({
  w = 40,
  style,
}) => {
  const theme = useTheme();
  return (
    <svg width={w} height={w} viewBox="0 0 40 40" style={style}>
      <rect x="3" y="6" width="34" height="31" rx="5" fill={KRAFT} stroke={KRAFT_LINE} strokeWidth="2.5" />
      <rect x="16" y="6" width="8" height="31" fill={theme.brand} opacity="0.92" />
      <rect x="3" y="18" width="34" height="7" fill={theme.brand} opacity="0.65" />
    </svg>
  );
};

// ----------------------------------------------------------------- conveyor
// Belt with moving tread marks + spinning rollers underneath.
export const Belt: React.FC<{
  x: number;
  y: number;
  w: number;
  speed?: number; // px per frame, positive = cargo moves right
}> = ({ x, y, w, speed = 3 }) => {
  const frame = useCurrentFrame();
  const shift = ((frame * speed) % 46 + 46) % 46;
  const rollers = Math.max(2, Math.floor(w / 90));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w }}>
      <div
        style={{
          position: "relative",
          height: 26,
          borderRadius: 13,
          background: CONCRETE,
          border: `3px solid ${INK}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 3,
            backgroundImage: `repeating-linear-gradient(90deg, rgba(37,49,58,0.28) 0 5px, transparent 5px 46px)`,
            backgroundPosition: `${shift}px 0`,
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 4 }}>
        {Array.from({ length: rollers }).map((_, i) => (
          <svg key={i} width="26" height="26" viewBox="0 0 26 26">
            <g transform={`rotate(${frame * speed * 3} 13 13)`}>
              <circle cx="13" cy="13" r="11" fill={INK} />
              <circle cx="13" cy="13" r="4.5" fill="#B9C4CC" />
              <line x1="6" y1="13" x2="20" y2="13" stroke="#B9C4CC" strokeWidth="2.5" />
            </g>
          </svg>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------------- depot
// The Open Connect mini-warehouse: concrete shed, red awning stripe, roller
// door open on glowing stocked shelves.
export const Depot: React.FC<{
  w?: number;
  doorGlow?: number; // 0..1
  sign?: string;
  style?: React.CSSProperties;
}> = ({ w = 340, doorGlow = 1, sign, style }) => {
  const theme = useTheme();
  const h = (w * 250) / 340;
  return (
    <svg width={w} height={h} viewBox="0 0 340 250" style={style}>
      {/* walls */}
      <rect x="14" y="66" width="312" height="176" rx="10" fill={CONCRETE} stroke={INK} strokeWidth="4" />
      {/* roof */}
      <path d="M 4 70 L 170 14 L 336 70 L 322 84 L 170 34 L 18 84 Z" fill={INK} />
      {/* awning stripe */}
      <rect x="14" y="96" width="312" height="22" fill={theme.brand} opacity="0.92" />
      {/* door opening */}
      <rect x="96" y="130" width="148" height="112" rx="8" fill="#3A4750" />
      {doorGlow > 0 ? (
        <rect x="96" y="130" width="148" height="112" rx="8" fill={theme.brand} opacity={0.16 * doorGlow} />
      ) : null}
      {/* shelves of parcels inside */}
      {[152, 192].map((sy) =>
        [112, 150, 188].map((sx) => (
          <g key={`${sx}${sy}`} opacity={0.55 + 0.45 * doorGlow}>
            <rect x={sx} y={sy} width="28" height="24" rx="4" fill={KRAFT} stroke={KRAFT_LINE} strokeWidth="2" />
            <rect x={sx + 11} y={sy} width="6" height="24" fill={theme.brand} opacity="0.9" />
          </g>
        ))
      )}
      {[148, 188, 228].map((ly) => (
        <line key={ly} x1="100" y1={ly} x2="240" y2={ly} stroke="#2A343C" strokeWidth="4" />
      ))}
      {/* sign */}
      {sign ? (
        <>
          <rect x="252" y="140" width="64" height="34" rx="6" fill={LABEL} stroke={KRAFT_LINE} strokeWidth="2.5" />
          <text
            x="284"
            y="163"
            textAnchor="middle"
            fontFamily={FONTS.mono}
            fontWeight="700"
            fontSize="18"
            fill={INK}
          >
            {sign}
          </text>
        </>
      ) : null}
    </svg>
  );
};

// -------------------------------------------------------------------- house
// A cute little home; window can glow warm (lights on) or brand-red (watching).
export const House: React.FC<{
  w?: number;
  glow?: "off" | "warm" | "watching";
  style?: React.CSSProperties;
}> = ({ w = 120, glow = "off", style }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const flicker = 0.82 + 0.18 * Math.sin(frame / 7);
  const win =
    glow === "watching" ? theme.brand : glow === "warm" ? "#F5D98A" : "#B9C4CC";
  return (
    <svg width={w} height={(w * 110) / 120} viewBox="0 0 120 110" style={style}>
      <rect x="16" y="46" width="88" height="58" rx="8" fill="#F4F0E6" stroke={INK} strokeWidth="3.5" />
      <path d="M 8 52 L 60 12 L 112 52 Z" fill={INK} />
      <rect x="66" y="70" width="22" height="34" rx="4" fill={KRAFT_DARK} stroke={KRAFT_LINE} strokeWidth="2" />
      <rect x="30" y="62" width="26" height="22" rx="4" fill={win} opacity={glow === "off" ? 0.5 : flicker} stroke={INK} strokeWidth="2.5" />
      {glow === "watching" ? (
        <rect x="24" y="56" width="38" height="34" rx="8" fill={theme.brand} opacity={0.22 * flicker} />
      ) : null}
    </svg>
  );
};

// ------------------------------------------------------------- route dashes
// Animated dashed shipping route along an SVG path.
export const Route: React.FC<{
  d: string;
  w: number;
  h: number;
  color?: string;
  speed?: number;
  progress?: number; // 0..1 draw-on
  style?: React.CSSProperties;
}> = ({ d, w, h, color, speed = 1.4, progress = 1, style }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={style}>
      <path
        d={d}
        fill="none"
        stroke={color ?? theme.second}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="10 24"
        strokeDashoffset={-frame * speed}
        opacity={progress * 0.85}
      />
    </svg>
  );
};

// --------------------------------------------------------------- wifi meter
export const Wifi: React.FC<{
  bars: 0 | 1 | 2 | 3; // lit arcs
  w?: number;
  style?: React.CSSProperties;
}> = ({ bars, w = 72, style }) => {
  const theme = useTheme();
  const col = bars >= 3 ? theme.good : bars === 2 ? theme.warn : theme.brand;
  return (
    <svg width={w} height={(w * 60) / 72} viewBox="0 0 72 60" style={style}>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${20 - i * 8} ${34 - i * 8} Q 36 ${12 - i * 10} ${52 + i * 8} ${34 - i * 8}`}
          fill="none"
          stroke={i < bars ? col : "rgba(37,49,58,0.18)"}
          strokeWidth="7"
          strokeLinecap="round"
        />
      ))}
      <circle cx="36" cy="46" r="6.5" fill={bars > 0 ? col : "rgba(37,49,58,0.18)"} />
    </svg>
  );
};

// ------------------------------------------------------------ stamp headline
// Big-beat text, same idiom as ep 002's stamp (channel constant: mono
// uppercase, tilted, accent border) dressed for the depot skin — it reads as
// a shipping stamp on a label.
export const Stamp: React.FC<{
  children: React.ReactNode;
  color?: string;
  fontSize?: number;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ children, color, fontSize = 44, rotate = -2.5, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "inline-block",
        padding: "16px 34px",
        border: `4px solid ${color ?? theme.accent}`,
        borderRadius: 14,
        background: "rgba(248, 244, 234, 0.88)",
        fontFamily: FONTS.mono,
        fontWeight: 700,
        fontSize,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: theme.text,
        whiteSpace: "nowrap",
        transform: `rotate(${rotate}deg)`,
        boxShadow: theme.cardShadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// --------------------------------------------------------------- chip label
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
