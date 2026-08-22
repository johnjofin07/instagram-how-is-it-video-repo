import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import {
  AirField,
  Chip,
  INTERIOR,
  LAV,
  Lavatory,
  METAL,
  METAL_DARK,
  PaperPlane,
  PumpUnit,
  RUSH,
  SetPanel,
  SkyStage,
  VOID,
  paperShadow,
} from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// ground — THE GROUND · 319f (v4 take)
// Z.3 pivot: a hard cut on "But" (f4) to the plane at the gate. Same
// left-cabin / hull / right-outside cutaway as scene 1, now equally crowded on
// both sides and NOTHING moving — no orange on the stage until the pump.
//   f73–116  "just as thick as inside" — THICK AIR / THICK AIR (scene 1's pair,
//            now both the same)
//   f188–205 "a roaring pump" — the pump spins up, shakes
//   f246–265 "makes the suction" — a pocket of VOID grows back along the pipe,
//            chip PUMP-MADE SUCTION
const CABIN = { x: 100, y: 740, w: 460, h: 500 };
const HULL_X = 560;
const OUT = { x: 600, y: 740, w: 380, h: 500 };
const UNIT = 5.5;
const LAVPOS = { x: 120, y: 985 };
const DRAIN = { x: LAVPOS.x + LAV.drain.x * UNIT, y: LAVPOS.y + LAV.drain.y * UNIT };
const PIPE_Y = 1172;
const PIPE_X1 = 722;
const PUMP = { x: 690, y: 1060, w: 280 };

const K = 0.028;
const travelAt = (f: number) => (f < 196 ? 0 : f < 236 ? (K * (f - 196) * (f - 196)) / 80 : K * 20 + K * (f - 236));

export const GroundScene: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const thickL = interpolate(frame, [96, 105], [0, 1], { ...clamp, easing: easeOut });
  const thickR = interpolate(frame, [114, 123], [0, 1], { ...clamp, easing: easeOut });
  const spin = interpolate(frame, [186, 216], [0, 1], clamp);
  const pocket = interpolate(frame, [198, 268], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const travel = travelAt(frame);
  const roar = spin > 0.05 ? spin * Math.sin(frame * 1.7) * 1.2 : 0;
  const chip = interpolate(frame, [246, 256], [0, 1], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill>
      <SkyStage />
      {/* the tarmac — a grey paper band under the wheels */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g style={{ filter: paperShadow(1) }}>
          <rect x={-40} y={640} width={1160} height={60} rx={10} fill="#B9C6CF" />
        </g>
        {/* jet bridge */}
        <g style={{ filter: paperShadow(1) }}>
          <path d="M786 552 H930 V640 H880 V598 H786 Z" fill="#FFFFFF" />
        </g>
        <rect x={798} y={566} width={76} height={18} rx={8} fill={METAL_DARK} />
      </svg>
      <div style={{ position: "absolute", left: 260, top: 478 }}>
        <PaperPlane w={520} onGround bob={false} />
      </div>

      {/* the cutaway's diorama box */}
      <SetPanel x={70} y={720} w={940} h={540} fill={INTERIOR} />

      {/* equally crowded on both sides, and nothing moving */}
      <div style={{ position: "absolute", left: CABIN.x, top: CABIN.y, width: CABIN.w, height: CABIN.h }}>
        <AirField w={CABIN.w} h={CABIN.h} count={150} seed={12} density={0.9} flow={{ x: 0.012, y: -0.014 }} />
      </div>
      <div style={{ position: "absolute", left: HULL_X, top: CABIN.y, width: 16, height: CABIN.h, background: METAL, borderRadius: 8, opacity: 0.6 }} />
      <div style={{ position: "absolute", left: OUT.x, top: OUT.y, width: OUT.w, height: OUT.h }}>
        <AirField w={OUT.w} h={OUT.h} count={124} seed={54} density={0.9} flow={{ x: -0.013, y: 0.011 }} />
      </div>

      {/* the pipe from the toilet to the pump, and the pocket of sky the pump digs in it */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d={`M${DRAIN.x} ${DRAIN.y} V${PIPE_Y} H${PIPE_X1}`} fill="none" stroke={METAL} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
        <path d={`M${DRAIN.x} ${DRAIN.y} V${PIPE_Y} H${PIPE_X1}`} fill="none" stroke={theme.bgLifted} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
        {pocket > 0.01 ? (
          <rect
            x={PIPE_X1 - (PIPE_X1 - DRAIN.x) * pocket}
            y={PIPE_Y - 17}
            width={(PIPE_X1 - DRAIN.x) * pocket}
            height={34}
            rx={17}
            fill={VOID}
          />
        ) : null}
      </svg>
      <div style={{ position: "absolute", left: LAVPOS.x, top: LAVPOS.y }}>
        <Lavatory unit={UNIT} valveOpen={1} />
      </div>

      {/* the only moving air on the ground — and only inside the pipe */}
      <div style={{ position: "absolute", left: DRAIN.x, top: PIPE_Y - 17, width: PIPE_X1 - DRAIN.x, height: 34, overflow: "hidden" }}>
        <AirField
          w={PIPE_X1 - DRAIN.x}
          h={34}
          count={26}
          seed={77}
          sink={frame >= 196 ? { x: PIPE_X1 - DRAIN.x - 6, y: 17 } : null}
          travel={travel}
          streak={interpolate(frame, [196, 236], [0, 1], clamp)}
        />
      </div>

      <div style={{ position: "absolute", left: PUMP.x, top: PUMP.y, transform: `translate(${roar}px, ${-roar}px)` }}>
        <PumpUnit spin={spin} w={PUMP.w} />
      </div>

      {/* THICK AIR on both sides — scene 1's pair, now identical */}
      {thickL > 0.01 ? (
        <div style={{ position: "absolute", left: 130, top: 744, opacity: thickL, transform: `scale(${0.8 + thickL * 0.2})` }}>
          <Chip color={theme.text}>THICK AIR</Chip>
        </div>
      ) : null}
      {thickR > 0.01 ? (
        <div style={{ position: "absolute", left: 640, top: 744, opacity: thickR, transform: `scale(${0.8 + thickR * 0.2})` }}>
          <Chip color={theme.text}>THICK AIR</Chip>
        </div>
      ) : null}

      {chip > 0.01 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1282, display: "flex", justifyContent: "center", opacity: chip, transform: `scale(${0.8 + chip * 0.2})` }}>
          <Chip color={RUSH} fontSize={30}>
            PUMP-MADE SUCTION
          </Chip>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
