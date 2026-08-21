import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import {
  BLUE,
  BOWL_PATH,
  BellyTank,
  CupVsGallons,
  LavCutaway,
  METAL,
  RUSH,
  SetPanel,
} from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// The bowl starts filling the stage (match cut: the river from scene 1 keeps
// running as these wall sweeps), then pulls back to make room for the cup.
const BOWL_C = { x: 232, y: 207 }; // bowl-interior centre in the 520×448 viewBox

// bowl — THE BOWL · 362f
// "…scrubs a bowl slicker than a nonstick pan" (f36–116) is carried by RUSH
// sweeps chasing a white gleam around the exact bowl profile; "one cup…replaces
// gallons" (f136–225) is the cup vs the collapsing jug tower; then the camera
// rides the pipe down into the belly and everything slams into the tank.
export const BowlScene: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // zoom state → pull-back state
  const pull = interpolate(frame, [108, 158], [0, 1], { ...clamp, easing: easeOut });
  const s = interpolate(pull, [0, 1], [1.9, 1.35]);
  const cx = interpolate(pull, [0, 1], [540, 370]);
  const cy = interpolate(pull, [0, 1], [880, 850]);
  const lavLeft = cx - BOWL_C.x * s;
  const lavTop = cy - BOWL_C.y * s;

  const pipeIn = interpolate(frame, [196, 232], [0, 1], clamp);
  const sweep = frame / 46; // continuous — the wall never stops being scrubbed
  const cupIn = interpolate(frame, [132, 158], [0, 1], clamp);
  const ribbon = interpolate(frame, [156, 214], [0, 1], clamp);
  const collapse = interpolate(frame, [202, 252], [0, 1], clamp);

  // the camera rides the pipe down into the belly
  // One camera: the bowl group rides up by `cam`, and the tank starts a full
  // frame-height below its landing spot so it is genuinely offscreen until then.
  const cam = interpolate(frame, [228, 274], [0, -1260], { ...clamp, easing: easeOut });
  const flash = interpolate(frame, [269, 274, 288], [0, 1, 0], clamp);
  const pulse = interpolate(frame, [244, 276, 300, 336], [0, 1, 1, 0], clamp);
  const sealed = interpolate(frame, [292, 300, 306], [0, 1, 0.7], clamp);
  const fill = interpolate(frame, [270, 320], [0, 0.55], clamp);
  const slosh = interpolate(frame, [276, 362], [0, 1], clamp) * 3.2 * Math.sin((frame - 276) / 13);

  return (
    <AbsoluteFill>
      {/* everything above the belly rides the camera up and out */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${cam}px)` }}>
        {/* the diorama box this close-up sits in */}
        <SetPanel x={70} y={520} w={940} h={760} fill="#F4F9FC" />
        {/* the pipe the camera follows down — hidden during the zoom state */}
        <svg
          width={1080}
          height={2300}
          style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: pipeIn }}
        >
          <path d={`M${lavLeft + 196 * s} ${lavTop + 372 * s} V2010`} stroke={METAL} strokeWidth={52} strokeLinecap="round" opacity={0.5} />
          <path d={`M${lavLeft + 196 * s} ${lavTop + 372 * s} V2010`} stroke={theme.bgLifted} strokeWidth={38} strokeLinecap="round" />
          {pulse > 0 ? (
            <path
              d={`M${lavLeft + 196 * s} ${lavTop + 372 * s} V2010`}
              stroke={RUSH}
              strokeWidth={28}
              strokeLinecap="round"
              strokeDasharray="60 92"
              strokeDashoffset={-frame * 14}
              opacity={0.85}
            />
          ) : null}
        </svg>

        <div style={{ position: "absolute", left: lavLeft, top: lavTop }}>
          <LavCutaway w={520 * s} valveOpen={1} press={0.2} scrub={sweep} stub={false} />
        </div>

        {/* RUSH sweeps chasing the gleam around the same wall */}
        <svg
          width={520 * s}
          height={448 * s}
          viewBox="0 0 520 448"
          style={{ position: "absolute", left: lavLeft, top: lavTop }}
        >
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={BOWL_PATH}
              fill="none"
              stroke={RUSH}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="90 490"
              strokeDashoffset={-(sweep * 580 + i * 193)}
              opacity={0.62}
            />
          ))}
          {/* one cup of blue, laid around the bowl */}
          {ribbon > 0.01 ? (
            <path
              d={BOWL_PATH}
              fill="none"
              stroke={BLUE}
              strokeWidth={7}
              strokeLinecap="round"
              strokeDasharray={`${ribbon * 580} 580`}
              opacity={0.9}
            />
          ) : null}
        </svg>

        {cupIn > 0.01 ? (
          <div style={{ position: "absolute", left: 620, top: 700, opacity: cupIn }}>
            <CupVsGallons cupIn={cupIn} collapse={collapse} />
          </div>
        ) : null}
      </div>

      {/* Top scrim: once the camera rides down the pipe, the run would otherwise
          cross the header and stepper. Fades the stage out under the chrome. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 560,
          background: `linear-gradient(180deg, ${theme.bg} 0%, ${theme.bg} 78%, ${theme.bg}00 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* the belly, arriving from below */}
      <div style={{ position: "absolute", left: 160, top: 660, transform: `translateY(${1260 + cam}px)` }}>
        <BellyTank w={760} fill={fill} slosh={slosh} flash={flash} sealed={sealed} />
      </div>
    </AbsoluteFill>
  );
};
