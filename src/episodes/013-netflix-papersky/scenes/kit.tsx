import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";

// Episode 013 kit — the delivery story rebuilt as a BRIGHT cut-paper diorama
// on the `papersky` skin. Inherits 012's rendering law:
//
//   NO STROKES as outlines. Every shape is a flat paper fill; separation comes
//   from layered pieces and soft hue-shifted (deep blue, never grey) drop
//   shadows. Nearer layers cast longer shadows. A stroke only survives where a
//   thick strip IS the shape — a route dash, a wifi arc: a strip is paper too.
//
// Where 004's `delivery` skin was concrete + muted kraft on a grey floor, this
// is saturated construction paper on a sky-blue board: grass green ground,
// Netflix red tape, warm amber cartons, orange paper arrows for motion.

// ── Semantic color law ────────────────────────────────────────────────────
export const RED = "#E50914"; // NETFLIX — tape, awning, the mark itself
export const RED_DEEP = "#A8060F"; // red's shadow-side pieces
export const KRAFT = "#F5C377"; // carton front face
export const KRAFT_LIP = "#FFDFAE"; // carton lid — the lit top plane
export const KRAFT_DEEP = "#D9A04C"; // carton side plane, in shade
export const CREAM = "#FFF7EA"; // labels, house walls, signage
export const GRASS = "#86CE6E"; // the near ground band
export const GRASS_DEEP = "#5FAE58"; // the far ground band
export const ROAD = "#E6EFF5"; // the road strip the depot sits on
export const INK = "#16293A"; // punched windows, silhouettes, text
export const SLATE = "#8FAABE"; // structural paper strips (belt, poles)
export const SLATE_PALE = "#D8E6EF"; // pale structural fills
export const TEAL = "#136C8E"; // the ORDER — what your TV asks for
export const RUSH = "#F2691B"; // MOTION — paper arrows, travelling parcels
export const SUN = "#FFC94A"; // a lit window, lights-on
export const NIGHT = "#152A40"; // the night sheet laid over the board

const LOGO = staticFile("episodes/013-netflix-papersky/netflix-n.png");
// cropped to the mark's alpha bounds — 909×1667
export const LOGO_RATIO = 909 / 1667;

export const rnd = (i: number, n: number, seed: number) => {
  const s = Math.sin((i + 1) * 127.1 + seed * 311.7 + n * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

// The one shadow. depth 0 = glued flat to the board, 3 = riding high off it.
export const paperShadow = (depth = 1) =>
  `drop-shadow(0 ${3 + depth * 4}px ${4 + depth * 5}px rgba(24, 56, 84, ${0.34 - depth * 0.04}))`;

// ── NetflixMark — the real logo, treated as a red paper cutout ────────────
export const NetflixMark: React.FC<{
  h?: number;
  depth?: number;
  style?: React.CSSProperties;
}> = ({ h = 128, depth = 2, style }) => (
  <Img
    src={LOGO}
    style={{
      height: h,
      width: h * LOGO_RATIO,
      display: "block",
      filter: paperShadow(depth),
      ...style,
    }}
  />
);

// ── TownStage — the board: sky papers up top, ground papers at the bottom ──
// `horizon` is where the far grass band starts; the road strip is the flat
// surface every building in this episode stands on.
export const TownStage: React.FC<{
  horizon?: number;
  road?: number; // y of the road strip's top edge
  clouds?: boolean;
}> = ({ horizon = 1020, road = 1140, clouds = true }) => {
  const frame = useCurrentFrame();

  // a torn paper edge: gentle scallops, drifting on its own phase
  const torn = (y: number, amp: number, phase: number, drift: number) => {
    const dx = Math.sin(frame / 110 + phase) * drift;
    let d = `M ${-80 + dx} ${y}`;
    for (let i = 0; i < 7; i++) {
      d += ` c 40 ${-amp} 80 ${-amp} 120 0 c 30 ${amp * 0.7} 60 ${amp * 0.7} 80 0`;
    }
    return d + ` L 1160 2000 L -80 2000 Z`;
  };

  return (
    <>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* two sky papers behind the horizon */}
        <g style={{ filter: paperShadow(0) }}>
          <path d={torn(horizon - 150, 14, 0, 9)} fill="#A5CFE8" />
        </g>
        <g style={{ filter: paperShadow(1) }}>
          <path d={torn(horizon - 40, 17, 2.1, 14)} fill="#8FC3E0" />
        </g>
        {/* the ground: far grass, near grass, then the road */}
        <g style={{ filter: paperShadow(1) }}>
          <path d={torn(horizon, 18, 1.2, 7)} fill={GRASS_DEEP} />
        </g>
        <g style={{ filter: paperShadow(2) }}>
          <path d={torn(horizon + 70, 13, 3.4, 5)} fill={GRASS} />
        </g>
        <g style={{ filter: paperShadow(2) }}>
          <rect x={-40} y={road} width={1160} height={1920 - road} fill={ROAD} />
        </g>
        {/* dashed centre line — a strip of paper laid on the road */}
        {Array.from({ length: 9 }, (_, i) => (
          <rect
            key={i}
            x={-20 + i * 130}
            y={road + 74}
            width={72}
            height={11}
            rx={5.5}
            fill="#C7D8E4"
          />
        ))}
      </svg>
      {clouds ? (
        <>
          <div style={{ position: "absolute", left: 74, top: 452 }}>
            <PaperCloud w={196} drift={6} />
          </div>
          <div style={{ position: "absolute", left: 786, top: 404 }}>
            <PaperCloud w={158} drift={4} />
          </div>
          <div style={{ position: "absolute", left: 616, top: horizon - 236 }}>
            <PaperCloud w={172} drift={7} />
          </div>
          <div style={{ position: "absolute", left: 96, top: horizon - 178 }}>
            <PaperCloud w={132} drift={5} />
          </div>
        </>
      ) : null}
    </>
  );
};

// ── PaperCloud — two stacked white cutouts on a raised pad ────────────────
export const PaperCloud: React.FC<{ w?: number; drift?: number }> = ({
  w = 220,
  drift = 5,
}) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / 70 + w) * drift;
  return (
    <svg
      width={w}
      height={w * 0.52}
      viewBox="0 0 220 114"
      style={{ position: "absolute", overflow: "visible", transform: `translateX(${dx}px)` }}
    >
      <g style={{ filter: paperShadow(1) }}>
        <path
          d="M18 84 Q0 84 2 66 Q4 48 26 48 Q30 26 56 26 Q66 8 92 12 Q118 -2 138 16 Q168 10 176 34 Q204 34 206 58 Q208 80 184 84 Z"
          fill="#F3F9FC"
        />
      </g>
      <g style={{ filter: paperShadow(2) }}>
        <path
          d="M52 96 Q34 96 36 80 Q38 66 56 66 Q62 48 84 50 Q96 36 116 42 Q140 38 146 58 Q168 60 168 78 Q168 94 148 96 Z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
};

// ── Carton — the episode's core prop. Box SIZE is the quality metaphor. ────
// Four paper planes: lid (lit), side (shade), front (face), plus the red tape
// strip that makes it Netflix cargo, and an optional cream label patch.
export const CARTON_RATIO = 112 / 132; // h / w
export const Carton: React.FC<{
  w?: number;
  label?: string;
  open?: boolean;
  depth?: number;
  style?: React.CSSProperties;
}> = ({ w = 132, label, open = false, depth = 1, style }) => (
  <svg
    width={w}
    height={w * CARTON_RATIO}
    viewBox="0 0 132 112"
    style={{ overflow: "visible", ...style }}
  >
    {open ? (
      <g style={{ filter: paperShadow(depth) }}>
        <polygon points="8,34 0,4 34,26" fill={KRAFT_DEEP} />
        <polygon points="104,26 132,2 124,32" fill={KRAFT_LIP} />
      </g>
    ) : null}
    {/* lid — the top plane, catching light */}
    <g style={{ filter: paperShadow(depth) }}>
      <polygon points="8,34 30,18 126,18 104,34" fill={KRAFT_LIP} />
    </g>
    {/* right side plane, in shade */}
    <g style={{ filter: paperShadow(depth) }}>
      <polygon points="104,34 126,18 126,94 104,110" fill={KRAFT_DEEP} />
    </g>
    {/* front face */}
    <g style={{ filter: paperShadow(depth) }}>
      <rect x="8" y="34" width="96" height="76" rx="4" fill={KRAFT} />
    </g>
    {/* red tape: across the lid, then down the face */}
    <polygon points="48,34 70,18 84,18 62,34" fill={RED_DEEP} />
    <rect x="48" y="34" width="14" height="76" fill={RED} />
    {label ? (
      <>
        <g style={{ filter: paperShadow(0) }}>
          <rect
            x="14"
            y="66"
            width={label.length > 3 ? 76 : 52}
            height="30"
            rx="5"
            fill={CREAM}
          />
        </g>
        <text
          x={14 + (label.length > 3 ? 38 : 26)}
          y="88"
          textAnchor="middle"
          fontFamily={FONTS.sans}
          fontWeight="900"
          fontSize="19"
          letterSpacing="0.5"
          fill={INK}
        >
          {label}
        </text>
      </>
    ) : null}
  </svg>
);

// ── Parcel — one four-second chunk, sealed with a red cross of tape ────────
export const Parcel: React.FC<{ w?: number; style?: React.CSSProperties }> = ({
  w = 44,
  style,
}) => (
  <svg width={w} height={w * 0.92} viewBox="0 0 44 40" style={{ overflow: "visible", ...style }}>
    <g style={{ filter: paperShadow(1) }}>
      <polygon points="4,12 12,5 42,5 34,12" fill={KRAFT_LIP} />
      <polygon points="34,12 42,5 42,32 34,39" fill={KRAFT_DEEP} />
      <rect x="4" y="12" width="30" height="27" rx="3" fill={KRAFT} />
    </g>
    <rect x="16" y="12" width="7" height="27" fill={RED} />
    <rect x="4" y="22" width="30" height="6" fill={RED} opacity="0.75" />
  </svg>
);

// ── Belt — a paper conveyor: pale strip, tread marks, rolling wheels ───────
export const Belt: React.FC<{
  x: number;
  y: number;
  w: number;
  speed?: number; // px/frame, positive = cargo moves right
}> = ({ x, y, w, speed = 3 }) => {
  const frame = useCurrentFrame();
  const shift = (((frame * speed) % 48) + 48) % 48;
  const rollers = Math.max(2, Math.floor(w / 96));
  const treads = Math.ceil(w / 48) + 2;
  return (
    <svg
      width={w}
      height={80}
      viewBox={`0 0 ${w} 80`}
      style={{ position: "absolute", left: x, top: y, overflow: "visible" }}
    >
      <defs>
        <clipPath id={`belt-${x}-${y}`}>
          <rect x="0" y="0" width={w} height="38" rx="19" />
        </clipPath>
      </defs>
      <g style={{ filter: paperShadow(2) }}>
        <rect x="0" y="0" width={w} height="38" rx="19" fill={SLATE} />
      </g>
      <g clipPath={`url(#belt-${x}-${y})`}>
        {Array.from({ length: treads }, (_, i) => (
          <rect
            key={i}
            x={-48 + i * 48 + shift}
            y="8"
            width="8"
            height="22"
            rx="4"
            fill={SLATE_PALE}
            opacity="0.85"
          />
        ))}
      </g>
      {Array.from({ length: rollers }, (_, i) => {
        const cx = (w / rollers) * (i + 0.5);
        return (
          <g key={i} style={{ filter: paperShadow(0) }}>
            <circle cx={cx} cy="54" r="17" fill={SLATE_PALE} />
            <g transform={`rotate(${frame * speed * 3} ${cx} 54)`}>
              <rect x={cx - 13} y="50.5" width="26" height="7" rx="3.5" fill={SLATE} />
            </g>
          </g>
        );
      })}
    </svg>
  );
};

// ── Warehouse — the Open Connect mini-depot, in paper ─────────────────────
export const WAREHOUSE_RATIO = 250 / 340;
export const Warehouse: React.FC<{
  w?: number;
  doorGlow?: number; // 0..1 — how stocked/awake it looks
  stock?: number; // 0..1 — how many of the six shelf crates have arrived
  sign?: string;
  mark?: boolean; // wear the Netflix mark on the wall
  style?: React.CSSProperties;
}> = ({ w = 340, doorGlow = 1, stock = 1, sign, mark = false, style }) => (
  <div style={{ position: "absolute", width: w, ...style }}>
    <svg
      width={w}
      height={w * WAREHOUSE_RATIO}
      viewBox="0 0 340 250"
      style={{ display: "block", overflow: "visible" }}
    >
      {/* walls */}
      <g style={{ filter: paperShadow(2) }}>
        <rect x="14" y="66" width="312" height="178" rx="8" fill={CREAM} />
      </g>
      {/* roof — one folded strip of slate paper */}
      <g style={{ filter: paperShadow(2) }}>
        <path d="M2 74 L170 12 L338 74 L338 92 L170 32 L2 92 Z" fill={SLATE} />
      </g>
      {/* Netflix awning stripe */}
      <g style={{ filter: paperShadow(0) }}>
        <rect x="14" y="98" width="312" height="26" fill={RED} />
      </g>
      {/* roller door, punched through to the dark inside */}
      <g style={{ filter: paperShadow(0) }}>
        <rect x="92" y="138" width="152" height="106" rx="6" fill="#2C3E4E" />
      </g>
      <rect
        x="92"
        y="138"
        width="152"
        height="106"
        rx="6"
        fill={SUN}
        opacity={0.2 * doorGlow}
      />
      {/* shelves of stock inside, brighter the more stocked it is */}
      {[150, 194].map((sy) => (
        <rect key={sy} x="98" y={sy + 30} width="140" height="7" rx="3.5" fill="#1B2C3A" />
      ))}
      {[152, 196].map((sy, row) =>
        [106, 150, 194].map((sx, col) => {
          // shelves fill bottom row first, left to right — the nightly stock-up
          const idx = (1 - row) * 3 + col;
          const on = Math.max(0, Math.min(1, stock * 6 - idx));
          return on <= 0 ? null : (
            <g key={`${sx}-${sy}`} opacity={(0.45 + 0.55 * doorGlow) * on}>
              <rect x={sx} y={sy + (1 - on) * 10} width="32" height="28" rx="3" fill={KRAFT} />
              <rect x={sx + 12} y={sy + (1 - on) * 10} width="8" height="28" fill={RED} />
            </g>
          );
        })
      )}
      {/* the mark on the wall */}
      {sign ? (
        <>
          <g style={{ filter: paperShadow(0) }}>
            <rect x="256" y="150" width="62" height="36" rx="6" fill={CREAM} />
          </g>
          <text
            x="287"
            y="176"
            textAnchor="middle"
            fontFamily={FONTS.sans}
            fontWeight="900"
            fontSize="21"
            fill={INK}
          >
            {sign}
          </text>
        </>
      ) : null}
    </svg>
    {mark ? (
      <NetflixMark
        h={w * 0.155}
        depth={0}
        style={{ position: "absolute", left: w * 0.115, top: w * WAREHOUSE_RATIO * 0.6 }}
      />
    ) : null}
  </div>
);

// ── House — a home on the road. Window: off → lights-on → watching (red). ──
export const HOUSE_RATIO = 118 / 132;
export const House: React.FC<{
  w?: number;
  glow?: "off" | "warm" | "watching";
  style?: React.CSSProperties;
}> = ({ w = 132, glow = "off", style }) => {
  const frame = useCurrentFrame();
  const flicker = 0.84 + 0.16 * Math.sin(frame / 7);
  const win = glow === "watching" ? RED : glow === "warm" ? SUN : SLATE_PALE;
  return (
    <svg
      width={w}
      height={w * HOUSE_RATIO}
      viewBox="0 0 132 118"
      style={{ overflow: "visible", ...style }}
    >
      {/* body */}
      <g style={{ filter: paperShadow(2) }}>
        <rect x="18" y="50" width="96" height="64" rx="5" fill={CREAM} />
      </g>
      {/* roof — a single folded piece */}
      <g style={{ filter: paperShadow(2) }}>
        <path d="M6 56 L66 12 L126 56 L114 56 L66 24 L18 56 Z" fill={RED_DEEP} />
        <path d="M6 56 L66 12 L126 56 L126 66 L66 26 L6 66 Z" fill={RED} />
      </g>
      {/* door */}
      <g style={{ filter: paperShadow(0) }}>
        <rect x="80" y="76" width="24" height="38" rx="3" fill={KRAFT_DEEP} />
      </g>
      {/* window, punched */}
      <g style={{ filter: paperShadow(0) }}>
        <rect x="30" y="68" width="34" height="28" rx="4" fill={INK} />
      </g>
      <rect
        x="34"
        y="72"
        width="26"
        height="20"
        rx="3"
        fill={win}
        opacity={glow === "off" ? 0.45 : flicker}
      />
      {/* the glow spilling out onto the wall */}
      {glow === "watching" ? (
        <rect x="22" y="60" width="50" height="44" rx="8" fill={RED} opacity={0.2 * flicker} />
      ) : null}
    </svg>
  );
};

// ── Route — a shipping run, drawn as marching paper dashes ────────────────
// (A dash is a strip of paper: the one stroke the law allows.)
export const Route: React.FC<{
  d: string;
  w: number;
  h: number;
  color?: string;
  speed?: number;
  progress?: number; // 0..1 — fades the run in
  width?: number;
  style?: React.CSSProperties;
}> = ({ d, w, h, color = RUSH, speed = 1.6, progress = 1, width = 11, style }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible", ...style }}>
      <g style={{ filter: paperShadow(0) }}>
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray="14 24"
          strokeDashoffset={-frame * speed}
          opacity={progress * 0.92}
        />
      </g>
    </svg>
  );
};

// ── Wifi — signal arcs as paper strips. bars 0..3. ────────────────────────
export const Wifi: React.FC<{
  bars: 0 | 1 | 2 | 3;
  w?: number;
  style?: React.CSSProperties;
}> = ({ bars, w = 78, style }) => {
  const theme = useTheme();
  const col = bars >= 3 ? theme.good : bars === 2 ? RUSH : RED;
  return (
    <svg
      width={w}
      height={(w * 60) / 72}
      viewBox="0 0 72 60"
      style={{ overflow: "visible", ...style }}
    >
      <g style={{ filter: paperShadow(1) }}>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${20 - i * 8} ${34 - i * 8} Q 36 ${12 - i * 10} ${52 + i * 8} ${34 - i * 8}`}
            fill="none"
            stroke={i < bars ? col : SLATE_PALE}
            strokeWidth="8"
            strokeLinecap="round"
          />
        ))}
        <circle cx="36" cy="46" r="7" fill={bars > 0 ? col : SLATE_PALE} />
      </g>
    </svg>
  );
};

// ── Headline — the big-beat text, on a white paper card ───────────────────
// Replaces 004's bordered "stamp": papersky forbids outlines, so the card is a
// pure white cutout with an optional colored paper strip laid under the words.
export const Headline: React.FC<{
  children: React.ReactNode;
  fontSize?: number;
  rotate?: number;
  rule?: string; // color of the paper strip under the text
  maxWidth?: number; // cap so full-width lines clear the IG action rail (x940)
  style?: React.CSSProperties;
}> = ({ children, fontSize = 46, rotate = -2, rule, maxWidth, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "inline-block",
        position: "relative",
        padding: "16px 34px 18px",
        borderRadius: 16,
        background: "#FFFFFF",
        boxShadow: "0 14px 34px rgba(24, 56, 84, 0.30)",
        transform: `rotate(${rotate}deg)`,
        maxWidth,
        ...style,
      }}
    >
      {rule ? (
        <div
          style={{
            position: "absolute",
            left: 24,
            right: 24,
            bottom: 12,
            height: 7,
            borderRadius: 4,
            background: rule,
          }}
        />
      ) : null}
      <span
        style={{
          position: "relative",
          fontFamily: FONTS.sans,
          fontWeight: 900,
          fontSize,
          lineHeight: 1.12,
          letterSpacing: "0.01em",
          textTransform: "uppercase",
          color: theme.text,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    </div>
  );
};

// ── Chip — the small paper label ──────────────────────────────────────────
export const Chip: React.FC<{
  children: React.ReactNode;
  color?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ children, color, fontSize = 27, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "inline-block",
        padding: "11px 24px 13px",
        borderRadius: 12,
        background: "#FFFFFF",
        boxShadow: "0 10px 24px rgba(24, 56, 84, 0.26)",
        fontFamily: FONTS.sans,
        fontWeight: 800,
        fontSize,
        letterSpacing: "0.02em",
        color: color ?? theme.textDim,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ── Poster — a bright paper title card (the thing inside the box) ─────────
export const Poster: React.FC<{
  top: string;
  bottom: string;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
}> = ({ top, bottom, w = 62, h = 90, style }) => (
  <svg
    width={w}
    height={h}
    viewBox="0 0 62 90"
    style={{ overflow: "visible", ...style }}
  >
    <g style={{ filter: paperShadow(1) }}>
      <rect x="0" y="0" width="62" height="90" rx="5" fill={top} />
      <path d="M0 52 H62 V85 Q62 90 57 90 H5 Q0 90 0 85 Z" fill={bottom} />
      <circle cx="31" cy="30" r="14" fill="#FFFFFF" opacity="0.55" />
      <rect x="12" y="62" width="38" height="6" rx="3" fill="#FFFFFF" opacity="0.75" />
      <rect x="19" y="74" width="24" height="6" rx="3" fill="#FFFFFF" opacity="0.5" />
    </g>
  </svg>
);

// ── FloorStage — the INTERIOR board: pale back wall, cream paper floor ────
// Used for the two "inside the operation" beats (packing floor, parcel line)
// so the belt and the boxes stand on something, instead of hovering over the
// street. Same paper law: torn edges, hue-shifted shadows, no outlines.
export const FloorStage: React.FC<{ floorFrom?: number }> = ({ floorFrom = 560 }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 130) * 5;
  let d = `M ${-80 + drift} ${floorFrom}`;
  for (let i = 0; i < 7; i++) {
    d += ` c 42 -11 84 -11 124 0 c 30 9 60 9 82 0`;
  }
  d += ` L 1160 2000 L -80 2000 Z`;
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {/* NO back-wall fill: the chrome (header + stepper) renders UNDER scene
          art, so anything opaque up there would erase it. The theme's sky
          board is the wall. */}
      {/* the floor sheet */}
      <g style={{ filter: paperShadow(2) }}>
        <path d={d} fill={CREAM} />
      </g>
      {/* one taped lane on the floor — a strip of paper, nothing more */}
      <rect x={-40} y={floorFrom + 470} width={1160} height="9" rx="4.5" fill="#F2E6D2" />
    </svg>
  );
};

// ── PaperStars — cream dots punched in the night sheet ────────────────────
export const PaperStars: React.FC<{ opacity: number; count?: number }> = ({
  opacity,
  count = 26,
}) => {
  const frame = useCurrentFrame();
  if (opacity <= 0.02) return null;
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}
    >
      {Array.from({ length: count }, (_, i) => {
        const x = 40 + rnd(i, 1, 4) * 1000;
        const y = 300 + rnd(i, 2, 4) * 620;
        const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(frame / 18 + rnd(i, 3, 4) * 9));
        return (
          <circle key={i} cx={x} cy={y} r={2 + rnd(i, 4, 4) * 2.4} fill="#FFF3CE" opacity={tw} />
        );
      })}
    </svg>
  );
};

// ── NightSheet — a navy paper laid over the whole board, plus a moon ──────
export const NightSheet: React.FC<{ amount: number }> = ({ amount }) =>
  amount <= 0.01 ? null : (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: NIGHT,
        opacity: amount,
        pointerEvents: "none",
      }}
    />
  );

export const Moon: React.FC<{ size?: number; opacity?: number; style?: React.CSSProperties }> = ({
  size = 130,
  opacity = 1,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    style={{ position: "absolute", overflow: "visible", opacity, ...style }}
  >
    <g style={{ filter: paperShadow(2) }}>
      <path d="M 78 22 A 42 42 0 1 0 78 98 A 34 34 0 1 1 78 22 Z" fill="#FFF3CE" />
    </g>
  </svg>
);
