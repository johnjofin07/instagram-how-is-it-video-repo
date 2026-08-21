import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import {
  BuildingSection,
  Car,
  Chip,
  RIDER_NEUTRAL,
  RouteLine,
  Rider,
  Stamp,
  buildingLayout,
  carHeight,
  clamp,
  fadeIn,
  fadeOut,
} from "./kit";

// Scene 2 — THE RULE · D = 418f (13.92s, timing.json).
// The whole dispatching rule in one cutaway: pick a direction, finish it.
// The car sweeps UP collecting 2 -> 5 -> 7, flips at the top, sweeps DOWN
// collecting 6 -> 3. Only THEN (hard-sequenced, never crossfaded — 005's
// bug) does the 40% ghost car replay the zig-zag, walking past the rider on
// 6 twice while they wait.
//
// Beats are pinned to the recorded narration (frames from timing.json):
//   f0-72    "An elevator follows one simple rule."
//   f91-155  "Pick a direction and finish it."   -> stampA in at f86
//   f171-209 "Collect everyone going up,"        -> pickups 112 / 154 / 194
//   f221-291 "then turn around and collect everyone going down."
//                                                -> flip at f216, pickups 252 / 284
//   f308-319 "Never zigzag."                     -> real run out, ghost in
//   f339-390 "Zigzagging leaves people stranded."-> warn chip at f348

const BX = 100;
const BY = 690;
const B = buildingLayout({ w: 880, h: 650, floors: 8, shafts: 1 });

const CAR_W = 150;
const CAR_H = 56;
const CAR_TOTAL = carHeight(CAR_W, CAR_H);
const CAR_X = BX + B.shaftX(0) + (B.shaftW - CAR_W) / 2;

const RIDER_SIZE = 50;
const RIDER_X = 665;

const carTop = (floor: number) => BY + B.floorFloor(floor) - 9 - CAR_TOTAL;
const riderTop = (floor: number) => BY + B.floorFloor(floor) - 9 - RIDER_SIZE;

// waiting riders: up-calls on 2/5/7, down-calls on 6/3
const WAITING: { floor: number; dir: "up" | "down"; pickup: number }[] = [
  { floor: 2, dir: "up", pickup: 112 },
  { floor: 5, dir: "up", pickup: 154 },
  { floor: 7, dir: "up", pickup: 194 },
  { floor: 6, dir: "down", pickup: 252 },
  { floor: 3, dir: "down", pickup: 284 },
];

const DEPART = 80; // the car picks its direction
const FLIP = 216; // top of the run, triangle turns over
const REAL_KEYS = [80, 108, 120, 150, 162, 190, 202, 216, 248, 262, 280, 300];
const REAL_FLOORS = [1, 2, 2, 5, 5, 7, 7, 8, 6, 6, 3, 3];
const GHOST_KEYS = [310, 332, 352, 372, 394];
const GHOST_FLOORS = [1, 5, 2, 7, 4];

// The ghost's route, PLOTTED (floor vs. time) across the empty landing area
// rather than inside the shaft: swinging the trail +/-38px either side of the
// shaft centre produced near-vertical parallel lines that read as nothing.
// Out here the doubling-back is an actual zig-zag shape, on light marble, so
// theme.warn works straight (5.0:1) — no WARN_LIT needed.
const zigY = (f: number) => BY + B.floorFloor(f) - 9 - CAR_TOTAL / 2;
const ZIG_X = [190, 300, 410, 520, 630];
const ZIG_FLOORS = [1, 5, 2, 7, 4];
const ZIG_PATH = ZIG_FLOORS.map(
  (f, i) => `${i === 0 ? "M" : "L"}${ZIG_X[i]} ${zigY(f)}`,
).join(" ");

export const Rule: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const realFloor = interpolate(frame, REAL_KEYS, REAL_FLOORS, clamp);
  const ghostFloor = interpolate(frame, GHOST_KEYS, GHOST_FLOORS, clamp);
  const lastGhost = interpolate(frame - 2, GHOST_KEYS, GHOST_FLOORS, clamp);

  const realO = fadeOut(frame, 298, 8);
  const ghostO = fadeIn(frame, 310, 10);

  const stampA = Math.min(fadeIn(frame, 86, 10), fadeOut(frame, 296, 10));
  const stampB = fadeIn(frame, 306, 10);
  const chipGood = Math.min(fadeIn(frame, 240, 10), fadeOut(frame, 296, 8));
  const chipWarn = fadeIn(frame, 348, 10);

  const onBoard = WAITING.filter((r) => frame >= r.pickup).map(() => RIDER_NEUTRAL);
  const dir: "up" | "down" = frame < FLIP ? "up" : "down";

  // the rider the zig-zag strands
  const strandedO = fadeIn(frame, 310, 10);
  const zigDraw = interpolate(frame, [314, 394], [0, 1], clamp);
  const blink = frame > 332 ? 0.5 + 0.5 * Math.sin((frame - 332) / 4.5) : 0;
  const tap = frame > 332 ? Math.abs(Math.sin((frame - 332) / 6)) * 5 : 0;

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: BX, top: BY, opacity: fadeIn(frame, 0, 14) }}>
        <BuildingSection layout={B} />
      </div>

      {/* --- the real run ------------------------------------------------- */}
      <div style={{ opacity: realO }}>
        {WAITING.map((r) => {
          const gone = frame >= r.pickup;
          const p = interpolate(frame, [r.pickup, r.pickup + 6], [1, 0], clamp);
          return gone && p <= 0 ? null : (
            <div
              key={r.floor}
              style={{
                position: "absolute",
                left: RIDER_X,
                top: riderTop(r.floor),
                opacity: Math.min(fadeIn(frame, 8 + r.floor * 3, 10), p),
                transform: `translateX(${(1 - p) * 60}px)`,
              }}
            >
              <Rider size={RIDER_SIZE} dir={r.dir} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: CAR_X, top: carTop(realFloor) }}>
          <Car w={CAR_W} h={CAR_H} dir={frame >= DEPART ? dir : null} riders={onBoard} />
        </div>
      </div>

      {/* --- the ghost zig-zag, strictly AFTER the real run ---------------- */}
      <RouteLine
        idKey="zig"
        path={ZIG_PATH}
        draw={zigDraw}
        color={theme.warn}
        width={6}
        opacity={0.95}
      />
      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", left: 0, top: 0, opacity: ghostO }}
      >
        {ZIG_FLOORS.map((f, i) =>
          zigDraw >= i / (ZIG_FLOORS.length - 1) - 0.005 ? (
            <circle key={i} cx={ZIG_X[i]} cy={zigY(f)} r={8} fill={theme.warn} />
          ) : null,
        )}
      </svg>
      <div style={{ opacity: ghostO }}>
        <div style={{ position: "absolute", left: CAR_X, top: carTop(ghostFloor) }}>
          <Car w={CAR_W} h={CAR_H} dir={ghostFloor > lastGhost ? "up" : "down"} ghost />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: RIDER_X,
          top: riderTop(6) - tap,
          opacity: strandedO,
        }}
      >
        <Rider
          size={RIDER_SIZE}
          dir="down"
          color={blink > 0.55 ? theme.warn : RIDER_NEUTRAL}
        />
      </div>

      {/* --- type --------------------------------------------------------- */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 452,
          display: "flex",
          justifyContent: "center",
          opacity: stampA,
          transform: `translateY(${(1 - stampA) * 14}px)`,
        }}
      >
        <Stamp fontSize={44}>
          pick a direction.
          <br />
          finish it.
        </Stamp>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 452,
          display: "flex",
          justifyContent: "center",
          opacity: stampB,
          transform: `translateY(${(1 - stampB) * 14}px)`,
        }}
      >
        <Stamp fontSize={44} color={theme.warn}>
          never zig-zag
        </Stamp>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 612,
          textAlign: "center",
          opacity: chipGood,
          transform: `translateY(${(1 - chipGood) * 14}px)`,
        }}
      >
        <Chip color={theme.good}>nobody skipped</Chip>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 612,
          textAlign: "center",
          opacity: chipWarn,
          transform: `translateY(${(1 - chipWarn) * 14}px)`,
        }}
      >
        <Chip color={theme.warn}>zig-zag = stranded</Chip>
      </div>
    </AbsoluteFill>
  );
};
