import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { Card, CountUp, MonoLabel, RiseIn } from "../../../components/ui";
import { Car, CAR_COLORS, Chip, HandcartWalker, SideRoad, SignalRings } from "./carto";

// Scene 4 (~25s): Berlin, 2020. Simon Weckert walks 99 phones down an empty
// street; Google paints it dark red; real drivers nope out of an empty road.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Skyline: React.FC = () => (
  <svg width="1080" height="300" viewBox="0 0 1080 300" style={{ position: "absolute", top: 806, opacity: 0.4 }}>
    {[
      [0, 120, 130],
      [150, 70, 180],
      [250, 150, 100],
      [430, 90, 160],
      [560, 140, 110],
      [880, 100, 150],
      [1000, 80, 170],
    ].map(([x, w, h], i) => (
      <rect key={i} x={x} y={300 - h} width={w} height={h} fill="#B9C6C4" />
    ))}
    {/* Fernsehturm */}
    <line x1="760" y1="300" x2="760" y2="60" stroke="#B9C6C4" strokeWidth="14" />
    <circle cx="760" cy="90" r="34" fill="#B9C6C4" />
    <line x1="760" y1="56" x2="760" y2="10" stroke="#B9C6C4" strokeWidth="6" />
  </svg>
);

export const Handcart: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const walkerX = interpolate(frame, [30, 430], [-400, 620], clamp);

  // map inset: the empty street igniting dark red under the wagon's path
  const mapIn = frame >= 380;
  const redDraw = interpolate(frame, [410, 520], [0, 1], clamp);

  // a real driver approaches the "jam", panics, and turns around
  const carIn = interpolate(frame, [500, 560], [1160, 780], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const fleeing = frame >= 620;
  const carOut = interpolate(frame, [620, 700], [780, 1220], { ...clamp, easing: (t) => t * t });
  const carX = fleeing ? carOut : carIn;

  return (
    <AbsoluteFill>
      <RiseIn delay={8} style={{ position: "absolute", top: 356, left: 0, right: 0, textAlign: "center" }}>
        <Chip>berlin · feb 2020</Chip>
      </RiseIn>

      <Skyline />
      <SideRoad y={1106} />

      {/* phone counter (steps aside when the map inset arrives) */}
      <RiseIn
        delay={90}
        style={{
          position: "absolute",
          left: 96,
          top: 470,
          opacity: interpolate(frame, [366, 392], [1, 0], clamp),
        }}
      >
        <Card style={{ padding: "22px 30px", textAlign: "center" }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 64, fontWeight: 700, color: theme.brand }}>
            ×<CountUp to={99} delay={100} durationFrames={60} />
          </div>
          <MonoLabel style={{ fontSize: 21, marginTop: 6 }}>phones in the wagon</MonoLabel>
        </Card>
      </RiseIn>

      {/* the slow walk — flipped so the walker leads and the wagon trails */}
      <div style={{ position: "absolute", left: walkerX, top: 946, transform: "scaleX(-1)" }}>
        <HandcartWalker />
      </div>
      {frame > 60 && frame < 640 ? (
        <SignalRings x={walkerX + 160} y={1000} size={80} period={40} />
      ) : null}
      {frame > 130 && frame < 380 ? (
        <RiseIn delay={140} style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center" }}>
          <Chip>99 “cars” · walking speed</Chip>
        </RiseIn>
      ) : null}

      {/* what google sees */}
      {mapIn ? (
        <RiseIn delay={382} style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center" }}>
          <Card brand style={{ width: 700, padding: 26 }}>
            <MonoLabel style={{ fontSize: 21, color: theme.brand }}>what google sees</MonoLabel>
            <svg width="648" height="180" viewBox="0 0 648 180">
              <rect x="0" y="70" width="648" height="44" rx="12" fill="#FFFFFF" stroke="rgba(32,48,60,0.14)" strokeWidth="2" />
              {/* dark red = severe jam */}
              <rect x="6" y="78" width={636 * redDraw} height="28" rx="14" fill="#9A1B12" />
              <text x="12" y="52" fontFamily={FONTS.mono} fontSize="22" fill={theme.brand} letterSpacing="2">
                {redDraw > 0.4 ? "SEVERE JAM · AVOID" : "…"}
              </text>
              <text x="636" y="150" fontFamily={FONTS.mono} fontSize="20" fill={theme.textDim} textAnchor="end">
                actual cars on street: 0
              </text>
            </svg>
          </Card>
        </RiseIn>
      ) : null}

      {/* the rerouted driver */}
      {frame >= 500 ? (
        <div style={{ position: "absolute", left: carX, top: 1064 }}>
          <Car color={CAR_COLORS[4]} w={180} flip={!fleeing} />
          {!fleeing && frame >= 566 ? (
            <div
              style={{
                position: "absolute",
                top: -74,
                left: 24,
                background: theme.card,
                border: `1.5px solid ${theme.cardBorder}`,
                borderRadius: 14,
                boxShadow: theme.cardShadow,
                padding: "8px 18px",
                fontFamily: FONTS.sans,
                fontWeight: 800,
                fontSize: 38,
                color: theme.brand,
              }}
            >
              ?!
            </div>
          ) : null}
        </div>
      ) : null}

      {/* punchline */}
      {frame >= 610 ? (
        <RiseIn delay={612} style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center" }}>
          <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 54, color: theme.text }}>
            99 phones = <span style={{ color: theme.brand }}>1 fake traffic jam</span>
          </div>
        </RiseIn>
      ) : null}
    </AbsoluteFill>
  );
};
