import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { AirField, METAL, METAL_DARK, Plane, PumpUnit, RUSH, SetPanel, SkyStage, VOID, paperShadow } from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Same left-cabin / hull / right-outside geometry as scene 1 — so the pivot
// reads as the SAME frame in the opposite state.
const CABIN = { x: 100, y: 690, w: 460, h: 550 };
const HULL_X = 560;
const OUT = { x: 600, y: 690, w: 380, h: 550 };
const PIPE_Y = 1167;
const PIPE_X0 = 300;
const PIPE_X1 = 716;
const PUMP = { x: 700, y: 1075, w: 240 };

// The pipe's own sink loop (see AirField): monotonic travel, pure in `frame`.
const K = 0.028;
const travelAt = (f: number) => (f < 186 ? 0 : f < 226 ? (K * (f - 186) * (f - 186)) / 80 : K * 20 + K * (f - 226));

// ground — THE GROUND · 261f
// Z.3 pivot: a hard cut at f3 ("But") to the plane at the gate, air equally
// thick on BOTH sides of the hull and nothing moving. There is deliberately NO
// orange on the stage until the pump starts at f152 — after ninety seconds of
// rushing, the pivot is legible in colour alone.
export const GroundScene: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const spin = interpolate(frame, [152, 186], [0, 1], clamp);
  const pocket = interpolate(frame, [180, 244], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 2) });
  const travel = travelAt(frame);
  const roar = spin > 0.05 ? spin * Math.sin(frame * 1.7) * 1.2 : 0;

  return (
    <AbsoluteFill>
      <SkyStage />
      {/* the tarmac — a grey paper band under the wheels */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g style={{ filter: paperShadow(1) }}>
          <rect x={-40} y={630} width={1160} height={54} rx={10} fill="#B9C6CF" />
        </g>
      </svg>
      {/* at the gate */}
      <div style={{ position: "absolute", left: 300, top: 470 }}>
        <Plane w={460} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {/* jet bridge — paper pieces */}
        <g style={{ filter: paperShadow(1) }}>
          <path d="M762 548 H904 V634 H858 V592 H762 Z" fill="#FFFFFF" />
        </g>
        <rect x={772} y={560} width={78} height={20} rx={8} fill={METAL_DARK} />
      </svg>
      {/* the cutaway's diorama box */}
      <SetPanel x={70} y={664} w={940} h={600} />

      {/* the cutaway: equally crowded on both sides, and nothing moving */}
      <div style={{ position: "absolute", left: CABIN.x, top: CABIN.y, width: CABIN.w, height: CABIN.h }}>
        <AirField w={CABIN.w} h={CABIN.h} count={140} seed={12} density={0.9} flow={{ x: 0.012, y: -0.014 }} />
      </div>
      <div style={{ position: "absolute", left: HULL_X, top: CABIN.y, width: 16, height: CABIN.h, background: METAL, opacity: 0.5 }} />
      <div style={{ position: "absolute", left: OUT.x, top: OUT.y, width: OUT.w, height: OUT.h }}>
        <AirField w={OUT.w} h={OUT.h} count={116} seed={54} density={0.9} flow={{ x: -0.013, y: 0.011 }} />
      </div>

      {/* the pipe, and the pocket of sky the pump digs inside it */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={PIPE_X0} y1={PIPE_Y} x2={PIPE_X1} y2={PIPE_Y} stroke={METAL} strokeWidth={50} strokeLinecap="round" opacity={0.55} />
        <line x1={PIPE_X0} y1={PIPE_Y} x2={PIPE_X1} y2={PIPE_Y} stroke={theme.bgLifted} strokeWidth={38} strokeLinecap="round" />
        {pocket > 0.01 ? (
          <rect
            x={PIPE_X1 - (PIPE_X1 - PIPE_X0) * pocket}
            y={PIPE_Y - 19}
            width={(PIPE_X1 - PIPE_X0) * pocket}
            height={38}
            rx={19}
            fill={VOID}
          />
        ) : null}
      </svg>

      {/* the only moving air on the ground — and only inside the pipe */}
      <div
        style={{
          position: "absolute",
          left: PIPE_X0,
          top: PIPE_Y - 19,
          width: PIPE_X1 - PIPE_X0,
          height: 38,
          overflow: "hidden",
        }}
      >
        <AirField
          w={PIPE_X1 - PIPE_X0}
          h={38}
          count={26}
          seed={77}
          sink={frame >= 186 ? { x: PIPE_X1 - PIPE_X0 - 6, y: 19 } : null}
          travel={travel}
          streak={interpolate(frame, [186, 226], [0, 1], clamp)}
        />
      </div>

      <div style={{ position: "absolute", left: PUMP.x, top: PUMP.y, transform: `translate(${roar}px, ${-roar}px)` }}>
        <PumpUnit spin={spin} w={PUMP.w} />
      </div>

      {/* the fake sky the pump is making, named once it exists */}
      {pocket > 0.55 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1250,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [214, 236], [0, 1], clamp),
            fontFamily: FONTS.sans,
            fontWeight: 900,
            fontSize: 30,
            letterSpacing: "0.18em",
            color: RUSH,
          }}
        >
          THE SKY, FAKED
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
