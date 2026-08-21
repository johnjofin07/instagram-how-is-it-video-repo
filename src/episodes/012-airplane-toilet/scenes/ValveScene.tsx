import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import {
  AirField,
  BLUE,
  HandPress,
  LAV_MARK,
  LavCutaway,
  METAL,
  PLANE_VB,
  PaperCloud,
  PlaneExterior,
  RED,
  RUSH,
  SetPanel,
  SkyStage,
  SpeedTicker,
  ValveVoid,
  paperShadow,
} from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeIn = (t: number) => t * t;

// ── Interior layout, comp space. Dense on the left, empty on the right. ──
const CABIN = { x: 100, y: 560, w: 490, h: 640 };
const HULL_X = 590;
const VOIDP = { x: 630, y: 560, w: 350, h: 640 };
const LAV = { x: 100, y: 690, w: 500, s: 500 / 520 };
const DRAIN = { x: LAV.x + 196 * LAV.s, y: LAV.y + 372 * LAV.s }; // the valve mouth
const SINK = { x: DRAIN.x - CABIN.x, y: DRAIN.y - CABIN.y }; // in AirField-local px
const PIPE_X0 = LAV.x + 452 * LAV.s;
const PIPE_Y = LAV.y + 408 * LAV.s;

// ── Exterior layout. The camera dives into the marked lavatory window. ──
const PLANE_W = 760;
const PLANE_POS = { x: (1080 - PLANE_W) / 2, y: 640 };
const PLANE_S = PLANE_W / PLANE_VB.w;
// the lav mark's comp-space position — the zoom's fixed point
const MARK = {
  x: PLANE_POS.x + LAV_MARK.x * PLANE_S,
  y: PLANE_POS.y + LAV_MARK.y * PLANE_S,
};

// The sink loop is driven by a monotonic "travel" integral so every frame stays
// a pure function of `frame` (deterministic-render rule). pull ramps over
// f236–300 and then holds.
const K = 0.03;
const travelAt = (f: number) => {
  if (f < 236) return 0;
  if (f < 300) return (K * (f - 236) * (f - 236)) / 128;
  return K * 32 + K * (f - 300);
};

// valve — THE VALVE · 434f
// Opens on the PLANE, not the toilet: a safety-card aircraft in cruise with
// one window ringed in orange and labelled TOILET, and the camera dives
// through that window (f14–56) into the lavatory cutaway. The hand presses on
// "flush button" (f52–60), the flap snaps on "a valve snaps open" (f73–106),
// and the whole physics is one frame of dense-here / empty-there.
// ★ SIGNATURE — the stampede begins on "rushes toward that emptiness" (f258).
export const ValveScene: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // ── the dive ──
  const zoom = interpolate(frame, [14, 56], [1, 9], { ...clamp, easing: easeIn });
  const exteriorOut = interpolate(frame, [42, 58], [1, 0], clamp);
  const interiorIn = interpolate(frame, [42, 58], [0, 1], clamp);
  const interiorScale = interpolate(frame, [42, 62], [0.62, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const labelIn = interpolate(frame, [4, 16, 34, 46], [0, 1, 1, 0], clamp);

  // ── the press (lands on "flush button") ──
  const press = interpolate(frame, [46, 58, 88], [0, 1, 0.35], clamp);
  const handIn = interpolate(frame, [44, 52], [0, 1], clamp);
  const handOut = interpolate(frame, [92, 120], [1, 0], clamp);

  // the flap SNAPS — a hard, fast open, not a spring settle
  const valveOpen = interpolate(frame, [70, 94], [0, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 4),
  });
  const voidReveal = interpolate(frame, [78, 116], [0, 1], clamp);

  const travel = travelAt(frame);
  const rushing = frame >= 236;
  const streak = interpolate(frame, [240, 306], [0, 1], clamp);
  // "The CROWDED cabin air" has to read as crowded from the reveal — the whole
  // physics is dense-here / empty-there, and it only lands if the left is full.
  const density = interpolate(frame, [0, 330, 430], [0.92, 0.92, 0.46], clamp);

  // the blue liquid in the bowl gets dragged along with everything else
  const dragged = interpolate(frame, [248, 312], [0, 1], { ...clamp, easing: easeIn });

  const pipePulse = interpolate(frame, [262, 300], [0, 1], clamp);
  const tickerIn = interpolate(frame, [322, 340], [0, 1], clamp);
  const mph = interpolate(frame, [330, 377], [0, 300], clamp);

  return (
    <AbsoluteFill>
      {/* ── INTERIOR — revealed as the dive lands ── */}
      {interiorIn > 0.001 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: interiorIn,
            transformOrigin: "540px 880px",
            transform: `scale(${interiorScale})`,
          }}
        >
          {/* the diorama box the interior sits in */}
          <SetPanel x={70} y={520} w={940} h={720} />

          {/* the cabin side: crowded air */}
          <div style={{ position: "absolute", left: CABIN.x, top: CABIN.y, width: CABIN.w, height: CABIN.h }}>
            <AirField
              w={CABIN.w}
              h={CABIN.h}
              count={340}
              seed={12}
              density={density}
              flow={{ x: -0.05, y: 0.09 }}
              sink={rushing ? SINK : null}
              travel={travel}
              streak={streak}
            />
          </div>

          {/* the hull, and the thin sky behind the valve */}
          <div
            style={{
              position: "absolute",
              left: HULL_X,
              top: CABIN.y,
              width: 16,
              height: CABIN.h,
              background: METAL,
              borderRadius: 8,
              boxShadow: "0 8px 18px rgba(24, 56, 84, 0.28)",
            }}
          />
          <div style={{ position: "absolute", left: VOIDP.x, top: VOIDP.y, width: VOIDP.w, height: VOIDP.h }}>
            <ValveVoid w={VOIDP.w} h={VOIDP.h} reveal={voidReveal} />
          </div>

          {/* the pipe through the hull, into the emptiness */}
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <path d={`M${PIPE_X0} ${PIPE_Y} H${VOIDP.x + 46}`} stroke={METAL} strokeWidth={46} strokeLinecap="round" opacity={0.55} />
            <path d={`M${PIPE_X0} ${PIPE_Y} H${VOIDP.x + 46}`} stroke={theme.bgLifted} strokeWidth={34} strokeLinecap="round" />
            {pipePulse > 0 ? (
              <path
                d={`M${PIPE_X0} ${PIPE_Y} H${VOIDP.x + 46}`}
                stroke={RUSH}
                strokeWidth={26}
                strokeLinecap="round"
                strokeDasharray="30 34"
                strokeDashoffset={-frame * 11}
                opacity={pipePulse * 0.9}
              />
            ) : null}
          </svg>

          {/* the lavatory itself */}
          <div style={{ position: "absolute", left: LAV.x, top: LAV.y }}>
            <LavCutaway w={LAV.w} valveOpen={valveOpen} press={press} />
          </div>

          {/* bowl contents — three drops of blue, dragged down the drain */}
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {[0, 1, 2].map((i) => {
              const sx = LAV.x + (168 + i * 62) * LAV.s;
              const sy = LAV.y + (272 + (i % 2) * 22) * LAV.s;
              const e = interpolate(dragged, [i * 0.12, i * 0.12 + 0.6], [0, 1], clamp);
              const o = 1 - Math.pow(e, 4);
              if (o <= 0.02) return null;
              return (
                <ellipse
                  key={i}
                  cx={sx + (DRAIN.x - sx) * e}
                  cy={sy + (DRAIN.y - sy) * e}
                  rx={13 - e * 6}
                  ry={9 + e * 10}
                  fill={BLUE}
                  opacity={0.75 * o}
                />
              );
            })}
          </svg>

          {/* the hand — reaches in with the reveal, presses on "flush button".
              Fingertip rests on the button at comp (479, 772). */}
          {handIn > 0.01 && handOut > 0.01 ? (
            <div style={{ position: "absolute", left: 447, top: 576, opacity: handIn * handOut }}>
              <HandPress size={190} press={press} />
            </div>
          ) : null}

          {/* the episode's one number */}
          {tickerIn > 0.01 ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: 1252, display: "flex", justifyContent: "center", opacity: tickerIn }}>
              <SpeedTicker value={mph} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ── EXTERIOR — the plane, and the dive into its marked window ── */}
      {exteriorOut > 0.001 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: exteriorOut,
            transformOrigin: `${MARK.x}px ${MARK.y}px`,
            transform: `scale(${zoom})`,
          }}
        >
          {/* layered paper sky + white cloud cutouts */}
          <SkyStage />
          <div style={{ position: "absolute", left: 140, top: 500 }}>
            <PaperCloud w={250} />
          </div>
          <div style={{ position: "absolute", left: 720, top: 1080 }}>
            <PaperCloud w={300} drift={7} />
          </div>
          <div style={{ position: "absolute", left: 300, top: 1290 }}>
            <PaperCloud w={190} drift={4} />
          </div>

          <div style={{ position: "absolute", left: PLANE_POS.x, top: PLANE_POS.y }}>
            <PlaneExterior w={PLANE_W} />
          </div>

          {/* TOILET — a paper luggage tag strung to the marked window */}
          {labelIn > 0.01 ? (
            <div style={{ position: "absolute", inset: 0, opacity: labelIn }}>
              <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
                <path
                  d={`M${MARK.x} ${MARK.y - 20} Q ${MARK.x + 14} ${MARK.y - 58} ${MARK.x - 4} ${MARK.y - 96}`}
                  fill="none"
                  stroke={theme.text}
                  strokeWidth={3.5}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  left: MARK.x - 118,
                  top: MARK.y - 168,
                  width: 236,
                  textAlign: "center",
                  padding: "13px 0",
                  borderRadius: 12,
                  background: "#FFFFFF",
                  boxShadow: "0 12px 28px rgba(24, 56, 84, 0.32)",
                  transform: "rotate(-4deg)",
                  fontFamily: FONTS.sans,
                  fontSize: 34,
                  fontWeight: 900,
                  letterSpacing: "0.16em",
                  color: RED,
                }}
              >
                TOILET
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
