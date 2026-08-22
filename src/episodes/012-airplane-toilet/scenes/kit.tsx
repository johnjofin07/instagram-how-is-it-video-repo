import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { Icon, IconPaths } from "../../../components/Icon";

// Episode 012 kit — `papersky` cut-paper diorama (v3). The rendering law:
// NO STROKES. Every shape is a flat paper fill; separation comes from layered
// pieces and soft deep-blue drop shadows (paperShadow). Nearer layers cast
// longer shadows. Strokes only survive where a thick strip IS the shape
// (pipes, ground lines) — a strip is a piece of paper too.

// ── Semantic color law ────────────────────────────────────────────────────
export const AIR = "#3B5A73"; // air particles — navy confetti on white sets
export const AIR_LIT = "#EAF3F9"; // air dots INSIDE the navy void only
export const RUSH = "#C64910"; // air IN MOTION — orange paper arrows/streaks
export const BLUE = "#2FA8CC"; // the blue liquid, and nothing else
export const BLUE_DEEP = "#136C8E"; // the liquid's wave-edge paper layer
export const VOID = "#1B2F44"; // the thin sky — deep high-altitude navy paper
export const METAL = "#8FAABE"; // structural paper strips (pipes, rails)
export const METAL_DARK = "#D8E6EF"; // pale structural paper fills
export const INK = "#16293A"; // punched windows, silhouettes
export const INTERIOR = "#E7F0F6"; // bowl / set interior paper
export const RED = "#C22F2C"; // THE PLANE
export const RED_DEEP = "#992220"; // the plane's shadow-side pieces
export const SKIN = "#F3D9BE"; // the paper hand

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const rnd = (i: number, n: number, seed: number) => {
  const s = Math.sin((i + 1) * 127.1 + seed * 311.7 + n * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

// The one shadow. depth 0 = glued flat, 3 = riding high off the board.
export const paperShadow = (depth = 1) =>
  `drop-shadow(0 ${3 + depth * 4}px ${4 + depth * 5}px rgba(24, 56, 84, ${0.34 - depth * 0.04}))`;

// ── SkyStage — layered sky-blue papers with torn wave edges ───────────────
// The theme bg is the farthest sky sheet; two nearer bands drift on their own
// parallax phases. Sits behind every exterior beat.
export const SkyStage: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const wave = (y: number, amp: number, phase: number, drift: number) => {
    const dx = Math.sin(frame / 95 + phase) * drift;
    let d = `M ${-80 + dx} ${y}`;
    for (let i = 0; i < 7; i++) {
      d += ` c 40 ${-amp} 80 ${-amp} 120 0 c 30 ${amp * 0.75} 60 ${amp * 0.75} 80 0`;
    }
    d += ` L 1160 2000 L -80 2000 Z`;
    return d;
  };
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}
    >
      <g style={{ filter: paperShadow(0) }}>
        <path d={wave(1150, 16, 0, 10)} fill="#A5CFE8" />
      </g>
      <g style={{ filter: paperShadow(1) }}>
        <path d={wave(1430, 20, 2.1, 16)} fill="#8FC3E0" />
      </g>
    </svg>
  );
};

// ── PaperPlane — the red papercraft model ─────────────────────────────────
// Same viewBox + lavatory-mark coordinates as v2 so the dive math holds.
export const PLANE_VB = { w: 640, h: 260 } as const;
export const LAV_MARK = { x: 476, y: 128 } as const;
export const PaperPlane: React.FC<{
  w?: number;
  markOn?: number;
  onGround?: boolean;
  bob?: boolean;
  // half-cut mode: the near wall + near wing are removed and `cut` is drawn
  // inside the fuselage (see PlaneCutaway)
  nearWing?: boolean;
  windows?: boolean;
  cut?: React.ReactNode;
}> = ({ w = 640, markOn = 0, onGround = false, bob = true, nearWing = true, windows = true, cut }) => {
  const frame = useCurrentFrame();
  const dy = bob ? Math.sin(frame / 26) * 3 : 0;
  return (
    <svg
      width={w}
      height={(w * PLANE_VB.h) / PLANE_VB.w}
      viewBox={`0 0 ${PLANE_VB.w} ${PLANE_VB.h}`}
      style={{ position: "absolute", overflow: "visible" }}
    >
      <g transform={`translate(0 ${dy})`}>
        {/* far wing, behind the body */}
        <g style={{ filter: paperShadow(0) }}>
          <path d="M300 100 L392 30 L448 30 L372 102 Z" fill={RED_DEEP} />
        </g>

        {/* landing gear (ground scenes only) */}
        {onGround ? (
          <g style={{ filter: paperShadow(0) }}>
            <rect x="164" y="150" width="12" height="42" rx="6" fill={METAL} />
            <rect x="332" y="146" width="12" height="46" rx="6" fill={METAL} />
            <circle cx="170" cy="198" r="15" fill={INK} />
            <circle cx="338" cy="198" r="15" fill={INK} />
          </g>
        ) : null}

        {/* fuselage — belly piece then body piece */}
        <g style={{ filter: paperShadow(1) }}>
          <path
            d="M34 132 Q30 156 84 160 L430 152 Q500 148 560 126 Q540 152 470 158 L96 168 Q28 168 26 138 Z"
            fill={RED_DEEP}
          />
        </g>
        <g style={{ filter: paperShadow(1) }}>
          <path
            d="M26 128 Q26 94 88 90 L426 78 Q516 74 578 104 Q600 113 580 126 L444 152 L92 160 Q26 162 26 128 Z"
            fill={RED}
          />
        </g>

        {/* tail fin + stabilizer */}
        <g style={{ filter: paperShadow(1) }}>
          <path d="M516 90 L560 18 L606 18 L582 96 Z" fill={RED} />
          <path d="M536 116 L622 102 L602 130 L544 132 Z" fill={RED_DEEP} />
        </g>

        {/* white window strip, windows punched out in navy */}
        {windows ? (
          <>
            <g style={{ filter: paperShadow(0) }}>
              <rect x="108" y="106" width="404" height="34" rx="17" fill="#FFFFFF" />
            </g>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <circle key={i} cx={146 + i * 52} cy="123" r="8" fill={INK} />
            ))}
          </>
        ) : null}
        {/* cockpit window */}
        <path d="M52 106 Q68 96 92 96 L88 118 L56 122 Z" fill={INK} />

        {cut}

        {nearWing ? (
          <>
            {/* near wing, over the body — the highest paper layer */}
            <g style={{ filter: paperShadow(2) }}>
              <path d="M236 122 L142 216 L216 216 L318 128 Z" fill={RED} />
            </g>
            {/* engine nacelle hanging under the wing */}
            <g style={{ filter: paperShadow(1) }}>
              <rect x="196" y="172" width="74" height="30" rx="15" fill="#FFFFFF" />
              <rect x="196" y="172" width="16" height="30" rx="8" fill={INK} />
            </g>
          </>
        ) : null}

        {/* the lavatory window, marked */}
        <g opacity={markOn}>
          <circle cx={LAV_MARK.x} cy={LAV_MARK.y} r="14" fill="none" stroke={RUSH} strokeWidth="6" />
          <circle
            cx={LAV_MARK.x}
            cy={LAV_MARK.y}
            r={21 + ((frame * 0.8) % 16)}
            fill="none"
            stroke={RUSH}
            strokeWidth="4"
            opacity={0.7 - ((frame * 0.8) % 16) / 30}
          />
        </g>
      </g>
    </svg>
  );
};

// Back-compat aliases: the scenes ask for `Plane` / `PlaneExterior`
export const Plane: React.FC<{ w?: number; onGround?: boolean }> = ({
  w = 560,
  onGround = true,
}) => <PaperPlane w={w} onGround={onGround} bob={false} />;
export const PlaneExterior: React.FC<{ w?: number; markOn?: number }> = ({
  w = 640,
  markOn = 1,
}) => <PaperPlane w={w} markOn={markOn} />;

// ── SetPanel — the white diorama backdrop the interior beats sit on ───────
export const SetPanel: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
}> = ({ x, y, w, h, fill = "#FFFFFF" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      background: fill,
      borderRadius: 22,
      boxShadow: "0 18px 44px rgba(24, 56, 84, 0.30)",
    }}
  />
);

// ── AirField — paper confetti. Same physics as before, paper colors. ──────
export const AirField: React.FC<{
  w: number;
  h: number;
  count: number;
  seed: number;
  density?: number;
  flow?: { x: number; y: number };
  sink?: { x: number; y: number } | null;
  travel?: number; // monotonic — keeps every frame pure in `frame`
  streak?: number;
  style?: React.CSSProperties;
}> = ({
  w,
  h,
  count,
  seed,
  density = 1,
  flow = { x: 0, y: 0 },
  sink = null,
  travel = 0,
  streak = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const n = Math.round(count * density);
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0, ...style }}>
      {Array.from({ length: n }, (_, i) => {
        const rate = 0.55 + rnd(i, 6, seed) * 0.75;
        const phase = sink ? (travel * rate + rnd(i, 7, seed)) % 1 : 0;
        const cycle = sink ? Math.floor(travel * rate + rnd(i, 7, seed)) : 0;
        const sx = 14 + rnd(i + cycle * 31, 1, seed) * (w - 28);
        const sy = 14 + rnd(i + cycle * 31, 2, seed) * (h - 28);
        const r = 2.4 + rnd(i, 3, seed) * 1.5;

        if (!sink) {
          const x = (((sx + flow.x * frame) % w) + w) % w;
          const y = (((sy + flow.y * frame) % h) + h) % h;
          const j = Math.sin(frame / 23 + rnd(i, 4, seed) * 9) * 1.2;
          return <circle key={i} cx={x + j} cy={y - j} r={r} fill={AIR} opacity={0.5 + rnd(i, 5, seed) * 0.35} />;
        }

        const e = Math.pow(phase, 2.3);
        const x = sx + (sink.x - sx) * e;
        const y = sy + (sink.y - sy) * e;
        const dist = Math.hypot(sink.x - sx, sink.y - sy);
        const speed = 2.3 * Math.pow(Math.max(phase, 0.001), 1.3) * dist * rate * 0.012;
        const len = Math.min(96, speed * 10) * streak;
        const ux = dist > 0 ? (sink.x - sx) / dist : 0;
        const uy = dist > 0 ? (sink.y - sy) / dist : 0;
        const fade = 1 - Math.pow(phase, 6);
        return (
          <g key={i} opacity={fade}>
            {len > 5 ? (
              <line
                x1={x - ux * len}
                y1={y - uy * len}
                x2={x}
                y2={y}
                stroke={RUSH}
                strokeWidth={Math.min(4.5, 1.8 + len / 26)}
                strokeLinecap="round"
                opacity={0.8}
              />
            ) : null}
            <circle cx={x} cy={y} r={r} fill={AIR} opacity={0.55 + rnd(i, 5, seed) * 0.4} />
          </g>
        );
      })}
    </svg>
  );
};

// ── ValveVoid — the window onto the sky at altitude ───────────────────────
// Navy overhead fading to sky blue below, one cloud far beneath, and only a
// handful of air dots: the same confetti the cabin is packed with, nearly gone.
export const ValveVoid: React.FC<{ w: number; h: number; reveal: number }> = ({ w, h, reveal }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, opacity: reveal }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 18,
          background: `linear-gradient(180deg, ${VOID} 0%, #27486A 38%, #4F86B4 74%, #8EC0E0 100%)`,
          boxShadow: "inset 0 8px 22px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: w * 0.12, top: h * 0.8 }}>
          <PaperCloud w={w * 0.62} drift={4} />
        </div>
        <div style={{ position: "absolute", left: w * 0.6, top: h * 0.9 }}>
          <PaperCloud w={w * 0.4} drift={3} />
        </div>
      </div>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle
            key={i}
            cx={40 + rnd(i, 1, 9) * (w - 80) + Math.sin(frame / 47 + i * 2) * 9}
            cy={40 + rnd(i, 2, 9) * (h - 120) + Math.cos(frame / 61 + i * 3) * 7}
            r={2.8}
            fill={AIR_LIT}
            opacity={0.75}
          />
        ))}
      </svg>
    </div>
  );
};

// ── PumpUnit — white paper housing, orange rotor ──────────────────────────
export const PumpUnit: React.FC<{ spin: number; w?: number }> = ({ spin, w = 260 }) => {
  const frame = useCurrentFrame();
  const shake = spin * Math.sin(frame * 1.9) * 1.4;
  return (
    <svg
      width={w}
      height={w * 0.72}
      viewBox="0 0 260 188"
      style={{ position: "absolute", overflow: "visible", transform: `translate(${shake}px, ${-shake}px)` }}
    >
      <g style={{ filter: paperShadow(2) }}>
        <rect x="84" y="34" width="168" height="132" rx="18" fill="#FFFFFF" />
      </g>
      <circle cx="168" cy="100" r="52" fill={METAL_DARK} />
      <g transform={`rotate(${frame * 13 * spin} 168 100)`}>
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d="M168 100 L168 54"
            stroke={spin > 0.2 ? RUSH : METAL}
            strokeWidth="12"
            strokeLinecap="round"
            transform={`rotate(${i * 90} 168 100)`}
          />
        ))}
      </g>
      {spin > 0.25
        ? [0, 1, 2].map((i) => (
            <circle
              key={i}
              cx="168"
              cy="100"
              r={26 + i * 11}
              fill="none"
              stroke={RUSH}
              strokeWidth="3.5"
              strokeDasharray="34 46"
              strokeDashoffset={-frame * (5 + i * 3)}
              opacity={spin * 0.45}
            />
          ))
        : null}
      {/* intake horn, facing left onto the pipe */}
      <g style={{ filter: paperShadow(1) }}>
        <path d="M84 74 L14 46 V154 L84 126 Z" fill={METAL_DARK} />
      </g>
    </svg>
  );
};

// ── SpeedTicker — the episode's one number, on a white paper card ─────────
export const SpeedTicker: React.FC<{ value: number; opacity?: number }> = ({
  value,
  opacity = 1,
}) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 14,
        padding: "14px 30px",
        borderRadius: 14,
        background: "#FFFFFF",
        boxShadow: "0 12px 30px rgba(24, 56, 84, 0.30)",
        opacity,
      }}
    >
      <span
        style={{
          fontFamily: FONTS.sans,
          fontSize: 62,
          fontWeight: 900,
          color: RUSH,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Math.round(value)}
      </span>
      <span style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 26, letterSpacing: "0.18em", color: theme.textDim }}>
        MPH
      </span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// OBJECTS — Fluent Emoji flat glyphs (MIT) from src/icons/registry.json,
// recolored to the paper law and rigged per piece. Hand-drawn SVG below this
// line is only for geometric things: pipes, arrows, liquid, the hull ring.
// ═══════════════════════════════════════════════════════════════════════════

// ── Chip / Stamp — white paper labels, bold sans (channel font) ───────────
export const Chip: React.FC<{
  children: React.ReactNode;
  color?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ children, color, fontSize = 28, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "inline-block",
        padding: "12px 26px 14px",
        borderRadius: 12,
        background: "#FFFFFF",
        boxShadow: "0 10px 24px rgba(24, 56, 84, 0.26)",
        fontFamily: FONTS.sans,
        fontWeight: 800,
        fontSize,
        letterSpacing: "0.06em",
        color: color ?? theme.textDim,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Two-line title card: the first line is the number (RUSH), the second the noun.
export const Stamp: React.FC<{
  top: string;
  bottom: string;
  pop: number; // 0→1 entrance
  rotate?: number;
}> = ({ top, bottom, pop, rotate = -2 }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "inline-block",
        padding: "18px 44px 22px",
        borderRadius: 18,
        background: "#FFFFFF",
        boxShadow: "0 16px 40px rgba(24, 56, 84, 0.30)",
        transform: `rotate(${rotate}deg) scale(${0.7 + pop * 0.3})`,
        opacity: pop,
        textAlign: "center",
        fontFamily: FONTS.sans,
        lineHeight: 1,
      }}
    >
      <div style={{ fontSize: 108, fontWeight: 900, color: RUSH, letterSpacing: "-0.02em" }}>{top}</div>
      <div style={{ fontSize: 54, fontWeight: 900, color: theme.text, letterSpacing: "0.16em", marginTop: 8 }}>
        {bottom}
      </div>
    </div>
  );
};

// ── PaperCloud — the "cloud" glyph as two white paper layers ──────────────
export const PaperCloud: React.FC<{ w?: number; drift?: number }> = ({ w = 220, drift = 5 }) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / 70 + w) * drift;
  return (
    <div style={{ position: "absolute", transform: `translateX(${dx}px)` }}>
      <Icon
        name="fluent-emoji-flat:cloud"
        size={w * 0.85}
        recolor={{ "#B4ACBC": "#DCE9F2", "#F3EEF8": "#FFFFFF" }}
        wrap={(node, i) => <g style={{ filter: paperShadow(i === 0 ? 1 : 2) }}>{node}</g>}
      />
    </div>
  );
};

// ── Lavatory — the "toilet" glyph, rigged ─────────────────────────────────
// Icon space is 32×32 units; `unit` px per unit. Landmarks (icon units):
export const LAV = {
  bowl: { x: 12.5, y: 19.5 }, // bowl cavity centre — the sink for the stampede
  rim: { x: 12.5, y: 16 }, // rim line
  drain: { x: 15.5, y: 30 }, // where the pedestal meets the pipe
  button: { x: 24, y: 1.4 }, // flush pill on the tank top — the hand lands here
  // the inner bowl wall, rim-left → bottom → rim-right (for gleam sweeps)
  wall: "M4 17.2 Q5.5 23.6 12.5 23.8 Q19.5 23.6 21 17.2",
} as const;
export const Lavatory: React.FC<{
  unit: number;
  valveOpen?: number; // 0 shut … 1 open
  press?: number; // 0…1 button travel
  gleam?: number; // continuous phase — a white highlight chasing the wall
  pipe?: { to: { x: number; y: number } } | null; // icon-unit endpoint of the stub
  pulse?: number; // RUSH dash running down the stub
}> = ({ unit, valveOpen = 0, press = 0, gleam, pipe = null, pulse = 0 }) => {
  const frame = useCurrentFrame();
  const U = unit;
  const vb = `0 0 ${32} ${32}`;
  return (
    <svg
      width={32 * U}
      height={32 * U}
      viewBox={vb}
      style={{ position: "absolute", overflow: "visible" }}
    >
      {/* pipe stub, behind everything: drain → down → across to `pipe.to` */}
      {pipe ? (
        <g>
          <path
            d={`M${LAV.drain.x} ${LAV.drain.y} V${pipe.to.y} H${pipe.to.x}`}
            fill="none"
            stroke={METAL}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: paperShadow(0) }}
          />
          <path
            d={`M${LAV.drain.x} ${LAV.drain.y} V${pipe.to.y} H${pipe.to.x}`}
            fill="none"
            stroke={METAL_DARK}
            strokeWidth={1.3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {pulse > 0.01 ? (
            <path
              d={`M${LAV.drain.x} ${LAV.drain.y} V${pipe.to.y} H${pipe.to.x}`}
              fill="none"
              stroke={RUSH}
              strokeWidth={1.1}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1.6 1.9"
              strokeDashoffset={-frame * 0.5}
              opacity={pulse * 0.95}
            />
          ) : null}
        </g>
      ) : null}
      {/* the toilet: piece 0 = rim + pedestal (METAL paper), piece 1 = tank + bowl (white) */}
      <IconPaths
        name="fluent-emoji-flat:toilet"
        recolor={{ "#B4ACBC": METAL, "#CDC4D6": "#FFFFFF" }}
        wrap={(node, i) => <g style={{ filter: paperShadow(i === 0 ? 0 : 1) }}>{node}</g>}
      />
      {/* the bowl cavity — a pale paper piece inside the rim */}
      <path d={`${LAV.wall} Z`} fill={INTERIOR} />
      {gleam !== undefined ? (
        <path
          d={LAV.wall}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={1.1}
          strokeLinecap="round"
          strokeDasharray="7 30"
          strokeDashoffset={-((gleam * 37) % 37)}
        />
      ) : null}
      {/* valve flap at the foot of the pedestal — rotates open into the pipe */}
      <g
        transform={`rotate(${-80 * valveOpen} ${LAV.drain.x - 1.6} ${LAV.drain.y + 0.2})`}
        style={{ filter: paperShadow(1) }}
      >
        <rect x={LAV.drain.x - 2.2} y={LAV.drain.y - 0.55} width={5} height={1.2} rx={0.6} fill={INK} />
      </g>
      {/* flush button: pale plate + RUSH pill on the tank top */}
      <g style={{ filter: paperShadow(1) }}>
        <rect x={LAV.button.x - 2.6} y={LAV.button.y - 1.1 + press * 0.6} width={5.2} height={2.2} rx={0.8} fill={METAL_DARK} />
      </g>
      <rect x={LAV.button.x - 1.6} y={LAV.button.y - 0.45 + press * 0.6} width={3.2} height={0.9} rx={0.45} fill={RUSH} />
    </svg>
  );
};

// ── Droplet — the "droplet" glyph in liquid BLUE ──────────────────────────
export const Droplet: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 40, style }) => (
  <Icon
    name="fluent-emoji-flat:droplet"
    size={size}
    recolor={{ "#26C9FC": BLUE }}
    wrap={(node) => <g style={{ filter: paperShadow(1) }}>{node}</g>}
    style={style}
  />
);

// ── HandPress — "backhand index pointing down", paper skin ────────────────
// Fingertip sits at HAND_TIP × size — scenes place the hand so that point
// lands on whatever it presses.
export const HAND_TIP = { x: 0.61, y: 0.95 } as const;
export const HandPress: React.FC<{ size?: number; press?: number }> = ({ size = 190, press = 1 }) => (
  <Icon
    name="fluent-emoji-flat:backhand-index-pointing-down"
    size={size}
    recolor={{ "#FFC83D": SKIN, "#D67D00": "#E9C6A4" }}
    wrap={(node, i) => (i === 0 ? <g style={{ filter: paperShadow(2) }}>{node}</g> : node)}
    style={{ transform: `translateY(${press * 12}px)` }}
  />
);

// ── Buckets — "gallons of water" as a stack of bucket glyphs ──────────────
export const Buckets: React.FC<{ appear: number; collapse: number; size?: number }> = ({
  appear,
  collapse,
  size = 104,
}) => (
  <div style={{ position: "absolute", width: size * 3, height: size * 2.2 }}>
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const inn = interpolate(appear, [i * 0.1, i * 0.1 + 0.4], [0, 1], clamp);
      const gone = interpolate(collapse, [i * 0.08, i * 0.08 + 0.45], [1, 0], clamp);
      const o = inn * gone;
      if (o <= 0.01) return null;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: col * size * 1.02,
            top: row * size * 1.04 + (1 - inn) * 20 + (1 - gone) * 60,
            opacity: o,
            transform: `rotate(${(1 - gone) * (col - 1) * 14}deg)`,
          }}
        >
          <Icon
            name="fluent-emoji-flat:bucket"
            size={size}
            recolor={{ "#0074BA": METAL, "#00A6ED": "#FFFFFF", "#D3D3D3": METAL }}
            wrap={(node, j) => (j === 0 ? <g style={{ filter: paperShadow(1) }}>{node}</g> : node)}
          />
        </div>
      );
    })}
  </div>
);

// ── PaperCup — one cup of BLUE, a paper cutout that can tip and pour ──────
export const PaperCup: React.FC<{ w?: number; tilt?: number; level?: number }> = ({
  w = 110,
  tilt = 0,
  level = 1,
}) => (
  <svg
    width={w}
    height={w * 1.05}
    viewBox="0 0 90 95"
    style={{ position: "absolute", overflow: "visible", transform: `rotate(${tilt}deg)`, transformOrigin: "20% 90%" }}
  >
    <g style={{ filter: paperShadow(2) }}>
      <path d="M6 8 H84 L74 88 H16 Z" fill="#FFFFFF" />
    </g>
    <path d={`M${8 + (1 - level) * 3} ${12 + (1 - level) * 60} H${82 - (1 - level) * 3} L74 88 H16 Z`} fill={BLUE} />
  </svg>
);

// ── Seat + passenger — "seat" glyph with a "bust" sat in it ───────────────
export const SeatRow: React.FC<{ seat?: number; highlight?: number; lit?: number }> = ({
  seat = 78,
  highlight = -1,
  lit = 0,
}) => (
  <g>
    {[0, 1, 2, 3, 4].map((i) => {
      const x = i * seat * 1.28;
      const hi = i === highlight ? lit : 0;
      return (
        <g key={i} transform={`translate(${x} 0)`}>
          {hi > 0.01 ? (
            <rect
              x={-8}
              y={-10}
              width={seat * 0.95}
              height={seat * 1.05}
              rx={14}
              fill={RUSH}
              opacity={hi * 0.22}
            />
          ) : null}
          <g transform={`scale(${seat / 32})`}>
            <IconPaths
              name="fluent-emoji-flat:seat"
              recolor={{ "#00A6ED": hi > 0.5 ? "#F6E3D6" : METAL_DARK, "#B4ACBC": METAL, "#000": INK }}
              wrap={(node, j) => (j === 0 ? <g style={{ filter: paperShadow(1) }}>{node}</g> : node)}
            />
          </g>
          {/* the passenger — a bust, scaled to the cushion */}
          <g transform={`translate(${seat * 0.28} ${seat * 0.06}) scale(${(seat * 0.62) / 32})`}>
            <IconPaths
              name="fluent-emoji-flat:bust-in-silhouette"
              recolor={{ "#321B41": INK, "#533566": "#2B4256" }}
              wrap={(node) => <g style={{ filter: paperShadow(2) }}>{node}</g>}
            />
          </g>
        </g>
      );
    })}
  </g>
);

// ── ServiceTruck — the "delivery truck" glyph, facing left, paper colors ──
// Box fills BLUE_DEEP as the tank drains (`load` 0…1).
export const TRUCK_NOSE = { x: 0.08, y: 0.74 } as const; // hose port, × size
export const ServiceTruck: React.FC<{ size?: number; load?: number }> = ({ size = 230, load = 0 }) => {
  const U = size / 32;
  return (
    <div style={{ position: "absolute", width: size, height: size }}>
      <Icon
        name="fluent-emoji-flat:delivery-truck"
        size={size}
        flipX
        recolor={{
          "#FCD53F": "#FFFFFF",
          "#FF822D": METAL_DARK,
          "#CA0B4A": METAL,
          "#26C9FC": "#BDDDF0",
          "#321B41": INK,
          "#E6E6E6": "#FFFFFF",
          "#F4F4F4": METAL_DARK,
        }}
        wrap={(node, i) => (i < 3 ? <g style={{ filter: paperShadow(1) }}>{node}</g> : node)}
      />
      {/* the load, rising inside the box (box ≈ x13–29u, y9–24u after the flip) */}
      {load > 0.01 ? (
        <svg width={size} height={size} viewBox="0 0 32 32" style={{ position: "absolute", inset: 0 }}>
          <rect x={13.2} y={24 - load * 14} width={15.6} height={load * 14} rx={0.6} fill={BLUE_DEEP} opacity={0.9} />
        </svg>
      ) : null}
    </div>
  );
};

// ── PlaneCutaway — the half-cut plane, seen from outside ──────────────────
// PaperPlane with its near wall and near wing removed: the cabin floor, a
// seat row with passengers, the lavatory at the back, and the sealed tank
// under the floor with its pipe. One object carries the rehook (S1), the
// belly zoom (S2) and the gate drain (S4). Landmarks in PLANE_VB units:
export const CUT = {
  tank: { x: 300, y: 145 }, // tank centre — zoom target
  hatch: { x: 300, y: 156 }, // underside port the truck hose meets
  seatArrow: (i: number) => 132 + i * 58 + 12, // x of seat i's centre
} as const;
export const PlaneCutaway: React.FC<{
  w?: number;
  fill: number;
  slosh: number;
  flash?: number;
  sealed?: number;
  highlightSeat?: number;
  lit?: number;
  glow?: number;
  hatchOpen?: number;
  pulse?: number; // RUSH dash running from the lavatory down to the tank
  onGround?: boolean;
  bob?: boolean;
}> = ({
  w = 640,
  fill,
  slosh,
  flash = 0,
  sealed = 1,
  highlightSeat = -1,
  lit = 0,
  glow = 0,
  hatchOpen = 0,
  pulse = 0,
  onGround = false,
  bob = true,
}) => {
  const frame = useCurrentFrame();
  const liquidTop = 153 - fill * 14;
  const pipe = "M452 124 V141 H384";
  const cut = (
    <g>
      {/* the opening in the near wall */}
      <rect x="112" y="96" width="360" height="60" rx="10" fill="#FFFFFF" />
      <rect x="112" y="96" width="360" height="60" rx="10" fill="none" stroke={RED_DEEP} strokeWidth="3" opacity="0.35" />
      {/* floor */}
      <rect x="116" y="128" width="352" height="4" rx="2" fill={METAL} />
      {/* seat row with passengers */}
      <g transform="translate(130 100)">
        <SeatRow seat={22} highlight={highlightSeat} lit={lit} />
      </g>
      {/* the lavatory at the back, and its pipe down to the tank */}
      <g transform="translate(436 101) scale(0.72)">
        <IconPaths
          name="fluent-emoji-flat:toilet"
          recolor={{ "#B4ACBC": METAL, "#CDC4D6": "#F3F8FB" }}
        />
      </g>
      <path d={pipe} fill="none" stroke={METAL} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={pipe} fill="none" stroke={METAL_DARK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {pulse > 0.01 ? (
        <path
          d={pipe}
          fill="none"
          stroke={RUSH}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5 6"
          strokeDashoffset={-frame * 1.4}
          opacity={pulse}
        />
      ) : null}
      {/* arrow from the lit seat down into the tank */}
      {lit > 0.01 && highlightSeat >= 0 ? (
        <g opacity={lit}>
          <path d={`M${CUT.seatArrow(highlightSeat)} 118 V${130 + lit * 6}`} stroke={RUSH} strokeWidth="3.5" strokeLinecap="round" />
          <path d={`M${CUT.seatArrow(highlightSeat) - 5} ${131 + lit * 6} l5 6 l5 -6 Z`} fill={RUSH} />
        </g>
      ) : null}
      {/* the sealed tank under the floor */}
      {glow > 0.01 ? <rect x="220" y="131" width="166" height="28" rx="9" fill={RUSH} opacity={glow * 0.3} /> : null}
      <g style={{ filter: paperShadow(0) }}>
        <rect x="226" y="136" width="154" height="19" rx="6" fill={flash > 0.02 ? "#F6E8D8" : METAL_DARK} />
      </g>
      <rect x="229" y="138.5" width="148" height="14" rx="4.5" fill="#FFFFFF" />
      <clipPath id="cuttank">
        <rect x="229" y="138.5" width="148" height="14" rx="4.5" />
      </clipPath>
      <g clipPath="url(#cuttank)">
        <g transform={`rotate(${slosh} 303 152)`}>
          <path d={`M200 ${liquidTop - 1.5} Q 240 ${liquidTop - 4.5} 280 ${liquidTop - 1.5} T 360 ${liquidTop - 1.5} T 440 ${liquidTop - 1.5} V 170 H 200 Z`} fill={BLUE_DEEP} />
          <path d={`M190 ${liquidTop} Q 230 ${liquidTop - 3} 270 ${liquidTop} T 350 ${liquidTop} T 440 ${liquidTop} V 170 H 190 Z`} fill={BLUE} />
        </g>
      </g>
      {/* hatch on the underside — shut, until the truck */}
      <g transform={`translate(0 ${-1 + sealed}) rotate(${hatchOpen * 70} 292 157)`}>
        <rect x="292" y="154" width="22" height="5" rx="2.5" fill={METAL} />
      </g>
    </g>
  );
  return <PaperPlane w={w} onGround={onGround} bob={bob} nearWing={false} windows={false} cut={cut} />;
};
