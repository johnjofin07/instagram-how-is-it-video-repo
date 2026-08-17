import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { MonoLabel, RiseIn } from "../../../components/ui";
import { Chip } from "./carto";

// Scene 5 (~15.5s): zoom out from one glowing dot to a whole city of them —
// then that one dot is YOU. Headline + comment CTA.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// deterministic pseudo-random for dot placement
const h = (i: number, n: number) => {
  const s = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const GRID_X = [90, 310, 530, 750, 970];
const GRID_Y = [80, 300, 520, 740, 940];

export const Payoff: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, 150], [2.1, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const heroPulse = frame >= 160 ? 1 + 0.15 * Math.sin((frame - 160) / 6) : 1;
  const ringT = frame >= 160 ? (((frame - 160) / 50) % 1 + 1) % 1 : 0;

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      {/* the city of probes */}
      <div style={{ position: "absolute", top: 380, transform: `scale(${zoom})`, transformOrigin: "540px 510px" }}>
        <svg width="1080" height="1020" viewBox="0 0 1080 1020">
          {GRID_X.map((x) => (
            <rect key={`v${x}`} x={x - 16} y="30" width="32" height="960" rx="16" fill="#FFFFFF" stroke="rgba(32,48,60,0.09)" strokeWidth="2" />
          ))}
          {GRID_Y.map((y) => (
            <rect key={`h${y}`} x="30" y={y - 16} width="1020" height="32" rx="16" fill="#FFFFFF" stroke="rgba(32,48,60,0.09)" strokeWidth="2" />
          ))}
          {/* moving probe dots */}
          {Array.from({ length: 44 }, (_, i) => {
            const horizontal = i % 2 === 0;
            const lane = horizontal ? GRID_Y[i % GRID_Y.length] : GRID_X[i % GRID_X.length];
            const speed = 1 + h(i, 1) * 2.2;
            const start = h(i, 2) * 1020;
            const pos = ((start + frame * speed) % 1080 + 1080) % 1080;
            return (
              <circle
                key={i}
                cx={horizontal ? pos : lane}
                cy={horizontal ? lane : pos}
                r={8}
                fill={theme.accent}
                opacity={0.4 + h(i, 3) * 0.5}
              />
            );
          })}
          {/* YOU: the hero dot, dead center */}
          <circle cx="540" cy="510" r={13 * heroPulse} fill={theme.brand} />
          {frame >= 160 ? (
            <circle cx="540" cy="510" r={16 + ringT * 90} fill="none" stroke={theme.brand} strokeWidth={4 - ringT * 3} opacity={1 - ringT} />
          ) : null}
        </svg>
      </div>

      {frame >= 175 ? (
        <RiseIn delay={178} style={{ position: "absolute", top: 806, left: 620 }}>
          <Chip color={theme.brand} style={{ fontWeight: 700 }}>you</Chip>
        </RiseIn>
      ) : null}

      <RiseIn delay={250} style={{ position: "absolute", top: 1330, textAlign: "center" }}>
        <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 66, color: theme.text }}>
          you <span style={{ color: theme.accent }}>are</span> the traffic.
        </div>
      </RiseIn>

      <RiseIn delay={352} style={{ position: "absolute", top: 1428, textAlign: "center" }}>
        <MonoLabel style={{ fontSize: 27, letterSpacing: "0.15em" }}>
          drop a topic in the comments ↓
        </MonoLabel>
      </RiseIn>
    </AbsoluteFill>
  );
};
