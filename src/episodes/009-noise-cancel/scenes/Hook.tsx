import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useEnter } from "../../../components/ui";
import { useTheme } from "../../../themes";
import {
  ANTI,
  Chip,
  HeadProfile,
  JaggedGlyph,
  MonoTag,
  NOISE,
  Stamp,
  SUM,
  Wave,
  clamp,
  easeOut,
  slotOpacity,
} from "./kit";

// hook — THE FIGHT
// v2 retime: 575f (19.16s). The scene nearly TRIPLED (was ~225f) because the
// narration gained the direct-question opener and the rehook line. The extra
// time does NOT go into slowing the old beats down — it goes into (a) letting
// the standoff actually breathe and (b) the new rehook beat at the tail.
//
// VISUAL HOOK (§0.7.2): frame 0 opens MID-COLLISION. The noise is already
// halfway across, the cup is already firing anti-noise back at it, and the
// white SUM segment is already burning between them. Nothing "arrives" — the
// fight is in progress before the viewer can blink. The first 96f only tighten
// the standoff; they are not a build-up.
//
// REHOOK (§0.7.4 / plan 009.5): the closing chip opens the loop that the final
// scene pays off — "one sound they can never erase", with a jagged wavelet
// standing in for the baby. The baby is never named here; naming it spoils the
// payoff.
//
// Beat table (D = 575, 30fps; % of scene; narration times from timing.json):
//   f0      0%    stamp pops (title hook, by f9) — collision ALREADY running
//   f0-96   0-17% the two fronts tighten onto the battle line, then hold
//   f8-26   1-5%  "the world" / "your ear" edge tags fade in
//   f96-296 17-51% breathing standoff: the line shoves back and forth
//   f296-446 51-78% loop chip: "so how does shouting make silence?"
//   f405-452 70-79% "= silence" tag over the flat segment (word lands f413)
//   f452-575 79-100% REHOOK chip + jagged glyph, NOISE-tinted, holds to the cut
const D = 575;

const EAR = { x: 768, y: 940 };
const CUP_EDGE = 704; // ear cup outer (left) edge — where anti-noise is emitted
const NOISE_START = 30;
const K = 0.0762; // ~4 cycles across the noise run
const AMP = 46;

// Where the two fronts meet at f0 vs where they settle. The f0 pair is already
// a collision (188px of white flat segment between them), not an approach.
const NOISE_F0 = 318;
const NOISE_SETTLED = 352;
const ANTI_F0 = 506;
const ANTI_SETTLED = 446;

// Tail beats are expressed off D so a future retime moves them together.
const REHOOK_IN = D - 123; // 452
const LOOP_OUT = REHOOK_IN - 6; // 446 — 6f of clear air, never a crossfade

export const Hook: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const claimIn = useEnter(1, { damping: 12 });

  // `settle` only tightens the standoff that is ALREADY happening at f0.
  const settle = interpolate(frame, [0, 96], [0, 1], { ...clamp, easing: easeOut });

  // The standoff breathes: the world shoves the battle line inward, the
  // headphone shoves it back. Two incommensurate sine rates so 200f of holding
  // never repeats visibly. Deterministic — no random, no Date.now.
  const push = Math.sin(frame * 0.075) * 13 * settle;
  const spread = Math.sin(frame * 0.041 + 1.2) * 8 * settle;

  const noiseFront = NOISE_F0 + settle * (NOISE_SETTLED - NOISE_F0) + push;
  const antiLeft = ANTI_F0 + settle * (ANTI_SETTLED - ANTI_F0) + push + spread;

  const antiW = Math.max(0, CUP_EDGE - antiLeft);

  // World-space phase, re-anchored to each wave's own left edge so the pattern
  // does not slide when the front moves.
  const noisePhase = -frame * 0.22 + NOISE_START * K;
  const antiPhase = frame * 0.22 + Math.PI + antiLeft * K;

  // Already clashing at f0 — this only firms up, it does not fade in. The
  // floors are high on purpose: at 0.7/0.72 the f0 SUM segment rendered grey,
  // and a grey flat line is the one thing this episode cannot afford.
  const clash = interpolate(frame, [0, 36], [0.9, 1], clamp);
  const shimmer = 0.82 + 0.18 * Math.sin(frame * 0.36);
  const gap = Math.max(0, antiLeft - noiseFront);

  const edgeTags = interpolate(frame, [8, 26], [0, 1], clamp);
  const loopChip = slotOpacity(frame, 296, LOOP_OUT);
  const silenceTag = interpolate(
    frame,
    [REHOOK_IN - 47, REHOOK_IN - 33, REHOOK_IN - 10, REHOOK_IN],
    [0, 1, 1, 0],
    clamp,
  );
  const rehook = interpolate(frame, [REHOOK_IN, REHOOK_IN + 16], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 455,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${claimIn})`,
        }}
      >
        <Stamp fontSize={44} rotate={-1.5}>
          <span style={{ color: NOISE }}>fights noise</span>
          <br />
          <span style={{ color: ANTI }}>with more noise</span>
        </Stamp>
      </div>

      <MonoTag x={65} y={640} color={NOISE} opacity={edgeTags}>
        the world
      </MonoTag>
      <MonoTag x={790} y={640} opacity={edgeTags}>
        your ear
      </MonoTag>

      <HeadProfile w={400} cupGlow style={{ left: 600, top: 700 }} />

      {/* the world's noise, streaming in — already mid-run at f0 */}
      <Wave
        x={NOISE_START}
        y={EAR.y}
        w={noiseFront - NOISE_START}
        amp={AMP}
        freq={K}
        phase={noisePhase}
        color={NOISE}
        strokeWidth={6}
        glow={12}
        opacity={1 - clash * 0.16}
      />

      {/* the headphone shouting back — already firing at f0 */}
      {antiW > 8 ? (
        <Wave
          x={antiLeft}
          y={EAR.y}
          w={antiW}
          amp={AMP}
          freq={K}
          phase={antiPhase}
          color={ANTI}
          strokeWidth={6}
          glow={12}
          opacity={1 - clash * 0.16}
        />
      ) : null}

      {/* where they meet: the first glimpse of SUM white */}
      {gap > 10 ? (
        <Wave
          x={noiseFront}
          y={EAR.y}
          w={gap}
          amp={0}
          freq={K}
          phase={0}
          color={SUM}
          strokeWidth={7}
          glow={18}
          opacity={clash * shimmer}
        />
      ) : null}

      {/* the flat segment gets named exactly when the word lands (f413) */}
      {silenceTag > 0.01 ? (
        <MonoTag
          x={(noiseFront + antiLeft) / 2 - 70}
          y={EAR.y - 104}
          size={26}
          color={theme.text}
          opacity={silenceTag}
        >
          silence
        </MonoTag>
      ) : null}

      {/* --------------------------------------------- bottom slot, sequenced */}
      {loopChip > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1250,
            textAlign: "center",
            opacity: loopChip,
          }}
        >
          <Chip color={theme.text}>so how does shouting make silence?</Chip>
        </div>
      ) : null}

      {/* REHOOK — the loop the LAST scene closes. Hard-sequenced after the loop
          chip (6f of clear air between them); holds to the cut at D. */}
      {frame >= REHOOK_IN ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1280,
            textAlign: "center",
            opacity: rehook,
            transform: `translateY(${interpolate(frame, [REHOOK_IN, REHOOK_IN + 16], [16, 0], { ...clamp, easing: easeOut })}px)`,
          }}
        >
          <Chip color={NOISE} style={{ fontSize: 24 }}>
            <JaggedGlyph w={48} h={26} style={{ marginRight: 16 }} />
            one sound they can never erase
          </Chip>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
