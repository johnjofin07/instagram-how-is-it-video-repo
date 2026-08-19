import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import { RiseIn, useEnter } from "../../../components/ui";
import { Chip, Depot, House, Route, Stamp } from "./kit";

// Scene 1 (~11.5s): retention-first hook. The claim is ON SCREEN at ~0.25s —
// "NETFLIX ALREADY KNOWS" stamps over a row of homes whose windows flick
// red one by one (tonight's binge, predicted). Beat 2: the depot slides in,
// already stocked, route dashes running to the houses. Beat 3: "streaming
// company" gets struck out — it's a delivery company.

export const Hook: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // beat 1: claim stamp, instant
  const claimIn = useEnter(2, { damping: 11 });

  // beat 2: depot slides in from the left
  const depotX = interpolate(frame, [105, 150], [-460, 70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const routeIn = interpolate(frame, [150, 190], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // beat 3: the reframe
  const strikeIn = useEnter(232, { damping: 12 });
  const strikeW = interpolate(frame, [246, 262], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const houses: Array<{ x: number; lit: number }> = [
    { x: 56, lit: 26 },
    { x: 246, lit: 44 },
    { x: 436, lit: 62 },
    { x: 646, lit: 36 },
    { x: 856, lit: 54 },
  ];

  return (
    <AbsoluteFill>
      {/* the claim — on screen immediately */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 380,
          textAlign: "center",
          transform: `scale(${claimIn})`,
        }}
      >
        <Stamp fontSize={47} rotate={-2}>
          netflix <span style={{ color: theme.brand }}>already knows</span>
        </Stamp>
      </div>
      <RiseIn delay={30} style={{ position: "absolute", left: 0, right: 0, top: 512, textAlign: "center" }}>
        <Chip>what your city binges tonight</Chip>
      </RiseIn>

      {/* the street: windows flick red one by one */}
      {houses.map(({ x, lit }, i) => (
        <div key={i} style={{ position: "absolute", left: x, top: 1160 }}>
          <House w={i % 2 === 0 ? 150 : 128} glow={frame >= lit ? "watching" : "warm"} />
        </div>
      ))}

      {/* beat 2: the stocked depot down the road (dims when the reframe lands) */}
      <div
        style={{
          position: "absolute",
          left: depotX,
          top: 690,
          opacity: interpolate(frame, [236, 262], [1, 0.35], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Depot w={400} sign="24/7" doorGlow={interpolate(frame, [150, 200], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        <RiseIn delay={170} style={{ position: "absolute", left: 236, top: -44 }}>
          <Chip color={theme.second}>down your road</Chip>
        </RiseIn>
      </div>
      {/* routes from the depot door to the houses */}
      <Route
        d="M 300 200 C 320 280, 230 300, 180 400"
        w={1080}
        h={420}
        speed={2}
        progress={routeIn * interpolate(frame, [236, 262], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        style={{ position: "absolute", left: 0, top: 780 }}
      />
      <Route
        d="M 330 210 C 480 300, 640 330, 720 410"
        w={1080}
        h={420}
        speed={2}
        progress={routeIn * interpolate(frame, [236, 262], [1, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        style={{ position: "absolute", left: 0, top: 780 }}
      />

      {/* beat 3: the reframe */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 928,
          textAlign: "center",
          transform: `scale(${strikeIn})`,
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <Chip style={{ fontSize: 30, padding: "12px 26px" }}>a streaming company?</Chip>
          <div
            style={{
              position: "absolute",
              left: "-2%",
              top: "50%",
              width: `${strikeW}%`,
              height: 6,
              borderRadius: 3,
              background: theme.brand,
              transform: "rotate(-4deg)",
            }}
          />
        </div>
      </div>
      <RiseIn delay={272} style={{ position: "absolute", left: 0, right: 0, top: 1024, textAlign: "center" }}>
        <Stamp fontSize={44} rotate={1.6} color={theme.brand}>
          a <span style={{ color: theme.brand }}>delivery</span> company
        </Stamp>
      </RiseIn>
    </AbsoluteFill>
  );
};
