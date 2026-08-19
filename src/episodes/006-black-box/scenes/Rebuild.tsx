import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Card, MonoLabel, RiseIn, useEnter } from "../../../components/ui";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { AircraftSide, Chip, MemoryUnit, Stamp, Timeline } from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EVIDENCE = ["cockpit warning", "altitude", "control input", "engine data"];

export const Rebuild: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const plug = useEnter(6, { damping: 15 });
  const timelineProgress = interpolate(frame, [48, 220], [0, 1], clamp);
  const sync = interpolate(frame, [138, 196], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const question = interpolate(frame, [292, 322], [0, 1], clamp);
  const evidenceIn = interpolate(frame, [350, 420], [0, 1], clamp);
  const flight = interpolate(frame, [430, 486], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });

  return (
    <AbsoluteFill>
      {frame < 286 ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center" }}>
            <Chip color={theme.second}>recorder laboratory</Chip>
          </div>
          <div style={{ position: "absolute", left: 88, top: 560, transform: `scale(${plug})` }}>
            <Card accent style={{ width: 904, height: 610, padding: 26, borderRadius: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <MemoryUnit w={150} layers={1} />
                <div>
                  <MonoLabel style={{ color: theme.second, fontSize: 21 }}>memory readout</MonoLabel>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 24, color: theme.good, marginTop: 8 }}>DATA RECOVERED</div>
                </div>
              </div>
              <div style={{ marginTop: 25 }}>
                <Timeline progress={timelineProgress} synced={sync} />
              </div>
            </Card>
          </div>
          {frame >= 158 ? (
            <RiseIn delay={158} style={{ position: "absolute", left: 0, right: 0, top: 1215, textAlign: "center" }}>
              <Stamp fontSize={38} rotate={-1} color={theme.second}>second by second</Stamp>
            </RiseIn>
          ) : null}
        </>
      ) : null}

      {frame >= 282 && frame < 432 ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center", opacity: question }}>
            <Stamp fontSize={52} rotate={-1} color={theme.warn}>cause: ?</Stamp>
          </div>
          <div style={{ position: "absolute", left: 100, right: 100, top: 650, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            {EVIDENCE.map((label, i) => {
              const local = interpolate(evidenceIn, [i * 0.16, i * 0.16 + 0.35], [0, 1], clamp);
              return (
                <Card key={label} style={{ padding: 26, borderRadius: 6, opacity: local, transform: `translateY(${(1 - local) * 28}px)` }}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 21, color: theme.textDim, letterSpacing: "0.12em" }}>CLUE {String(i + 1).padStart(2, "0")}</div>
                  <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 34, color: theme.text, marginTop: 10 }}>{label}</div>
                </Card>
              );
            })}
          </div>
          <RiseIn delay={326} style={{ position: "absolute", left: 0, right: 0, top: 1208, textAlign: "center" }}>
            <Stamp fontSize={37} rotate={1} color={theme.second}>evidence, not a verdict</Stamp>
          </RiseIn>
        </>
      ) : null}

      {frame >= 420 ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center", opacity: flight }}>
            <Stamp fontSize={40} rotate={-1} color={theme.good}>make the next flight safer</Stamp>
          </div>
          <div style={{ position: "absolute", left: 120, top: 650, opacity: flight, transform: `translateY(${(1 - flight) * 50}px)` }}>
            <AircraftSide w={840} tailGlow={0.2} flightProgress={flight} />
          </div>
          <svg width="900" height="180" viewBox="0 0 900 180" style={{ position: "absolute", left: 90, top: 1000, opacity: flight }}>
            <path d="M40 140 Q250 115 430 92 T860 28" fill="none" stroke={theme.good} strokeWidth="8" strokeDasharray="14 16" strokeLinecap="round" />
            <circle cx="860" cy="28" r="13" fill={theme.good} />
          </svg>
          {frame >= 486 ? (
            <RiseIn delay={486} style={{ position: "absolute", left: 0, right: 0, top: 1230, textAlign: "center" }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 27, letterSpacing: "0.11em", color: theme.textDim }}>
                what machine should I break down next? ↓
              </div>
            </RiseIn>
          ) : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
