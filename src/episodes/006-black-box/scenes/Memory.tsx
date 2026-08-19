import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RiseIn, useEnter } from "../../../components/ui";
import { useTheme } from "../../../themes";
import { Chip, MemoryUnit, Recorder, Stamp } from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const DEBRIS = [
  { x: -230, y: -140, r: -24, w: 120 },
  { x: 250, y: -130, r: 18, w: 150 },
  { x: -290, y: 120, r: 28, w: 105 },
  { x: 300, y: 130, r: -16, w: 132 },
  { x: -150, y: 250, r: 14, w: 94 },
  { x: 175, y: 255, r: -28, w: 118 },
];

export const Memory: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const headline = useEnter(8, { damping: 12 });
  const split = interpolate(frame, [24, 88], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const zoom = interpolate(frame, [78, 138], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const layers = interpolate(frame, [116, 174], [0, 1], clamp);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 460, display: "flex", justifyContent: "center", transform: `scale(${headline})`, opacity: 1 - zoom * 0.55 }}>
        <Stamp fontSize={42} rotate={-1} color={theme.warn}>
          most of the box
          <br />
          can be destroyed
        </Stamp>
      </div>

      <div style={{ position: "absolute", left: 340, top: 690, opacity: 1 - split * 0.7, transform: `scale(${1 - split * 0.12})` }}>
        <Recorder w={400} damage={0.88} cutaway={split} />
      </div>

      {DEBRIS.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 540 - d.w / 2 + d.x * split,
            top: 835 + d.y * split,
            width: d.w,
            height: d.w * 0.38,
            borderRadius: 9,
            background: i % 2 === 0 ? theme.accentDim : "#303B44",
            border: `3px solid ${i % 2 === 0 ? theme.accent : "#667581"}`,
            opacity: split * (1 - zoom * 0.82),
            transform: `rotate(${d.r * split}deg)`,
          }}
        />
      ))}

      <div style={{ position: "absolute", left: 450 - zoom * 55, top: 815 - zoom * 120, transform: `scale(${0.72 + zoom * 1.12})` }}>
        <MemoryUnit w={250} glow={0.7 + zoom * 0.3} layers={layers} />
      </div>

      {frame >= 128 ? (
        <div style={{ position: "absolute", left: 100, right: 100, top: 1060, display: "flex", justifyContent: "space-between", opacity: layers }}>
          <Chip>metal shell</Chip>
          <Chip>heat barrier</Chip>
          <Chip color={theme.second}>solid-state memory</Chip>
        </div>
      ) : null}

      <RiseIn delay={166} style={{ position: "absolute", left: 0, right: 0, top: 1232, textAlign: "center" }}>
        <Stamp fontSize={35} rotate={1} color={theme.second}>
          only the memory must survive
        </Stamp>
      </RiseIn>
    </AbsoluteFill>
  );
};
