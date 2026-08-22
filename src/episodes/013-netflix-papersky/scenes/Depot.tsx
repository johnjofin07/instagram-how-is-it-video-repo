import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import { RiseIn, useEnter } from "../../../components/ui";
import {
  Chip,
  Moon,
  NightSheet,
  PaperStars,
  Parcel,
  RED,
  RUSH,
  TownStage,
  Warehouse,
  paperShadow,
} from "./kit";

// Scene 4 (~10.9s / 327f): the pivot. "But those parcels never travel far,
// because Netflix hands that warehouse to your internet provider for free,
// and every night it fills up with what your neighborhood will watch
// tomorrow." Faraway cloud struck through → the warehouse at the provider →
// the night sheet drops and the shelves stock up. (v1's "OPEN CONNECT" and
// "on the shelf before you asked" headlines are gone — unspoken now.)

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const BASE = 1170;
const DEPOT = { w: 340, left: 70 };
const DEPOT_TOP = BASE - DEPOT.w * (250 / 340);
const NIGHT = 206; // "every night" is spoken at f210

export const Depot: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const cloudIn = useEnter(0, { damping: 13 });
  const slashIn = interpolate(frame, [22, 40], [0, 1], clamp);
  const cloudOut = interpolate(frame, [96, 124], [1, 0], clamp);
  const depotIn = useEnter(110, { damping: 11 });

  const night = interpolate(frame, [NIGHT, NIGHT + 50], [0, 0.56], clamp);
  const stocking = frame >= NIGHT + 16;

  return (
    <AbsoluteFill>
      <TownStage horizon={1020} road={1140} clouds={false} />

      {/* the faraway cloud, struck through — "never travel far" */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 424,
          textAlign: "center",
          opacity: cloudOut,
          transform: `scale(${cloudIn})`,
        }}
      >
        <svg width="320" height="200" viewBox="0 0 320 200" style={{ display: "block", margin: "0 auto", overflow: "visible" }}>
          <g style={{ filter: paperShadow(2) }}>
            <path
              d="M52 150 Q16 150 18 118 Q20 88 60 88 Q66 46 116 46 Q136 14 184 22 Q232 8 250 52 Q296 54 298 100 Q300 146 258 150 Z"
              fill="#FFFFFF"
            />
          </g>
          <rect x="34" y="160" width={252 * slashIn} height="13" rx="6.5" fill={RED} transform="rotate(-33 34 166)" />
        </svg>
        <Chip style={{ marginTop: 10 }}>some faraway cloud · 3,000 km</Chip>
      </div>

      {/* nightly stocking: parcels rain down and vanish BEHIND the roof */}
      {stocking
        ? [0, 1, 2, 3].map((i) => {
            const t = (((frame - NIGHT - 16 + i * 19) % 76) + 76) % 76;
            const drop = t / 76;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 132 + i * 58,
                  top: 748 + drop * 250,
                  opacity: Math.min(1, drop * 5),
                  transform: `rotate(${drop * 44 - 22}deg)`,
                }}
              >
                <Parcel w={46} />
              </div>
            );
          })
        : null}

      {/* the warehouse, handed to your internet provider */}
      <div
        style={{
          position: "absolute",
          left: DEPOT.left,
          top: DEPOT_TOP,
          transform: `scale(${depotIn})`,
          transformOrigin: "bottom center",
        }}
      >
        <Warehouse
          w={DEPOT.w}
          sign="ISP"
          mark
          doorGlow={interpolate(frame, [NIGHT, NIGHT + 100], [0.35, 1], clamp)}
          stock={interpolate(frame, [110, NIGHT + 10, NIGHT + 110], [0.34, 0.34, 1], clamp)}
        />
      </div>

      {/* night sheet — above the board, BELOW every label */}
      <NightSheet amount={night} />
      <PaperStars opacity={Math.min(1, night * 1.7)} />
      {night > 0.05 ? (
        <Moon size={124} opacity={Math.min(1, night * 2.2)} style={{ left: 806, top: 612 }} />
      ) : null}

      <RiseIn delay={164} style={{ position: "absolute", left: 490, top: 962 }}>
        <Chip color={theme.good} fontSize={26}>
          free, from netflix
        </Chip>
      </RiseIn>
      <RiseIn delay={186} style={{ position: "absolute", left: 490, top: 1038 }}>
        <Chip fontSize={26}>at your internet provider</Chip>
      </RiseIn>
      <RiseIn delay={NIGHT + 30} style={{ position: "absolute", left: 84, top: 764 }}>
        <Chip color={RUSH} fontSize={25}>
          every night · tomorrow's shows, stocked
        </Chip>
      </RiseIn>
    </AbsoluteFill>
  );
};
