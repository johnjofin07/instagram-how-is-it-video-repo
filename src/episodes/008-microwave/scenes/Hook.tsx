import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RiseIn, useEnter } from "../../../components/ui";
import { useTheme } from "../../../themes";
import {
  CavityStage,
  COLD,
  Chip,
  FieldLines,
  FoodPlate,
  ForkSpark,
  HeatLobes,
  INNER,
  LOBE_COLS,
  MicrowaveBody,
  STAGE,
  Stamp,
  Turntable,
  cavityRect,
  clampT,
} from "./kit";

// Scene 1 — THE FORK (v3 hook flip: lightning leads, cold spots rehook).
//
// v3 hook framework (EPISODE-PLANS.md §0.7 / §008.5):
//   title hook   "YOUR MICROWAVE MAKES / REAL LIGHTNING" stamp by f9 — the
//                MACHINE is the claim; the fork is just the trigger ("all it
//                takes is a fork")
//   VISUAL HOOK  frame 0 opens INSIDE the cavity at full-stage scale — dark
//                stage, the big ForkSpark mid-strike at f2, field lines
//                crowding the tines, stage shaking on every hit. Maximum
//                spectacle before the viewer can blink; the mechanism
//                (WHY it sparks) is deliberately withheld for `spark`.
//   zoom-out     on "And the same waves…" the whole stage shrinks into the
//                cutaway MicrowaveBody on the counter — the chaos you just
//                watched lives inside THIS box. The wave map fades up in its
//                cavity as the word "waves" lands.
//   verbal hook  the lightning claim — no spoken deferral. The "saved for
//                last" chip alone keeps the loop open until `spark` closes
//                it on the same glyph, at the same full-stage scale.
//   REHOOK       the stamp hard-swaps to "YOUR MICROWAVE HAS / COLD SPOTS"
//                (deliberately parallel lead), the cold bites' ice styling
//                snaps on with it, and the plate begins its first slow turn
//                under "the real reason the plate spins" — loop paid off
//                across `waves`/`spin`.
//
// Beats are synced to the recorded v3 narration (timing.json, scene 0):
//   f63-115 "real lightning"  ·  f164-180 "a fork" (strike f166)
//   f182-231 "and the same waves that spark it" (zoom-out f168-198)
//   f247-272 "cold spots"  ·  f346-428 "that's the real reason the plate spins"

const D = 428; // scene length in frames — timing.json sceneSeconds[0] * 30

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---- full-stage cavity (the cold open), same geometry as Spark.tsx ----
const FORK_W = 320;
const FORK_H = FORK_W * 1.35;
const FORK_X = 540 - FORK_W / 2;
const FORK_TOP = STAGE.y - 36; // hangs through the roof
const TIP_Y = FORK_TOP + FORK_H * 0.74;

// Bolts: instant hit at f2, a burst under "real lightning" (f63-115), one
// last crack as the trigger is named ("a fork", f166). 8f flash, 1f peak.
const STRIKES = [2, 30, 66, 84, 103, 166];

// zoom-out: STAGE rect shrinks onto the diorama's cavity rect. Kept TIGHT
// (24f) with the cross-fade riding the move — a slower zoom leaves both
// layers legible mid-flight and reads as a glitch, not a match cut.
const ZOOM_IN = 168;
const ZOOM_OUT = 192;

// ---- diorama geometry (single source of truth; everything derives from it) ----
const BODY = { left: 80, top: 686, w: 920 };
const CAV = cavityRect(BODY.left, BODY.top, BODY.w);
const ZOOM_SCALE = CAV.w / STAGE.w;
const STAGE_CX = STAGE.x + STAGE.w / 2;
const STAGE_CY = STAGE.y + STAGE.h / 2;
const ZOOM_DX = CAV.x + CAV.w / 2 - STAGE_CX;
const ZOOM_DY = CAV.y + CAV.h / 2 - STAGE_CY;

const BITES = 6;
const A0 = 0; // deg — with 6 bites this parks 2 on antinodes and 4 in the nulls
const biteU = (i: number, angleDeg: number) =>
  0.5 + 0.325 * Math.cos(((angleDeg + (i * 360) / BITES) * Math.PI) / 180);

// heat a bite picks up at normalized x `u`: a gaussian around each antinode
export const exposure = (u: number) => {
  const d = Math.min(...LOBE_COLS.map((c) => Math.abs(u - c)));
  return clampT(Math.exp(-((d / 0.095) ** 2)) * 1.06 - 0.06);
};

// Heat belongs to the FOOD, not to the position — so it is fixed at the
// bite's resting spot and simply rides along with the (barely) turning plate.
const HEATS = Array.from({ length: BITES }, (_, i) => exposure(biteU(i, A0)));

// the stamp swap + rehook beat
const SWAP = 246; // "cold spots" lands f247
const SPIN_IN = 350; // "that's the real reason the plate spins" (f346)

export const Hook: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const claimIn = useEnter(2, { damping: 11 });
  const coldIn = useEnter(SWAP + 2, { damping: 11 });
  const lobeBreath = 0.5 + 0.5 * Math.sin(frame / 17);

  // ---- the lightning show ----
  const strike = STRIKES.reduce((acc, s) => {
    const d = frame - s;
    if (d < 0 || d > 8) return acc;
    return Math.max(acc, d < 2 ? 1 : 1 - (d - 2) / 6);
  }, 0);
  const whiteFlash = STRIKES.some((s) => frame === s) ? 0.34 : 0;
  // tips smolder between strikes (deterministic flicker), die during the zoom
  const tipGlow =
    (0.78 + 0.14 * Math.sin(frame / 2.3)) * interpolate(frame, [ZOOM_IN, ZOOM_OUT - 8], [1, 0], clamp);
  // every hit rattles the stage — the shake IS the "real" in "real lightning"
  const shakeX = strike * 6 * Math.sin(frame * 2.7);
  const shakeY = strike * 4 * Math.cos(frame * 3.3);

  // ---- zoom-out: the cavity shrinks into the machine on the counter ----
  const zoomT = interpolate(frame, [ZOOM_IN, ZOOM_OUT], [0, 1], {
    ...clamp,
    easing: (t) => t * t * (3 - 2 * t),
  });
  const stageOpacity = interpolate(frame, [ZOOM_IN + 6, ZOOM_OUT], [1, 0], clamp);
  const dioramaIn = interpolate(frame, [ZOOM_IN + 2, ZOOM_OUT - 4], [0, 1], clamp);
  // the wave map fades up in the diorama's cavity as "waves" is spoken (f202)
  const lobesIn = interpolate(frame, [194, 222], [0, 0.46], clamp);

  // REHOOK: the cold call-out pulses only once the stamp has swapped.
  const ringPulse = 0.5 + 0.5 * Math.sin(frame / 6);

  // f270-330: the HOT bites come up for contrast (the cold ones can't follow —
  // multiplying keeps them under the 0.18 "stone cold" threshold throughout).
  const hotGlow = interpolate(frame, [270, 330], [0.58, 1], clamp);

  // "the real reason the plate spins": the plate starts its first slow turn,
  // freezes after 30 degrees ("plate spins" lands f396-428).
  const angle = interpolate(frame, [SPIN_IN, SPIN_IN + 70], [0, 30], clamp);

  const plateSize = CAV.w;
  const plateH = 250;
  const plateTop = CAV.y + CAV.h - plateH - 26;
  const tableSize = CAV.w * 0.99;
  const tableLeft = CAV.x + (CAV.w - tableSize) / 2;

  return (
    <AbsoluteFill>
      {/* the claim — on screen immediately, swaps to the rehook claim */}
      {frame < SWAP ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 450,
            textAlign: "center",
            transform: `scale(${claimIn})`,
            opacity: interpolate(frame, [SWAP - 16, SWAP - 4], [1, 0], clamp),
          }}
        >
          <Stamp fontSize={54}>
            your microwave makes
            <br />
            <span style={{ color: theme.warn }}>real lightning</span>
          </Stamp>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 450,
            textAlign: "center",
            transform: `scale(${coldIn})`,
          }}
        >
          <Stamp fontSize={54}>
            your microwave has
            <br />
            <span style={{ color: COLD }}>cold spots</span>
          </Stamp>
        </div>
      )}

      {/* ---------------- diorama: the machine on the counter ---------------- */}
      {frame >= ZOOM_IN - 2 ? (
        <div style={{ opacity: dioramaIn }}>
          <div style={{ position: "absolute", left: BODY.left, top: BODY.top }}>
            <MicrowaveBody w={BODY.w} cutaway />
          </div>

          {/* the invisible map, fading up on the word "waves" */}
          <HeatLobes
            w={CAV.w}
            h={CAV.h}
            on={lobesIn}
            pulse={lobeBreath * 0.5}
            style={{ position: "absolute", left: CAV.x, top: CAV.y }}
          />

          <Turntable
            size={tableSize}
            angle={angle}
            h={plateH}
            style={{ position: "absolute", left: tableLeft, top: plateTop }}
          />
          {/* Before the stamp swap the null bites are floored to 0.19 — just
              over FoodPlate's 0.18 cold threshold — so the ice styling stays
              hidden until it snaps on WITH the COLD SPOTS stamp. */}
          <FoodPlate
            size={plateSize}
            bites={HEATS.map((h) => {
              const v = h * hotGlow;
              return frame >= SWAP ? v : Math.max(v, 0.19);
            })}
            angle={A0 + angle}
            h={plateH}
            style={{ position: "absolute", left: CAV.x, top: plateTop }}
          />

          {/* REHOOK — the cold call-out, pulsing from the stamp swap */}
          {frame >= SWAP ? (
            <svg
              width={CAV.w}
              height={plateH}
              viewBox={`0 0 ${CAV.w} ${plateH}`}
              style={{ position: "absolute", left: CAV.x, top: plateTop }}
            >
              {HEATS.map((heat, i) => {
                const t = ((A0 + angle + (i * 360) / BITES) * Math.PI) / 180;
                // ring only the two FRONT cold bites — ringing all four is noise
                if (heat >= 0.18 || Math.sin(t) < 0.1) return null;
                const cx = CAV.w / 2 + CAV.w * 0.325 * Math.cos(t);
                const cy = plateH / 2 + plateH * 0.22 * Math.sin(t);
                const r0 = plateH * 0.13 * 1.55;
                return (
                  <g key={i}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r0 * (1.02 + ringPulse * 0.09)}
                      fill="none"
                      stroke={COLD}
                      strokeWidth="5"
                      opacity={(0.45 + ringPulse * 0.5) * interpolate(frame, [SWAP, SWAP + 14], [0, 1], clamp)}
                    />
                  </g>
                );
              })}
            </svg>
          ) : null}
        </div>
      ) : null}

      {/* ---------------- VISUAL HOOK: inside the cavity, mid-strike ----------------
          Full-stage dark interior (same geometry as Spark.tsx — the payoff
          scene returns here, closing the loop at the same scale). On "And the
          same waves…" the whole stage shrinks onto the diorama's cavity rect:
          the chaos lives inside the box on your counter. */}
      {stageOpacity > 0.01 ? (
        <div
          style={{
            opacity: stageOpacity,
            transform: `translate(${zoomT * ZOOM_DX + shakeX}px, ${zoomT * ZOOM_DY + shakeY}px) scale(${
              1 - zoomT * (1 - ZOOM_SCALE)
            })`,
            transformOrigin: `${STAGE_CX}px ${STAGE_CY}px`,
          }}
        >
          <CavityStage w={STAGE.w} h={STAGE.h} style={{ position: "absolute", left: STAGE.x, top: STAGE.y }} />

          {/* the wave map, faint under the bolts — "the same waves that spark it" */}
          <HeatLobes
            w={INNER.w}
            h={STAGE.h}
            on={0.24 + strike * 0.14}
            pulse={lobeBreath * 0.6}
            style={{ position: "absolute", left: INNER.x, top: STAGE.y }}
          />

          {/* field lines already crowding the tines at f0 — mid-action, no
              build-up. Resting converge stays HIGH (0.78): at ~0.5 the
              interpolated lines read as static curled springs in stills
              (caught in QA at f102); the strike only flares them the rest of
              the way home. */}
          <FieldLines
            w={INNER.w}
            h={STAGE.h}
            focus={{ x: 540 - INNER.x, y: TIP_Y - STAGE.y }}
            converge={clampT(0.78 + strike * 0.22)}
            style={{ position: "absolute", left: INNER.x, top: STAGE.y }}
          />

          {/* clipped to the cavity: the fork hangs THROUGH the oven roof */}
          <div
            style={{
              position: "absolute",
              left: STAGE.x,
              top: STAGE.y,
              width: STAGE.w,
              height: STAGE.h,
              borderRadius: 26,
              overflow: "hidden",
            }}
          >
            <ForkSpark
              size={FORK_W}
              strike={strike}
              boltCount={3}
              glow={clampT(tipGlow)}
              style={{ position: "absolute", left: FORK_X - STAGE.x, top: FORK_TOP - STAGE.y }}
            />
          </div>

          {/* the 1-frame flash, confined to the cavity (never a full-screen strobe) */}
          {whiteFlash > 0 ? (
            <div
              style={{
                position: "absolute",
                left: STAGE.x,
                top: STAGE.y,
                width: STAGE.w,
                height: STAGE.h,
                borderRadius: 26,
                background: `radial-gradient(ellipse 46% 60% at 50% ${((TIP_Y - STAGE.y) / STAGE.h) * 100}%, #FFFFFF, rgba(255,255,255,0) 72%)`,
                opacity: whiteFlash,
              }}
            />
          ) : null}
        </div>
      ) : null}

      {/* the deferral is on-screen only — this chip alone holds the loop
          open until `spark` closes it ~45s later */}
      {frame >= 202 && frame < 246 ? (
        <RiseIn delay={202} style={{ position: "absolute", left: 0, right: 0, top: 612, textAlign: "center" }}>
          <div style={{ opacity: interpolate(frame, [232, 244], [1, 0], clamp) }}>
            <Chip color={theme.warn}>lightning — saved for last</Chip>
          </div>
        </RiseIn>
      ) : null}

      {/* narration dropped the "ice cold" descriptor for time — this chip
          carries it on-screen instead */}
      {frame >= 264 && frame < 350 ? (
        <RiseIn delay={264} style={{ position: "absolute", left: 0, right: 0, top: 612, textAlign: "center" }}>
          <div style={{ opacity: interpolate(frame, [336, 348], [1, 0], clamp) }}>
            <Chip color={COLD}>ice cold — no matter how long</Chip>
          </div>
        </RiseIn>
      ) : null}

      {/* the loop out: the plate has only just begun to turn */}
      {frame >= SPIN_IN + 18 ? (
        <RiseIn
          delay={SPIN_IN + 18}
          style={{ position: "absolute", left: 0, right: 0, top: 1262, textAlign: "center" }}
        >
          <div style={{ opacity: interpolate(frame, [D - 17, D - 5], [1, 0], clamp) }}>
            <Chip color={theme.accent} style={{ maxWidth: 760 }}>
              so why does it spin?
            </Chip>
          </div>
        </RiseIn>
      ) : null}
    </AbsoluteFill>
  );
};
