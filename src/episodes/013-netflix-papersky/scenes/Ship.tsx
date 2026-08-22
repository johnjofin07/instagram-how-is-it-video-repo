import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { RiseIn } from "../../../components/ui";
import {
  Belt,
  CARTON_RATIO,
  Carton,
  Chip,
  FloorStage,
  House,
  Parcel,
  RUSH,
  SLATE,
  TEAL,
  Wifi,
} from "./kit";

// Scene 3 (~9.1s / 273f): the parcel line. "Each box is chopped into
// four-second parcels, and your TV orders them one at a time, picking a
// smaller box whenever your wifi gets busy." Slicer → parcel stream → the
// house ordering → wifi drops → parcels shrink. (v1's strong-wifi headline,
// video-call chip and buffering-wheel beat are gone — unspoken now.)

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const BELT_Y = 890;
const BELT_X = 44;
const BELT_W = 720;
const BUSY = 176; // "smaller" is spoken at f179 — the parcels shrink on the word

export const Ship: React.FC = () => {
  const frame = useCurrentFrame();

  const srcW = 170;
  const cartonX = interpolate(frame, [0, 40], [-260, 120], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  const parcelW = interpolate(frame, [BUSY, BUSY + 26], [58, 32], clamp);
  const bars: 0 | 1 | 2 | 3 = frame < BUSY ? 3 : 1;
  const blade = 7 * Math.sin(frame / 3.2);

  return (
    <AbsoluteFill>
      <FloorStage floorFrom={560} />

      {/* the source box + the slicer */}
      <div style={{ position: "absolute", left: cartonX, top: BELT_Y - srcW * CARTON_RATIO }}>
        <Carton w={srcW} label="1080" depth={2} />
      </div>
      <svg
        width="80"
        height="230"
        viewBox="0 0 80 230"
        style={{ position: "absolute", left: 292, top: 676, overflow: "visible" }}
      >
        <g style={{ filter: "drop-shadow(0 6px 10px rgba(24,56,84,0.28))" }}>
          <rect x="26" y="0" width="26" height="58" rx="8" fill={SLATE} />
        </g>
        <g transform={`translate(0 ${blade})`}>
          <path d="M39 58 V196" fill="none" stroke={TEAL} strokeWidth="7" strokeLinecap="round" strokeDasharray="14 12" />
          <path d="M28 194 L39 216 L50 194 Z" fill={TEAL} />
        </g>
      </svg>

      {/* the parcel stream */}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 372 + ((((frame * 2.8 + i * 92) % 480) + 480) % 480);
        return x < 748 ? (
          <div key={i} style={{ position: "absolute", left: x, top: BELT_Y - parcelW * 0.92 }}>
            <Parcel w={parcelW} />
          </div>
        ) : null;
      })}
      <Belt x={BELT_X} y={BELT_Y} w={BELT_W} speed={2.8} />

      {/* your home, doing the ordering */}
      <div style={{ position: "absolute", left: 776, top: BELT_Y - 158 * (118 / 132) }}>
        <House w={158} glow="watching" />
      </div>
      <RiseIn delay={104} style={{ position: "absolute", left: 500, top: 668 }}>
        <Chip color={TEAL} fontSize={26}>
          next parcel, please!
        </Chip>
      </RiseIn>
      <RiseIn delay={116} style={{ position: "absolute", left: 836, top: 596 }}>
        <Wifi bars={bars} w={80} />
      </RiseIn>

      <RiseIn delay={40} style={{ position: "absolute", left: 84, top: 1000 }}>
        <Chip fontSize={26}>1 parcel ≈ 4 seconds of video</Chip>
      </RiseIn>

      {/* the wifi gets busy → smaller boxes */}
      <RiseIn delay={BUSY} style={{ position: "absolute", left: 84, top: 444 }}>
        <Chip color={RUSH} fontSize={27}>
          wifi busy → smaller boxes, same show
        </Chip>
      </RiseIn>
      {frame >= BUSY ? (
        <div
          style={{
            position: "absolute",
            left: 604,
            top: 1006,
            fontFamily: FONTS.sans,
            fontWeight: 800,
            fontSize: 24,
            color: RUSH,
            whiteSpace: "nowrap",
            opacity: interpolate(frame, [BUSY, BUSY + 14], [0, 1], clamp),
          }}
        >
          smaller parcels
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
