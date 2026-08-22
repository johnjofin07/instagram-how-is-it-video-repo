import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import { BLUE_DEEP, CUT, Chip, METAL, PaperCloud, PlaneCutaway, ServiceTruck, SkyStage, TRUCK_NOSE, paperShadow } from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// tank — THE TANK · 342f (v4 take, cold end)
// The half-cut plane from outside, the whole way through:
//   f0–60    "That tank never opens in flight" — descending, chip
//   f104     "sealed" — tank flash
//   f150     "sloshing" — bigger swell; gear from f130, touchdown f168
//   f185–231 "a truck pulls up at the gate" — the service truck rolls in under
//            the belly; camera eases in on the belly f236–262
//   f244–289 "drains the whole flight's worth" — hose on, hatch opens (the one
//            time it does), tank empties into the truck. Hold. No CTA (Z.4).
const PLANE_W = 900;
const PS = PLANE_W / 640;
const PLANE_POS = { x: 90, y: 640 };
const GROUND_Y = PLANE_POS.y + 213 * PS; // wheels
const TRUCK_SIZE = 170;
const TRUCK_Y = GROUND_Y - 0.94 * TRUCK_SIZE;
const HATCH = { x: PLANE_POS.x + CUT.hatch.x * PS, y: PLANE_POS.y + CUT.hatch.y * PS };

export const TankScene: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const pitch = interpolate(frame, [0, 150, 170], [-2, -2, 0], clamp);
  const ground = interpolate(frame, [95, 168], [1500, GROUND_Y], { ...clamp, easing: (t) => t * t });
  const bump = frame >= 168 && frame < 180 ? [0, 3, -3, 2, -1, 1, 0, 0, 0, 0, 0, 0][frame - 168] : 0;

  const chip = interpolate(frame, [22, 31, 176, 188], [0, 1, 1, 0], clamp);
  const flash = interpolate(frame, [104, 110, 124], [0, 1, 0], clamp);

  const swellA = 3.4 * Math.sin(frame / 12.5);
  const swell = swellA * (1 + interpolate(frame, [146, 158, 180], [0, 0.7, 0], clamp));
  const settle = interpolate(frame, [170, 210], [1, 0.12], clamp);
  const slosh = frame < 168 ? swell : swellA * settle;

  const truckX = interpolate(frame, [185, 232], [1150, 700], { ...clamp, easing: easeOut });
  const zoom = interpolate(frame, [236, 262], [1, 1.7], { ...clamp, easing: easeOut });
  const hose = interpolate(frame, [244, 258], [0, 1], { ...clamp, easing: easeOut });
  const hatchOpen = interpolate(frame, [246, 258], [0, 1], { ...clamp, easing: easeOut });
  const drain = interpolate(frame, [258, 306], [0, 1], { ...clamp, easing: (t) => t * (2 - t) });
  const fill = 0.6 - drain * 0.58;
  const nose = { x: truckX + TRUCK_NOSE.x * TRUCK_SIZE, y: TRUCK_Y + TRUCK_NOSE.y * TRUCK_SIZE };
  const hosePath = `M${nose.x} ${nose.y} Q ${(nose.x + HATCH.x) / 2} ${GROUND_Y - 10} ${HATCH.x} ${HATCH.y + 2}`;

  return (
    <AbsoluteFill>
      <SkyStage />
      <div style={{ position: "absolute", left: 120, top: 470 }}>
        <PaperCloud w={200} drift={4} />
      </div>
      <div style={{ position: "absolute", left: 760, top: 520 }}>
        <PaperCloud w={170} drift={6} />
      </div>

      {/* ground + plane + truck share one camera */}
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${HATCH.x + 80}px ${HATCH.y + 20}px`, transform: `scale(${zoom})` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <g style={{ filter: paperShadow(1) }}>
            <rect x={-40} y={ground} width={1160} height={2000 - ground} rx={12} fill="#B9C6CF" />
          </g>
        </svg>

        <div
          style={{
            position: "absolute",
            left: PLANE_POS.x,
            top: PLANE_POS.y + bump,
            transformOrigin: "50% 60%",
            transform: `rotate(${pitch}deg)`,
          }}
        >
          <PlaneCutaway w={PLANE_W} fill={fill} slosh={slosh} flash={flash} hatchOpen={hatchOpen} onGround={frame >= 130} bob={frame < 168} />
        </div>

        {hose > 0.01 ? (
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <path d={hosePath} fill="none" stroke={METAL} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${hose} 1`} style={{ filter: paperShadow(0) }} />
            {drain > 0.01 ? (
              <path d={hosePath} fill="none" stroke={BLUE_DEEP} strokeWidth={6} strokeLinecap="round" strokeDasharray="16 20" strokeDashoffset={frame * 5} opacity={0.9} />
            ) : null}
          </svg>
        ) : null}

        {frame >= 185 ? (
          <div style={{ position: "absolute", left: truckX, top: TRUCK_Y }}>
            <ServiceTruck size={TRUCK_SIZE} load={drain} />
          </div>
        ) : null}
      </div>

      {chip > 0.01 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", opacity: chip, transform: `scale(${0.85 + chip * 0.15})` }}>
          <Chip color={theme.text} fontSize={32}>
            NEVER OPENS IN FLIGHT
          </Chip>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
