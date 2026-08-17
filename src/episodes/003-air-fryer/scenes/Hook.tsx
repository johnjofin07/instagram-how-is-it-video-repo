import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { RiseIn, useEnter } from "../../../components/ui";
import { Chip, Counter, Fryer, Headline, INK } from "./kitchen";

// Scene 1 (~10.5s): the air fryer on the counter. An oil drop falls toward it
// and gets frozen + slashed ("not a single drop"). The shell goes translucent
// to reveal coil + fan, then a shiny NEW! sticker slaps on for "marketing".

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Hook: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // beats snapped to narration: "not a single drop" ~f66-102, "small oven
  // with a fan" ~f122-165, "marketing" ~f202, scene ends f259
  const pop = useEnter(6);
  const dropY = interpolate(frame, [42, 76], [400, 655], {
    ...clamp,
    easing: (t) => t * t,
  });
  const slash = useEnter(84, { damping: 10 });
  const reveal = interpolate(frame, [115, 140], [0, 1], clamp);
  const sticker = useEnter(198, { damping: 9 });

  return (
    <AbsoluteFill>
      <Counter y={1180} />

      {/* the fryer */}
      <div
        style={{
          position: "absolute",
          left: 350,
          top: 742,
          transform: `scale(${pop})`,
          transformOrigin: "bottom center",
        }}
      >
        <Fryer w={380} reveal={reveal} />
      </div>

      {/* the oil drop that never gets to fry */}
      {frame >= 42 && frame < 160 ? (
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ position: "absolute", left: 460, top: dropY }}>
          <path d="M80 22 C 62 62 44 84 44 106 a36 36 0 0 0 72 0 C 116 84 98 62 80 22 Z" fill="#E8C34C" stroke={INK} strokeWidth="4" />
          <ellipse cx="66" cy="104" rx="9" ry="13" fill="#F7E39A" />
          {/* the slash stamp */}
          <g opacity={slash} transform={`scale(${0.6 + slash * 0.4})`} transform-origin="80 90">
            <circle cx="80" cy="90" r="62" fill="none" stroke={theme.brand} strokeWidth="9" />
            <line x1="38" y1="48" x2="122" y2="132" stroke={theme.brand} strokeWidth="9" strokeLinecap="round" />
          </g>
        </svg>
      ) : null}
      {frame >= 92 && frame < 160 ? (
        <RiseIn delay={92} style={{ position: "absolute", left: 640, top: 690 }}>
          <Chip color={theme.brand} style={{ fontWeight: 700 }}>no frying</Chip>
        </RiseIn>
      ) : null}

      {/* x-ray labels */}
      {frame >= 125 ? (
        <RiseIn delay={125} style={{ position: "absolute", left: 128, top: 820 }}>
          <Chip>a small oven</Chip>
        </RiseIn>
      ) : null}
      {frame >= 155 ? (
        <RiseIn delay={155} style={{ position: "absolute", left: 706, top: 940 }}>
          <Chip color={theme.accent}>+ a fan</Chip>
        </RiseIn>
      ) : null}

      {/* marketing sticker */}
      <div
        style={{
          position: "absolute",
          left: 620,
          top: 704,
          opacity: sticker,
          transform: `rotate(14deg) scale(${sticker})`,
          transformOrigin: "center",
        }}
      >
        <svg width="150" height="150" viewBox="0 0 150 150">
          <path
            d={Array.from({ length: 24 }, (_, i) => {
              const a = (i / 24) * Math.PI * 2;
              const r = i % 2 === 0 ? 70 : 54;
              return `${i === 0 ? "M" : "L"} ${75 + r * Math.cos(a)} ${75 + r * Math.sin(a)}`;
            }).join(" ") + " Z"}
            fill={theme.brand}
          />
          <text x="75" y="86" textAnchor="middle" fontFamily={FONTS.sans} fontWeight="900" fontSize="34" fill="#FFF8EE">
            NEW!
          </text>
        </svg>
      </div>

      <RiseIn delay={210} style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center" }}>
        <Headline>
          an oven. a fan. <span style={{ color: theme.brand }}>great marketing.</span>
        </Headline>
      </RiseIn>
    </AbsoluteFill>
  );
};
