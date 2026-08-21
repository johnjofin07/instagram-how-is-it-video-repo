import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";

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

// ── PaperPlane — the red papercraft model ─────────────────────────────────
// Same viewBox + lavatory-mark coordinates as v2 so the dive math holds.
export const PLANE_VB = { w: 640, h: 260 } as const;
export const LAV_MARK = { x: 476, y: 128 } as const;
export const PaperPlane: React.FC<{
  w?: number;
  markOn?: number;
  onGround?: boolean;
  bob?: boolean;
}> = ({ w = 640, markOn = 0, onGround = false, bob = true }) => {
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
        <g style={{ filter: paperShadow(0) }}>
          <rect x="108" y="106" width="404" height="34" rx="17" fill="#FFFFFF" />
        </g>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <circle key={i} cx={146 + i * 52} cy="123" r="8" fill={INK} />
        ))}
        {/* cockpit window */}
        <path d="M52 106 Q68 96 92 96 L88 118 L56 122 Z" fill={INK} />

        {/* near wing, over the body — the highest paper layer */}
        <g style={{ filter: paperShadow(2) }}>
          <path d="M236 122 L142 216 L216 216 L318 128 Z" fill={RED} />
        </g>
        {/* engine nacelle hanging under the wing */}
        <g style={{ filter: paperShadow(1) }}>
          <rect x="196" y="172" width="74" height="30" rx="15" fill="#FFFFFF" />
          <rect x="196" y="172" width="16" height="30" rx="8" fill={INK} />
        </g>

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

// ── ValveVoid — a window cut clean through the diorama to the thin sky ────
export const ValveVoid: React.FC<{ w: number; h: number; reveal: number }> = ({ w, h, reveal }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: VOID,
          borderRadius: 18,
          boxShadow: "inset 0 8px 22px rgba(0, 0, 0, 0.45)",
          opacity: reveal,
        }}
      />
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, opacity: reveal }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx={40 + rnd(i, 1, 9) * (w - 80) + Math.sin(frame / 47 + i * 2) * 9}
            cy={40 + rnd(i, 2, 9) * (h - 80) + Math.cos(frame / 61 + i * 3) * 7}
            r={2.6}
            fill={AIR_LIT}
            opacity={0.6}
          />
        ))}
      </svg>
    </div>
  );
};

// The bowl interior profile, kept for the RUSH sweeps in scene 2.
export const BOWL_PATH = "M120 92 H344 V196 Q344 322 232 322 Q120 322 120 196 Z";

// ── LavCutaway — the lavatory as stacked paper pieces ─────────────────────
export const LavCutaway: React.FC<{
  w: number;
  valveOpen: number;
  press: number;
  scrub?: number;
  stub?: boolean;
}> = ({ w, valveOpen, press, scrub = 0, stub = true }) => {
  const h = w * 0.86;
  return (
    <svg width={w} height={h} viewBox="0 0 520 448" style={{ position: "absolute", overflow: "visible" }}>
      {/* housing piece */}
      <g style={{ filter: paperShadow(1) }}>
        <path d="M40 60 H430 V150 H360 V196 Q360 340 232 340 Q104 340 104 196 V60 Z" fill="#FFFFFF" />
      </g>
      {/* seat rim strip */}
      <g style={{ filter: paperShadow(0) }}>
        <rect x="100" y="52" width="264" height="16" rx="8" fill={METAL_DARK} />
      </g>
      {/* bowl interior piece */}
      <path d={BOWL_PATH} fill={INTERIOR} />
      {scrub > 0 ? (
        <path
          d={BOWL_PATH}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeDasharray="120 460"
          strokeDashoffset={-scrub * 580}
          opacity={0.95}
        />
      ) : null}
      {/* flush button — orange paper dot on a pale plate */}
      <g style={{ filter: paperShadow(1) }}>
        <rect x="364" y={76 + press * 8} width="60" height="36" rx="12" fill={METAL_DARK} />
      </g>
      <rect x="376" y={86 + press * 8} width="36" height="16" rx="8" fill={RUSH} />
      {/* drain throat + valve flap */}
      <path d="M192 322 H272 V376 H192 Z" fill={INTERIOR} />
      <g transform={`rotate(${-82 * valveOpen} 196 372)`} style={{ filter: paperShadow(1) }}>
        <rect x="188" y="362" width="90" height="18" rx="9" fill={METAL} />
      </g>
      {/* pipe stub heading for the belly */}
      {stub ? (
        <g style={{ filter: paperShadow(0) }}>
          <path d="M196 372 V420 H500" fill="none" stroke={METAL} strokeWidth="26" strokeLinecap="round" />
          <path d="M196 372 V420 H500" fill="none" stroke={METAL_DARK} strokeWidth="14" strokeLinecap="round" />
        </g>
      ) : null}
    </svg>
  );
};

// ── CupVsGallons — paper cutouts ──────────────────────────────────────────
export const CupVsGallons: React.FC<{ cupIn: number; collapse: number }> = ({
  cupIn,
  collapse,
}) => {
  const theme = useTheme();
  return (
    <svg width="300" height="360" viewBox="0 0 300 360" style={{ position: "absolute", overflow: "visible" }}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const gone = interpolate(collapse, [i * 0.09, i * 0.09 + 0.4], [1, 0], clamp);
        if (gone <= 0.01) return null;
        return (
          <g
            key={i}
            opacity={gone}
            transform={`translate(${168 + col * 62} ${28 + row * 84 + (1 - gone) * 26})`}
            style={{ filter: paperShadow(1) }}
          >
            <rect x="0" y="10" width="50" height="64" rx="10" fill={METAL_DARK} />
            <rect x="17" y="0" width="16" height="14" rx="5" fill={METAL} />
          </g>
        );
      })}
      <g opacity={cupIn} transform={`translate(28 ${190 + (1 - cupIn) * 22})`} style={{ filter: paperShadow(2) }}>
        <path d="M6 8 H84 L74 88 H16 Z" fill="#FFFFFF" />
        <path d="M11 44 H79 L74 88 H16 Z" fill={BLUE} />
      </g>
      <text x="70" y="322" textAnchor="middle" fill={BLUE_DEEP} fontFamily={FONTS.sans} fontWeight="800" fontSize="27" letterSpacing="2">
        ONE CUP
      </text>
      <text x="222" y="322" textAnchor="middle" fill={theme.textDim} fontFamily={FONTS.sans} fontWeight="800" fontSize="27" letterSpacing="2" opacity={1 - collapse}>
        GALLONS
      </text>
    </svg>
  );
};

// ── BellyTank — the red plane in cross-section, paper ring + paper waves ──
export const BellyTank: React.FC<{
  w: number;
  fill: number;
  slosh: number;
  flash?: number;
  sealed?: number;
  passengers?: boolean;
}> = ({ w, fill, slosh, flash = 0, sealed = 0, passengers = false }) => {
  const h = w * 0.7;
  const liquidTop = 372 - fill * 96;
  return (
    <svg width={w} height={h} viewBox="0 0 700 490" style={{ position: "absolute", overflow: "visible" }}>
      {/* red hull ring: red ellipse with a white interior piece on top */}
      <g style={{ filter: paperShadow(2) }}>
        <ellipse cx="350" cy="250" rx="330" ry="228" fill={RED} />
      </g>
      <ellipse cx="350" cy="250" rx="296" ry="196" fill="#FFFFFF" />
      {/* cabin floor strip */}
      <g style={{ filter: paperShadow(0) }}>
        <rect x="62" y="242" width="576" height="12" rx="6" fill={METAL} />
      </g>
      {passengers
        ? [0, 1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(${152 + i * 100} 150)`} style={{ filter: paperShadow(0) }}>
              <path d="M0 96 V46 Q0 30 16 30 H44 Q60 30 60 46 V96 Z" fill={METAL_DARK} />
              <circle cx="30" cy="14" r="15" fill={INK} />
            </g>
          ))
        : null}
      {/* windows punched in the hull */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={128 + i * 130} y="96" width="44" height="30" rx="14" fill={VOID} />
      ))}
      {/* the sealed tank */}
      <g style={{ filter: paperShadow(1) }}>
        <rect x="150" y="284" width="400" height="100" rx="24" fill={flash > 0.02 ? "#F6E8D8" : METAL_DARK} />
      </g>
      <rect x="162" y="294" width="376" height="82" rx="18" fill="#FFFFFF" />
      {/* liquid: deep wave layer behind, bright layer in front — paper waves */}
      <clipPath id="tankclip">
        <rect x="162" y="294" width="376" height="82" rx="18" />
      </clipPath>
      <g clipPath="url(#tankclip)">
        <g transform={`rotate(${slosh} 350 372)`}>
          <path
            d={`M60 ${liquidTop - 7} Q 170 ${liquidTop - 21} 280 ${liquidTop - 7} T 500 ${liquidTop - 7} T 700 ${liquidTop - 7} V 470 H 60 Z`}
            fill={BLUE_DEEP}
          />
          <path
            d={`M40 ${liquidTop} Q 150 ${liquidTop - 13} 260 ${liquidTop} T 480 ${liquidTop} T 700 ${liquidTop} V 470 H 40 Z`}
            fill={BLUE}
          />
        </g>
      </g>
      {/* hatch, sealed */}
      <g transform={`translate(0 ${-4 + sealed * 4})`} style={{ filter: paperShadow(1) }}>
        <rect x="316" y="376" width="68" height="18" rx="8" fill={METAL} />
      </g>
    </svg>
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

// ── HandPress — a cut-paper hand: index piece under a palm piece ──────────
// Fingertip at viewBox (34, 206); `press` drives the downward travel.
export const HandPress: React.FC<{ size?: number; press?: number }> = ({
  size = 190,
  press = 1,
}) => {
  const w = size;
  const h = size * 1.15;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 200 230"
      style={{ position: "absolute", overflow: "visible", transform: `translateY(${press * 12}px)` }}
    >
      {/* index finger — its own paper piece, lower layer */}
      <g style={{ filter: paperShadow(1) }}>
        <path d="M84 58 Q56 62 48 86 L26 172 Q21 193 34 201 Q48 210 60 191 L100 118 Z" fill={SKIN} />
      </g>
      {/* palm piece with curled-finger scallops cut into its lower edge */}
      <g style={{ filter: paperShadow(2) }}>
        <path
          d="M206 4 Q158 -6 124 12 Q92 30 82 60 Q74 92 96 110
             Q100 132 116 130 Q128 128 130 112
             Q134 134 150 132 Q162 130 162 112
             Q168 132 182 128 Q192 125 192 108
             L206 92 Z"
          fill={SKIN}
        />
      </g>
      {/* thumb piece across the palm */}
      <g style={{ filter: paperShadow(2) }}>
        <path d="M96 42 Q64 48 58 76 Q54 98 74 104 Q92 108 100 92 Q106 78 100 62 Z" fill="#E9C6A4" />
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
