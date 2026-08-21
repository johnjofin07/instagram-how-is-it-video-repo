import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RiseIn, useEnter } from "../../../components/ui";
import { useTheme } from "../../../themes";
import {
  CavityStage,
  Chip,
  FieldLines,
  ForkSpark,
  HeatLobes,
  INNER,
  STAGE,
  MicrowaveBody,
  Stamp,
  cavityRect,
  clampT,
} from "./kit";

// Scene 5 — THE SPARK (D = 420f, from timing.json). Danger beat + CTA.
// theme.warn appears HERE AND NOWHERE ELSE in the episode: it is the danger
// color, not a heat color. Heat stays on the HOT / HOT_CORE pair throughout.
//
// [v3] THE MAIN LOOP CLOSES HERE. The hook now OPENS the video on this same
// `ForkSpark` glyph mid-strike ("your microwave can make real lightning —
// all it takes is a fork"), so this scene pays off the video-long promise on
// literally the same object — here at full size, with the field-line
// mechanism the hook deliberately withheld. Do not swap this for a different
// fork drawing.
//
// [v2] The spoken CTA was cut from the recording (§0.7.4), so the ask is an
// on-screen chip during the allDone end hold. The audio ends on "maybe don't
// test that one" (f378) — everything after that is the CTA's 42-frame hold.
//
// Beats are synced to the recorded narration (timing.json, scene 4):
//   f1-111 "now, about that fork"  ·  f145-181 "squeeze the waves"
//   f190-242 "tiny lightning bolts"  ·  f247-327 "real indoor lightning"
//   f331-378 "maybe don't test that one"

const D = 420; // scene length in frames — timing.json sceneSeconds[4] * 30

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const FORK_W = 340;
const FORK_H = FORK_W * 1.35;
const FORK_X = 540 - FORK_W / 2;
const FORK_REST = 618;
const TIP_Y = FORK_REST + FORK_H * 0.74;

const BODY = { left: 90, top: 600, w: 900 };
const CAV = cavityRect(BODY.left, BODY.top, BODY.w);

// three strikes, 26f apart; each is an 8f flash with a 1-frame peak.
// Placed under "tiny lightning bolts" (f190-242), the last one landing with
// the INDOOR LIGHTNING stamp on "real indoor lightning" (f247).
const STRIKES = [196, 222, 248];

export const Spark: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const stageIn = interpolate(frame, [0, 12], [0, 1], clamp);

  // the loop glyph lowers in on a slight arc, landing on "that fork" (f65-111)
  const drop = interpolate(frame, [8, 72], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });
  const retreat = interpolate(frame, [286, 336], [0, 1], { ...clamp, easing: (t) => t * t });

  const forkY = FORK_REST - (1 - drop) * 300 - retreat * 380;
  const forkTilt = (1 - drop) * -9 + retreat * 7;

  // the field un-crowds as the fork leaves — otherwise 10 lines stay hooked
  // onto an empty point after the retreat (caught in QA at f270)
  const converge = interpolate(frame, [96, 186], [0, 1], clamp) * (1 - retreat);
  const tipGlow = interpolate(frame, [140, 196, 262, 286], [0, 1, 1, 0], clamp);

  const strike = STRIKES.reduce((acc, s) => {
    const d = frame - s;
    if (d < 0 || d > 8) return acc;
    return Math.max(acc, d < 2 ? 1 : 1 - (d - 2) / 6);
  }, 0);
  const whiteFlash = STRIKES.some((s) => frame === s) ? 0.34 : 0;

  const stampIn = useEnter(248, { damping: 10 });

  // closing swap: cavity stage out by f362, machine back in from f364. Keep
  // the gap at ~2f — a longer one leaves the frame empty under the chips.
  const stageOut = interpolate(frame, [346, 362], [1, 0], clamp);
  const machineIn = interpolate(frame, [364, 388], [0, 1], clamp);
  const hum = 0.5 + 0.5 * Math.sin(frame / 13);

  return (
    <AbsoluteFill>
      {frame >= 248 && frame < 368 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 462,
            textAlign: "center",
            transform: `scale(${stampIn})`,
            opacity: interpolate(frame, [354, 366], [1, 0], clamp),
          }}
        >
          <Stamp fontSize={62} color={theme.warn}>
            indoor lightning
          </Stamp>
        </div>
      ) : null}

      {/* ---------------- interior stage (fork beat) ---------------- */}
      {stageOut > 0.01 ? (
        <div style={{ opacity: stageIn * stageOut }}>
          <CavityStage w={STAGE.w} h={STAGE.h} style={{ position: "absolute", left: STAGE.x, top: STAGE.y }} />

          <HeatLobes
            w={INNER.w}
            h={STAGE.h}
            on={0.28}
            pulse={hum * 0.6}
            style={{ position: "absolute", left: INNER.x, top: STAGE.y }}
          />

          {converge > 0.01 ? (
            <FieldLines
              w={INNER.w}
              h={STAGE.h}
              focus={{ x: 540 - INNER.x, y: TIP_Y - STAGE.y }}
              converge={converge}
              style={{ position: "absolute", left: INNER.x, top: STAGE.y }}
            />
          ) : null}

          {/* clipped to the cavity: the fork enters and leaves THROUGH the
              oven roof, it must never float above the stage */}
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
            {/* the loop glyph — same component as the hook's rehook tease,
                here at full size with all three tines firing */}
            <ForkSpark
              size={FORK_W}
              strike={strike}
              boltCount={3}
              glow={clampT(tipGlow)}
              style={{
                position: "absolute",
                left: FORK_X - STAGE.x,
                top: forkY - STAGE.y,
                transform: `rotate(${forkTilt}deg)`,
                transformOrigin: "50% 10%",
              }}
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

      {/* ---------------- CTA hold: the machine, humming ---------------- */}
      {machineIn > 0.01 ? (
        <div style={{ opacity: machineIn }}>
          <div style={{ position: "absolute", left: BODY.left, top: BODY.top }}>
            <MicrowaveBody w={BODY.w} cutaway />
          </div>
          <HeatLobes
            w={CAV.w}
            h={CAV.h}
            on={0.5 + hum * 0.32}
            pulse={hum}
            style={{ position: "absolute", left: CAV.x, top: CAV.y }}
          />
        </div>
      ) : null}

      {/* the danger line, on "maybe don't test that one" (f331) — it stays up
          through the end hold, with the CTA stacked under it */}
      {frame >= 330 ? (
        <RiseIn delay={330} style={{ position: "absolute", left: 0, right: 0, top: 1178, textAlign: "center" }}>
          <Chip color={theme.warn} style={{ maxWidth: 780 }}>
            maybe don&apos;t test that one
          </Chip>
        </RiseIn>
      ) : null}

      {/* [v2] on-screen CTA (§0.7.4) — plain theme `card` chip in textDim, so
          it reads as the channel asking rather than as part of the danger
          beat. Bottom edge lands ~y1345, clear of the caption pill at y1370. */}
      {frame >= D - 42 ? (
        <RiseIn delay={D - 42} style={{ position: "absolute", left: 0, right: 0, top: 1288, textAlign: "center" }}>
          <Chip style={{ maxWidth: 820 }}>what machine should I break down next? ↓</Chip>
        </RiseIn>
      ) : null}
    </AbsoluteFill>
  );
};
