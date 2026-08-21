import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";

// ---------------------------------------------------------------------------
// Episode 010 — "The Close Button In Your Elevator Is a Dummy" — episode kit.
//
// COLOR LAW (never blur this — see EPISODE-PLANS.md §010.3):
//   theme.accent  deep teal  = THE ALGORITHM. Route lines, the dispatcher's
//                              plan, destination groupings, the door timer.
//                              Everything invisible and thinking.
//   theme.second  brass      = THE MACHINE + THE HUMAN RITUAL. Buttons, doors,
//                              the car, the firefighter key. Everything you
//                              can touch.
//   Teal thinks, brass moves.
//
// LIGHT-SKIN / DARK-STAGE CONTRAST (measured against the `lobby` skin's own
// audit, all ratios computed with the WCAG relative-luminance formula):
//
//   on MARBLE / bg #EFEBE3 : theme.text 13.3 · accent #0C6660 5.7
//                            second #866224 4.7 · accentDim 3.0 (strokes only)
//   on SHAFT   #2B2620     : second #866224 is 2.7  <-- FAILS. Never use it
//                            straight on the shaft.
//                            BRASS_LIT #C8A24A -> 6.2  (use this inside)
//                            TEAL_LIT  #5FB3AA -> 6.1  (use this inside)
//                            theme.accent      -> 2.2  <-- FAILS inside.
//   BRASS_LIT on marble is 2.0 and TEAL_LIT on marble is 2.1 — both are
//   DARK-STAGE-ONLY values. The rule is simply: light ground -> theme tokens,
//   dark ground (SHAFT / cab shell) -> the *_LIT consts below.
// ---------------------------------------------------------------------------

export const MARBLE = "#E4DFD4"; // wall panels / floor slabs
export const MARBLE_DARK = "#D2CBBA"; // slab shading, edges
export const MARBLE_EDGE = "#B9B1A0"; // slab top lip
export const SHAFT = "#2B2620"; // shaft interior — the dark stage
export const SHAFT_DEEP = "#201C17"; // recessed shaft detail
export const STEEL_DOOR = "#C8C2B4";
export const STEEL_EDGE = "#A29A8A";

// The one brass value bright enough for the dark shaft interior (the rgb of
// the skin's `brandGlow`). 6.2:1 on SHAFT, 2.0:1 on marble — dark ground only.
export const BRASS_LIT = "#C8A24A";
export const BRASS_DEEP = "#5C4718"; // engraved glyphs on a brass plate
export const PLATE = "#D8C79B"; // button-plate face (light brass)
export const PLATE_DARK = "#BCA470"; // plate bezel
export const CAB_LIGHT = "#F6F0E0"; // lit cab interior (so riders read inside)

// Teal for the dark stage only — 6.1:1 on SHAFT, 2.1:1 on marble.
export const TEAL_LIT = "#5FB3AA";
// Same problem for `warn`: #B23A0A is 2.5:1 on SHAFT. This is 5.6:1 there.
// Currently unused — the zig-zag beat ended up plotted on light marble, where
// theme.warn works straight — but keep it: any warn ink drawn INSIDE the shaft
// must use this, not the token.
export const WARN_LIT = "#E8834E";

// Riders whose destination doesn't matter yet (hook / rule) are neutral warm
// slate: 6.4:1 on marble, and it never collides with `warn` (the stranded
// rider's blink) the way a rust rider would.
export const RIDER_NEUTRAL = "#57534A";

// --------------------------------------------------------- destination palette
// Four DESTINATION groups for the `sort` scene. Constraints they had to meet:
//   1. legible on the light marble ground #EFEBE3 (all >= 4.5:1, i.e. they'd
//      pass even as *text*, not just as graphics)
//   2. pairwise separable — hues are 15 / 74 / 176 / 310 deg, so no two sit
//      within 60 deg of each other
//   3. separable from the episode's structural colors: brass #866224 is hue
//      38 deg, so OLIVE was pushed to 74 deg (yellow-green, not gold) and RUST
//      to 15 deg (red-orange, not amber)
//   4. RUST is deliberately NOT the skin's `warn` #B23A0A — warn stays
//      reserved for the stranded-rider beat
// Measured contrast on #EFEBE3:  TEAL 5.7 · PLUM 5.3 · OLIVE 4.5 · RUST 5.1
export const DEST = {
  teal: "#0C6660",
  plum: "#8E4680",
  olive: "#5F7320",
  rust: "#A34526",
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// NOTE ON DETERMINISM: this episode contains no scatter at all — every
// position is an explicit number — so there is deliberately no Math.random()
// and no seeded-hash helper here. If a future beat needs scatter, copy the
// `makeStars` hash idiom from src/components/Background.tsx.

// ------------------------------------------------------------------ type bits
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
        padding: "10px 24px",
        borderRadius: 999,
        background: theme.card,
        border: `2px solid ${color ?? theme.cardBorder}`,
        boxShadow: theme.cardShadow,
        fontFamily: FONTS.mono,
        fontSize: 26,
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

export const Stamp: React.FC<{
  children: React.ReactNode;
  color?: string;
  fontSize?: number;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ children, color, fontSize = 46, rotate = -2, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: "inline-block",
        padding: "16px 30px",
        border: `4px solid ${color ?? theme.accent}`,
        borderRadius: 14,
        background: "rgba(255, 255, 255, 0.88)",
        boxShadow: theme.cardShadow,
        fontFamily: FONTS.mono,
        fontWeight: 700,
        fontSize,
        lineHeight: 1.14,
        letterSpacing: "0.12em",
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

// --------------------------------------------------------------- the building
export type BuildingLayout = {
  w: number;
  h: number;
  floors: number;
  shafts: number;
  floorH: number;
  shaftW: number;
  shaftGap: number;
  numberCol: number;
  /** local x of shaft i's left edge */
  shaftX: (i: number) => number;
  /** local x of shaft i's center */
  shaftCx: (i: number) => number;
  /** local y of the slab surface a rider on floor f stands on (1 = ground) */
  floorFloor: (f: number) => number;
  /** local y of the vertical center of floor f */
  floorCy: (f: number) => number;
  /** local x where the landing (waiting) area ends */
  landingRight: number;
};

export const buildingLayout = (opts: {
  w: number;
  h: number;
  floors?: number;
  shafts?: number;
}): BuildingLayout => {
  const { w, h } = opts;
  const floors = opts.floors ?? 8;
  const shafts = opts.shafts ?? 1;
  const floorH = h / floors;
  const shaftW = shafts === 1 ? 208 : shafts === 2 ? 178 : 150;
  const shaftGap = 22;
  const numberCol = 64;
  const total = shafts * shaftW + (shafts - 1) * shaftGap;
  const shaftLeft = w - 28 - total;
  const shaftX = (i: number) => shaftLeft + i * (shaftW + shaftGap);
  return {
    w,
    h,
    floors,
    shafts,
    floorH,
    shaftW,
    shaftGap,
    numberCol,
    shaftX,
    shaftCx: (i) => shaftX(i) + shaftW / 2,
    floorFloor: (f) => h - (f - 1) * floorH,
    floorCy: (f) => h - (f - 1) * floorH - floorH / 2,
    landingRight: shaftLeft - 10,
  };
};

// Cutaway set piece: marble slabs, dark shaft columns, floor numbers.
// `xray` draws it as a faint outline only, so the light-ground teal route
// lines can be drawn straight over the marble wall (theme.accent is 5.7:1
// there but only 2.2:1 inside a filled shaft — see the contrast note above).
export const BuildingSection: React.FC<{
  layout: BuildingLayout;
  numberEvery?: number;
  numbered?: number[];
  xray?: number; // 0 = solid cutaway, 1 = faint schematic
  marks?: { floor: number; shaft: number; color: string }[];
  style?: React.CSSProperties;
}> = ({ layout: L, numberEvery = 1, numbered, xray = 0, marks = [], style }) => {
  const theme = useTheme();
  const solid = 1 - xray;
  const floorList = Array.from({ length: L.floors }, (_, i) => i + 1);
  const shaftList = Array.from({ length: L.shafts }, (_, i) => i);
  const showNumber = (f: number) =>
    numbered ? numbered.includes(f) : f % numberEvery === 0 || f === 1;

  return (
    <svg
      width={L.w}
      height={L.h}
      viewBox={`0 0 ${L.w} ${L.h}`}
      style={{ overflow: "visible", ...style }}
    >
      {/* marble body */}
      <rect
        x={L.numberCol}
        y={0}
        width={L.w - L.numberCol}
        height={L.h}
        fill={MARBLE}
        opacity={solid}
      />
      <rect
        x={L.numberCol}
        y={0}
        width={L.w - L.numberCol}
        height={L.h}
        fill="none"
        stroke={theme.line}
        strokeWidth={3}
        opacity={0.5 + solid * 0.5}
      />

      {/* floor slabs */}
      {floorList.map((f) => {
        const y = L.floorFloor(f);
        return (
          <g key={`slab${f}`}>
            <rect
              x={L.numberCol}
              y={y - 9}
              width={L.w - L.numberCol}
              height={9}
              fill={MARBLE_EDGE}
              opacity={0.35 + solid * 0.65}
            />
            <line
              x1={0}
              y1={y - 9}
              x2={L.w}
              y2={y - 9}
              stroke={theme.lineFaint}
              strokeWidth={2}
            />
          </g>
        );
      })}

      {/* shaft columns */}
      {shaftList.map((i) => (
        <g key={`shaft${i}`}>
          <rect
            x={L.shaftX(i)}
            y={0}
            width={L.shaftW}
            height={L.h}
            fill={SHAFT}
            opacity={solid}
          />
          <rect
            x={L.shaftX(i)}
            y={0}
            width={L.shaftW}
            height={L.h}
            fill="none"
            stroke={solid > 0.5 ? SHAFT_DEEP : theme.line}
            strokeWidth={3}
            opacity={0.7}
          />
          {/* guide rails */}
          {[0.16, 0.84].map((p) => (
            <line
              key={p}
              x1={L.shaftX(i) + L.shaftW * p}
              y1={0}
              x2={L.shaftX(i) + L.shaftW * p}
              y2={L.h}
              stroke={solid > 0.5 ? BRASS_LIT : theme.lineFaint}
              strokeWidth={2}
              opacity={0.3}
            />
          ))}
          {/* landing doors, one per floor */}
          {floorList.map((f) => {
            const dh = Math.min(L.floorH * 0.62, 62);
            const dw = L.shaftW * 0.56;
            return (
              <rect
                key={`d${i}-${f}`}
                x={L.shaftX(i) + (L.shaftW - dw) / 2}
                y={L.floorFloor(f) - 9 - dh}
                width={dw}
                height={dh}
                fill={SHAFT_DEEP}
                stroke={solid > 0.5 ? BRASS_LIT : theme.lineFaint}
                strokeWidth={2}
                opacity={0.55}
              />
            );
          })}
        </g>
      ))}

      {/* stop marks (which car serves which floor) */}
      {marks.map((m, i) => (
        <rect
          key={i}
          x={L.shaftX(m.shaft) - 16}
          y={L.floorFloor(m.floor) - 9 - Math.min(L.floorH * 0.62, 62)}
          width={10}
          height={Math.min(L.floorH * 0.62, 62)}
          rx={5}
          fill={m.color}
        />
      ))}

      {/* floor numbers */}
      {floorList.map((f) =>
        showNumber(f) ? (
          <text
            key={`n${f}`}
            x={L.numberCol - 14}
            y={L.floorCy(f) + 8}
            textAnchor="end"
            fontFamily={FONTS.mono}
            fontSize={Math.min(24, Math.max(16, L.floorH * 0.3))}
            fill={theme.textFaint}
            letterSpacing="1"
          >
            {f}
          </text>
        ) : null,
      )}
    </svg>
  );
};

// ------------------------------------------------------------------- the car
// Brass-trimmed cab in a shaft. The cab SHELL is dark (it lives inside the
// dark shaft) so its trim uses BRASS_LIT; the cab INTERIOR is lit CAB_LIGHT
// so the rider dots inside read as dark marks on light, exactly like the
// riders standing on the marble landings.
export const Car: React.FC<{
  w?: number;
  h?: number;
  dir?: "up" | "down" | null;
  riders?: string[];
  ghost?: boolean;
  style?: React.CSSProperties;
}> = ({ w = 168, h, dir = null, riders = [], ghost = false, style }) => {
  const H = h ?? w * 0.6;
  const triBand = Math.max(16, H * 0.32);
  const ts = Math.min(16, triBand * 0.8);
  const trim = ghost ? "#8B8377" : BRASS_LIT;
  const shell = ghost ? "#4A443B" : "#39322A";
  const inner = ghost ? "#B9B2A5" : CAB_LIGHT;
  const slitX = w * 0.12;
  const slitW = w * 0.76;
  const slitY = H * 0.2;
  const slitH = H * 0.56;
  const n = Math.min(riders.length, 5);
  return (
    <svg
      width={w}
      height={H + triBand}
      viewBox={`0 0 ${w} ${H + triBand}`}
      style={{ overflow: "visible", ...style }}
    >
      {/* direction triangle above the cab */}
      {dir ? (
        <path
          d={
            dir === "up"
              ? `M${w / 2} 1 L${w / 2 + ts} ${triBand - 4} L${w / 2 - ts} ${triBand - 4} Z`
              : `M${w / 2} ${triBand - 4} L${w / 2 + ts} 1 L${w / 2 - ts} 1 Z`
          }
          fill={trim}
        />
      ) : null}
      <g transform={`translate(0 ${triBand})`}>
        <rect
          x={0}
          y={0}
          width={w}
          height={H}
          rx={7}
          fill={shell}
          stroke={trim}
          strokeWidth={4}
        />
        {/* lit interior slit */}
        <rect x={slitX} y={slitY} width={slitW} height={slitH} rx={4} fill={inner} />
        {/* riders visible through the slit */}
        {Array.from({ length: n }, (_, i) => (
          <g key={i}>
            <circle
              cx={slitX + (slitW * (i + 0.5)) / Math.max(n, 1)}
              cy={slitY + slitH * 0.36}
              r={Math.min(slitH * 0.17, 9)}
              fill={riders[i]}
            />
            <path
              d={(() => {
                const cx = slitX + (slitW * (i + 0.5)) / Math.max(n, 1);
                const r = Math.min(slitH * 0.17, 9);
                const by = slitY + slitH * 0.52;
                return `M${cx - r * 1.5} ${by + r * 2} V${by + r * 0.7} Q${cx - r * 1.5} ${by} ${cx} ${by} Q${cx + r * 1.5} ${by} ${cx + r * 1.5} ${by + r * 0.7} V${by + r * 2} Z`;
              })()}
              fill={riders[i]}
            />
          </g>
        ))}
        {/* brass floor lip */}
        <rect x={0} y={H - 7} width={w} height={7} rx={3} fill={trim} opacity={0.85} />
      </g>
    </svg>
  );
};

/** Total rendered height of a <Car/> (cab + direction-triangle band). */
export const carHeight = (w: number, h?: number) => {
  const H = h ?? w * 0.6;
  return H + Math.max(16, H * 0.32);
};

// ----------------------------------------------------------------- the rider
// Abstract on purpose: a dot with shoulders. No faces — channel style.
export const Rider: React.FC<{
  size?: number; // total height of the body glyph
  color?: string;
  floor?: number | string; // optional destination badge
  dir?: "up" | "down" | null; // hall-call arrow (brass = a button = a ritual)
  ring?: string; // group ring assigned by the dispatcher
  style?: React.CSSProperties;
}> = ({ size = 54, color = RIDER_NEUTRAL, floor, dir = null, ring, style }) => {
  const theme = useTheme();
  const w = (size * 34) / 48;
  return (
    <div style={{ position: "relative", width: w, height: size, ...style }}>
      {ring ? (
        <div
          style={{
            position: "absolute",
            left: w / 2 - size * 0.52,
            top: size * 0.5 - size * 0.52,
            width: size * 1.04,
            height: size * 1.04,
            borderRadius: 999,
            border: `5px solid ${ring}`,
            opacity: 0.85,
          }}
        />
      ) : null}
      <svg width={w} height={size} viewBox="0 0 34 48" style={{ display: "block" }}>
        <circle cx="17" cy="10" r="8.4" fill={color} />
        <path
          d="M2.5 48 V33 C2.5 22.6 9.2 19 17 19 C24.8 19 31.5 22.6 31.5 33 V48 Z"
          fill={color}
        />
      </svg>
      {dir ? (
        <svg
          width={size * 0.36}
          height={size * 0.36}
          viewBox="0 0 20 20"
          style={{ position: "absolute", left: w + 4, top: -2 }}
        >
          <path
            d={dir === "up" ? "M10 2 L18 16 H2 Z" : "M10 18 L18 4 H2 Z"}
            fill={theme.second}
          />
        </svg>
      ) : null}
      {floor !== undefined ? (
        <div
          style={{
            position: "absolute",
            left: w / 2 - 21,
            top: -30,
            width: 42,
            textAlign: "center",
            fontFamily: FONTS.mono,
            fontSize: 20,
            fontWeight: 700,
            color: theme.card,
            background: color,
            borderRadius: 6,
            padding: "1px 0",
          }}
        >
          {floor}
        </div>
      ) : null}
    </div>
  );
};

// ------------------------------------------------------------ the door close-up
export const doorPanelLayout = (w: number, withButton = true) => {
  const doorsH = Math.round(w * 1.06); // portrait — a landscape door read as a TV
  const gap = withButton ? 20 : 0;
  const plateH = withButton ? 180 : 0;
  const plateW = Math.min(210, Math.round(w * 0.5));
  return { w, doorsH, gap, plateH, plateW, h: doorsH + gap + plateH };
};

export const DoorPanel: React.FC<{
  w?: number;
  open?: number; // 0 = shut, 1 = fully open
  withButton?: boolean;
  letter?: string; // small brass car letter over the lintel (sort scene)
  children?: React.ReactNode; // rendered centered on the button plate
  style?: React.CSSProperties;
}> = ({ w = 560, open = 0, withButton = true, letter, children, style }) => {
  const theme = useTheme();
  const L = doorPanelLayout(w, withButton);
  const frameW = Math.max(10, w * 0.045);
  const innerW = w - frameW * 2;
  const innerH = L.doorsH - frameW * 2;
  const leaf = innerW / 2;
  // keep a sliver of each leaf visible at full open — a fully-cleared opening
  // read as a blank grey slab, not a lift
  const slide = leaf * open * 0.86;
  return (
    <div style={{ position: "relative", width: w, height: L.h, ...style }}>
      <svg width={w} height={L.doorsH} viewBox={`0 0 ${w} ${L.doorsH}`} style={{ display: "block" }}>
        {/* marble jamb */}
        <rect x={0} y={0} width={w} height={L.doorsH} rx={8} fill={MARBLE} stroke={theme.line} strokeWidth={3} />
        {/* the opening: a LIT cab behind the doors, not a black hole */}
        <rect x={frameW} y={frameW} width={innerW} height={innerH} fill={SHAFT} />
        <g opacity={0.25 + open * 0.75}>
          <rect x={frameW} y={frameW} width={innerW} height={innerH} fill={CAB_LIGHT} />
          {/* ceiling strip + light */}
          <rect x={frameW} y={frameW} width={innerW} height={innerH * 0.09} fill={SHAFT_DEEP} opacity={0.75} />
          <rect
            x={frameW + innerW * 0.3}
            y={frameW + innerH * 0.025}
            width={innerW * 0.4}
            height={innerH * 0.04}
            rx={innerH * 0.02}
            fill="#FFF8E4"
          />
          {/* handrail */}
          <rect x={frameW + innerW * 0.08} y={frameW + innerH * 0.6} width={innerW * 0.84} height={innerH * 0.028} rx={4} fill={BRASS_LIT} />
          {/* cab floor */}
          <rect x={frameW} y={frameW + innerH * 0.9} width={innerW} height={innerH * 0.1} fill={MARBLE_DARK} />
          <line x1={frameW} y1={frameW + innerH * 0.9} x2={frameW + innerW} y2={frameW + innerH * 0.9} stroke={STEEL_EDGE} strokeWidth={3} />
        </g>
        {/* leaves */}
        <g>
          <rect
            x={frameW - slide}
            y={frameW}
            width={leaf}
            height={innerH}
            fill={STEEL_DOOR}
            stroke={STEEL_EDGE}
            strokeWidth={3}
          />
          <rect
            x={frameW + leaf + slide}
            y={frameW}
            width={leaf}
            height={innerH}
            fill={STEEL_DOOR}
            stroke={STEEL_EDGE}
            strokeWidth={3}
          />
          {/* brushed-steel grain */}
          {[0.25, 0.5, 0.75].map((p) => (
            <g key={p}>
              <line x1={frameW - slide + leaf * p} y1={frameW + 12} x2={frameW - slide + leaf * p} y2={frameW + innerH - 12} stroke={STEEL_EDGE} strokeWidth={1.5} opacity={0.5} />
              <line x1={frameW + leaf + slide + leaf * p} y1={frameW + 12} x2={frameW + leaf + slide + leaf * p} y2={frameW + innerH - 12} stroke={STEEL_EDGE} strokeWidth={1.5} opacity={0.5} />
            </g>
          ))}
        </g>
        {/* brass frame trim */}
        <rect x={frameW / 2} y={frameW / 2} width={w - frameW} height={L.doorsH - frameW} fill="none" stroke={theme.second} strokeWidth={frameW} opacity={0.95} />
        {/* lintel plate — the floor indicator, the cheapest "this is a lift" cue */}
        <rect x={w * 0.32} y={frameW * 0.14} width={w * 0.36} height={frameW * 0.72} rx={4} fill={PLATE} stroke={theme.second} strokeWidth={2} />
        {letter ? (
          <text
            x={w / 2}
            y={frameW * 0.72}
            textAnchor="middle"
            fontFamily={FONTS.mono}
            fontWeight={700}
            fontSize={frameW * 0.58}
            fill={BRASS_DEEP}
          >
            {letter}
          </text>
        ) : (
          <path
            d={`M${w / 2} ${frameW * 0.26} L${w / 2 + frameW * 0.24} ${frameW * 0.72} L${w / 2 - frameW * 0.24} ${frameW * 0.72} Z`}
            fill={BRASS_DEEP}
          />
        )}
      </svg>

      {withButton ? (
        <>
          <svg
            width={w}
            height={L.plateH}
            viewBox={`0 0 ${w} ${L.plateH}`}
            style={{ position: "absolute", left: 0, top: L.doorsH + L.gap, display: "block" }}
          >
            <rect
              x={w / 2 - L.plateW / 2}
              y={2}
              width={L.plateW}
              height={L.plateH - 4}
              rx={18}
              fill={PLATE}
              stroke={theme.second}
              strokeWidth={4}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: L.doorsH + L.gap,
              height: L.plateH,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {children}
          </div>
        </>
      ) : (
        children
      )}
    </div>
  );
};

// ------------------------------------------------------------- the close button
// The star of the show. `dead` makes the ring flash go textFaint instead of
// accent — the machine heard nothing.
export const CloseButton: React.FC<{
  size?: number;
  pressed?: number; // 0..1 depress amount
  ring?: number; // 0..1 flash expansion (defaults to `pressed`)
  dead?: boolean;
  style?: React.CSSProperties;
}> = ({ size = 140, pressed = 0, ring, dead = true, style }) => {
  const theme = useTheme();
  const r = ring ?? pressed;
  const c = size / 2;
  const bez = size * 0.44;
  const face = size * 0.34;
  const sink = pressed * 3.5;
  const ringColor = dead ? theme.textFaint : theme.accent;
  const g = size * 0.1;
  return (
    <svg
      width={size * 2}
      height={size * 2}
      viewBox={`0 0 ${size * 2} ${size * 2}`}
      style={{ overflow: "visible", ...style }}
    >
      <g transform={`translate(${c} ${c})`}>
        {/* ring flash */}
        {r > 0.01 ? (
          <>
            <circle
              cx={c}
              cy={c}
              r={bez + 6 + r * size * 0.44}
              fill="none"
              stroke={ringColor}
              strokeWidth={8}
              opacity={1 - r}
            />
            <circle
              cx={c}
              cy={c}
              r={bez + 4 + r * size * 0.22}
              fill="none"
              stroke={ringColor}
              strokeWidth={5}
              opacity={(1 - r) * 0.6}
            />
          </>
        ) : null}
        {/* bezel */}
        <circle cx={c} cy={c} r={bez} fill={PLATE_DARK} stroke={theme.second} strokeWidth={4} />
        <circle cx={c} cy={c} r={bez - 6} fill={PLATE} opacity={0.55} />
        {/* face */}
        <g transform={`translate(0 ${sink})`}>
          <circle cx={c} cy={c} r={face} fill={PLATE} stroke={theme.second} strokeWidth={3} />
          <circle
            cx={c}
            cy={c}
            r={face}
            fill="none"
            stroke={BRASS_DEEP}
            strokeWidth={3}
            opacity={0.18 + pressed * 0.45}
            strokeDasharray={`${face * 3} ${face * 3.3}`}
            transform={`rotate(215 ${c} ${c})`}
          />
          {/* the >|< glyph */}
          <path
            d={`M${c - g * 2.5} ${c - g * 1.5} L${c - g * 0.9} ${c} L${c - g * 2.5} ${c + g * 1.5}`}
            fill="none"
            stroke={BRASS_DEEP}
            strokeWidth={size * 0.055}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={`M${c + g * 2.5} ${c - g * 1.5} L${c + g * 0.9} ${c} L${c + g * 2.5} ${c + g * 1.5}`}
            fill="none"
            stroke={BRASS_DEEP}
            strokeWidth={size * 0.055}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1={c}
            y1={c - g * 1.7}
            x2={c}
            y2={c + g * 1.7}
            stroke={BRASS_DEEP}
            strokeWidth={size * 0.055}
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
};

// -------------------------------------------------------------- the door timer
// `accent` (teal = the algorithm) arc around the button plate. Presses never
// touch it — that stillness is the joke.
export const TimerArc: React.FC<{
  size?: number;
  t?: number; // 0 = full, 1 = expired
  color?: string;
  style?: React.CSSProperties;
}> = ({ size = 200, t = 0, color, style }) => {
  const theme = useTheme();
  const c = color ?? theme.accent;
  const r = size / 2 - 7;
  const C = 2 * Math.PI * r;
  const left = Math.max(0, Math.min(1, 1 - t));
  const ang = -Math.PI / 2 + left * Math.PI * 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible", ...style }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={theme.accentGlow} strokeWidth={9} />
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={c}
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - left)}
        />
      </g>
      {left > 0.001 ? (
        <circle cx={size / 2 + r * Math.cos(ang)} cy={size / 2 + r * Math.sin(ang)} r={8} fill={c} />
      ) : null}
    </svg>
  );
};

// ------------------------------------------------------------------- the kiosk
export const Kiosk: React.FC<{
  w?: number;
  typed?: string;
  car?: string;
  style?: React.CSSProperties;
}> = ({ w = 250, typed, car, style }) => {
  const theme = useTheme();
  const screenH = w * 0.7;
  const keyR = w * 0.075;
  return (
    <div style={{ position: "relative", width: w, ...style }}>
      <div
        style={{
          width: w,
          height: screenH,
          borderRadius: 16,
          background: theme.card,
          border: `4px solid ${theme.second}`,
          boxShadow: theme.cardShadow,
          padding: "14px 16px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: w * 0.09,
            letterSpacing: "0.16em",
            color: theme.textFaint,
          }}
        >
          FLOOR
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontWeight: 700,
            fontSize: w * 0.26,
            lineHeight: 1,
            color: typed ? theme.text : theme.lineFaint,
          }}
        >
          {typed ?? "--"}
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontWeight: 700,
            fontSize: w * 0.115,
            letterSpacing: "0.1em",
            color: car ? theme.accent : theme.lineFaint,
          }}
        >
          {car ? `→ CAR ${car}` : "→ ??"}
        </div>
      </div>
      {/* keypad */}
      <svg width={w} height={keyR * 7.6} viewBox={`0 0 ${w} ${keyR * 7.6}`} style={{ display: "block", marginTop: 10 }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <circle
            key={i}
            cx={w / 2 + ((i % 3) - 1) * keyR * 2.7}
            cy={keyR * 1.3 + Math.floor(i / 3) * keyR * 2.5}
            r={keyR}
            fill={PLATE}
            stroke={theme.second}
            strokeWidth={2.5}
          />
        ))}
      </svg>
      {/* stand */}
      <svg width={w} height={w * 0.5} viewBox={`0 0 ${w} ${w * 0.5}`} style={{ display: "block" }}>
        <rect x={w / 2 - w * 0.045} y={0} width={w * 0.09} height={w * 0.42} fill={MARBLE_DARK} stroke={theme.line} strokeWidth={2} />
        <ellipse cx={w / 2} cy={w * 0.44} rx={w * 0.24} ry={w * 0.055} fill={MARBLE_EDGE} stroke={theme.line} strokeWidth={2} />
      </svg>
    </div>
  );
};

// ------------------------------------------------------------ firefighter key
// The KEYHOLE is a loop glyph: the `hook` scene's rehook stamp shows it bare
// and unexplained ("it works for exactly one person" — who?), and `timer` pays
// the loop off by turning the very same escutcheon with a key in it. Both draw
// from `KeyholeFace` so the two shots are literally the same object.
const KeyholeFace: React.FC<{ size: number; turned: number }> = ({ size, turned }) => {
  const theme = useTheme();
  const c = size / 2;
  return (
    <>
      {/* escutcheon */}
      <circle cx={c} cy={c} r={c * 0.62} fill={PLATE} stroke={theme.second} strokeWidth={4} />
      <circle cx={c} cy={c} r={c * 0.5} fill="none" stroke={theme.second} strokeWidth={2} opacity={0.55} />
      {/* keyhole */}
      <g transform={`rotate(${turned * 90} ${c} ${c})`}>
        <rect
          x={c - size * 0.028}
          y={c - size * 0.24}
          width={size * 0.056}
          height={size * 0.48}
          rx={size * 0.028}
          fill={BRASS_DEEP}
        />
      </g>
    </>
  );
};

/** The bare glyph — escutcheon + keyhole, no key, no fire marking. A question. */
export const Keyhole: React.FC<{
  size?: number;
  turned?: number;
  style?: React.CSSProperties;
}> = ({ size = 86, turned = 0, style }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    style={{ display: "block", overflow: "visible", ...style }}
  >
    <KeyholeFace size={size} turned={turned} />
  </svg>
);

export const FireKey: React.FC<{
  size?: number;
  turned?: number; // 0..1 -> rotates 90deg
  style?: React.CSSProperties;
}> = ({ size = 150, turned = 0, style }) => {
  const theme = useTheme();
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible", ...style }}>
      {turned > 0.02 ? (
        <circle cx={c} cy={c} r={c * (0.55 + turned * 0.6)} fill={theme.brandGlow} opacity={turned * 0.9} />
      ) : null}
      <KeyholeFace size={size} turned={turned} />
      <g transform={`rotate(${turned * 90} ${c} ${c})`}>
        {/* key bow + shaft sticking out of the cylinder */}
        <rect x={c - size * 0.036} y={c + size * 0.1} width={size * 0.072} height={size * 0.3} rx={size * 0.02} fill={theme.second} />
        <circle cx={c} cy={c + size * 0.46} r={size * 0.11} fill="none" stroke={theme.second} strokeWidth={size * 0.05} />
        <rect x={c - size * 0.09} y={c + size * 0.24} width={size * 0.055} height={size * 0.05} fill={theme.second} />
      </g>
      {/* helmet tick — the "fire service" marking */}
      <path
        d={`M${c - size * 0.09} ${c - size * 0.4} q${size * 0.09} ${-size * 0.09} ${size * 0.18} 0 z`}
        fill={theme.warn}
        opacity={0.9}
      />
    </svg>
  );
};

// ------------------------------------------------------------------ route line
// The dispatcher "thinking". A full-frame overlay svg by default, so scenes
// can write paths straight in comp coordinates.
export const RouteLine: React.FC<{
  idKey: string;
  path: string;
  draw?: number; // 0..1 reveal
  color?: string;
  width?: number;
  w?: number;
  h?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ idKey, path, draw = 1, color, width = 5, w = 1080, h = 1920, opacity = 1, style }) => {
  const theme = useTheme();
  const d = Math.max(0.0001, Math.min(1, draw));
  const id = `rl-${idKey}`;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }}
    >
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse">
          <path
            d={path}
            fill="none"
            stroke="#fff"
            strokeWidth={width * 4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${d} 1`}
          />
        </mask>
      </defs>
      {/* draw=0 must be INVISIBLE: the round line-cap on a 0-length dash left a
          coloured speck parked on stage for the whole scene before the reveal */}
      <g mask={`url(#${id})`} opacity={draw <= 0.002 ? 0 : opacity}>
        <path
          d={path}
          fill="none"
          stroke={color ?? theme.accent}
          strokeWidth={width}
          strokeDasharray="14 10"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

// --------------------------------------------------------------- misc glyphs
// A pressing hand — abstract silhouette, no detail (channel style).
export const HandPress: React.FC<{
  size?: number;
  press?: number; // 0..1 travel toward the button
  style?: React.CSSProperties;
}> = ({ size = 130, press = 0, style }) => {
  const theme = useTheme();
  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 100 125"
      style={{
        transform: `translate(${-press * 15}px, ${-press * 13}px)`,
        overflow: "visible",
        ...style,
      }}
    >
      <g opacity={0.9}>
        {/* index finger, pointing up-left at the plate */}
        <line x1="26" y1="12" x2="58" y2="68" stroke={theme.text} strokeWidth="17" strokeLinecap="round" />
        {/* thumb */}
        <line x1="44" y1="84" x2="24" y2="74" stroke={theme.text} strokeWidth="15" strokeLinecap="round" />
        {/* fist */}
        <rect x="38" y="56" width="52" height="52" rx="24" fill={theme.text} />
      </g>
    </svg>
  );
};

// The reason the timer exists.
export const Wheelchair: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 130,
  style,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
      <g stroke={theme.text} strokeWidth={5} fill="none" strokeLinecap="round">
        <circle cx="42" cy="72" r="24" />
        <g transform={`rotate(${frame * 2.2} 42 72)`} strokeWidth={2.5} opacity={0.6}>
          <line x1="42" y1="50" x2="42" y2="94" />
          <line x1="20" y1="72" x2="64" y2="72" />
          <line x1="27" y1="57" x2="57" y2="87" />
          <line x1="57" y1="57" x2="27" y2="87" />
        </g>
        <circle cx="82" cy="86" r="9" />
        <path d="M42 48 H72 L82 78" />
      </g>
      <g fill={RIDER_NEUTRAL}>
        <circle cx="42" cy="18" r="10" />
        <path d="M30 48 V38 C30 30 35 27 42 27 C49 27 54 30 54 38 V48 Z" />
        <rect x="52" y="40" width="28" height="8" rx="4" />
      </g>
    </svg>
  );
};

// The simile, in one glyph: a van that groups its drop-offs.
export const Van: React.FC<{
  w?: number;
  parcels?: string[];
  style?: React.CSSProperties;
}> = ({ w = 230, parcels = [DEST.teal, DEST.plum, DEST.olive], style }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  return (
    <svg width={w} height={(w * 120) / 230} viewBox="0 0 230 120" style={{ overflow: "visible", ...style }}>
      <rect x="8" y="26" width="140" height="62" rx="8" fill={MARBLE} stroke={theme.line} strokeWidth={4} />
      <path d="M148 88 V44 H182 L212 68 V88 Z" fill={MARBLE_DARK} stroke={theme.line} strokeWidth={4} strokeLinejoin="round" />
      <rect x="160" y="50" width="26" height="18" rx="3" fill={CAB_LIGHT} stroke={theme.line} strokeWidth={3} />
      {parcels.map((p, i) => (
        <rect key={i} x={22 + i * 42} y={40} width={32} height={32} rx={4} fill={p} />
      ))}
      {[46, 190].map((cx) => (
        <g key={cx} transform={`rotate(${frame * 6} ${cx} 92)`}>
          <circle cx={cx} cy="92" r="18" fill={theme.text} />
          <circle cx={cx} cy="92" r="7" fill={MARBLE} />
          <line x1={cx - 5} y1="92" x2={cx + 5} y2="92" stroke={theme.text} strokeWidth="3" />
        </g>
      ))}
    </svg>
  );
};

export const House: React.FC<{ w?: number; color?: string; style?: React.CSSProperties }> = ({
  w = 110,
  color,
  style,
}) => {
  const theme = useTheme();
  return (
    <svg width={w} height={(w * 100) / 110} viewBox="0 0 110 100" style={{ overflow: "visible", ...style }}>
      <path d="M8 44 L55 10 L102 44 Z" fill={color ?? MARBLE_DARK} stroke={theme.line} strokeWidth={4} strokeLinejoin="round" />
      <rect x="18" y="44" width="74" height="48" fill={MARBLE} stroke={theme.line} strokeWidth={4} />
      <rect x="46" y="62" width="20" height="30" fill={color ?? MARBLE_DARK} stroke={theme.line} strokeWidth={3} />
    </svg>
  );
};

// The eerie payoff of the `sort` scene: a cab wall where the panel should be.
export const CabInterior: React.FC<{
  w?: number;
  h?: number;
  ghostPanel?: number; // 0..1 faint outline of the buttons that aren't there
  style?: React.CSSProperties;
}> = ({ w = 760, h = 470, ghostPanel = 0, style }) => {
  const theme = useTheme();
  const doorW = w * 0.38;
  const wallX = doorW + 22;
  const wallW = w - wallX - 20;
  const panelW = 168;
  const panelH = h * 0.46;
  const panelX = wallX + (wallW - panelW) / 2;
  const panelY = h * 0.1;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible", ...style }}>
      <rect x={0} y={0} width={w} height={h} rx={10} fill={CAB_LIGHT} stroke={theme.second} strokeWidth={6} />
      {/* the shut cab doors — establishes that we're INSIDE the car */}
      <g>
        <rect x={20} y={20} width={doorW} height={h - 40} rx={5} fill={STEEL_DOOR} stroke={STEEL_EDGE} strokeWidth={4} />
        <line x1={20 + doorW / 2} y1={24} x2={20 + doorW / 2} y2={h - 24} stroke={STEEL_EDGE} strokeWidth={5} />
        {[0.24, 0.74].map((p) => (
          <line key={p} x1={20 + doorW * p} y1={40} x2={20 + doorW * p} y2={h - 40} stroke={STEEL_EDGE} strokeWidth={2} opacity={0.55} />
        ))}
      </g>
      {/* the brass wall where the panel should be */}
      <rect x={wallX} y={20} width={wallW} height={h - 40} rx={6} fill={PLATE} opacity={0.42} stroke={theme.second} strokeWidth={3} />
      <rect x={wallX + 14} y={h * 0.66} width={wallW - 28} height={13} rx={7} fill={theme.second} opacity={0.9} />
      {/* ...and the panel that isn't there */}
      {ghostPanel > 0.01 ? (
        <g opacity={ghostPanel}>
          <rect
            x={panelX}
            y={panelY}
            width={panelW}
            height={panelH}
            rx={12}
            fill="none"
            stroke={theme.textFaint}
            strokeWidth={4}
            strokeDasharray="12 12"
          />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <circle
              key={i}
              cx={panelX + panelW * (i % 2 === 0 ? 0.3 : 0.7)}
              cy={panelY + panelH * (0.16 + Math.floor(i / 2) * 0.23)}
              r={16}
              fill="none"
              stroke={theme.textFaint}
              strokeWidth={3}
              strokeDasharray="7 8"
            />
          ))}
        </g>
      ) : null}
    </svg>
  );
};

export const fadeIn = (frame: number, at: number, len = 12) =>
  interpolate(frame, [at, at + len], [0, 1], clamp);
export const fadeOut = (frame: number, at: number, len = 10) =>
  interpolate(frame, [at, at + len], [1, 0], clamp);
export { clamp };
