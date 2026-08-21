import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Constellation,
  ListenRing,
  PANEL,
  PointField,
  ShazamPhone,
  SONG_EDGES,
  SONG_STARS,
  SoundMap,
  WaveStream,
} from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Phone geometry for the cold open — centered on the panel's centre so the
// zoom into the screen and the panel's own scale share one fixed point.
const PHONE_W = 400;
const PHONE_H = PHONE_W * 2.05;
const CX = PANEL.x + PANEL.w / 2; // 540
const CY = PANEL.y + PANEL.h / 2; // 900

// map — THE MAP · 336f
// Cold open (Z.1): the SHAZAM APP is already mid-listen at f0 — blue screen,
// pulsing button, rings already expanding. On "hit that button" (f24) the
// button takes a tap ripple, and on "stops hearing music" the camera dives
// THROUGH the screen (f48–104): the phone scales past the viewer while the
// sound map scales up from inside it. From there the original beats hold:
// the ribbon tips vertical and rains on "starts drawing it" (f108–146), and
// the star ignition — the episode's signature — fires on "only the loudest"
// (f249–312).
export const MapScene: React.FC = () => {
  const frame = useCurrentFrame();

  // ── the dive through the screen ──
  const tap = interpolate(frame, [22, 40], [0, 1], clamp);
  const phoneScale = interpolate(frame, [48, 104], [1, 3.1], {
    ...clamp,
    easing: (t) => t * t,
  });
  const phoneOut = interpolate(frame, [74, 100], [1, 0], clamp);
  const mapIn = interpolate(frame, [62, 92], [0, 1], clamp);
  const mapScale = interpolate(frame, [48, 106], [0.44, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 2),
  });

  // ── the map (original beats, unchanged) ──
  const tip = interpolate(frame, [108, 146], [0, 1], { ...clamp, easing: (t) => t * t });
  const ringOut = interpolate(frame, [104, 140], [1, 0], clamp);
  const landed = interpolate(frame, [112, 218], [0, 1], clamp);

  // ★ SIGNATURE — the star ignition. The crowd dims away while 12 points flare.
  const dim = interpolate(frame, [249, 306], [0, 0.85], clamp);
  const ignite = interpolate(frame, [252, 312], [0, 1], clamp);

  // pre-echo of scene 2: the first links start drawing before the cut
  const links = interpolate(frame, [306, 348], [0, 1], clamp);

  return (
    <AbsoluteFill>
      {/* the sound map, revealed through the screen */}
      {mapIn > 0.001 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: mapIn,
            transformOrigin: `${CX}px ${CY}px`,
            transform: `scale(${mapScale})`,
          }}
        >
          <SoundMap>
            <PointField
              count={150}
              seed={17}
              landed={landed}
              dim={dim}
              stars={SONG_STARS}
              starIgnite={ignite}
            />
            <Constellation stars={SONG_STARS} edges={SONG_EDGES} progress={links} />
            <WaveStream amp={132} y={PANEL.h * 0.5} seed={5} tip={tip} />
            {ringOut > 0.01 ? (
              <div style={{ opacity: ringOut }}>
                <ListenRing x={PANEL.w / 2} y={PANEL.h * 0.5} />
              </div>
            ) : null}
          </SoundMap>
        </div>
      ) : null}

      {/* the phone, mid-listen at f0, then flying past the camera */}
      {phoneOut > 0.001 ? (
        <div
          style={{
            position: "absolute",
            left: CX - PHONE_W / 2,
            top: CY - PHONE_H / 2,
            opacity: phoneOut,
            transformOrigin: `${PHONE_W / 2}px ${PHONE_H * 0.44}px`,
            transform: `scale(${phoneScale})`,
          }}
        >
          <ShazamPhone w={PHONE_W} tap={tap} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
