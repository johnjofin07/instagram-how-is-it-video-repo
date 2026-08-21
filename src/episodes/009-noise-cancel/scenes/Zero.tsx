import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import {
  ANTI,
  Chip,
  EAR_ANCHOR,
  HeadProfile,
  MonoTag,
  NOISE,
  ScopeFrame,
  Stamp,
  SUM,
  Wave,
  clamp,
  easeOut,
  mixHex,
  rand,
} from "./kit";

// zero — THE ZERO. The money shot of the episode.
// v2 retime: 514f (17.14s), up from ~420f. Two exact opposites are added
// together on one scope and the answer is a white flat line. The SUM wave is a
// REAL point-wise sum (Wave's `add` prop), so the flatline is not a drawing
// trick — as the misalignment goes to zero the residual genuinely collapses.
// That white line is the brightest thing in the whole episode; nothing else may
// use SUM white.
//
// ===== [v2] PATTERN INTERRUPT — LITERAL SILENCE (plan §0.7 row 009) =========
// The recorded take really does stop. Measured on the MP3 (silencedetect,
// -38dB): scene-relative dead air at 7.97-8.88s and 9.44-10.35s, with only a
// whispered "Zero." between them. So frames 223-310 carry ~2.4s of near-total
// audio silence.
//
// The screen has to match it. From f223 to f306 NOTHING on this stage moves:
//   * the merge is finished (`mis` hits 0 at f222 → the sum is EXACTLY flat)
//   * every fading element has completed its fade before f222
//   * the SUM glow stops interpolating at f222 and is constant after
//   * `flare` only ever multiplies `callouts`, which is 0 by f214
//   * the "0" HARD-CUTS in on the whispered word (f266) with no spring, no
//     scale, no fade — a cut is not motion; an animated pop would be
//   * `scopeFade` no longer fades out mid-scene (it used to, at f238-248,
//     right through what is now the interrupt)
// Any beat added inside f223-306 kills the effect. That stillness IS the
// interrupt — it is the one thing in this episode that cannot be re-shot.
//
// Beat table (D = 514; narration frames from timing.json):
//   f0-96    scope in; the pair drifts apart into two rows
//   f96-158  "peak meets dip" chip (words f99-148)
//   f130-222 the pair merges onto the axis; misalignment → 0
//   f150-218 "+1" / "−1" callouts ("Plus one meets minus one", f151-223)
//   f223-306 ***THE INTERRUPT*** — flat white line, dead still, 83 frames
//   f266     "0" hard-cuts in on the whispered "Zero."
//   f306-312 the scope releases; hard cut to the ear canal (no crossfade)
//   f312-400 air particles jitter, then freeze ("stops moving", f371-407)
//   f400-416 "the air just stops moving"
//   f452-514 closing stamp: "not blocked. ERASED." (words f412-513)
const D = 514;

const MERGED = 222; // misalignment is exactly 0 from here on (f223 = still #1)
const ZERO_CUT = 266; // the whispered "Zero." lands here
const STILL_OUT = 306; // f223-306 = 83 still frames; the plan's floor is 60
const B_IN = 312; // phase B starts; phase A is fully gone (no overlap)
const CLOSE_IN = D - 62; // 452 — closing stamp, tied to the scene tail

const SCOPE = { x: 80, y: 700, w: 920, h: 500 };
const AXIS = SCOPE.y + SCOPE.h / 2; // 950
const WX = 100;
const WW = 880;
const K = (Math.PI * 2 * 4) / WW; // 4 cycles
const AMP = 66;
const PEAKS = [275, 495, 715]; // local x where the noise wave peaks

// Ear-canal inset (phase B)
const INSET = { x: 555, y: 690, w: 425, h: 400 };
const HEAD = { x: 80, y: 640, w: 420 };
const EAR = {
  x: HEAD.x + HEAD.w * EAR_ANCHOR.x,
  y: HEAD.y + HEAD.w * 1.2 * EAR_ANCHOR.y,
};

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  bx: 65 + rand(i, 9, 1) * 250,
  by: 152 + rand(i, 9, 2) * 96,
  speed: 0.16 + rand(i, 9, 3) * 0.34,
  phase: rand(i, 9, 4) * Math.PI * 2,
  amp: 7 + rand(i, 9, 5) * 13,
  r: 5 + rand(i, 9, 6) * 5,
}));

export const Zero: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // --- phase A: the scope ---------------------------------------------------
  const cyNoise =
    frame < 130
      ? interpolate(frame, [6, 80], [640, 800], { ...clamp, easing: easeOut })
      : interpolate(frame, [130, MERGED], [800, AXIS], { ...clamp, easing: easeOut });
  const cyAnti =
    frame < 130
      ? interpolate(frame, [6, 80], [1260, 1100], { ...clamp, easing: easeOut })
      : interpolate(frame, [130, MERGED], [1100, AXIS], { ...clamp, easing: easeOut });

  // misalignment → 0. Residual amplitude is 2·AMP·sin(mis·0.425), which is
  // exactly 0 once the two waves are true opposites — and `mis` is clamped, so
  // it stays exactly 0 for every frame of the interrupt.
  const mis = interpolate(frame, [134, MERGED], [1, 0], { ...clamp, easing: easeOut });
  const pairFade = interpolate(frame, [192, MERGED], [1, 0], clamp);
  const sumIn = interpolate(frame, [134, 158], [0, 1], clamp);
  // NOTE: no mid-scene fade-out any more. The scope holds full brightness
  // straight through the interrupt and only releases at STILL_OUT.
  const scopeFade =
    interpolate(frame, [0, 14], [0, 1], clamp) *
    interpolate(frame, [STILL_OUT, B_IN], [1, 0], clamp);
  const labels = interpolate(frame, [150, 164, 206, 218], [0, 1, 1, 0], clamp);
  const callouts = interpolate(frame, [136, 152, 200, 214], [0, 1, 1, 0], clamp);
  const flare = 0.66 + 0.34 * Math.sin(frame * 0.5); // only ever scales `callouts`

  const phaseA = frame < B_IN;
  const phaseB = frame >= B_IN;

  // --- phase B: the ear canal ----------------------------------------------
  const bIn = interpolate(frame, [B_IN, B_IN + 18], [0, 1], clamp);
  const freeze = interpolate(frame, [364, 400], [1, 0], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill>
      {/* top slot — hard-sequenced: chip → the "0" → chip. Never overlapping. */}
      {frame < 162 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            textAlign: "center",
            opacity: interpolate(frame, [96, 112, 148, 158], [0, 1, 1, 0], clamp),
          }}
        >
          <Chip color={theme.text}>peak meets dip</Chip>
        </div>
      ) : null}

      {/* The "0". HARD CUT on the whispered word — no spring, no scale-up, no
          fade-in. It is the only thing that happens in 83 frames, and it has to
          arrive the way a cut arrives, not the way an animation arrives. It
          then holds perfectly still until the scope releases. */}
      {frame >= ZERO_CUT && frame < B_IN ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 455,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [STILL_OUT, B_IN], [1, 0], clamp),
          }}
        >
          {/* the numeral itself is SUM white, not theme.text — with the whole
              stage dark and flat this has to be the brightest thing on screen */}
          <Stamp fontSize={130} rotate={0} color={SUM} style={{ padding: "12px 52px" }}>
            <span style={{ color: SUM }}>0</span>
          </Stamp>
        </div>
      ) : null}

      {phaseB ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            textAlign: "center",
            opacity: interpolate(frame, [330, 348], [0, 1], clamp),
          }}
        >
          <Chip color={ANTI}>your eardrum feels nothing</Chip>
        </div>
      ) : null}

      {/* ---------------------------------------------------------- phase A */}
      {phaseA ? (
        <>
          <ScopeFrame x={SCOPE.x} y={SCOPE.y} w={SCOPE.w} h={SCOPE.h} opacity={scopeFade} />

          <Wave
            x={WX}
            y={cyNoise}
            w={WW}
            amp={AMP}
            freq={K}
            phase={0}
            color={NOISE}
            strokeWidth={6}
            glow={10}
            opacity={pairFade * scopeFade}
          />
          <Wave
            x={WX}
            y={cyAnti}
            w={WW}
            amp={AMP}
            freq={K}
            phase={Math.PI}
            color={ANTI}
            strokeWidth={6}
            glow={10}
            opacity={pairFade * scopeFade}
          />

          {/* +1 / −1 callouts, parked exactly on a peak and its mirror dip */}
          <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0, opacity: labels }}>
            <circle cx={WX + PEAKS[0]} cy={cyNoise - AMP} r="9" fill={NOISE} />
            <circle cx={WX + PEAKS[0]} cy={cyAnti + AMP} r="9" fill={ANTI} />
          </svg>
          <MonoTag x={WX + PEAKS[0] + 24} y={cyNoise - AMP - 17} size={30} color={NOISE} opacity={labels}>
            +1
          </MonoTag>
          <MonoTag x={WX + PEAKS[0] + 24} y={cyAnti + AMP - 17} size={30} color={ANTI} opacity={labels}>
            −1
          </MonoTag>

          {/* three alignment points flashing as the waves close */}
          <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0, opacity: callouts * flare }}>
            {PEAKS.map((p) => (
              <g key={p}>
                <line
                  x1={WX + p}
                  y1={cyNoise - AMP}
                  x2={WX + p}
                  y2={cyAnti + AMP}
                  stroke={SUM}
                  strokeWidth="3"
                  strokeDasharray="8 12"
                  opacity="0.75"
                />
                <circle cx={WX + p} cy={cyNoise - AMP} r="8" fill={SUM} />
                <circle cx={WX + p} cy={cyAnti + AMP} r="8" fill={SUM} />
              </g>
            ))}
          </svg>

          {/* the sum itself — a real point-wise addition of the two shapes */}
          <Wave
            x={WX}
            y={AXIS}
            w={WW}
            amp={AMP}
            freq={K}
            phase={0}
            add={{ amp: AMP, freq: K, phase: Math.PI + mis * 0.85 }}
            color={SUM}
            strokeWidth={8}
            // stops interpolating at MERGED — constant through the interrupt
            glow={interpolate(frame, [198, MERGED], [12, 34], clamp)}
            opacity={sumIn * scopeFade}
          />
        </>
      ) : null}

      {/* ---------------------------------------------------------- phase B */}
      {phaseB ? (
        <div style={{ opacity: bIn }}>
          <HeadProfile w={HEAD.w} cupGlow style={{ left: HEAD.x, top: HEAD.y }} />

          {/* magnifier cone from the cup to the inset */}
          <svg width="1080" height="1920" style={{ position: "absolute", left: 0, top: 0 }}>
            <path
              d={`M${EAR.x} ${EAR.y}L${INSET.x} ${INSET.y}L${INSET.x} ${INSET.y + INSET.h}Z`}
              fill={theme.lineFaint}
              opacity="0.35"
            />
            <path
              d={`M${EAR.x} ${EAR.y}L${INSET.x} ${INSET.y}M${EAR.x} ${EAR.y}L${INSET.x} ${INSET.y + INSET.h}`}
              stroke={theme.line}
              strokeWidth="2"
              strokeDasharray="10 12"
              fill="none"
            />
          </svg>

          <svg
            width={INSET.w}
            height={INSET.h}
            viewBox={`0 0 ${INSET.w} ${INSET.h}`}
            style={{ position: "absolute", left: INSET.x, top: INSET.y, overflow: "visible" }}
          >
            <rect
              x="2"
              y="2"
              width={INSET.w - 4}
              height={INSET.h - 4}
              rx="16"
              fill="rgba(7, 12, 26, 0.82)"
              stroke={theme.line}
              strokeWidth="3"
            />
            {/* ear canal walls */}
            <path d="M22 96C120 120 210 132 352 146" fill="none" stroke={theme.textDim} strokeWidth="6" opacity="0.85" />
            <path d="M22 306C120 282 210 268 352 254" fill="none" stroke={theme.textDim} strokeWidth="6" opacity="0.85" />
            {/* eardrum */}
            <line x1="356" y1="140" x2="356" y2="260" stroke={theme.text} strokeWidth="9" strokeLinecap="round" />

            {PARTICLES.map((p, i) => {
              const j = Math.sin(frame * p.speed + p.phase) * p.amp * freeze;
              const j2 = Math.cos(frame * p.speed * 1.3 + p.phase) * p.amp * 0.7 * freeze;
              return (
                <circle
                  key={i}
                  cx={p.bx + j}
                  cy={p.by + j2}
                  r={p.r}
                  fill={mixHex(NOISE, "#5d6a84", 1 - freeze)}
                  opacity={0.55 + freeze * 0.4}
                />
              );
            })}
            <text
              x="30"
              y="44"
              fontFamily="ui-monospace, Menlo, monospace"
              fontSize="22"
              fontWeight="700"
              letterSpacing="3"
              fill={theme.textFaint}
            >
              AIR AT THE EARDRUM
            </text>
          </svg>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 1160,
              textAlign: "center",
              opacity: interpolate(frame, [400, 416], [0, 1], clamp),
            }}
          >
            <Chip color={theme.text}>the air just stops moving</Chip>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 1258,
              display: "flex",
              justifyContent: "center",
              opacity: interpolate(frame, [CLOSE_IN, CLOSE_IN + 18], [0, 1], clamp),
              transform: `translateY(${interpolate(frame, [CLOSE_IN, CLOSE_IN + 18], [20, 0], { ...clamp, easing: easeOut })}px)`,
            }}
          >
            <Stamp fontSize={36} rotate={1}>
              not blocked. <span style={{ color: ANTI }}>erased.</span>
            </Stamp>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
