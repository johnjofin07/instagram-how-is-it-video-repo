import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Card, MonoLabel, RiseIn } from "../../../components/ui";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { AircraftSide, AudioWave, Chip, DataBus, Recorder, Stamp } from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Recorders: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const planeDraw = interpolate(frame, [0, 32], [0, 1], clamp);
  const cardsIn = interpolate(frame, [30, 70], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const audio = interpolate(frame, [82, 145], [0, 1], clamp);
  const data = interpolate(frame, [146, 245], [0, 1], clamp);
  const returnToTail = interpolate(frame, [252, 318], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center", opacity: 1 - returnToTail }}>
        <Stamp fontSize={45} rotate={-1.2}>
          two recorders
        </Stamp>
      </div>

      {frame < 72 || frame >= 250 ? (
        <div
          style={{
            position: "absolute",
            left: 135,
            top: 715,
            opacity: frame < 72 ? planeDraw * (1 - cardsIn) : returnToTail,
            transform: `translateY(${frame < 72 ? (1 - planeDraw) * 35 : 0}px)`,
          }}
        >
          <AircraftSide w={810} tailGlow={frame < 72 ? 0.35 : returnToTail} />
        </div>
      ) : null}

      {frame >= 28 && frame < 325 ? (
        <div
          style={{
            position: "absolute",
            left: 70,
            right: 70,
            top: 620,
            display: "flex",
            gap: 30,
            opacity: cardsIn * (1 - returnToTail),
            transform: `scale(${0.86 + cardsIn * 0.14 - returnToTail * 0.16}) translateY(${returnToTail * 160}px)`,
          }}
        >
          <Card accent style={{ width: 440, height: 560, padding: 24, overflow: "hidden", borderRadius: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <MonoLabel style={{ color: theme.accent, fontSize: 24 }}>CVR</MonoLabel>
              <Recorder w={140} />
            </div>
            <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 38, color: theme.text, marginTop: 10 }}>cockpit audio</div>
            <div style={{ width: 390, overflow: "hidden", marginTop: 40 }}>
              <AudioWave progress={audio} />
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 34 }}>
              {["voices", "radio", "alarms", "engine sounds"].map((label, i) => <Chip key={label} color={i === 2 ? theme.warn : undefined} style={{ fontSize: 18, padding: "7px 12px" }}>{label}</Chip>)}
            </div>
          </Card>

          <Card accent style={{ width: 440, height: 560, padding: 24, overflow: "hidden", borderRadius: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <MonoLabel style={{ color: theme.second, fontSize: 24 }}>FDR</MonoLabel>
              <Recorder w={140} />
            </div>
            <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 38, color: theme.text, marginTop: 10 }}>flight data</div>
            <div style={{ transform: "scale(0.55)", transformOrigin: "top left", width: 700, marginTop: 26 }}>
              <DataBus progress={data} />
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 25, color: theme.second, marginTop: -86, letterSpacing: "0.09em" }}>
              {frame < 188 ? "dozens of signals" : frame < 222 ? "hundreds of signals" : "100s OF SYSTEMS"}
            </div>
          </Card>
        </div>
      ) : null}

      {frame >= 302 ? (
        <RiseIn delay={302} style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center" }}>
          <Chip color={theme.accent}>protected memory · near the tail</Chip>
        </RiseIn>
      ) : null}
    </AbsoluteFill>
  );
};
