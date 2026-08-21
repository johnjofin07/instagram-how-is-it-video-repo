import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useEnter } from "../../../components/ui";
import { useTheme } from "../../../themes";
import {
  ANTI,
  ChipBadge,
  Chip,
  MicDot,
  MonoTag,
  NOISE,
  ScopeFrame,
  Stamp,
  Wave,
  clamp,
  easeOut,
  mixHex,
} from "./kit";

// flip — THE FLIP
// v2 retime: 257f (8.57s) — the shortest scene, essentially the same LENGTH as
// the v1 estimate (~255f) but every beat moved, because the recorded phrasing
// puts "then flips it upside down" much later than the estimate did.
//
// Signal flow reads strictly left→right: the world's noise runs across the top,
// the mic on the cup shell hears it, the chip copies it onto a scope, the copy
// mirrors around the axis and recolours NOISE→ANTI, then slides off toward the
// ear. Everything sharing a screen slot is hard-sequenced (005 lesson).
//
// Beat table (D = 257; narration frames from timing.json):
//   f1-122   "Tiny microphones ... hear the noise before you do."
//   f14-132  mic chip: "the mic hears it first"
//   f118-140 chip lights ("A chip", f123)
//   f120-190 scope frame in, copy traces across it ("copies the sound wave")
//   f208-232 THE FLIP — scaleY 1→−1, NOISE→ANTI ("flips it", f208)
//   f234-248 "inverted" readout ("upside down", f223-257)
//   f236-257 the ANTI copy slides out toward the ear; the cut carries it into
//            `zero`, which opens on "It plays that flipped wave into your ear"
const D = 257;

const CUP = { x: 250, y: 1010, r: 140 };
const SCOPE = { x: 560, y: 830, w: 440, h: 300 };
const AXIS = SCOPE.y + SCOPE.h / 2; // 980
const COPY_X = SCOPE.x + 25;
const COPY_W = 390;
const COPY_K = 0.0483; // 3 cycles across the scope
const COPY_AMP = 62;

const smooth = (t: number) => t * t * (3 - 2 * t);

const CupZoom: React.FC<{ glow: number }> = ({ glow }) => {
  const theme = useTheme();
  return (
    <svg
      width={CUP.r * 2 + 40}
      height={CUP.r * 2 + 40}
      viewBox="0 0 320 320"
      style={{ position: "absolute", left: CUP.x - CUP.r - 20, top: CUP.y - CUP.r - 20, overflow: "visible" }}
    >
      <circle cx="160" cy="160" r="140" fill={theme.bg} stroke={theme.textDim} strokeWidth="10" />
      <circle
        cx="160"
        cy="160"
        r="104"
        fill="none"
        stroke={mixHex("#9aa7bf", ANTI, glow)}
        strokeWidth="7"
        style={glow > 0.05 ? { filter: `drop-shadow(0 0 ${14 * glow}px ${ANTI})` } : undefined}
      />
      {/* driver ribs — abstract, not a product drawing */}
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx="160" cy="160" r={30 + i * 16} fill="none" stroke={theme.lineFaint} strokeWidth="3" />
      ))}
      {/* "toward the ear" gate on the inner (right) side */}
      <path d="M262 118 L300 160 L262 202" fill="none" stroke={theme.textDim} strokeWidth="6" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
};

export const Flip: React.FC = () => {
  const frame = useCurrentFrame();
  const claimIn = useEnter(2, { damping: 12 });

  const lit = interpolate(frame, [118, 140], [0.05, 1], clamp);
  const trace = interpolate(frame, [130, 190], [0, 1], { ...clamp, easing: easeOut });
  const flipP = smooth(interpolate(frame, [208, 232], [0, 1], clamp));
  const outX = interpolate(frame, [236, D], [0, 300], { ...clamp, easing: easeOut });
  const outFade = interpolate(frame, [244, D - 1], [1, 0], clamp);
  const cupGlow = interpolate(frame, [232, 250], [0, 1], clamp);

  // Colour SNAPS at the halfway point instead of lerping: the mid-mix of a
  // warm and a cool hue is a muddy olive, and at flipP = 0.5 the wave is
  // edge-on (scaleY 0) so the swap is invisible anyway.
  const copyColor = flipP < 0.5 ? NOISE : ANTI;
  const ghost = interpolate(frame, [204, 212, 236, 248], [0, 0.32, 0.32, 0], clamp);

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
        <Stamp fontSize={38} rotate={-1.2}>
          a chip copies the wave
          <br />
          <span style={{ color: ANTI }}>then flips it upside down</span>
        </Stamp>
      </div>

      {/* the world keeps making noise the whole scene */}
      <Wave
        x={60}
        y={726}
        w={940}
        amp={40}
        freq={0.0468}
        phase={-frame * 0.22}
        color={NOISE}
        strokeWidth={6}
        glow={10}
      />

      <CupZoom glow={cupGlow} />
      <MicDot x={CUP.x} y={CUP.y - CUP.r - 4} size={42} reach={158} arc={140} ping={frame / 34} />
      <ChipBadge x={CUP.x} y={CUP.y} size={104} lit={lit} />

      {/* chip → scope */}
      <svg
        width="220"
        height="70"
        viewBox="0 0 220 70"
        style={{ position: "absolute", left: 386, top: 955, overflow: "visible" }}
      >
        <path
          d="M4 60 C70 60 110 22 176 22"
          fill="none"
          stroke={NOISE}
          strokeWidth="5"
          strokeDasharray="12 14"
          strokeDashoffset={-frame * 1.6}
          opacity={interpolate(frame, [120, 140], [0, 0.85], clamp)}
          strokeLinecap="round"
        />
      </svg>

      <ScopeFrame x={SCOPE.x} y={SCOPE.y} w={SCOPE.w} h={SCOPE.h} opacity={interpolate(frame, [118, 142], [0, 1], clamp)} />

      {/* ghost of the original, so the mirroring is legible while it happens */}
      {ghost > 0.01 ? (
        <Wave
          x={COPY_X}
          y={AXIS}
          w={COPY_W}
          amp={COPY_AMP}
          freq={COPY_K}
          phase={-frame * 0.22}
          color={NOISE}
          strokeWidth={4}
          opacity={ghost}
        />
      ) : null}

      {/* the copy: traces in, mirrors around the axis, recolours on the way */}
      {trace > 0.02 ? (
        <Wave
          x={COPY_X}
          y={AXIS}
          w={COPY_W * trace}
          amp={COPY_AMP}
          freq={COPY_K}
          phase={-frame * 0.22}
          color={copyColor}
          strokeWidth={6}
          glow={10 + flipP * 12}
          opacity={outFade}
          style={{ transform: `translateX(${outX}px) scaleY(${1 - 2 * flipP})` }}
        />
      ) : null}

      {/* scope readout label — hard-sequenced, never crossfaded */}
      {frame >= 140 && frame < 206 ? (
        <MonoTag
          x={COPY_X}
          y={SCOPE.y + 26}
          size={22}
          color={NOISE}
          opacity={interpolate(frame, [140, 152, 198, 206], [0, 1, 1, 0], clamp)}
        >
          copy
        </MonoTag>
      ) : null}
      {frame >= 234 ? (
        <MonoTag x={COPY_X} y={SCOPE.y + 26} size={22} color={ANTI} opacity={interpolate(frame, [234, 246], [0, 1], clamp)}>
          inverted
        </MonoTag>
      ) : null}

      {/* bottom slot — one chip at a time */}
      {frame < 138 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1225,
            textAlign: "center",
            opacity: interpolate(frame, [14, 30, 122, 134], [0, 1, 1, 0], clamp),
          }}
        >
          <Chip color={NOISE}>the mic hears it first</Chip>
        </div>
      ) : null}
      {frame >= 202 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1225,
            textAlign: "center",
            opacity: interpolate(frame, [206, 222], [0, 1], clamp),
          }}
        >
          <Chip color={ANTI}>{"×(−1) = anti-noise"}</Chip>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
