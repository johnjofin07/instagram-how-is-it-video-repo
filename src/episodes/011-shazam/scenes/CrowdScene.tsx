import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Constellation,
  HazeTide,
  PANEL,
  PointField,
  SONG_EDGES,
  SONG_STARS,
  SoundMap,
} from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The constellation stays exactly where scene 2 left it — hard cut, no re-entry.
const S = 0.58;
const TX = (PANEL.w / 2) * (1 - S);
const TY = 30;

// crowd — THE CROWD · 233f
// Warm scream-noise floods the panel from the floor and fills it with its own
// points; on "already threw everything quiet away" (f92–134) every one of those
// points is discarded; on "the stars burn louder" (f164) each star blooms and
// punches a clean dark halo straight through the haze. HAZE is the only warm
// color in the episode, and it never touches a star.
export const CrowdScene: React.FC = () => {
  const frame = useCurrentFrame();

  const haze = interpolate(frame, [0, 84, 190, 233], [0, 0.54, 0.7, 0.72], clamp);
  const noiseIn = interpolate(frame, [4, 88], [0, 1], clamp);
  const noiseOut = interpolate(frame, [92, 142], [0, 1], clamp); // thrown away
  const bloom = interpolate(frame, [160, 202], [0, 1], clamp);

  // the match still holds — the LOCK halo re-pulses through the haze
  const halo = 0.55 + 0.45 * Math.max(0, Math.sin((frame - 196) / 9));
  const rePulse = frame >= 196 ? halo : 0.55;

  return (
    <AbsoluteFill>
      <SoundMap>
        {/* the crowd's own noise, drowning everything that isn't a star */}
        <PointField
          count={130}
          seed={73}
          landed={noiseIn}
          dim={noiseOut}
          dotColor="rgba(245,186,120,0.85)"
        />

        <HazeTide level={haze} />

        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "0 0",
            transform: `translate(${TX}px, ${TY}px) scale(${S})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 52% 46% at 52% 54%, rgba(229,9,20,0.30), transparent 70%)",
              opacity: rePulse,
            }}
          />
          <PointField count={0} seed={17} stars={SONG_STARS} starIgnite={1} starBloom={bloom} />
          <Constellation
            stars={SONG_STARS}
            edges={SONG_EDGES}
            progress={1}
            width={5 / S}
          />
        </div>
      </SoundMap>
    </AbsoluteFill>
  );
};
