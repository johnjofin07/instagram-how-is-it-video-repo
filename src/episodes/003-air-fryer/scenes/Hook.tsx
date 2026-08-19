import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { RiseIn, useEnter } from "../../../components/ui";
import { AirLoop, Chip, Counter, Fryer, Headline, INK } from "./kitchen";

// Scene 1 (~11s, v2 retention hook): the claim ("a hurricane in a bucket")
// is ON SCREEN at ~0.07s while the fryer pops onto the counter. Then the v1
// beats, shifted ~2.7s later: an oil drop falls and gets frozen + slashed
// ("not one drop of oil"), the shell goes translucent to reveal coil + fan,
// and a shiny NEW! sticker slaps on for "marketing".

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Hook: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // beats snapped to the v2 narration: claim spoken f5-94, "never fried
  // anything" f105-153, "not one drop of oil" f161-219, "small oven with a
  // fan" f233-295, "marketing" f322, scene ends f389
  const claimIn = useEnter(2, { damping: 11 });
  const pop = useEnter(6);
  // the storm in the shell: a vortex whips around the closed fryer while
  // "hurricane in a bucket" is spoken, then calms before the oil-drop beat
  const storm =
    interpolate(frame, [38, 56], [0, 1], clamp) *
    interpolate(frame, [88, 104], [1, 0], clamp);
  const jx = Math.sin(frame * 2.7) * 2.2 * storm;
  const jy = Math.cos(frame * 3.3) * 1.6 * storm;
  const dropY = interpolate(frame, [105, 140], [400, 655], {
    ...clamp,
    easing: (t) => t * t,
  });
  const slash = useEnter(165, { damping: 10 });
  const reveal = interpolate(frame, [232, 258], [0, 1], clamp);
  const sticker = useEnter(318, { damping: 9 });

  return (
    <AbsoluteFill>
      {/* the claim — on screen immediately */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 430,
          textAlign: "center",
          transform: `scale(${claimIn})`,
        }}
      >
        <Headline style={{ fontSize: 62 }}>
          a <span style={{ color: theme.brand }}>hurricane</span> in a bucket
        </Headline>
      </div>

      <Counter y={1180} />

      {/* vortex, far side (drawn behind the fryer) */}
      <svg width="760" height="560" viewBox="0 0 760 560" style={{ position: "absolute", left: 160, top: 700 }}>
        <AirLoop cx={380} cy={265} rx={300} ry={120} count={7} speed={0.02} grow={storm * 0.45} />
      </svg>

      {/* the fryer (rattling while the storm blows) */}
      <div
        style={{
          position: "absolute",
          left: 350,
          top: 742,
          transform: `translate(${jx}px, ${jy}px) scale(${pop})`,
          transformOrigin: "bottom center",
        }}
      >
        <Fryer w={380} reveal={reveal} />
      </div>

      {/* vortex, near side (in front of the fryer) */}
      <svg width="760" height="560" viewBox="0 0 760 560" style={{ position: "absolute", left: 160, top: 700 }}>
        <AirLoop cx={380} cy={290} rx={252} ry={96} count={9} speed={0.024} grow={storm} />
      </svg>

      {/* the oil drop that never gets to fry */}
      {frame >= 105 && frame < 228 ? (
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
      {frame >= 185 && frame < 228 ? (
        <RiseIn delay={185} style={{ position: "absolute", left: 640, top: 690 }}>
          <Chip color={theme.brand} style={{ fontWeight: 700 }}>no frying</Chip>
        </RiseIn>
      ) : null}

      {/* x-ray labels */}
      {frame >= 250 ? (
        <RiseIn delay={250} style={{ position: "absolute", left: 128, top: 820 }}>
          <Chip>a small oven</Chip>
        </RiseIn>
      ) : null}
      {frame >= 285 ? (
        <RiseIn delay={285} style={{ position: "absolute", left: 706, top: 940 }}>
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

      <RiseIn delay={338} style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center" }}>
        <Headline>
          an oven. a fan. <span style={{ color: theme.brand }}>great marketing.</span>
        </Headline>
      </RiseIn>
    </AbsoluteFill>
  );
};
