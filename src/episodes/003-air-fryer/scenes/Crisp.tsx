import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { RiseIn, useEnter } from "../../../components/ui";
import { Chip, FRY_GOLD, FRY_PALE, Headline, INK, mixHex, Steam, h } from "./kitchen";

// Scene 4 (~19s): macro shot of one fry. Steam leaves the surface, the crust
// browns pale → golden, a cut-open reveal shows the soft interior, and the
// teaspoon of oil shows up looking very small.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Crisp: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // beats snapped to narration (v2 audio: align.mjs moved this scene's
  // boundary 19 frames closer to the speech, so all v1 beats shift -19):
  // "blast the surface" ~f156, "steams off" ~f229-241, "outside browns"
  // ~f319, "inside stays soft" ~f361, "teaspoon" ~f415, "the wind does the
  // frying" ~f541-565
  const enter = useEnter(10);
  const brown = interpolate(frame, [161, 326], [0, 1], clamp);
  const crust = mixHex(FRY_PALE, FRY_GOLD, brown);
  const cut = useEnter(356, { damping: 13 });
  const spoon = useEnter(411, { damping: 10 });

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      {/* the giant fry */}
      <div style={{ position: "absolute", top: 470, opacity: enter, transform: `scale(${enter})`, transformOrigin: "center" }}>
        <svg width="420" height="640" viewBox="0 0 420 640">
          <Steam x={210} y={80} start={156} count={8} rise={110} />
          {/* crust */}
          <rect x="130" y="70" width="160" height="540" rx="46" fill={crust} stroke={INK} strokeWidth="5" />
          {/* browning speckles fade in with the crust */}
          {Array.from({ length: 10 }, (_, i) => (
            <circle
              key={i}
              cx={160 + h(i, 12) * 100}
              cy={110 + h(i, 13) * 460}
              r={4 + h(i, 14) * 5}
              fill="#9A6425"
              opacity={brown * (0.25 + h(i, 15) * 0.4)}
            />
          ))}
          {/* cut-open reveal: soft pale interior */}
          <g opacity={cut}>
            <rect x="152" y="92" width="116" height="496" rx="34" fill="#F8ECC8" />
            {[0, 1, 2].map((i) => (
              <line key={i} x1={172} y1={160 + i * 160} x2={248} y2={172 + i * 160} stroke="#E4D3A4" strokeWidth="7" strokeLinecap="round" />
            ))}
          </g>
        </svg>
      </div>

      {frame >= 221 && frame < 341 ? (
        <RiseIn delay={221} style={{ position: "absolute", left: 620, top: 540 }}>
          <Chip color={theme.second}>water steams off</Chip>
        </RiseIn>
      ) : null}

      {frame >= 326 ? (
        <RiseIn delay={326} style={{ position: "absolute", left: 96, top: 640 }}>
          <Chip color={theme.accent} style={{ fontWeight: 700 }}>crispy outside</Chip>
        </RiseIn>
      ) : null}
      {frame >= 371 ? (
        <RiseIn delay={371} style={{ position: "absolute", left: 660, top: 900 }}>
          <Chip>soft inside</Chip>
        </RiseIn>
      ) : null}

      {/* the very small teaspoon of oil */}
      <div style={{ position: "absolute", left: 130, top: 1120, opacity: spoon, transform: `scale(${spoon}) rotate(-8deg)`, transformOrigin: "center" }}>
        <svg width="180" height="110" viewBox="0 0 180 110">
          <ellipse cx="46" cy="64" rx="34" ry="22" fill="#C8CDD4" stroke={INK} strokeWidth="3.5" />
          <ellipse cx="46" cy="60" rx="24" ry="13" fill="#E8C34C" />
          <line x1="78" y1="56" x2="168" y2="34" stroke="#C8CDD4" strokeWidth="10" strokeLinecap="round" />
        </svg>
      </div>
      {frame >= 426 ? (
        <RiseIn delay={426} style={{ position: "absolute", left: 96, top: 1230 }}>
          <Chip>1 tsp — heat + flavor</Chip>
        </RiseIn>
      ) : null}

      <RiseIn delay={536} style={{ position: "absolute", left: 0, right: 0, top: 1296, textAlign: "center" }}>
        <Headline>
          the <span style={{ color: theme.accent }}>wind</span> does the frying
        </Headline>
      </RiseIn>
    </AbsoluteFill>
  );
};
