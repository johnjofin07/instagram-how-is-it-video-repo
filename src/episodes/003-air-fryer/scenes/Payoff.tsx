import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { Card, CountUp, MonoLabel, RiseIn, useEnter } from "../../../components/ui";
import { Chip, Counter, Fan, Fryer, Headline, SHELL } from "./kitchen";

// Scene 5 (~13s): the marketing punchline as a mini timeline. 1945 convection
// oven (ignored, asleep) → someone points the fan down → 100,000,000 sold.
// Ends on the channel sign-off.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// dusty old convection oven, fast asleep
const OldOven: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width="300" height="300" viewBox="0 0 300 300">
      <rect x="20" y="30" width="260" height="240" rx="26" fill="#8E8779" />
      <rect x="44" y="82" width="212" height="130" rx="16" fill="#6E685D" />
      {[70, 110, 190, 230].map((x) => (
        <circle key={x} cx={x} cy="56" r="8" fill="#5C5749" />
      ))}
      <Fan cx={150} cy={147} r={34} angle={frame * 0.4} color="#57524A" />
      {/* zzz */}
      {[0, 1, 2].map((i) => {
        const t = ((frame / 90 + i * 0.33) % 1 + 1) % 1;
        return (
          <text
            key={i}
            x={240 + t * 34}
            y={40 - t * 46}
            fontFamily={FONTS.mono}
            fontSize={22 + i * 5}
            fill="#8E8779"
            opacity={Math.sin(Math.PI * t) * 0.9}
          >
            z
          </text>
        );
      })}
    </svg>
  );
};

export const Payoff: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // beats snapped to narration: "1940s" ~f76, "then someone pointed the fan
  // down" ~f193-237, "sold 100 million" ~f295-332, "what machine" ~f388
  const ovenIn = useEnter(20);
  const arrowIn = useEnter(190);
  const fryerIn = useEnter(205);
  // the pivotal gesture: the fan rotates from sideways to pointing down
  const tilt = interpolate(frame, [215, 255], [-90, 0], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const countIn = useEnter(290);

  return (
    <AbsoluteFill>
      <Counter y={1120} />

      {/* 1945: the ignored convection oven */}
      <div style={{ position: "absolute", left: 70, top: 826, opacity: ovenIn, transform: `scale(${ovenIn})`, transformOrigin: "bottom center" }}>
        <OldOven />
      </div>
      {frame >= 70 ? (
        <RiseIn delay={70} style={{ position: "absolute", left: 76, top: 748 }}>
          <Chip>1945 · convection</Chip>
        </RiseIn>
      ) : null}

      {/* the pivot arrow */}
      <div style={{ position: "absolute", left: 400, top: 940, opacity: arrowIn }}>
        <svg width="200" height="80" viewBox="0 0 200 80">
          <line x1="12" y1="40" x2="160" y2="40" stroke={theme.textDim} strokeWidth="7" strokeLinecap="round" strokeDasharray="2 18" />
          <path d="M156 22 L186 40 L156 58 Z" fill={theme.textDim} />
        </svg>
      </div>

      {/* 2010: fan pointed down, rebranded */}
      <div style={{ position: "absolute", left: 660, top: 800, opacity: fryerIn, transform: `scale(${fryerIn})`, transformOrigin: "bottom center" }}>
        <Fryer w={280} />
        {/* the fan being tilted downward above it */}
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: "absolute", left: 70, top: -128, transform: `rotate(${tilt}deg)`, transformOrigin: "center" }}>
          <Fan cx={70} cy={62} r={34} angle={frame * 9} color={SHELL} />
          <path d="M54 112 L70 134 L86 112" fill="none" stroke={theme.accent} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {frame >= 240 ? (
        <RiseIn delay={240} style={{ position: "absolute", left: 656, top: 748 }}>
          <Chip color={theme.accent}>fan pointed down</Chip>
        </RiseIn>
      ) : null}

      {/* the receipts */}
      {frame >= 290 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 460, display: "flex", justifyContent: "center", opacity: countIn, transform: `scale(${countIn})` }}>
          <Card brand style={{ padding: "30px 52px", textAlign: "center" }}>
            <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 66, color: theme.brand }}>
              <CountUp to={100000000} delay={296} durationFrames={45} />
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 24, letterSpacing: "0.22em", color: theme.textDim, marginTop: 6 }}>
              AIR FRYERS SOLD
            </div>
          </Card>
        </div>
      ) : null}

      <RiseIn delay={385} style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center" }}>
        <Headline style={{ fontSize: 50 }}>
          what <span style={{ color: theme.accent }}>machine</span> should I break down next?
        </Headline>
      </RiseIn>
      <RiseIn delay={430} style={{ position: "absolute", left: 0, right: 0, top: 1316, textAlign: "center" }}>
        <MonoLabel style={{ fontSize: 27, letterSpacing: "0.15em" }}>
          drop it in the comments ↓
        </MonoLabel>
      </RiseIn>

    </AbsoluteFill>
  );
};
