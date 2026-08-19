import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";

export const METAL = "#667581";
export const METAL_DARK = "#303B44";
export const INSULATION = "#E5D5B8";
export const BOARD = "#163E46";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

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
        background: "rgba(13, 18, 23, 0.9)",
        boxShadow: `0 0 36px ${color ? "rgba(84,214,232,0.18)" : theme.accentGlow}`,
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

export const LabGrid: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const theme = useTheme();
  return (
    <svg
      width="950"
      height="760"
      viewBox="0 0 950 760"
      style={{ position: "absolute", left: 65, top: 540, opacity }}
    >
      <path d="M70 650 L300 390 L650 390 L880 650" fill="rgba(23,32,41,0.62)" stroke={theme.line} strokeWidth="3" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={`h${i}`} x1={70 + i * 34} y1={650 - i * 48} x2={880 - i * 34} y2={650 - i * 48} stroke={theme.lineFaint} strokeWidth="2" />
      ))}
      {[-2, -1, 0, 1, 2].map((i) => (
        <line key={`v${i}`} x1={475 + i * 70} y1="390" x2={475 + i * 178} y2="650" stroke={theme.lineFaint} strokeWidth="2" />
      ))}
      <rect x="190" y="82" width="220" height="20" rx="10" fill={theme.textFaint} opacity="0.32" />
      <rect x="540" y="82" width="220" height="20" rx="10" fill={theme.textFaint} opacity="0.32" />
    </svg>
  );
};

export const MemoryUnit: React.FC<{
  w?: number;
  glow?: number;
  layers?: number;
  style?: React.CSSProperties;
}> = ({ w = 180, glow = 1, layers = 0, style }) => {
  const theme = useTheme();
  const h = w * 0.72;
  return (
    <svg width={w} height={h} viewBox="0 0 180 130" style={{ filter: `drop-shadow(0 0 ${22 * glow}px ${theme.second})`, ...style }}>
      {layers > 0 ? <rect x="8" y="8" width="164" height="114" rx="24" fill={METAL_DARK} stroke={METAL} strokeWidth="5" opacity={interpolate(layers, [0, 0.34], [0, 1], clamp)} /> : null}
      {layers > 0.34 ? <rect x="25" y="24" width="130" height="82" rx="17" fill={INSULATION} stroke="#9F8F73" strokeWidth="4" opacity={interpolate(layers, [0.34, 0.67], [0, 1], clamp)} /> : null}
      <rect x="42" y="38" width="96" height="56" rx="11" fill={BOARD} stroke={theme.second} strokeWidth="4" opacity={interpolate(layers, [0.64, 0.86], [0.25, 1], clamp)} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={53 + i * 27} y="50" width="18" height="30" rx="3" fill={theme.second} opacity={0.58 + 0.14 * i} />
      ))}
      <path d="M48 86 H132" stroke={theme.second} strokeWidth="3" strokeDasharray="6 6" opacity="0.72" />
    </svg>
  );
};

export const Recorder: React.FC<{
  w?: number;
  damage?: number;
  cutaway?: number;
  beaconOn?: boolean;
  style?: React.CSSProperties;
}> = ({ w = 400, damage = 0, cutaway = 0, beaconOn = false, style }) => {
  const theme = useTheme();
  const h = w * 0.66;
  const dent = damage * 12;
  return (
    <svg width={w} height={h} viewBox="0 0 400 264" style={style}>
      <defs>
        <linearGradient id="recorder-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF9A3D" />
          <stop offset="0.56" stopColor={theme.accent} />
          <stop offset="1" stopColor="#B94308" />
        </linearGradient>
      </defs>
      <g opacity={0.18 + cutaway * 0.82}>
        <rect x="80" y="50" width="230" height="154" rx="20" fill="#111820" stroke={METAL} strokeWidth="5" />
        <path d="M104 77 H286 M104 175 H286" stroke={theme.line} strokeWidth="3" />
        <rect x="102" y="96" width="74" height="58" rx="8" fill="#283842" stroke={theme.line} strokeWidth="3" />
        <circle cx="124" cy="124" r="9" fill={theme.good} opacity="0.7" />
        <g transform="translate(188 78)">
          <MemoryUnit w={118} glow={1} layers={1} />
        </g>
      </g>
      <g opacity={1 - cutaway * 0.78}>
        <path
          d={`M${48 + dent} 44 Q48 28 68 28 H325 Q348 28 ${350 - dent} 50 L356 210 Q356 234 330 238 H70 Q44 238 44 212 Z`}
          fill="url(#recorder-face)"
          stroke="#702B09"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <path d="M61 72 H339 M58 194 H343" stroke="#FFF3DE" strokeWidth="15" opacity="0.88" />
        <path d="M61 72 H339 M58 194 H343" stroke="#59656E" strokeWidth="3" strokeDasharray="18 10" opacity="0.8" />
        <rect x="92" y="91" width="195" height="84" rx="12" fill="rgba(111,38,5,0.56)" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
        <text x="189" y="122" textAnchor="middle" fontFamily={FONTS.mono} fontSize="20" fontWeight="800" fill="#FFF7EC" letterSpacing="2">
          FLIGHT RECORDER
        </text>
        <text x="189" y="150" textAnchor="middle" fontFamily={FONTS.mono} fontSize="14" fill="#FFE2C0" letterSpacing="1.4">
          DO NOT OPEN
        </text>
        <g transform="translate(318 73)">
          <rect width="54" height="112" rx="25" fill="#F07A1C" stroke="#6E2B0A" strokeWidth="5" />
          <rect x="12" y="13" width="30" height="74" rx="14" fill={beaconOn ? theme.second : "#E9A35B"} opacity={beaconOn ? 0.95 : 0.66} />
          <circle cx="27" cy="95" r="8" fill="#632406" />
        </g>
        {damage > 0 ? (
          <g opacity={damage} stroke="#4A1C09" strokeWidth="5" strokeLinecap="round">
            <path d="M86 51 L115 92 L96 125" />
            <path d="M272 164 L247 190 L266 225" />
            <path d="M164 31 L180 54 L197 35" />
          </g>
        ) : null}
      </g>
    </svg>
  );
};

export const TestReadout: React.FC<{
  value: string;
  label: string;
  color?: string;
  status?: string;
}> = ({ value, label, color, status }) => {
  const theme = useTheme();
  return (
    <div style={{ width: 360, padding: "20px 24px", borderRadius: 6, background: theme.card, border: `2px solid ${color ?? theme.cardBorder}`, boxShadow: theme.cardShadow }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 20, letterSpacing: "0.2em", color: theme.textDim }}>{label}</div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 62, lineHeight: 1.08, fontWeight: 800, color: color ?? theme.text, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {status ? <div style={{ fontFamily: FONTS.mono, fontSize: 18, letterSpacing: "0.16em", color: theme.second }}>{status}</div> : null}
    </div>
  );
};

export const Press: React.FC<{ gap: number }> = ({ gap }) => {
  const theme = useTheme();
  const upperY = 5 + (1 - gap) * 82;
  const lowerY = 310 - (1 - gap) * 82;
  return (
    <svg width="620" height="380" viewBox="0 0 620 380">
      <rect x="120" y={upperY - 90} width="380" height="90" rx="10" fill={METAL_DARK} stroke={METAL} strokeWidth="6" />
      <rect x="92" y={upperY} width="436" height="32" rx="8" fill={METAL} stroke={theme.line} strokeWidth="4" />
      <rect x="92" y={lowerY - 32} width="436" height="32" rx="8" fill={METAL} stroke={theme.line} strokeWidth="4" />
      <rect x="120" y={lowerY} width="380" height="90" rx="10" fill={METAL_DARK} stroke={METAL} strokeWidth="6" />
    </svg>
  );
};

const FLAMES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const FlameEnvelope: React.FC<{ intensity: number }> = ({ intensity }) => (
  <svg width="650" height="470" viewBox="0 0 650 470">
    {FLAMES.map((i) => {
      const x = 52 + i * 50;
      const h = 110 + ((i * 47) % 150) * intensity;
      const sway = Math.sin(i * 1.8 + intensity * 4) * 12;
      return (
        <path
          key={i}
          d={`M${x} 430 C${x - 36} ${430 - h * 0.38}, ${x + 38 + sway} ${430 - h * 0.68}, ${x + sway} ${430 - h} C${x + 54} ${430 - h * 0.56}, ${x + 34} ${430 - h * 0.2}, ${x + 18} 430 Z`}
          fill={i % 3 === 0 ? "#FFF0A6" : i % 2 === 0 ? "#FFB21A" : "#F35A13"}
          opacity={0.42 + intensity * 0.5}
        />
      );
    })}
  </svg>
);

export const AircraftSide: React.FC<{
  w?: number;
  tailGlow?: number;
  flightProgress?: number;
  style?: React.CSSProperties;
}> = ({ w = 800, tailGlow = 0, flightProgress = 0, style }) => {
  const theme = useTheme();
  const h = w * 0.34;
  return (
    <svg width={w} height={h} viewBox="0 0 800 270" style={style}>
      <path d="M48 145 Q85 112 176 105 L550 89 L653 29 L705 31 L664 94 L746 106 Q781 112 784 127 Q778 145 730 150 L457 162 L315 240 L257 240 L354 165 L152 166 Q74 165 48 145 Z" fill="#D7E0E5" stroke={theme.line} strokeWidth="5" />
      <path d="M475 157 L574 215 L631 214 L556 151" fill="#AAB8C1" stroke={theme.line} strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <rect key={i} x={190 + i * 43} y="119" width="24" height="10" rx="5" fill="#42515C" />)}
      <circle cx="648" cy="112" r={24 + tailGlow * 18} fill={theme.accent} opacity={0.1 + tailGlow * 0.3} />
      <rect x="633" y="98" width="30" height="27" rx="6" fill={theme.accent} opacity={0.35 + tailGlow * 0.65} />
      {flightProgress > 0 ? <path d="M35 204 Q390 84 770 70" fill="none" stroke={theme.good} strokeWidth="8" strokeDasharray="900" strokeDashoffset={900 * (1 - flightProgress)} strokeLinecap="round" opacity="0.8" /> : null}
    </svg>
  );
};

const WAVE_PATH = "M0 60 L24 60 L36 35 L49 87 L62 18 L76 99 L91 54 L111 60 L135 60 L148 40 L160 79 L175 27 L190 93 L207 60 L236 60 L248 48 L260 72 L275 22 L291 101 L306 60 L340 60 L354 43 L369 79 L385 35 L401 87 L418 60 L450 60 L466 20 L482 104 L499 45 L516 75 L535 60 L565 60 L579 39 L595 82 L610 25 L626 96 L642 60 L680 60";

export const AudioWave: React.FC<{ progress: number; color?: string }> = ({ progress, color }) => {
  const theme = useTheme();
  return (
    <svg width="680" height="120" viewBox="0 0 680 120">
      <path d="M0 60 H680" stroke={theme.lineFaint} strokeWidth="2" />
      <path d={WAVE_PATH} fill="none" stroke={color ?? theme.second} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1000" strokeDashoffset={1000 * (1 - progress)} />
    </svg>
  );
};

const DATA_ROWS = ["SPEED", "ALTITUDE", "CONTROLS", "SYSTEMS"];
export const DataBus: React.FC<{ progress: number; rows?: string[] }> = ({ progress, rows = DATA_ROWS }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  return (
    <svg width="700" height={rows.length * 64} viewBox={`0 0 700 ${rows.length * 64}`}>
      {rows.map((row, i) => {
        const y = 32 + i * 64;
        const packetX = 160 + ((frame * (2.4 + i * 0.3) + i * 90) % 500);
        return (
          <g key={row} opacity={interpolate(progress, [i * 0.12, i * 0.12 + 0.3], [0, 1], clamp)}>
            <text x="0" y={y + 8} fontFamily={FONTS.mono} fontSize="20" fill={theme.textDim} letterSpacing="2">{row}</text>
            <line x1="160" y1={y} x2="680" y2={y} stroke={theme.line} strokeWidth="3" />
            <circle cx={packetX} cy={y} r="8" fill={theme.second} />
            {[0, 1, 2, 3, 4].map((j) => <rect key={j} x={180 + j * 92} y={y - 13} width={42} height="26" rx="5" fill={theme.second} opacity={0.16 + ((i + j) % 3) * 0.16} />)}
          </g>
        );
      })}
    </svg>
  );
};

export const Beacon: React.FC<{ pulse: number }> = ({ pulse }) => {
  const theme = useTheme();
  return (
    <svg width="700" height="470" viewBox="0 0 700 470">
      {[0, 1, 2].map((i) => {
        const p = (pulse + i / 3) % 1;
        return <circle key={i} cx="350" cy="310" r={55 + p * 230} fill="none" stroke={theme.second} strokeWidth="7" opacity={(1 - p) * 0.72} />;
      })}
      <path d="M350 310 Q420 135 600 76" fill="none" stroke={theme.second} strokeWidth="4" strokeDasharray="10 14" opacity="0.7" />
    </svg>
  );
};

export const Timeline: React.FC<{ progress: number; synced: number }> = ({ progress, synced }) => {
  const theme = useTheme();
  const playhead = 110 + progress * 700;
  const lowerShift = interpolate(synced, [0, 1], [64, 0]);
  const events = [0.15, 0.34, 0.51, 0.73, 0.9];
  return (
    <svg width="900" height="330" viewBox="0 0 900 330">
      <text x="16" y="78" fontFamily={FONTS.mono} fontSize="22" fill={theme.textDim}>AUDIO</text>
      <g transform="translate(110 20) scale(1 0.72)"><AudioWave progress={1} /></g>
      <text x="16" y="242" fontFamily={FONTS.mono} fontSize="22" fill={theme.textDim}>FLIGHT</text>
      <line x1={110 + lowerShift} y1="220" x2={810 + lowerShift} y2="220" stroke={theme.line} strokeWidth="5" />
      {events.map((e, i) => <rect key={e} x={110 + lowerShift + e * 700 - 9} y={190 - (i % 2) * 34} width="18" height={60 + (i % 2) * 34} rx="8" fill={i === 3 ? theme.warn : theme.second} opacity="0.75" />)}
      <line x1={playhead} y1="20" x2={playhead} y2="295" stroke={theme.second} strokeWidth="5" />
      <circle cx={playhead} cy="20" r="9" fill={theme.second} />
    </svg>
  );
};
