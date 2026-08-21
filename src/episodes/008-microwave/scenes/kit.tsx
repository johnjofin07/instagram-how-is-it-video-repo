import React from "react";
import { useTheme } from "../../../themes";
import { FONTS } from "../../../theme";

// Episode 008 kit — "Your Microwave Has Cold Spots".
// Skin is the shared `kitchen` (light cream counter-top). The episode's own
// language is a THERMAL-CAMERA overlay staged inside a deliberately DARK
// cutaway cavity, so the hot/cold map glows against it (same trick `maps`
// uses for its dark panels inside a light skin).
//
// COLOR LAW (do not break): heat is ALWAYS the HOT -> HOT_CORE pair, cold is
// ALWAYS COLD. `theme.warn` is reserved for the fork-danger beat in `spark`
// and appears nowhere else. The hot/cold split IS the episode's argument.
//
// Everything here is deterministic: no Math.random / Date.now. Scatter uses
// the seeded hash idiom from src/components/Background.tsx.

export const HOT = "#FF6B4A"; // heat lobes
export const HOT_CORE = "#FFD166"; // lobe centers
export const COLD = "#4AA3FF"; // cold spots
export const STEEL = "#8E9BA6"; // microwave body
export const CAVITY = "#1E262CEE"; // cutaway interior (dark stage, light skin)

// supporting literals (not part of the hot/cold argument)
export const STEEL_DARK = "#5C6873";
export const STEEL_LIGHT = "#C3CCD3";
export const INK = "#3B2F26"; // warm charcoal outline, never black
export const GLASS = "#243038";
export const FOOD = "#B9AEA0"; // un-heated food grey
export const CHEESE = "#F2DFA6";
export const CHEESE_MELT = "#E8A93F";

// ---------------------------------------------------------------- seeded rng
// Same hash shape as Background.tsx's makeStars — deterministic per (i, n).
export const hash = (i: number, n: number) => {
  const s = Math.sin((i + 1) * 127.1 + n * 311.7 + 74.7) * 43758.5453;
  return s - Math.floor(s);
};

export const clampT = (t: number) => Math.min(1, Math.max(0, t));

export const mixHex = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const k = clampT(t);
  const m = pa.map((v, i) => Math.round(v + (pb[i] - v) * k));
  return `#${m.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

// ------------------------------------------------------- THE LOBE MAP (核)
// The single source of truth for where the standing wave's antinodes (hot)
// and nodes (cold) sit. Normalized 0..1 across the cavity width/height, so
// ANY component given the same rect lands on the same columns — that is how
// the cheese stripes in `spin` register perfectly under the heat lobes.
//
// These are the antinodes of a 3-half-wavelength standing wave with nodes at
// the metal walls: sin(3*pi*x/w) peaks at 1/6, 1/2, 5/6 and is zero at
// 1/3, 2/3. StandingWave uses the same k, so the lobes are literally born
// from the wave's peaks.
export const LOBE_COLS = [1 / 6, 1 / 2, 5 / 6];
export const COLD_COLS = [1 / 3, 2 / 3];
// Rows are symmetric about the cavity mid-line on purpose: they are the two
// extremes of the standing wave's envelope (amp = 0.21 * h), so the lobes in
// `waves` are literally drawn where the frozen wave's peaks reach.
export const LOBE_ROWS = [0.29, 0.71];
export const WAVE_AMP_RATIO = 0.105; // 2 * amp = 0.21h = the row offset
export const LOBES = LOBE_COLS.flatMap((x) => LOBE_ROWS.map((y) => ({ x, y })));
export const WAVE_K = 3 * Math.PI; // per unit width

// The interior stage shared by waves / spin / spark, so the lobe map lands on
// identical pixels in all three. INNER is the space between the metal walls —
// every normalized coordinate (LOBE_COLS, the wave, the tray) is relative to
// INNER, which is what makes the cheese stripes register under the lobes.
export const STAGE = { x: 90, y: 606, w: 900, h: 548 };
export const INNER = { x: STAGE.x + 22, w: STAGE.w - 44 };

// ------------------------------------------------------------------- typography
export const Stamp: React.FC<{
  children: React.ReactNode;
  fontSize?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, fontSize = 58, color, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        fontFamily: FONTS.sans,
        fontWeight: 900,
        fontSize,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        lineHeight: 1.16,
        color: color ?? theme.text,
        padding: "0 40px",
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
        borderRadius: 999,
        background: theme.card,
        border: `2px solid ${color ?? theme.cardBorder}`,
        boxShadow: theme.cardShadow,
        fontFamily: FONTS.mono,
        fontSize: 25,
        letterSpacing: "0.12em",
        color: color ?? theme.textDim,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ------------------------------------------------------------- microwave body
// Front elevation. viewBox is 640x400; the door window (== the cavity) is a
// fixed rect inside it, exported so scenes can compute the comp-space rect and
// drop lobes / turntables / food exactly inside it.
export const BODY_VB = { w: 640, h: 400 };
export const BODY_CAVITY = { x: 44, y: 52, w: 384, h: 296 };

export const cavityRect = (left: number, top: number, w: number) => {
  const s = w / BODY_VB.w;
  return {
    x: left + BODY_CAVITY.x * s,
    y: top + BODY_CAVITY.y * s,
    w: BODY_CAVITY.w * s,
    h: BODY_CAVITY.h * s,
  };
};

const MESH_DOTS: { x: number; y: number }[] = [];
for (let r = 0; r < 15; r++) {
  for (let c = 0; c < 20; c++) {
    MESH_DOTS.push({ x: 54 + c * 19 + (r % 2) * 9.5, y: 62 + r * 19 });
  }
}

// The dark hole itself — reused by both the cutaway and the open-door path.
const CavityHole: React.FC = () => (
  <g>
    <rect
      x={BODY_CAVITY.x}
      y={BODY_CAVITY.y}
      width={BODY_CAVITY.w}
      height={BODY_CAVITY.h}
      rx="10"
      fill={CAVITY}
    />
    <rect x={BODY_CAVITY.x} y={BODY_CAVITY.y} width="12" height={BODY_CAVITY.h} fill={STEEL_DARK} />
    <rect x={BODY_CAVITY.x + BODY_CAVITY.w - 12} y={BODY_CAVITY.y} width="12" height={BODY_CAVITY.h} fill={STEEL_DARK} />
    <rect x={BODY_CAVITY.x} y={BODY_CAVITY.y + BODY_CAVITY.h - 10} width={BODY_CAVITY.w} height="10" fill={STEEL_DARK} />
    <rect
      x={BODY_CAVITY.x}
      y={BODY_CAVITY.y}
      width={BODY_CAVITY.w}
      height={BODY_CAVITY.h}
      rx="10"
      fill="none"
      stroke={INK}
      strokeWidth="6"
      opacity="0.65"
    />
  </g>
);

export const MicrowaveBody: React.FC<{
  w?: number;
  open?: number; // 0..1 door swing (foreshortened about the left hinge)
  cutaway?: boolean;
  style?: React.CSSProperties;
}> = ({ w = 820, open = 0, cutaway = false, style }) => {
  const theme = useTheme();
  const h = (w * BODY_VB.h) / BODY_VB.w;
  const doorScale = 1 - clampT(open) * 0.86;
  const showInterior = cutaway || open > 0.02;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${BODY_VB.w} ${BODY_VB.h}`} style={style}>
      {/* shell */}
      <rect x="6" y="6" width="628" height="378" rx="26" fill={STEEL} stroke={INK} strokeWidth="5" />
      <rect x="16" y="16" width="608" height="358" rx="20" fill="#A4AFB8" />
      {/* feet */}
      <rect x="70" y="382" width="86" height="14" rx="7" fill={STEEL_DARK} />
      <rect x="484" y="382" width="86" height="14" rx="7" fill={STEEL_DARK} />

      {/* interior + door.
          cutaway: the door frame is drawn first and the dark cavity sits ON
          TOP of it (that is what a cut-open front looks like).
          open: the cavity is drawn BEHIND the door so the swing reveals it. */}
      {cutaway ? null : showInterior ? <CavityHole /> : null}

      <g transform={`translate(26 0) scale(${doorScale} 1) translate(-26 0)`} opacity={open > 0.9 ? 0 : 1}>
        <rect x="26" y="30" width="430" height="336" rx="16" fill={STEEL_LIGHT} stroke={STEEL_DARK} strokeWidth="5" />
        {cutaway ? null : (
          <>
            <rect
              x={BODY_CAVITY.x}
              y={BODY_CAVITY.y}
              width={BODY_CAVITY.w}
              height={BODY_CAVITY.h}
              rx="10"
              fill={GLASS}
            />
            <g fill={STEEL} opacity="0.62">
              {MESH_DOTS.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r="3.4" />
              ))}
            </g>
            <rect
              x={BODY_CAVITY.x}
              y={BODY_CAVITY.y}
              width={BODY_CAVITY.w}
              height={BODY_CAVITY.h}
              rx="10"
              fill="none"
              stroke={STEEL_DARK}
              strokeWidth="5"
            />
          </>
        )}
        <rect x="434" y="140" width="16" height="120" rx="8" fill={STEEL_DARK} />
      </g>

      {cutaway ? <CavityHole /> : null}

      {/* control panel */}
      <rect x="466" y="40" width="152" height="316" rx="12" fill="#79858F" stroke={STEEL_DARK} strokeWidth="4" />
      <rect x="482" y="58" width="120" height="54" rx="6" fill={GLASS} />
      <g fill={theme.accent}>
        <rect x="496" y="76" width="14" height="20" rx="2" />
        <rect x="516" y="76" width="14" height="20" rx="2" />
        <rect x="544" y="76" width="14" height="20" rx="2" />
        <rect x="564" y="76" width="14" height="20" rx="2" />
      </g>
      {[0, 1, 2, 3, 4].map((r) =>
        [0, 1, 2].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={486 + c * 40}
            y={132 + r * 42}
            width="30"
            height="30"
            rx="6"
            fill="#5B666F"
          />
        )),
      )}
    </svg>
  );
};

// ------------------------------------------------------------- cavity stage
// The dark interior blown up to fill the stage — used whenever a scene is
// "inside" the oven. Same wall language as MicrowaveBody's cutaway.
export const CavityStage: React.FC<{
  w: number;
  h: number;
  style?: React.CSSProperties;
}> = ({ w, h, style }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={style}>
    <rect x="0" y="0" width={w} height={h} rx="26" fill={CAVITY} />
    {/* the two metal mirrors the waves bounce between — deliberately bright,
        they are the whole reason a standing wave forms */}
    <rect x="0" y="0" width="22" height={h} rx="11" fill={STEEL} />
    <rect x="6" y="10" width="7" height={h - 20} rx="4" fill={STEEL_LIGHT} opacity="0.7" />
    <rect x={w - 22} y="0" width="22" height={h} rx="11" fill={STEEL} />
    <rect x={w - 13} y="10" width="7" height={h - 20} rx="4" fill={STEEL_LIGHT} opacity="0.7" />
    <rect x="0" y={h - 18} width={w} height="18" fill={STEEL_DARK} />
    <rect x="0" y="0" width={w} height="16" fill={STEEL_DARK} opacity="0.7" />
    <rect x="0" y="0" width={w} height={h} rx="26" fill="none" stroke={INK} strokeWidth="5" opacity="0.55" />
  </svg>
);

// ------------------------------------------------------------- standing wave
// dir = travelling direction. `frozen` stops the travel and pulses amplitude
// in place (2A sin(kx) cos(phase)) — that IS the standing-wave concept.
export const StandingWave: React.FC<{
  w: number;
  h?: number;
  phase: number;
  frozen?: boolean;
  mix?: number; // 0 = travelling, 1 = frozen. Overrides `frozen` when given.
  dir?: 1 | -1;
  amp?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ w, h = 240, phase, frozen = false, mix, dir = 1, amp, color = HOT, strokeWidth = 7, opacity = 1, style }) => {
  const A = amp ?? h * WAVE_AMP_RATIO;
  const m = clampT(mix ?? (frozen ? 1 : 0));
  const mid = h / 2;
  const pts: string[] = [];
  for (let x = 0; x <= w; x += 4) {
    const u = x / w;
    // continuous blend: travelling -> standing. No crossfade of two lines,
    // the single polyline morphs (this IS the superposition).
    const y =
      mid -
      ((1 - m) * A * Math.sin(WAVE_K * u - dir * phase) +
        m * 2 * A * Math.sin(WAVE_K * u) * Math.cos(phase));
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={style}>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
      />
    </svg>
  );
};

// ----------------------------------------------------------------- heat lobes
// 3 x 2 blobs at the LOBES const, with COLD gaps between them. Any two
// instances given the same rect land on the same pixels.
export const HeatLobes: React.FC<{
  w: number;
  h: number;
  on: number; // 0..1
  pulse?: number; // 0..1 extra breathing
  showCold?: boolean;
  outline?: boolean; // registration mode: rings only, so whatever is UNDER
  // the lobes (the cheese stripes) stays readable
  style?: React.CSSProperties;
}> = ({ w, h, on, pulse = 0, showCold = true, outline = false, style }) => {
  const k = clampT(on);
  if (k <= 0.001) return null;
  const rx = w * 0.15 * (0.86 + k * 0.14 + pulse * 0.07);
  const ry = h * 0.26 * (0.86 + k * 0.14 + pulse * 0.07);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={style}>
      <defs>
        <radialGradient id="mw-lobe">
          <stop offset="0%" stopColor="#FFF0C2" stopOpacity="1" />
          <stop offset="30%" stopColor={HOT_CORE} stopOpacity="1" />
          <stop offset="52%" stopColor={HOT} stopOpacity="0.7" />
          <stop offset="100%" stopColor={HOT} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mw-cold">
          <stop offset="0%" stopColor={COLD} stopOpacity="0.66" />
          <stop offset="55%" stopColor={COLD} stopOpacity="0.34" />
          <stop offset="100%" stopColor={COLD} stopOpacity="0" />
        </radialGradient>
      </defs>
      {showCold
        ? COLD_COLS.flatMap((cx) =>
            LOBE_ROWS.map((cy) => (
              <ellipse
                key={`c-${cx}-${cy}`}
                cx={cx * w}
                cy={cy * h}
                rx={rx * 0.86}
                ry={ry * 0.86}
                fill="url(#mw-cold)"
                opacity={k}
              />
            )),
          )
        : null}
      {LOBES.map((l) =>
        outline ? (
          <g key={`${l.x}-${l.y}`} opacity={k}>
            <ellipse
              cx={l.x * w}
              cy={l.y * h}
              rx={rx * 0.5}
              ry={ry * 0.5}
              fill="none"
              stroke={HOT_CORE}
              strokeWidth="6"
              strokeDasharray="16 12"
            />
            <ellipse cx={l.x * w} cy={l.y * h} rx={rx * 0.14} ry={ry * 0.14} fill={HOT_CORE} />
          </g>
        ) : (
          <ellipse
            key={`${l.x}-${l.y}`}
            cx={l.x * w}
            cy={l.y * h}
            rx={rx}
            ry={ry}
            fill="url(#mw-lobe)"
            opacity={k * (0.86 + pulse * 0.14)}
          />
        ),
      )}
    </svg>
  );
};

// ------------------------------------------------------------------ turntable
export const Turntable: React.FC<{
  size: number;
  angle: number; // degrees
  h?: number; // override the ellipse height (perspective squash)
  style?: React.CSSProperties;
}> = ({ size, angle, h: hOverride, style }) => {
  const w = size;
  const h = hOverride ?? size * 0.46;
  const cx = w / 2;
  const cy = h * 0.5;
  const rx = w * 0.46;
  const ry = h * 0.28;
  const a = (angle * Math.PI) / 180;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={style}>
      {/* roller ring */}
      <ellipse cx={cx} cy={cy + h * 0.2} rx={rx * 0.62} ry={ry * 0.62} fill="none" stroke={STEEL_DARK} strokeWidth="5" />
      {[0, 1, 2].map((i) => {
        const t = a * 1.6 + (i * Math.PI * 2) / 3;
        return (
          <circle
            key={i}
            cx={cx + rx * 0.62 * Math.cos(t)}
            cy={cy + h * 0.2 + ry * 0.62 * Math.sin(t)}
            r={size * 0.028}
            fill={STEEL_LIGHT}
            stroke={STEEL_DARK}
            strokeWidth="3"
          />
        );
      })}
      {/* glass plate */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(190,214,226,0.18)" stroke={STEEL_LIGHT} strokeWidth="4" opacity="0.62" />
      <ellipse cx={cx} cy={cy} rx={rx * 0.9} ry={ry * 0.9} fill="none" stroke={STEEL_LIGHT} strokeWidth="3" opacity="0.26" />
      {/* rotation tell: 4 etched marks that visibly travel round the rim */}
      {[0, 1, 2, 3].map((i) => {
        const t = a + (i * Math.PI) / 2;
        return (
          <circle
            key={`m${i}`}
            cx={cx + rx * 0.88 * Math.cos(t)}
            cy={cy + ry * 0.88 * Math.sin(t)}
            r={size * 0.018}
            fill={STEEL_LIGHT}
            opacity={0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t))}
          />
        );
      })}
    </svg>
  );
};

// ------------------------------------------------------------------ food plate
// 8 chunks on the plate ring. bites[i] = heat 0..1 (0 = stone cold: grey with
// a COLD outline + ice glint; 1 = HOT).
export const FoodPlate: React.FC<{
  size: number; // width — the ring x-span is always 0.5 +/- 0.325 of it, so
  // a plate given the cavity width lands its bites exactly on LOBE_COLS
  bites: number[];
  angle?: number; // degrees, rotates the ring with the turntable
  h?: number; // override the ellipse height (perspective squash)
  style?: React.CSSProperties;
}> = ({ size, bites, angle = 0, h: hOverride, style }) => {
  const w = size;
  const h = hOverride ?? size * 0.46;
  const cx = w / 2;
  const cy = h * 0.5;
  const rx = w * 0.325;
  const ry = h * 0.22;
  const a = (angle * Math.PI) / 180;
  const chunk = h * 0.13;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={style}>
      {bites.map((heat, i) => {
        const t = a + (i * Math.PI * 2) / bites.length;
        const px = cx + rx * Math.cos(t);
        const py = cy + ry * Math.sin(t);
        const cold = heat < 0.18;
        const fill = mixHex(FOOD, HOT_CORE, heat);
        const depth = 0.55 + 0.45 * Math.sin(t); // fake front/back sorting
        return (
          <g key={i} opacity={0.72 + depth * 0.28}>
            {heat > 0.2 ? (
              <ellipse cx={px} cy={py} rx={chunk * 1.9} ry={chunk * 1.6} fill={HOT} opacity={heat * 0.4} />
            ) : null}
            <rect
              x={px - chunk}
              y={py - chunk * 0.85}
              width={chunk * 2}
              height={chunk * 1.7}
              rx={chunk * 0.55}
              fill={fill}
              stroke={cold ? COLD : INK}
              strokeWidth={cold ? 5 : 3.5}
            />
            {cold ? (
              <g stroke={COLD} strokeWidth="4" strokeLinecap="round" opacity="0.95">
                <line x1={px - chunk * 0.5} y1={py - chunk * 1.5} x2={px + chunk * 0.5} y2={py - chunk * 1.5} />
                <line x1={px} y1={py - chunk * 1.9} x2={px} y2={py - chunk * 1.1} />
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

// ------------------------------------------------------------------ cheese tray
// The money shot. `melt` 0..1 grows molten stripes ONLY at LOBE_COLS — the
// same normalized columns HeatLobes uses, so the overlay registers exactly.
// Jittered grid, not pure noise: a raw hash scatter clumped left and left the
// right third bare (caught in QA). 13 columns x 4 rows, each nudged by hash.
const SHRED_COLS = 13;
const SHRED_ROWS = 4;
const SHREDS = Array.from({ length: SHRED_COLS * SHRED_ROWS }, (_, i) => {
  const c = i % SHRED_COLS;
  const r = Math.floor(i / SHRED_COLS);
  return {
    u: 0.045 + ((c + 0.5) / SHRED_COLS) * 0.91 + (hash(i, 1) - 0.5) * 0.045,
    v: 0.18 + ((r + 0.5) / SHRED_ROWS) * 0.64 + (hash(i, 2) - 0.5) * 0.1,
    rot: -46 + hash(i, 3) * 92,
    len: 0.65 + hash(i, 4) * 0.75,
    lag: hash(i, 5) * 0.35,
  };
});

export const CheeseTray: React.FC<{
  w: number;
  melt: number; // 0..1
  style?: React.CSSProperties;
}> = ({ w, melt, style }) => {
  const h = w * 0.46;
  const m = clampT(melt);
  const bandW = w * 0.135;
  const shredW = w * 0.023;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={style}>
      <defs>
        {/* molten CHEESE, not heat: the field keeps HOT / HOT_CORE to itself */}
        <linearGradient id="mw-molten" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#C97F2C" />
          <stop offset="42%" stopColor={CHEESE_MELT} />
          <stop offset="100%" stopColor="#B96E22" />
        </linearGradient>
      </defs>
      {/* tray */}
      <rect x="0" y="0" width={w} height={h} rx="22" fill="#D9DEE2" stroke={STEEL_DARK} strokeWidth="6" />
      <rect x="14" y="14" width={w - 28} height={h - 28} rx="14" fill="#EFEDE6" stroke={STEEL_LIGHT} strokeWidth="4" />

      {/* molten stripes — grow from the vertical center outward */}
      {LOBE_COLS.map((c, i) => {
        const grow = clampT((m - i * 0.06) / 0.7);
        if (grow <= 0.01) return null;
        const bh = (h - 96) * grow;
        return (
          <rect
            key={c}
            x={c * w - bandW / 2}
            y={h / 2 - bh / 2}
            width={bandW}
            height={bh}
            rx={bandW * 0.34}
            fill="url(#mw-molten)"
            opacity={0.62 + grow * 0.3}
          />
        );
      })}

      {/* shreds */}
      {SHREDS.map((s, i) => {
        const near = Math.min(...LOBE_COLS.map((c) => Math.abs(s.u - c)));
        const inBand = near < 0.085;
        const t = inBand ? clampT((m - s.lag) / 0.55) : 0;
        const fill = mixHex(CHEESE, CHEESE_MELT, t);
        const len = shredW * s.len * 3.2 * (1 + t * 0.5);
        return (
          <rect
            key={i}
            x={s.u * w - len / 2}
            y={s.v * h - shredW / 2}
            width={len}
            height={shredW * (1 - t * 0.35)}
            rx={shredW * 0.5}
            fill={fill}
            stroke={INK}
            strokeWidth={2.4}
            opacity={0.92}
            transform={`rotate(${s.rot * (1 - t * 0.7)} ${s.u * w} ${s.v * h})`}
          />
        );
      })}
      <rect x="0" y="0" width={w} height={h} rx="22" fill="none" stroke={STEEL_DARK} strokeWidth="6" />
    </svg>
  );
};

// -------------------------------------------------------------------- meshzoom
// Circular magnifier over the door mesh. Left half = dark oven interior,
// right half = your kitchen. A thin `accent` squiggle (small enough to fit a
// hole) sails through; a fat HOT wave arc (>= 6x hole width) slams into the
// plate and rebounds. THE SIZE CONTRAST IS THE GAG — the arc must dwarf the
// holes at delivery scale, so strokes are deliberately heavy.
const HEX_R = 27; // circumradius -> hole width ~54px (flat-to-flat 46.8)
const hexPath = (cx: number, cy: number, r: number) => {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 90);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
};

export const MeshZoom: React.FC<{
  size: number;
  waveScale?: number;
  lightT?: number; // 0..1 squiggle travel (left -> through a hole -> out)
  waveT?: number; // 0..1 approach -> flatten on the plate -> rebound
  glint?: number; // 0..1 metal glint sweep
  style?: React.CSSProperties;
}> = ({ size, waveScale = 1, lightT = 0, waveT = 0, glint = 0, style }) => {
  const theme = useTheme();
  const R = size / 2;
  const plateW = size * 0.26;
  const plateX = R - plateW / 2;
  const holeR = HEX_R;
  const hStep = Math.sqrt(3) * holeR + 12; // ~58.8
  const vStep = 1.5 * holeR + 11; // ~51.5

  // Grid anchored so ONE hole sits exactly at the magnifier center — that is
  // the hole the light squiggle threads through.
  const rowsN = Math.ceil(size / vStep) + 2;
  const colsN = Math.ceil(plateW / hStep) + 2;
  const rMid = Math.floor(rowsN / 2);
  const cMid = Math.floor(colsN / 2);
  const holes: { x: number; y: number }[] = [];
  for (let r = 0; r < rowsN; r++) {
    for (let c = 0; c < colsN; c++) {
      holes.push({
        x: R + (c - cMid) * hStep + (Math.abs(r - rMid) % 2) * hStep * 0.5,
        y: R + (r - rMid) * vStep,
      });
    }
  }

  // The light: total length == one hole width, amplitude well under it.
  const sq = clampT(lightT);
  const sqW = holeR * 2; // 54px
  const sqX = -sqW + sq * (size + sqW * 2);
  const sqPts: string[] = [];
  for (let i = 0; i <= 14; i++) {
    const x = (i / 14) * sqW;
    sqPts.push(`${x.toFixed(1)},${(Math.sin((i / 14) * Math.PI * 2) * 9).toFixed(1)}`);
  }

  // The wave: front spans >= 6x the hole width. It cannot thread a hole, so
  // it squashes against the plate and rebounds.
  const wv = clampT(waveT);
  const arcW = holeR * 2 * 6.6 * waveScale; // >= 6x the hole width
  // ramp in, HOLD against the plate, then rebound only part-way — a full
  // retreat put the arc off the clip circle and the gag vanished (seen in QA).
  const approach =
    wv < 0.45 ? wv / 0.45 : wv < 0.62 ? 1 : 1 - ((wv - 0.62) / 0.38) * 0.75;
  const squash = wv > 0.36 && wv < 0.64 ? 1 - Math.abs(wv - 0.5) / 0.14 : 0;
  const arcRy = arcW / 2;
  const arcRx = (arcW / 2) * (1 - clampT(squash) * 0.34);
  const tipX = plateX - 3 - (1 - approach) * 230;
  const arcAt = (back: number) => {
    const rx2 = arcRx - back;
    return `M ${tipX - back - rx2} ${R - arcRy} A ${rx2} ${arcRy} 0 0 1 ${tipX - back - rx2} ${R + arcRy}`;
  };
  const arcD = arcAt(0);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={style}>
      <defs>
        <clipPath id="mw-mag">
          <circle cx={R} cy={R} r={R - 12} />
        </clipPath>
        <clipPath id="mw-plate">
          <rect x={plateX} y="0" width={plateW} height={size} />
        </clipPath>
      </defs>
      <g clipPath="url(#mw-mag)">
        {/* left = inside the oven, right = your kitchen */}
        <rect x="0" y="0" width={R} height={size} fill={CAVITY} />
        <rect x={R} y="0" width={R} height={size} fill="#FBF6EC" />

        {/* the metal plate with its hex holes */}
        <rect x={plateX} y="0" width={plateW} height={size} fill={STEEL} />
        <g clipPath="url(#mw-plate)">
          <g fill={CAVITY}>
            {holes.map((hp, i) => (
              <path key={i} d={hexPath(hp.x, hp.y, holeR)} />
            ))}
          </g>
          <g stroke={STEEL_DARK} strokeWidth="4" fill="none" opacity="0.8">
            {holes.map((hp, i) => (
              <path key={i} d={hexPath(hp.x, hp.y, holeR)} />
            ))}
          </g>
          {glint > 0.01 ? (
            <rect
              x={plateX - 40 + glint * (plateW + 80)}
              y="0"
              width="34"
              height={size}
              fill="#FFFFFF"
              opacity={0.55 * Math.sin(Math.PI * glint)}
            />
          ) : null}
        </g>
        <rect x={plateX} y="0" width="5" height={size} fill={STEEL_DARK} />
        <rect x={plateX + plateW - 5} y="0" width="5" height={size} fill={STEEL_DARK} />

        {/* the fat wave that cannot fit */}
        {wv > 0.005 ? (
          <g opacity={0.55 + clampT(approach) * 0.45}>
            {[62, 32].map((back) => (
              <path key={back} d={arcAt(back)} fill="none" stroke={HOT} strokeWidth={12} strokeLinecap="round" opacity={back > 40 ? 0.42 : 0.68} />
            ))}
            <path d={arcD} fill="none" stroke={HOT} strokeWidth={22} strokeLinecap="round" />
            <path d={arcD} fill="none" stroke={HOT_CORE} strokeWidth={8} strokeLinecap="round" opacity="0.9" />
          </g>
        ) : null}

        {/* the thin light that slips straight through */}
        {sq > 0.005 ? (
          <g transform={`translate(${sqX} ${R})`}>
            <polyline
              points={sqPts.join(" ")}
              fill="none"
              stroke={theme.accent}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ) : null}
      </g>
      {/* magnifier rim */}
      <circle cx={R} cy={R} r={R - 12} fill="none" stroke={STEEL_DARK} strokeWidth="16" />
      <circle cx={R} cy={R} r={R - 23} fill="none" stroke={STEEL_LIGHT} strokeWidth="5" opacity="0.65" />
    </svg>
  );
};

// -------------------------------------------------------------------- fieldlines
// 6 faint lines bending toward a point — the field crowding onto the tines.
export const FieldLines: React.FC<{
  w: number;
  h: number;
  focus: { x: number; y: number };
  converge: number; // 0..1
  style?: React.CSSProperties;
}> = ({ w, h, focus, converge, style }) => {
  const theme = useTheme();
  const k = clampT(converge);
  const lanes = [0.14, 0.34, 0.54, 0.74, 0.9];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={style}>
      {lanes.flatMap((lane, i) =>
        [-1, 1].map((side) => {
          const y0 = lane * h;
          const x0 = side < 0 ? 0 : w;
          // the far end walks from "straight past" to "hooked into the tip"
          const endX = x0 + (focus.x - x0) * k;
          const endY = y0 + (focus.y - y0) * k;
          const cX = x0 + (focus.x - x0) * (0.55 + k * 0.3);
          const cY = y0;
          return (
            <path
              key={`${i}-${side}`}
              d={`M${x0} ${y0} Q ${cX} ${cY} ${endX} ${endY}`}
              fill="none"
              stroke={k > 0.5 ? HOT : theme.lineFaint}
              strokeWidth={4 + k * 3}
              strokeLinecap="round"
              opacity={(0.22 + k * 0.62) * (k > 0.5 ? 1 : 0.8)}
            />
          );
        }),
      )}
    </svg>
  );
};

// ------------------------------------------------------------------- fork spark
// Fork silhouette, tines down. `strike` 0..1 flashes 3 jagged bolts off the
// tine tips. `glow` warms the tips before the strike.
//
// LOOP GLYPH: this is the ONE fork drawing in the episode. The hook's rehook
// tease (small, boltCount 1) and the `spark` payoff (large, boltCount 3) are
// the same component so the open loop visibly closes on the same object.
// `boltCount` trims how many tines fire — 1 = the hook's micro-spark.
const BOLTS = [
  "M0 0 L-22 38 L4 46 L-16 104",
  "M0 0 L18 34 L-6 44 L20 98",
  "M0 0 L-6 40 L18 48 L0 110",
];
const BOLT_TINES = [0, 1, 3];

export const ForkSpark: React.FC<{
  size: number;
  strike: number; // 0..1
  glow?: number; // 0..1
  boltCount?: number; // 1..3 — how many tines fire (1 = the hook's micro-spark)
  style?: React.CSSProperties;
}> = ({ size, strike, glow = 0, boltCount = 3, style }) => {
  const w = size;
  const h = size * 1.35;
  const s = clampT(strike);
  const g = clampT(glow);
  const tineX = [w * 0.32, w * 0.44, w * 0.56, w * 0.68];
  const tineTop = h * 0.42;
  const tipY = h * 0.74;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={style}>
      {/* handle */}
      <rect
        x={w * 0.452}
        y={h * 0.02}
        width={w * 0.096}
        height={h * 0.28}
        rx={w * 0.048}
        fill={STEEL_LIGHT}
        stroke={INK}
        strokeWidth="4"
      />
      {/* neck flaring into the head */}
      <path
        d={`M${w * 0.452} ${h * 0.28} L${w * 0.548} ${h * 0.28} L${w * 0.7} ${tineTop} L${w * 0.3} ${tineTop} Z`}
        fill={STEEL_LIGHT}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* tines */}
      {tineX.map((x, i) => (
        <g key={i}>
          <rect
            x={x - w * 0.03}
            y={tineTop - 6}
            width={w * 0.06}
            height={tipY - tineTop + 6}
            rx={w * 0.028}
            fill={STEEL_LIGHT}
            stroke={INK}
            strokeWidth="4"
          />
          {g > 0.02 ? (
            <circle cx={x} cy={tipY} r={w * 0.045 * (0.6 + g * 0.55)} fill={HOT_CORE} opacity={g * 0.9} />
          ) : null}
        </g>
      ))}
      {/* bolts */}
      {s > 0.02
        ? BOLTS.slice(0, Math.max(1, Math.min(3, boltCount))).map((d, i) => (
            <g
              key={i}
              transform={`translate(${tineX[BOLT_TINES[i]]} ${tipY}) scale(${(w / 260) * (0.9 + s * 0.3)})`}
              opacity={s}
            >
              <path d={d} fill="none" stroke={HOT} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
              <path d={d} fill="none" stroke={HOT_CORE} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d={d} fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))
        : null}
    </svg>
  );
};
