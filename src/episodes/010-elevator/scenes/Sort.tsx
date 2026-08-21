import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import {
  BuildingSection,
  CabInterior,
  Car,
  Chip,
  DEST,
  DoorPanel,
  Kiosk,
  RouteLine,
  Rider,
  Stamp,
  buildingLayout,
  carHeight,
  clamp,
  fadeIn,
  fadeOut,
} from "./kit";

// Scene 3 — THE SORT · D = 446f (14.88s, timing.json). THREE stages now:
//   1  f0-198    lobby: kiosk + 6 riders, teal routes converging on 3 doors
//   2  f196-316  cutaway: three express runs, no shared stops
//   3  f316-446  PATTERN INTERRUPT — inside a car: a blank brass wall
//
// [v2] The delivery-van beat that used to sit between 2 and 3 is CUT: the van
// simile left the narration, so it had nothing to sync to. The express-runs
// shot breathes into the space instead (the cars are still arriving at f306,
// one frame before the cut, so the interrupt lands on motion, not on a lull).
//
// [v2] THE CUT AT f316 IS HARD — one frame, no crossfade. It lands on the
// whispered "look," (@f314) and is followed by ~24 frames in which literally
// nothing on screen moves. Eerie is correct. Beats, from timing.json:
//   f0-48    "Fancy buildings go further."
//   f84-113  "You type your floor in the lobby"   -> riders type f88..f168
//   f122-156 "and a computer sorts the people."   -> chip at f124
//   f184-269 "...gets packed into the same car."  -> the cutaway runs
//   f281-314 "Which is why, look,"                -> CUT
//   f330-428 "some elevators have no buttons inside at all."
//
// Rider dot colour = their DESTINATION floor. Ring = the CAR the dispatcher
// packed them into. Floors 11 and 12 are deliberately two DIFFERENT dot
// colours sharing one olive ring — that pair is the whole idea: nearby
// destinations, same car.

const CARS = [
  { letter: "A", ring: DEST.teal, shaft: 0, stops: [4, 5] },
  { letter: "B", ring: DEST.olive, shaft: 1, stops: [11, 12] },
  { letter: "C", ring: DEST.plum, shaft: 2, stops: [7, 8] },
];

const RIDERS = [
  { floor: 12, color: DEST.rust, car: 1, at: 88 },
  { floor: 4, color: DEST.teal, car: 0, at: 104 },
  { floor: 7, color: DEST.plum, car: 2, at: 120 },
  { floor: 11, color: DEST.olive, car: 1, at: 136 },
  { floor: 5, color: DEST.teal, car: 0, at: 152 },
  { floor: 8, color: DEST.plum, car: 2, at: 168 },
];

const QUEUE_X = [400, 460, 520, 580, 640, 700];
const QUEUE_TOP = 1210;
const RIDER_SIZE = 58;

const DOOR_W = 160;
const DOOR_X = 790;
const DOOR_TOPS = [700, 894, 1088];
const DOOR_CY = DOOR_TOPS.map((t) => t + (DOOR_W * 1.06) / 2);

// ---- stage 2: the cutaway ---------------------------------------------------
const BX = 100;
const BY = 690;
const B = buildingLayout({ w: 880, h: 650, floors: 12, shafts: 3 });
const CAR_W = 110;
const CAR_H = 38;
const CAR_TOTAL = carHeight(CAR_W, CAR_H);
const carTop = (floor: number) => BY + B.floorFloor(floor) - 9 - CAR_TOTAL;
const carX = (shaft: number) => BX + B.shaftX(shaft) + (B.shaftW - CAR_W) / 2;

const RUNS = [
  { keys: [212, 258, 270, 300], floors: [1, 4, 4, 5] },
  { keys: [212, 268, 280, 306], floors: [1, 11, 11, 12] },
  { keys: [212, 262, 274, 303], floors: [1, 7, 7, 8] },
];

// ---- the pattern interrupt --------------------------------------------------
const CUT = 316; // hard cut, ONE frame, on the whispered "look,"
const STILL = 24; // frames after the cut in which nothing moves at all

export const Sort: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // hard cut: no crossfade, no shared frame — everything before CUT is simply
  // gone on CUT, and the cab is simply there.
  const after = frame >= CUT ? 1 : 0;

  const lobbyO = Math.min(fadeIn(frame, 0, 12), fadeOut(frame, 188, 10));
  const cutawayO = fadeIn(frame, 196, 10) * (1 - after);
  const cabO = after;

  const stampLobby = Math.min(fadeIn(frame, 36, 10), fadeOut(frame, 186, 8));
  const stamp = Math.min(fadeIn(frame, 206, 10), fadeOut(frame, 300, 10));
  const stampCab = fadeIn(frame, CUT + STILL, 12);
  const chipLobby = Math.min(fadeIn(frame, 124, 10), fadeOut(frame, 186, 8));
  const chipCab = fadeIn(frame, 384, 12);

  // kiosk shows whichever rider is currently at the keypad
  const activeIdx = Math.max(
    0,
    RIDERS.reduce((acc, r, i) => (frame >= r.at - 14 ? i : acc), 0),
  );
  const active = RIDERS[activeIdx];
  const kioskTyped = frame >= RIDERS[0].at - 14 ? String(active.floor) : undefined;
  const kioskCar = frame >= active.at ? CARS[active.car].letter : undefined;

  // the missing panel ghosts in only AFTER the stillness has done its work
  const ghostPanel = interpolate(frame, [352, 384], [0, 0.7], clamp);

  return (
    <AbsoluteFill>
      {/* ---------------------------------------------------------- 1. lobby */}
      <div style={{ opacity: lobbyO }}>
        <div style={{ position: "absolute", left: 120, top: 700 }}>
          <Kiosk w={250} typed={kioskTyped} car={kioskCar} />
        </div>

        {CARS.map((c, i) => (
          <div key={c.letter} style={{ position: "absolute", left: DOOR_X, top: DOOR_TOPS[i] }}>
            <DoorPanel w={DOOR_W} open={0.16} withButton={false} />
            <div
              style={{
                position: "absolute",
                left: DOOR_W / 2 - 27,
                top: (DOOR_W * 1.06) / 2 - 27,
                width: 54,
                height: 54,
                borderRadius: 999,
                background: theme.card,
                border: `4px solid ${c.ring}`,
                boxShadow: theme.cardShadow,
                fontFamily: FONTS.mono,
                fontWeight: 700,
                fontSize: 30,
                lineHeight: "46px",
                textAlign: "center",
                color: c.ring,
              }}
            >
              {c.letter}
            </div>
          </div>
        ))}

        {RIDERS.map((r, i) => {
          const drawn = interpolate(frame, [r.at + 4, r.at + 26], [0, 1], {
            ...clamp,
            easing: (t) => 1 - Math.pow(1 - t, 3),
          });
          const sx = QUEUE_X[i] + 20;
          const dy = DOOR_CY[r.car];
          return (
            <RouteLine
              key={`rt${i}`}
              idKey={`s${i}`}
              path={`M${sx} 1200 C ${sx} ${dy + 140}, ${sx + 150} ${dy}, 782 ${dy}`}
              draw={drawn}
              color={CARS[r.car].ring}
              opacity={0.95}
            />
          );
        })}

        {RIDERS.map((r, i) => (
          <div
            key={r.floor}
            style={{
              position: "absolute",
              left: QUEUE_X[i],
              top: QUEUE_TOP,
              opacity: fadeIn(frame, 4 + i * 4, 10),
            }}
          >
            <Rider
              size={RIDER_SIZE}
              color={r.color}
              floor={frame >= r.at - 16 ? r.floor : undefined}
              ring={frame >= r.at ? CARS[r.car].ring : undefined}
            />
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------- 2. cutaway */}
      <div style={{ opacity: cutawayO }}>
        <div style={{ position: "absolute", left: BX, top: BY }}>
          <BuildingSection
            layout={B}
            marks={CARS.flatMap((c) =>
              c.stops.map((f) => ({ floor: f, shaft: c.shaft, color: c.ring })),
            )}
          />
        </div>
        {CARS.map((c, i) => {
          const f = interpolate(frame, RUNS[i].keys, RUNS[i].floors, clamp);
          const riders = RIDERS.filter((r) => r.car === i).map((r) => r.color);
          return (
            <div key={c.letter} style={{ position: "absolute", left: carX(c.shaft), top: carTop(f) }}>
              <Car w={CAR_W} h={CAR_H} dir="up" riders={riders} />
            </div>
          );
        })}
      </div>

      {/* ---------------------------- 3. inside a car (pattern interrupt) --- */}
      <div style={{ opacity: cabO }}>
        <CabInterior
          w={720}
          h={520}
          ghostPanel={ghostPanel}
          style={{ position: "absolute", left: 180, top: 716 }}
        />
      </div>

      {/* ---------------------------------------------------------- type ---- */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 612,
          textAlign: "center",
          opacity: chipLobby,
          transform: `translateY(${(1 - chipLobby) * 14}px)`,
        }}
      >
        <Chip>the computer picks your car</Chip>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 452,
          display: "flex",
          justifyContent: "center",
          opacity: stampLobby,
          transform: `translateY(${(1 - stampLobby) * 14}px)`,
        }}
      >
        <Stamp fontSize={44}>you type your floor</Stamp>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 452,
          display: "flex",
          justifyContent: "center",
          opacity: stamp,
          transform: `translateY(${(1 - stamp) * 14}px)`,
        }}
      >
        <Stamp fontSize={44}>sorted like parcels</Stamp>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 452,
          display: "flex",
          justifyContent: "center",
          opacity: stampCab,
          transform: `translateY(${(1 - stampCab) * 14}px)`,
        }}
      >
        <Stamp fontSize={44} color={theme.second}>
          nothing to press
        </Stamp>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1280,
          textAlign: "center",
          opacity: chipCab,
          transform: `translateY(${(1 - chipCab) * 14}px)`,
        }}
      >
        <Chip color={theme.second}>no buttons inside at all</Chip>
      </div>
    </AbsoluteFill>
  );
};
