import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import { BellyTank, METAL, SkyStage, paperShadow } from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// tank — THE TANK · 247f (cold end)
// The peak image, held: passengers above the floor line, the sealed tank below
// their feet, both arriving together. Per Z.4 there is NO CTA chip — the video
// stops here and, on an IG loop, smash-cuts straight back into the button press.
export const TankScene: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // descending, then level at touchdown
  const pitch = interpolate(frame, [0, 24, 186, 200], [-2, -2, -2, 0], clamp);
  const ground = interpolate(frame, [95, 197], [1520, 1292], clamp);

  // the slosh is the only bold motion; one bigger swell on "sloshing," (f142)
  const swellA = 3.4 * Math.sin(frame / 12.5);
  const swell = swellA * (1 + interpolate(frame, [138, 152, 176], [0, 0.65, 0], clamp));
  const settle = interpolate(frame, [200, 236], [1, 0.12], clamp);
  const slosh = frame < 197 ? swell : swellA * settle;

  // touchdown: a 3px vertical bump
  const bump = frame >= 197 && frame < 209 ? [0, 3, -3, 2, -1, 1, 0, 0, 0, 0, 0, 0][frame - 197] : 0;

  return (
    <AbsoluteFill>
      <SkyStage />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {/* the ground, rising to meet the wheels — a paper band */}
        <g style={{ filter: paperShadow(1) }}>
          <rect x={-40} y={ground} width={1160} height={2000 - ground} rx={12} fill="#B9C6CF" />
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          left: 90,
          top: 600 + bump,
          transformOrigin: "50% 50%",
          transform: `rotate(${pitch}deg)`,
        }}
      >
        <BellyTank w={900} fill={0.6} slosh={slosh} sealed={1} passengers />
      </div>
    </AbsoluteFill>
  );
};
