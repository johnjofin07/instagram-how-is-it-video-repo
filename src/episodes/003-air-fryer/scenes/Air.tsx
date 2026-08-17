import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { Card, CountUp, RiseIn, useEnter } from "../../../components/ui";
import { AirLoop, Blanket, Chip, Cutaway, Headline } from "./kitchen";

// Scene 3 (~20.5s): the money shot. The fan spins up, hot air starts
// circulating, and the cool blanket around the fries gets shredded and swept
// away. "3× faster" counter, then "a hurricane in a bucket".

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// fan angle = integral of a speed ramp (2 → 26 deg/frame over the first 60f)
const fanAngle = (frame: number) => {
  const f = Math.min(frame, 60);
  const ramp = 2 * f + (24 * f * f) / (2 * 60);
  return frame <= 60 ? ramp : ramp + 26 * (frame - 60);
};

export const Air: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // beats snapped to narration: "destroys that blanket" ~f10-37, "200 degree"
  // ~f79, "three times faster" ~f400-421, "hurricane" ~f549
  const enter = useEnter(6);
  const loopGrow = interpolate(frame, [25, 80], [0, 1], clamp);
  const shake = frame >= 60 ? Math.sin(frame * 1.7) * 1.6 : 0;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 240,
          top: 430,
          opacity: enter,
          transform: `scale(${enter}) translate(${shake}px, ${-shake * 0.6}px)`,
          transformOrigin: "center",
        }}
      >
        <Cutaway w={600} spin={fanAngle(frame)} coilGlow={interpolate(frame, [10, 40], [0.4, 1], clamp)}>
          <Blanket cx={220} cy={345} rx={118} ry={62} appearAt={0} shredAt={35} />
          <AirLoop cx={220} cy={262} rx={128} ry={116} count={16} grow={loopGrow} speed={0.0075} />
        </Cutaway>
      </div>

      {frame >= 80 ? (
        <RiseIn delay={80} style={{ position: "absolute", left: 96, top: 500 }}>
          <Chip color={theme.accent} style={{ fontWeight: 700 }}>200° moving air</Chip>
        </RiseIn>
      ) : null}

      {frame >= 395 ? (
        <RiseIn delay={395} style={{ position: "absolute", left: 0, right: 0, display: "flex", justifyContent: "center", top: 1180 }}>
          <Card accent style={{ padding: "26px 46px", textAlign: "center" }}>
            <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 76, color: theme.accent }}>
              <CountUp to={3} delay={401} durationFrames={24} />× faster
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 24, letterSpacing: "0.2em", color: theme.textDim, marginTop: 6 }}>
              HEAT INTO THE FOOD
            </div>
          </Card>
        </RiseIn>
      ) : null}

      <RiseIn delay={540} style={{ position: "absolute", left: 0, right: 0, top: 1390, textAlign: "center" }}>
        <Headline>
          a <span style={{ color: theme.accent }}>hurricane</span> in a bucket
        </Headline>
      </RiseIn>
    </AbsoluteFill>
  );
};
