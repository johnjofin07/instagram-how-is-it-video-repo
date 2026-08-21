import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RiseIn, useEnter } from "../../../components/ui";
import {
  CAVITY,
  COLD,
  CavityStage,
  Chip,
  CheeseTray,
  FoodPlate,
  HOT,
  HeatLobes,
  INNER,
  LOBE_COLS,
  STAGE,
  Stamp,
  Turntable,
  clampT,
} from "./kit";

// Scene 3 — THE SPIN (D = 445f, from timing.json). The payoff scene.
// Beat 1: the hot spots stay put, the food is dragged through them.
// Beat 2: **[v2] PATTERN INTERRUPT** on "Don't believe me?" (f240) — a hard
//   snap cut, no easing anywhere: the turntable is YANKED out over 2 frames,
//   the lobe map cuts to black, a 2-frame CAVITY-dark wipe covers the stage
//   and the claim stamp is replaced (0-frame swap) by the direct-address card.
//   This is the episode's one tonal break (§0.7 device 5) — it must never
//   soften into a crossfade.
// Beat 3: the cheese tray melts in stripes at exactly LOBE_COLS.
// Beat 4: the lobe overlay fades in on top — same normalized columns, same
// rect, so registration is structural, not hand-placed.
//
// Beats are synced to the recorded v3 narration (timing.json, scene 2):
//   f0-90 "the hot spots can't move, so your food does"
//   f206-246 "Don't believe me?" (the interrupt)
//   f281-338 "microwave a tray of cheese"  ·  f339-381 "it melts in stripes"

const D = 435; // scene length in frames — timing.json sceneSeconds[2] * 30
const CUT = 206; // the pattern interrupt — everything before it ends HERE

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const BITES = 6;
const A0 = 0;
const SPIN_RATE = 1.0; // deg/frame — fast enough that a bite crosses a lobe
const PLATE_H = 250;
const PLATE_TOP = STAGE.y + STAGE.h - PLATE_H - 40;

const exposure = (u: number) => {
  const d = Math.min(...LOBE_COLS.map((c) => Math.abs(u - c)));
  return clampT(Math.exp(-((d / 0.095) ** 2)) * 1.06 - 0.06);
};

const biteU = (i: number, angleDeg: number) =>
  0.5 + 0.325 * Math.cos(((angleDeg + (i * 360) / BITES) * Math.PI) / 180);

// Heat ACCUMULATES as each bite is dragged through the (stationary) lobes.
// Coarse deterministic integral — no randomness, no frame-order dependence.
const heatsAt = (frame: number) =>
  Array.from({ length: BITES }, (_, i) => {
    let acc = 0;
    for (let t = 0; t <= frame; t += 2) {
      acc += exposure(biteU(i, A0 + t * SPIN_RATE)) * 0.045;
    }
    return clampT(acc);
  });

export const Spin: React.FC = () => {
  const frame = useCurrentFrame();

  const claimIn = useEnter(2, { damping: 11 });
  const stageIn = interpolate(frame, [0, 12], [0, 1], clamp);
  const angle = A0 + frame * SPIN_RATE;

  // THE CUT: the plate is yanked out in 2 frames, LINEAR — no easing, that is
  // what makes it read as a cut and not a transition.
  const plateOut = interpolate(frame, [CUT - 1, CUT + 1], [0, 1], clamp);
  const wipe = interpolate(frame, [CUT - 1, CUT, CUT + 1, CUT + 2], [0, 0.92, 0.92, 0], clamp);
  const trayIn = interpolate(frame, [250, 280], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });
  const melt = interpolate(frame, [298, 385], [0, 1], clamp);
  const overlay = interpolate(frame, [388, 414], [0, 1], clamp);

  // heat accumulates right up to the cut, then the plate is gone
  const heats = heatsAt(Math.min(frame, CUT - 2));
  const trayW = INNER.w;
  const trayH = trayW * 0.42;
  const trayTop = STAGE.y + (STAGE.h - trayH) / 2;

  return (
    <AbsoluteFill>
      {/* beat 1 claim — held right up to the cut, then GONE. No fade: the
          swap is the interrupt. */}
      {frame < CUT ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 462,
            textAlign: "center",
            transform: `scale(${claimIn})`,
          }}
        >
          <Stamp fontSize={54}>
            the hot spots can&apos;t move.
            <br />
            <span style={{ color: HOT }}>the food does.</span>
          </Stamp>
        </div>
      ) : null}

      {/* [v2] the interrupt card — direct address, COLD on a CAVITY-dark slab.
          It appears on the cut frame with no spring and no fade. */}
      {frame >= CUT && frame < 292 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 448, textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "22px 46px",
              borderRadius: 20,
              background: CAVITY,
              border: `3px solid ${COLD}`,
              boxShadow: "0 16px 40px rgba(30, 38, 44, 0.34)",
            }}
          >
            <Stamp fontSize={56} color={COLD} style={{ padding: 0 }}>
              don&apos;t believe me?
            </Stamp>
          </div>
        </div>
      ) : null}

      {frame >= 296 && frame < 386 ? (
        <RiseIn delay={296} style={{ position: "absolute", left: 0, right: 0, top: 482, textAlign: "center" }}>
          <div style={{ opacity: interpolate(frame, [372, 384], [1, 0], clamp) }}>
            <Chip color={HOT}>a tray of cheese, no plate</Chip>
          </div>
        </RiseIn>
      ) : null}

      <div style={{ opacity: stageIn }}>
        <CavityStage w={STAGE.w} h={STAGE.h} style={{ position: "absolute", left: STAGE.x, top: STAGE.y }} />

        {/* the map — always on, always in the same place */}
        <HeatLobes
          w={INNER.w}
          h={STAGE.h}
          on={frame < CUT ? 0.72 : 0}
          pulse={0.5 + 0.5 * Math.sin(frame / 15)}
          style={{ position: "absolute", left: INNER.x, top: STAGE.y }}
        />

        {/* beat 1-2: the plate, dragging the food through the lobes */}
        {plateOut < 0.999 ? (
          <div
            style={{
              position: "absolute",
              left: INNER.x,
              top: PLATE_TOP,
              transform: `translate(${plateOut * 620}px, ${plateOut * 130}px) scale(${1 - plateOut * 0.18})`,
              opacity: 1 - plateOut,
            }}
          >
            <Turntable size={INNER.w * 0.99} angle={angle} h={PLATE_H} style={{ position: "absolute", left: INNER.w * 0.005, top: 0 }} />
            <FoodPlate size={INNER.w} bites={heats} angle={angle} h={PLATE_H} style={{ position: "absolute", left: 0, top: 0 }} />
          </div>
        ) : null}

        {/* the 2-frame dark wipe that sells the cut */}
        {wipe > 0.01 ? (
          <div
            style={{
              position: "absolute",
              left: STAGE.x,
              top: STAGE.y,
              width: STAGE.w,
              height: STAGE.h,
              borderRadius: 26,
              background: CAVITY,
              opacity: wipe,
            }}
          />
        ) : null}

        {/* beat 3-4: the tray. Stripes grow ONLY at LOBE_COLS. */}
        {frame >= 250 ? (
          <div
            style={{
              position: "absolute",
              left: INNER.x,
              top: trayTop,
              transform: `translateX(${(1 - trayIn) * -720}px)`,
            }}
          >
            <CheeseTray w={trayW} melt={melt} />
          </div>
        ) : null}

        {/* the overlay is drawn again ON TOP of the tray for the registration
            beat — same rect, same LOBE_COLS, so it lands on the stripes. */}
        {overlay > 0.01 ? (
          <HeatLobes
            w={INNER.w}
            h={STAGE.h}
            on={overlay}
            showCold={false}
            outline
            pulse={0.5 + 0.5 * Math.sin(frame / 15)}
            style={{ position: "absolute", left: INNER.x, top: STAGE.y }}
          />
        ) : null}
      </div>

      {/* closing chip — holds the last ~45f of the scene (through D = 445) */}
      {frame >= D - 45 ? (
        <RiseIn delay={D - 45} style={{ position: "absolute", left: 0, right: 0, top: 1272, textAlign: "center" }}>
          <Chip color={HOT} style={{ maxWidth: 780 }}>
            the cold spots, photographed
          </Chip>
        </RiseIn>
      ) : null}
    </AbsoluteFill>
  );
};
