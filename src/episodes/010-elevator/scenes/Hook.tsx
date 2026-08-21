import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useEnter } from "../../../components/ui";
import { useTheme } from "../../../themes";
import {
  Chip,
  CloseButton,
  DoorPanel,
  HandPress,
  Keyhole,
  MARBLE,
  MARBLE_EDGE,
  RouteLine,
  Stamp,
  clamp,
  doorPanelLayout,
  fadeIn,
  fadeOut,
} from "./kit";

// Scene 1 — THE BUTTON · D = 523f (17.44s, timing.json).
//
// v2 restructure (EPISODE-PLANS.md §010.5 + §0.7):
//   title hook   f0-9   stamp "THE CLOSE BUTTON / IS FAKE" — instant pop
//   visual hook  f0     the press is ALREADY happening. PRESSES[0] = -5, so
//                       the finger is at full depression on frame 0 and the
//                       dead grey ring is expanding by f6. Nothing builds up.
//   verbal hook  f4     "The close button in your elevator? It's a dummy."
//   presses      f68 / f93 land on "dummy!" and "fake!" — 25f apart, all three
//                       flash GREY (`dead`): the machine heard nothing.
//   the plan     f166+  wall goes x-ray, teal routes draw behind the marble
//                       ("because it already has a plan" @f211)
//   you're in it f278+  one route bends round to end at THIS door (@f280)
//   rehook       f386+  the panel rises out of the lower third and the stamp
//                       swaps to "IT WORKS FOR EXACTLY ONE PERSON" + a bare
//                       KEYHOLE. Who? — the loop `timer` closes at f352 there
//                       by turning that exact glyph. Lands under "for exactly
//                       one person" @f410-446.
//
// The panel RISE (f386-414) is a deviation forced by geometry: the plan puts
// the rehook stamp at y1250, but at PANEL_TOP 678 the button plate owns
// y1154-1334. Lifting the shot by 206px empties the lower third — and lands it
// on the same composition `doors` closes the episode with (PANEL_TOP 452).

const PANEL_W = 430;
const PANEL_LEFT = (1080 - PANEL_W) / 2; // 325
const PANEL_TOP = 678;
const L = doorPanelLayout(PANEL_W, true);
const PLATE_CY = PANEL_TOP + L.doorsH + L.gap + L.plateH / 2; // 1244

// press start frames. The first is NEGATIVE on purpose — frame 0 opens
// mid-press. Then press, beat, press-press (comic timing) on "dummy" / "fake".
const PRESSES = [-5, 68, 93];

const RISE = 206; // px the shot lifts for the rehook
const RISE_IN = 386;
const RISE_OUT = 414;

const pressAmount = (frame: number, start: number) =>
  interpolate(frame, [start, start + 5, start + 14], [0, 1, 0], clamp);
const ringAmount = (frame: number, start: number) =>
  interpolate(frame, [start + 2, start + 26], [0, 1], clamp);

// The wall, x-rayed: floor slabs across the full stage and the two shaft
// columns the door panel does NOT cover, so the teal route lines have light
// marble to sit on (accent is 5.7:1 there, only 2.2:1 inside a filled shaft).
const PlanSchematic: React.FC<{ o: number }> = ({ o }) => {
  const theme = useTheme();
  const floors = [680, 761, 842, 924, 1005, 1086, 1168, 1249, 1330];
  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", left: 0, top: 0, opacity: o }}
    >
      <rect x={95} y={680} width={890} height={650} fill={MARBLE} opacity={0.45} />
      {floors.map((y) => (
        <line key={y} x1={95} y1={y} x2={985} y2={y} stroke={theme.line} strokeWidth={2} />
      ))}
      {[110, 832].map((x) => (
        <g key={x}>
          <rect x={x} y={680} width={138} height={650} fill={MARBLE_EDGE} opacity={0.3} />
          <rect x={x} y={680} width={138} height={650} fill="none" stroke={theme.line} strokeWidth={3} />
          {floors.slice(0, -1).map((y) => (
            <rect
              key={y}
              x={x + 34}
              y={y + 18}
              width={70}
              height={44}
              fill="none"
              stroke={theme.lineFaint}
              strokeWidth={3}
            />
          ))}
        </g>
      ))}
      <rect x={95} y={680} width={890} height={650} fill="none" stroke={theme.line} strokeWidth={3} />
    </svg>
  );
};

export const Hook: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const claim = useEnter(1, { damping: 11 });

  const press = Math.max(...PRESSES.map((p) => pressAmount(frame, p)));
  const ring = (() => {
    const active = PRESSES.filter((p) => frame >= p + 2 && frame < p + 30);
    return active.length ? ringAmount(frame, active[active.length - 1]) : 0;
  })();

  // the plan, thinking — up while the narration explains it, gone before the
  // rehook so the lower third is empty for the stamp
  const planO = fadeOut(frame, 370, 14);
  const xray = interpolate(frame, [166, 188], [0, 1], clamp) * planO;
  const cubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const draw1 = interpolate(frame, [178, 232], [0, 1], { ...clamp, easing: cubic });
  const draw2 = interpolate(frame, [196, 250], [0, 1], { ...clamp, easing: cubic });
  const draw3 = interpolate(frame, [278, 322], [0, 1], { ...clamp, easing: cubic });
  const endDot = interpolate(frame, [320, 334], [0, 1], clamp) * planO;
  const endPulse = 1 + 0.18 * Math.sin((frame - 320) / 4);

  const claimO = fadeOut(frame, 372, 14);
  const chipIn = fadeIn(frame, 214, 12);
  const chipO = fadeOut(frame, 366, 12);
  const handO = interpolate(frame, [120, 136], [1, 0], clamp);

  // the shot lifts out of the lower third, then the rehook stamp takes it
  const lift = interpolate(frame, [RISE_IN, RISE_OUT], [0, -RISE], { ...clamp, easing: cubic });
  const rehook = interpolate(frame, [402, 418], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <PlanSchematic o={xray * 0.95} />

      {/* the plan, drawn on light marble, never on the dark shaft */}
      <RouteLine idKey="h1" path="M179 1310 L179 744" draw={draw1} opacity={0.9 * planO} />
      <RouteLine idKey="h2" path="M901 744 L901 1128" draw={draw2} opacity={0.9 * planO} />

      {/* claim */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 452,
          display: "flex",
          justifyContent: "center",
          opacity: claimO,
          transform: `scale(${claim})`,
        }}
      >
        <Stamp fontSize={42} rotate={-1.6}>
          the close button
          <br />
          is <span style={{ color: theme.second }}>fake</span>
        </Stamp>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 612,
          textAlign: "center",
          opacity: chipIn * chipO,
          transform: `translateY(${(1 - chipIn) * 16}px)`,
        }}
      >
        <Chip>it already has a plan</Chip>
      </div>

      {/* the shot the episode keeps coming back to */}
      <div style={{ position: "absolute", left: PANEL_LEFT, top: PANEL_TOP, transform: `translateY(${lift}px)` }}>
        <DoorPanel w={PANEL_W} open={1}>
          <CloseButton size={150} pressed={press} ring={ring} dead />
        </DoorPanel>
      </div>

      <HandPress
        size={105}
        press={press}
        style={{ position: "absolute", left: 588, top: 1217, opacity: handO }}
      />

      {/* ...and you're part of it: the plan bends round to end at THIS door */}
      <RouteLine idKey="h3" path="M901 1158 Q901 1244 845 1244 L658 1244" draw={draw3} width={4} opacity={planO} />
      {endDot > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 658 - 13,
            top: 1244 - 13,
            width: 26,
            height: 26,
            borderRadius: 999,
            background: theme.accent,
            opacity: endDot,
            transform: `scale(${endPulse})`,
            boxShadow: `0 0 22px ${theme.accentGlow}`,
          }}
        />
      ) : null}

      {/* --- REHOOK: who is the one person? (paid off in `timer`) ---------- */}
      {rehook > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1180,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            opacity: rehook,
            transform: `translateY(${(1 - rehook) * 18}px)`,
          }}
        >
          <Keyhole size={86} />
          <Stamp fontSize={38} rotate={-1.6}>
            it works for exactly
            <br />
            <span style={{ color: theme.accent }}>one person</span>
          </Stamp>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
