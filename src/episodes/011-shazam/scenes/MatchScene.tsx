import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  CELL_H,
  CELL_W,
  Constellation,
  LOCK,
  MapWall,
  PANEL,
  PointField,
  SONG_EDGES,
  SONG_STARS,
  SoundMap,
  wallCellY,
} from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// The wall occupies the panel below the contracted constellation.
const WALL_TOP = 490;
const WALL_H = PANEL.h - WALL_TOP;
const LOCK_ROW = 2;

// The scroll slams dead at exactly 480px — chosen so LOCK_ROW lands at
// wall-local y=120, centred in the visible band. wallCellY is shared with
// MapWall so the flying copy leaves from the cell it actually flew off.
const scrollOffset = (frame: number) => {
  if (frame < 116) return 0;
  if (frame < 236) {
    const u = frame - 116;
    return u + (u * u) / 40; // speed ramps 1 → 7 px/f
  }
  const d = frame - 236;
  return 480 + (d < 10 ? 5 * Math.sin(d * 0.8) * Math.exp(-d * 0.35) : 0);
};

// Contracted-constellation transform (origin 0 0 on a panel-sized layer).
const S_END = 0.58;
const TX_END = (PANEL.w / 2) * (1 - S_END);
const TY_END = 30;

// match — THE MATCH · 314f
// The constellation completes, contracts to the panel's top third like a wanted
// poster, and holds still while millions of wrong shapes stream past
// underneath. On "matches." (f236) one cell — drawn in the SONG's own shape —
// flares LOCK, the scroll slams dead, and that cell flies up and snaps 1:1 onto
// the song. Stroke widths are divided by the group scale so nothing thins below
// the ~4px delivery-scale floor.
export const MatchScene: React.FC = () => {
  const frame = useCurrentFrame();

  // picks up exactly where MapScene's pre-echo left off (0.69 at its f335),
  // otherwise the links visibly retract across the cut
  const links = interpolate(frame, [0, 48], [0.69, 1], clamp);
  const clearField = interpolate(frame, [0, 74], [0.85, 1], clamp); // dim the crowd away
  const contract = interpolate(frame, [58, 120], [0, 1], { ...clamp, easing: easeOut });

  const s = interpolate(contract, [0, 1], [1, S_END]);
  const tx = interpolate(contract, [0, 1], [0, TX_END]);
  const ty = interpolate(contract, [0, 1], [0, TY_END]);

  const offset = scrollOffset(frame);
  const wallIn = interpolate(frame, [112, 146], [0, 1], clamp);
  const locked = frame >= 236;
  const lockProgress = interpolate(frame, [236, 258], [0, 1], clamp);
  const wallDim = interpolate(frame, [258, 292], [1, 0.3], clamp);

  // the locked cell flies up and lands on the song constellation
  const fly = interpolate(frame, [246, 278], [0, 1], { ...clamp, easing: easeOut });
  const flyOut = interpolate(frame, [276, 298], [1, 0], clamp);
  const cellY = wallCellY(LOCK_ROW, offset);
  const sStart = CELL_H / PANEL.h;
  const txStart = CELL_W * 1.5 - (PANEL.w / 2) * sStart;
  const tyStart = WALL_TOP + cellY + CELL_H / 2 - (PANEL.h / 2) * sStart;
  const fs = interpolate(fly, [0, 1], [sStart, S_END]);
  const fx = interpolate(fly, [0, 1], [txStart, TX_END]);
  const fy = interpolate(fly, [0, 1], [tyStart, TY_END]);

  // the merged shape flashes LOCK, then settles back to STAR/LINK with a halo
  const flash = interpolate(frame, [274, 286, 308], [0, 1, 0.22], clamp);
  const halo = interpolate(frame, [274, 298], [0, 1], clamp);
  const beat = 1 + 0.035 * flash * Math.sin((frame - 274) / 4);

  return (
    <AbsoluteFill>
      <SoundMap>
        {/* the hunt, clipped to the band below the constellation */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: WALL_TOP,
            height: WALL_H,
            overflow: "hidden",
            opacity: wallIn * wallDim,
          }}
        >
          <MapWall
            offset={offset}
            lockCell={locked ? LOCK_ROW : null}
            lockProgress={lockProgress}
            lockPts={SONG_STARS}
            lockEdges={SONG_EDGES}
          />
        </div>

        {/* the song, held still above the stream */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "0 0",
            transform: `translate(${tx}px, ${ty}px) scale(${s * beat})`,
          }}
        >
          {halo > 0 ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse 52% 46% at 52% 54%, rgba(229,9,20,0.30), transparent 70%)",
                opacity: halo,
              }}
            />
          ) : null}
          <PointField count={150} seed={17} dim={clearField} stars={SONG_STARS} starIgnite={1} />
          <Constellation
            stars={SONG_STARS}
            edges={SONG_EDGES}
            progress={links}
            width={5 / s}
          />
          {flash > 0.01 ? (
            <Constellation
              stars={SONG_STARS}
              edges={SONG_EDGES}
              progress={1}
              color={LOCK}
              opacity={flash}
              width={6 / s}
            />
          ) : null}
        </div>

        {/* the matched cell, on its way up */}
        {frame >= 246 && flyOut > 0.01 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "0 0",
              transform: `translate(${fx}px, ${fy}px) scale(${fs})`,
              opacity: flyOut,
            }}
          >
            <Constellation
              stars={SONG_STARS}
              edges={SONG_EDGES}
              progress={1}
              color={LOCK}
              width={6 / fs}
            />
          </div>
        ) : null}
      </SoundMap>
    </AbsoluteFill>
  );
};
