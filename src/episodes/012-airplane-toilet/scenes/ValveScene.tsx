import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import {
  AirField,
  PlaneCutaway,
  Chip,
  Droplet,
  HAND_TIP,
  HandPress,
  LAV,
  Lavatory,
  METAL,
  PaperCloud,
  PaperPlane,
  RUSH,
  SetPanel,
  SkyStage,
  Stamp,
  INTERIOR,
  ValveVoid,
} from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// valve — THE VALVE · 619f (v4 take, timing.json 2026-08-22)
//
// Three hard-cut phases, each on a narration landmark:
//   EXT    f0–124   "An airplane toilet flushes at 300 miles an hour"
//                   — the plane in cruise, title stamp at f0, speed lines on "300"
//   REHOOK f125–275 "…rides right under your seat for the rest of the flight"
//                   — the half-cut plane from outside: seat row, the viewer's
//                   seat lit, arrow down into the glowing tank under the floor,
//                   chips UNDER YOUR SEAT / WHOLE FLIGHT
//   INT    f276–619 "Press flush (289) … valve opens (314) … pipe to the sky (342)
//                   … far thinner (408) … stampedes (484) … bowl goes with it (579)"
// ★ SIGNATURE — the stampede, from f478.

// ── interior layout (comp px) ──
const PANEL = { x: 70, y: 520, w: 940, h: 720 };
const CABIN = { x: 100, y: 560, w: 490, h: 640 };
const HULL_X = 590;
const VOIDP = { x: 630, y: 560, w: 350, h: 640 };
const UNIT = 13; // px per toilet-icon unit
const LAVPOS = { x: 96, y: 745 };
const lavPt = (p: { x: number; y: number }) => ({ x: LAVPOS.x + p.x * UNIT, y: LAVPOS.y + p.y * UNIT });
const BOWL = lavPt(LAV.bowl);
const DRAIN = lavPt(LAV.drain);
const BTN = lavPt(LAV.button);
const SINK = { x: BOWL.x - CABIN.x, y: BOWL.y - CABIN.y }; // AirField-local
const PIPE_TO = { x: (VOIDP.x + 40 - LAVPOS.x) / UNIT, y: 33.2 }; // icon units
const HAND_SIZE = 190;
const HAND_POS = { x: BTN.x - HAND_TIP.x * HAND_SIZE, y: BTN.y - HAND_TIP.y * HAND_SIZE };

// stampede travel — monotonic so each frame is pure in `frame`
const K = 0.03;
const travelAt = (f: number) => {
  if (f < 478) return 0;
  if (f < 540) return (K * (f - 478) * (f - 478)) / 124;
  return K * 31 + K * (f - 540);
};

export const ValveScene: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const phase = frame < 125 ? "ext" : frame < 276 ? "rehook" : "int";

  // ── EXT ──
  const stampPop = interpolate(frame, [0, 9], [0, 1], { ...clamp, easing: easeOut });
  const speedIn = interpolate(frame, [61, 72, 112, 124], [0, 1, 1, 0], clamp);

  // ── REHOOK ──
  const lit = interpolate(frame, [158, 176], [0, 1], clamp);
  const glow = interpolate(frame, [186, 206], [0, 1], clamp);
  const chip1 = interpolate(frame, [182, 190], [0, 1], { ...clamp, easing: easeOut });
  const chip2 = interpolate(frame, [226, 234], [0, 1], { ...clamp, easing: easeOut });
  const rehookSlosh = 2.2 * Math.sin(frame / 14);
  const rehookZoom = interpolate(frame, [125, 180], [1, 1.2], { ...clamp, easing: easeOut });

  // ── INT ──
  const punch = interpolate(frame, [276, 286], [0.86, 1], { ...clamp, easing: easeOut });
  const handIn = interpolate(frame, [276, 284], [0, 1], clamp);
  const handOut = interpolate(frame, [332, 356], [1, 0], clamp);
  const press = interpolate(frame, [283, 290, 302, 322], [0, 1, 1, 0.3], clamp);
  const valveOpen = interpolate(frame, [314, 336], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 4) });
  const voidReveal = interpolate(frame, [346, 392], [0, 1], clamp);
  const thick = interpolate(frame, [401, 410], [0, 1], { ...clamp, easing: easeOut });
  const thin = interpolate(frame, [411, 420], [0, 1], { ...clamp, easing: easeOut });
  const labelsOut = interpolate(frame, [530, 548], [1, 0], clamp);
  const rushing = frame >= 478;
  const travel = travelAt(frame);
  const streak = interpolate(frame, [482, 540], [0, 1], clamp);
  const density = interpolate(frame, [0, 560, 619], [0.92, 0.92, 0.55], clamp);
  const pulse = interpolate(frame, [500, 520], [0, 1], clamp);
  const dragged = interpolate(frame, [556, 606], [0, 1], { ...clamp, easing: (t) => t * t });

  return (
    <AbsoluteFill>
      {phase === "ext" ? (
        <>
          <SkyStage />
          <div style={{ position: "absolute", left: 90, top: 600 }}>
            <PaperCloud w={230} />
          </div>
          <div style={{ position: "absolute", left: 770, top: 560 }}>
            <PaperCloud w={200} drift={7} />
          </div>
          <div style={{ position: "absolute", left: 640, top: 1080 }}>
            <PaperCloud w={270} drift={4} />
          </div>
          <div style={{ position: "absolute", left: 110, top: 1150 }}>
            <PaperCloud w={180} drift={6} />
          </div>

          <div style={{ position: "absolute", left: 180, top: 740 }}>
            <PaperPlane w={720} />
          </div>

          {/* speed lines trailing the tail, on "300 miles an hour" */}
          {speedIn > 0.01 ? (
            <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: speedIn }}>
              {[0, 1, 2].map((i) => (
                <line
                  key={i}
                  x1={905 + i * 12}
                  y1={836 + i * 34}
                  x2={905 + i * 12 + 90 + ((frame * 9 + i * 40) % 70)}
                  y2={836 + i * 34}
                  stroke={RUSH}
                  strokeWidth={8}
                  strokeLinecap="round"
                  opacity={0.85 - i * 0.2}
                />
              ))}
            </svg>
          ) : null}

          {/* title stamp — the claim, on screen before it is spoken */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center" }}>
            <Stamp top="300 MPH" bottom="FLUSH" pop={stampPop} />
          </div>
        </>
      ) : null}

      {phase === "rehook" ? (
        <>
          <SkyStage />
          <div style={{ position: "absolute", left: 640, top: 1120 }}>
            <PaperCloud w={240} drift={4} />
          </div>
          <div style={{ position: "absolute", inset: 0, transformOrigin: "540px 840px", transform: `scale(${rehookZoom})` }}>
            <div style={{ position: "absolute", left: 90, top: 640 }}>
              <PlaneCutaway
                w={900}
                fill={0.5}
                slosh={rehookSlosh}
                highlightSeat={2}
                lit={lit}
                glow={glow}
              />
            </div>
          </div>
          {chip1 > 0.01 ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 1138,
                display: "flex",
                justifyContent: "center",
                opacity: chip1,
                transform: `scale(${0.8 + chip1 * 0.2})`,
              }}
            >
              <Chip color={RUSH} fontSize={34}>
                UNDER YOUR SEAT
              </Chip>
            </div>
          ) : null}
          {chip2 > 0.01 ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 1222,
                display: "flex",
                justifyContent: "center",
                opacity: chip2,
                transform: `scale(${0.8 + chip2 * 0.2})`,
              }}
            >
              <Chip fontSize={28}>FOR THE WHOLE FLIGHT</Chip>
            </div>
          ) : null}
        </>
      ) : null}

      {phase === "int" ? (
        <div style={{ position: "absolute", inset: 0, transformOrigin: "540px 880px", transform: `scale(${punch})` }}>
          <SetPanel x={PANEL.x} y={PANEL.y} w={PANEL.w} h={PANEL.h} fill={INTERIOR} />

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

          {/* the toilet, its pipe running through the hull into the void */}
          <div style={{ position: "absolute", left: LAVPOS.x, top: LAVPOS.y }}>
            <Lavatory unit={UNIT} valveOpen={valveOpen} press={press} pipe={{ to: PIPE_TO }} pulse={pulse} />
          </div>

          {/* bowl contents — three drops, dragged down the drain with the air */}
          {[0, 1, 2].map((i) => {
            const sx = BOWL.x - 46 + i * 44;
            const sy = BOWL.y - 30 + (i % 2) * 10;
            const e = interpolate(dragged, [i * 0.12, i * 0.12 + 0.62], [0, 1], clamp);
            const o = 1 - Math.pow(e, 5);
            if (o <= 0.02) return null;
            return (
              <Droplet
                key={i}
                size={34 - e * 10}
                style={{
                  left: sx + (DRAIN.x - sx) * e - 17,
                  top: sy + (DRAIN.y - 10 - sy) * e - 17,
                  opacity: o,
                }}
              />
            );
          })}

          {/* the hand — already descending at the cut, press lands on "flush" */}
          {handIn > 0.01 && handOut > 0.01 ? (
            <div
              style={{
                position: "absolute",
                left: HAND_POS.x,
                top: HAND_POS.y - (1 - handIn) * 50,
                opacity: Math.min(handIn, handOut),
              }}
            >
              <HandPress size={HAND_SIZE} press={press} />
            </div>
          ) : null}

          {/* THICK / THIN — the physics, named once, on "far thinner" */}
          {thick > 0.01 ? (
            <div style={{ position: "absolute", left: 130, top: 548, opacity: thick * labelsOut, transform: `scale(${0.8 + thick * 0.2})` }}>
              <Chip color={theme.text}>THICK AIR</Chip>
            </div>
          ) : null}
          {thin > 0.01 ? (
            <div style={{ position: "absolute", left: 690, top: 548, opacity: thin * labelsOut, transform: `scale(${0.8 + thin * 0.2})` }}>
              <Chip color={theme.text}>THIN AIR</Chip>
            </div>
          ) : null}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
