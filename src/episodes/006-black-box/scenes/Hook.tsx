import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RiseIn, useEnter } from "../../../components/ui";
import { useTheme } from "../../../themes";
import { Chip, FlameEnvelope, LabGrid, Press, Recorder, Stamp, TestReadout } from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const IMPACT_SHAKE = [0, 18, -14, 10, -7, 4, -2, 0];

export const Hook: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const claimIn = useEnter(2, { damping: 11 });

  const hitProgress = interpolate(frame, [56, 76], [0, 1], {
    ...clamp,
    easing: (t) => t * t,
  });
  const shakeIndex = Math.max(0, Math.min(IMPACT_SHAKE.length - 1, frame - 76));
  const impactShake = frame >= 76 && frame < 76 + IMPACT_SHAKE.length ? IMPACT_SHAKE[shakeIndex] : 0;
  const pressGap = interpolate(frame, [132, 178], [1, 0], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const fire = interpolate(frame, [205, 238, 278], [0, 1, 0.82], clamp);
  const depth = interpolate(frame, [298, 380], [0, 6000], clamp);
  const testDone = interpolate(frame, [386, 404], [0, 1], clamp);

  const phase = frame < 126 ? "impact" : frame < 196 ? "crush" : frame < 286 ? "fire" : "depth";

  return (
    <AbsoluteFill style={{ transform: `translateX(${impactShake}px)` }}>
      <LabGrid opacity={phase === "depth" ? 0.18 : 0.72} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 460,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${claimIn})`,
        }}
      >
        <Stamp fontSize={44} rotate={-1.5}>
          to approve it,
          <br />
          <span style={{ color: theme.accent }}>try to destroy it</span>
        </Stamp>
      </div>

      <RiseIn delay={18} style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center" }}>
        <Chip>black box qualification</Chip>
      </RiseIn>

      {phase === "impact" ? (
        <>
          <div style={{ position: "absolute", left: 735, top: 680, width: 82, height: 410, borderRadius: 12, background: "#303B44", border: "5px solid #667581" }} />
          <div
            style={{
              position: "absolute",
              left: 205 + hitProgress * 290,
              top: 760,
              transform: `rotate(${hitProgress * 3}deg)`,
            }}
          >
            <Recorder w={340} damage={hitProgress > 0.94 ? 0.38 : 0} />
          </div>
          <div style={{ position: "absolute", left: 360, top: 1125 }}>
            <TestReadout value={frame < 76 ? `${Math.round(hitProgress * 3400).toLocaleString()} G` : "3,400 G"} label="IMPACT SHOCK" color={frame >= 76 ? theme.warn : theme.text} status={frame >= 86 ? "DATA OK" : "TESTING"} />
          </div>
        </>
      ) : null}

      {phase === "crush" ? (
        <>
          <div style={{ position: "absolute", left: 230, top: 625 }}><Press gap={pressGap} /></div>
          <div style={{ position: "absolute", left: 360, top: 785, transform: `scaleY(${0.94 + pressGap * 0.06})` }}>
            <Recorder w={360} damage={0.44} />
          </div>
          <div style={{ position: "absolute", left: 360, top: 1125 }}>
            <TestReadout value={`${(2.3 * (1 - pressGap)).toFixed(1)} t`} label="STATIC CRUSH" color={pressGap < 0.08 ? theme.warn : theme.text} status={frame >= 182 ? "DATA OK" : "TESTING"} />
          </div>
        </>
      ) : null}

      {phase === "fire" ? (
        <>
          <div style={{ position: "absolute", left: 215, top: 620, opacity: fire }}><FlameEnvelope intensity={fire} /></div>
          <div style={{ position: "absolute", left: 350, top: 760, filter: `brightness(${1 - fire * 0.22}) saturate(${1 - fire * 0.18})` }}>
            <Recorder w={380} damage={0.62} />
          </div>
          <div style={{ position: "absolute", left: 360, top: 1125 }}>
            <TestReadout value={`${Math.round(interpolate(frame, [202, 248], [20, 1100], clamp)).toLocaleString()}°C`} label="HIGH-TEMP FIRE" color={theme.accent} status={frame >= 266 ? "DATA OK" : "TESTING"} />
          </div>
        </>
      ) : null}

      {phase === "depth" ? (
        <>
          <div style={{ position: "absolute", left: 150, top: 590, width: 780, height: 560, border: `5px solid ${theme.secondDim}`, borderRadius: 70, overflow: "hidden", background: "linear-gradient(180deg, rgba(32,83,103,.25), rgba(2,18,28,.82))" }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} style={{ position: "absolute", left: 70 + ((i * 113) % 620), top: 70 + ((frame * (1.1 + i * 0.08) + i * 57) % 420), width: 7 + (i % 3) * 4, height: 7 + (i % 3) * 4, borderRadius: 999, border: `2px solid ${theme.secondDim}`, opacity: 0.35 }} />
            ))}
            <div style={{ position: "absolute", left: 200, top: 165 }}><Recorder w={380} damage={0.7} /></div>
          </div>
          <div style={{ position: "absolute", left: 360, top: 1125, opacity: 1 - testDone }}>
            <TestReadout value={`${Math.round(depth).toLocaleString()} m`} label="DEEP-SEA PRESSURE" color={theme.second} status={frame >= 382 ? "DATA OK" : "TESTING"} />
          </div>
        </>
      ) : null}

      {frame >= 386 ? (
        <div style={{ position: "absolute", left: 65, right: 140, top: 1260, display: "flex", justifyContent: "space-between", opacity: testDone }}>
          {["IMPACT", "CRUSH", "FIRE", "DEPTH"].map((label) => <Chip key={label} color={theme.second} style={{ fontSize: 20, padding: "8px 15px" }}>{label} · OK</Chip>)}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
