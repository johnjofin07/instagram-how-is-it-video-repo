import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RiseIn, useEnter } from "../../../components/ui";
import { Headline, House, Parcel, RED, Route, TEAL, TownStage, Warehouse, paperShadow } from "./kit";

// Scene 5 (~5.8s / 174f): the cold end. "So the show you pressed play on was
// stocked before you even knew you wanted it." Press play → parcel one hops
// from the warehouse to the house → the window goes red → hold on the peak
// image. Zack rule 8: NO on-screen CTA, no summary chip — the CTA lives in
// the post caption (same deviation as 011/012).

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const BASE = 1170;
const DEPOT_W = 300;
const HOUSE_W = 150;

export const Payoff: React.FC = () => {
  const frame = useCurrentFrame();

  const playIn = useEnter(0, { damping: 11 });
  const press = interpolate(frame, [40, 48, 58], [1, 0.86, 1], clamp); // "play" at f43

  const hop = interpolate(frame, [58, 122], [0, 1], {
    ...clamp,
    easing: (t) => t * t * (3 - 2 * t),
  });
  const hopX = 208 + hop * 604;
  const hopY = 1064 - Math.sin(hop * Math.PI) * 178;

  return (
    <AbsoluteFill>
      <TownStage horizon={1020} road={1140} />

      {/* press play */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 426,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${playIn * press})`,
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 999,
            background: RED,
            filter: paperShadow(3),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="56" height="64" viewBox="0 0 56 64">
            <path d="M 10 5 L 52 32 L 10 59 Z" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* the handover */}
      <Warehouse w={DEPOT_W} doorGlow={1} stock={1} mark style={{ left: 70, top: BASE - DEPOT_W * (250 / 340) }} />
      <div style={{ position: "absolute", left: 790, top: BASE - HOUSE_W * (118 / 132) }}>
        <House w={HOUSE_W} glow={hop >= 1 ? "watching" : "warm"} />
      </div>
      <Route
        d="M 218 152 Q 520 -8 838 162"
        w={1080}
        h={400}
        progress={interpolate(frame, [46, 70], [0, 1], clamp)}
        style={{ position: "absolute", left: 0, top: 920 }}
      />
      {frame >= 58 && hop < 1 ? (
        <div style={{ position: "absolute", left: hopX, top: hopY, transform: `rotate(${hop * 360}deg)` }}>
          <Parcel w={48} />
        </div>
      ) : null}

      {/* the peak image, and nothing after it */}
      <RiseIn delay={106} style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center" }}>
        <Headline fontSize={36} rotate={-1.4} rule={TEAL} maxWidth={820}>
          stocked before you wanted it
        </Headline>
      </RiseIn>
    </AbsoluteFill>
  );
};
