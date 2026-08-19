import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { RiseIn, useEnter } from "../../../components/ui";
import { Chip, Depot, House, Parcel, Route, Stamp } from "./kit";

// Scene 5 (~15s): press play → the handover. No ocean crossing — the depot
// down the road tosses parcel one to your house. "You're streaming from the
// neighborhood." Then the channel sign-off.

export const Payoff: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // play button pops in, then gets "pressed"
  const playIn = useEnter(6, { damping: 10 });
  const press = interpolate(frame, [46, 54, 64], [1, 0.86, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // parcel one hops depot → house
  const hop = interpolate(frame, [128, 212], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t),
  });
  const hopX = 236 + hop * 610;
  const hopY = 960 - Math.sin(hop * Math.PI) * 200;

  return (
    <AbsoluteFill>
      {/* press play */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 400,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${playIn * press})`,
        }}
      >
        <div
          style={{
            width: 148,
            height: 148,
            borderRadius: 999,
            background: theme.brand,
            boxShadow: `0 0 64px ${theme.brandGlow}, ${theme.cardShadow}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="56" height="64" viewBox="0 0 56 64">
            <path d="M 8 4 L 52 32 L 8 60 Z" fill="#FFFFFF" />
          </svg>
        </div>
      </div>
      <RiseIn delay={40} style={{ position: "absolute", left: 0, right: 0, top: 580, textAlign: "center" }}>
        <Chip>
          tonight · press play ·{" "}
          <span style={{ color: theme.textFaint, textDecoration: "line-through" }}>ocean crossing</span>{" "}
          <span style={{ color: theme.brand, fontWeight: 700 }}>none</span>
        </Chip>
      </RiseIn>

      {/* the handover */}
      <div style={{ position: "absolute", left: 64, top: 830 }}>
        <Depot w={340} doorGlow={1} />
      </div>
      <div style={{ position: "absolute", left: 826, top: 934 }}>
        <House w={160} glow={hop >= 1 ? "watching" : "warm"} />
      </div>
      <Route
        d="M 250 210 Q 540 -30 860 190"
        w={1080}
        h={260}
        progress={interpolate(frame, [116, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        style={{ position: "absolute", left: 0, top: 760 }}
      />
      {frame >= 128 && hop < 1 ? (
        <div style={{ position: "absolute", left: hopX, top: hopY, transform: `rotate(${hop * 360}deg)` }}>
          <Parcel w={46} />
        </div>
      ) : null}
      <RiseIn delay={214} style={{ position: "absolute", left: 396, top: 1044 }}>
        <Chip color={theme.second}>parcel #1 · handed over</Chip>
      </RiseIn>

      {/* the reframe, one last time */}
      <RiseIn delay={252} style={{ position: "absolute", left: 0, right: 0, top: 1176, textAlign: "center" }}>
        <Stamp fontSize={37} rotate={-1.6} color={theme.brand}>
          streaming from <span style={{ color: theme.brand }}>the neighborhood</span>
        </Stamp>
      </RiseIn>

      {/* channel sign-off */}
      {frame >= 396 ? (
        <RiseIn delay={396} style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center" }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 27,
              letterSpacing: "0.12em",
              color: theme.textDim,
            }}
          >
            what system should I break down next? ↓
          </div>
        </RiseIn>
      ) : null}
    </AbsoluteFill>
  );
};
