import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Constellation,
  HUM_EDGES,
  HUM_STARS,
  MapWall,
  PANEL,
  PointField,
  SONG_EDGES,
  SONG_STARS,
  SoundMap,
  WaveStream,
} from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// hum — THE HUM · 296f (cold end)
// Z.3 pivot: within 6 frames of "But" (f0) the haze is gone, the map is wiped,
// and the panel is empty — the state flip IS the interrupt. Then the same tune,
// hummed, rains a different field, ignites a different constellation, and the
// ghost of the original proves no star landed where it should have.
// Z.4 cold end: no CTA chip. The video stops on the peak image.
export const HumScene: React.FC = () => {
  const frame = useCurrentFrame();

  const waveIn = interpolate(frame, [6, 20], [0, 1], clamp);
  const tip = interpolate(frame, [30, 64], [0, 1], { ...clamp, easing: (t) => t * t });
  const landed = interpolate(frame, [34, 112], [0, 1], clamp);

  const dim = interpolate(frame, [64, 118], [0, 0.93], clamp);
  const ignite = interpolate(frame, [66, 124], [0, 1], clamp);
  const links = interpolate(frame, [112, 168], [0, 1], clamp);

  // the original, ghosted in at 25% — and nothing lines up
  const ghost = interpolate(frame, [100, 142, 204, 246], [0, 0.25, 0.25, 0], clamp);

  // the wall scrolls slowly, stops on "matches nothing" (f126–140), then drains
  const wallIn = interpolate(frame, [108, 126], [0, 0.24], clamp);
  const offset = 2.2 * Math.min(Math.max(frame - 108, 0), 34);
  const drain = interpolate(frame, [130, 192], [0, 1], clamp);

  // cold end: the lone constellation drifts ≤3px in the dark
  const drift = 3 * Math.sin(frame / 42);

  return (
    <AbsoluteFill>
      <SoundMap>
        {wallIn > 0.01 && drain < 0.999 ? (
          <div style={{ position: "absolute", inset: 0, opacity: wallIn }}>
            <MapWall offset={offset} drain={drain} />
          </div>
        ) : null}

        {ghost > 0.005 ? (
          <div style={{ position: "absolute", inset: 0, opacity: ghost }}>
            <PointField count={0} seed={17} stars={SONG_STARS} starIgnite={1} twinkle={false} />
            <Constellation stars={SONG_STARS} edges={SONG_EDGES} progress={1} width={4} />
          </div>
        ) : null}

        <div style={{ position: "absolute", inset: 0, transform: `translate(${drift}px, ${drift * 0.6}px)` }}>
          <PointField
            count={80}
            seed={41}
            landed={landed}
            dim={dim}
            stars={HUM_STARS}
            starIgnite={ignite}
          />
          <Constellation stars={HUM_STARS} edges={HUM_EDGES} progress={links} />
        </div>

        {waveIn > 0.01 && tip < 0.999 ? (
          <div style={{ opacity: waveIn }}>
            <WaveStream amp={86} y={PANEL.h * 0.5} seed={29} wobble={1} tip={tip} />
          </div>
        ) : null}
      </SoundMap>
    </AbsoluteFill>
  );
};
