import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import {
  BLUE,
  BLUE_DEEP,
  PaperCloud,
  PlaneCutaway,
  SkyStage,
  Buckets,
  Chip,
  Droplet,
  INTERIOR,
  LAV,
  Lavatory,
  METAL,
  PaperCup,
  SetPanel,
} from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// bowl — THE BOWL · 399f (v4 take)
//   f3–87    "The bowl is coated so slick that nothing sticks" — gleam chasing
//            the bowl wall; three drops hit the wall and slide straight off
//   f108–152 "instead of gallons of water" — six buckets stack up, then fall
//   f168–199 "one cup of blue disinfectant" — the cup, which tips and pours
//   f227–249 "rinses it clean" — BLUE ribbon around the wall
//   f272–399 "the waste slams into a sealed tank in the plane's belly" — hard
//            cut to the WHOLE plane from outside (half-cut), a RUSH pulse runs
//            from the lavatory down its pipe, and the camera zooms into the
//            belly tank; slam at f335, hatch seals f348
const UNIT = 17;
const LAVPOS = { x: 110, y: 600 };
const lavPt = (p: { x: number; y: number }) => ({ x: LAVPOS.x + p.x * UNIT, y: LAVPOS.y + p.y * UNIT });
const BOWL = lavPt(LAV.bowl);
const DRAIN = lavPt(LAV.drain);

export const BowlScene: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const gleam = frame / 40;

  // buckets vs cup
  const bucketsIn = interpolate(frame, [108, 140], [0, 1], clamp);
  const collapse = interpolate(frame, [131, 170], [0, 1], clamp);
  const gallonsLabel = interpolate(frame, [112, 120, 140, 160], [0, 1, 1, 0], clamp);
  const cupIn = interpolate(frame, [168, 178], [0, 1], { ...clamp, easing: easeOut });
  const cupLabel = interpolate(frame, [170, 178, 210, 222], [0, 1, 1, 0], clamp);
  const cupMove = interpolate(frame, [186, 214], [0, 1], { ...clamp, easing: easeOut });
  const tilt = interpolate(frame, [205, 232], [0, -62], { ...clamp, easing: easeOut });
  const level = interpolate(frame, [210, 248], [1, 0.08], clamp);
  const stream = interpolate(frame, [212, 222, 244, 254], [0, 1, 1, 0], clamp);
  const ribbon = interpolate(frame, [224, 262], [0, 1], { ...clamp, easing: easeOut });
  const cupOut = interpolate(frame, [256, 272], [1, 0], clamp);
  const cupPos = { x: 700 + (300 - 700) * cupMove, y: 700 + (690 - 700) * cupMove };

  // the belly: whole plane, then zoom in on the tank
  const ext = frame >= 272;
  const PLANE_W = 880;
  const PS = PLANE_W / 640;
  const PLANE_POS = { x: 100, y: 720 };
  const tankPt = { x: PLANE_POS.x + 300 * PS, y: PLANE_POS.y + 145 * PS };
  const zoom = interpolate(frame, [284, 336], [1, 3.6], { ...clamp, easing: easeOut });
  const pulse = interpolate(frame, [276, 286, 336, 350], [0, 1, 1, 0], clamp);
  const flash = interpolate(frame, [333, 338, 352], [0, 1, 0], clamp);
  const sealed = interpolate(frame, [348, 356], [0, 1], clamp);
  const fill = interpolate(frame, [334, 372], [0, 0.55], clamp);
  const slosh = interpolate(frame, [338, 399], [0, 1], clamp) * 3.2 * Math.sin((frame - 338) / 13);

  return (
    <AbsoluteFill>
      {ext ? (
        <>
          <SkyStage />
          <div style={{ position: "absolute", left: 120, top: 560 }}>
            <PaperCloud w={220} />
          </div>
          <div style={{ position: "absolute", left: 700, top: 1120 }}>
            <PaperCloud w={260} drift={6} />
          </div>
          <div style={{ position: "absolute", inset: 0, transformOrigin: `${tankPt.x}px ${tankPt.y}px`, transform: `scale(${zoom})` }}>
            <div style={{ position: "absolute", left: PLANE_POS.x, top: PLANE_POS.y }}>
              <PlaneCutaway w={PLANE_W} fill={fill} slosh={slosh} flash={flash} sealed={sealed} pulse={pulse} />
            </div>
          </div>
        </>
      ) : (
      <div style={{ position: "absolute", inset: 0 }}>
        <SetPanel x={70} y={520} w={940} h={760} fill={INTERIOR} />
        {/* the pipe leaving the toilet, behind it */}
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={`M${DRAIN.x} ${DRAIN.y} V1320`} stroke={METAL} strokeWidth={52} strokeLinecap="round" opacity={0.5} />
          <path d={`M${DRAIN.x} ${DRAIN.y} V1320`} stroke={theme.bgLifted} strokeWidth={38} strokeLinecap="round" />
        </svg>

        <div style={{ position: "absolute", left: LAVPOS.x, top: LAVPOS.y }}>
          <Lavatory unit={UNIT} valveOpen={1} press={0.2} gleam={gleam} />
        </div>

        {/* nothing sticks — drops hit the wall and slide off into the drain */}
        {[0, 1, 2].map((i) => {
          const t0 = 30 + i * 22;
          const fall = interpolate(frame, [t0, t0 + 16], [0, 1], { ...clamp, easing: (t) => t * t });
          const slide = interpolate(frame, [t0 + 16, t0 + 48], [0, 1], { ...clamp, easing: easeOut });
          const gone = interpolate(frame, [t0 + 40, t0 + 52], [1, 0], clamp);
          if (frame < t0 || gone <= 0.02) return null;
          const hitX = BOWL.x - 90 + i * 90;
          const hitY = BOWL.y - 46 + Math.abs(i - 1) * -22;
          const x = hitX + (BOWL.x - hitX) * slide;
          const y = (BOWL.y - 230) + (hitY - (BOWL.y - 230)) * fall + (BOWL.y + 56 - hitY) * slide;
          return <Droplet key={i} size={44} style={{ left: x - 22, top: y - 22, opacity: gone }} />;
        })}

        {/* the BLUE ribbon laid around the wall on "rinses it clean" */}
        {ribbon > 0.01 ? (
          <svg
            width={32 * UNIT}
            height={32 * UNIT}
            viewBox="0 0 32 32"
            style={{ position: "absolute", left: LAVPOS.x, top: LAVPOS.y, overflow: "visible" }}
          >
            <path
              d={LAV.wall}
              fill="none"
              stroke={BLUE}
              strokeWidth={1.3}
              strokeLinecap="round"
              strokeDasharray={`${ribbon * 37} 37`}
              opacity={0.95}
            />
          </svg>
        ) : null}

        {/* gallons — the bucket stack */}
        {bucketsIn > 0.01 && collapse < 0.99 ? (
          <div style={{ position: "absolute", left: 660, top: 600 }}>
            <Buckets appear={bucketsIn} collapse={collapse} />
          </div>
        ) : null}
        {gallonsLabel > 0.01 ? (
          <div style={{ position: "absolute", left: 660, top: 836, width: 294, display: "flex", justifyContent: "center", opacity: gallonsLabel }}>
            <Chip>GALLONS</Chip>
          </div>
        ) : null}

        {/* one cup — pops where the buckets were, then carries over and pours */}
        {cupIn > 0.01 && cupOut > 0.01 ? (
          <div
            style={{
              position: "absolute",
              left: cupPos.x,
              top: cupPos.y,
              opacity: Math.min(cupIn, cupOut),
              transform: `scale(${0.7 + cupIn * 0.3})`,
            }}
          >
            <PaperCup w={130} tilt={tilt} level={level} />
          </div>
        ) : null}
        {stream > 0.01 ? (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: stream }}>
            <path
              d={`M${cupPos.x + 16} ${cupPos.y + 30} Q ${cupPos.x - 10} ${cupPos.y + 140} ${BOWL.x - 20} ${BOWL.y - 40}`}
              stroke={BLUE}
              strokeWidth={12}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        ) : null}
        {cupLabel > 0.01 ? (
          <div style={{ position: "absolute", left: 660, top: 836, width: 294, display: "flex", justifyContent: "center", opacity: cupLabel }}>
            <Chip color={BLUE_DEEP}>ONE CUP</Chip>
          </div>
        ) : null}
      </div>
      )}
    </AbsoluteFill>
  );
};
