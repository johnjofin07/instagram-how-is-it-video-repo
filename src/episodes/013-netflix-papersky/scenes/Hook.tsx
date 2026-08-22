import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RiseIn } from "../../../components/ui";
import {
  Headline,
  House,
  NetflixMark,
  RED,
  Route,
  TEAL,
  TownStage,
  Warehouse,
} from "./kit";

// Scene 1 (~6.5s / 195f) — zack-mode hook. The most shareable image is the
// FIRST image: the Netflix mark over a warehouse that is already standing at
// the end of a paper street, shelves full, by frame 0. Words: "Netflix runs a
// warehouse at the end of your street, and tonight's show is already on its
// shelf." Nothing slides in late — the claim is on the board before the
// first word, the routes run to the homes as the windows flick red.

const BASE = 1170;
const HOUSE_W = 118;
const HOUSES = [
  { x: 462, lit: 96 },
  { x: 578, lit: 112 },
  { x: 694, lit: 128 },
  { x: 810, lit: 104 },
];
const DEPOT_W = 360;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // the claim is ON the board at frame 0 — no entrance spring. The IG loop
  // crashes the cold end straight into this frame, so it must be complete.
  const routeIn = interpolate(frame, [60, 96], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <TownStage horizon={1020} road={1140} />

      {/* the claim — on the board from frame 0 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 430,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
        }}
      >
        <NetflixMark h={110} />
        <Headline fontSize={40} rotate={-1.6} rule={RED}>
          warehouse on your street
        </Headline>
      </div>

      {/* the street — warehouse already standing, already stocked */}
      {HOUSES.map(({ x, lit }, i) => (
        <div
          key={i}
          style={{ position: "absolute", left: x, top: BASE - HOUSE_W * (118 / 132) }}
        >
          <House w={HOUSE_W} glow={frame >= lit ? "watching" : "warm"} />
        </div>
      ))}
      <Warehouse
        w={DEPOT_W}
        sign="24/7"
        mark
        doorGlow={1}
        stock={1}
        style={{ left: 64, top: BASE - DEPOT_W * (250 / 340) }}
      />
      <Route
        d="M 242 100 C 272 40, 404 30, 520 110"
        w={1080}
        h={340}
        progress={routeIn}
        style={{ position: "absolute", left: 0, top: 950 }}
      />
      <Route
        d="M 268 104 C 470 14, 706 18, 868 110"
        w={1080}
        h={340}
        progress={routeIn}
        speed={2}
        style={{ position: "absolute", left: 0, top: 950 }}
      />

      {/* "tonight's show is already on its shelf" */}
      <RiseIn
        delay={118}
        style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center" }}
      >
        <Headline fontSize={36} rotate={1.2} rule={TEAL}>
          tonight's show · on the shelf
        </Headline>
      </RiseIn>
    </AbsoluteFill>
  );
};
