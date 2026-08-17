import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { MonoLabel, RiseIn, useEnter } from "../../../components/ui";
import { Blanket, CHAMBER, Chip, Coil, Cutaway, Headline, INK, SHELL, TRAY } from "./kitchen";

// Scene 2 (~20.5s): open the fryer — coil, fan, "that's it." Then the big
// oven slides in with the SAME coil, but its still air forms a lazy cool
// blanket around the roast that heat can barely soak through.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Cross-section of a big oven: same coil up top, roast in a dish, still air.
const OvenCutaway: React.FC<{ coilGlow: number }> = ({ coilGlow }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  return (
    <svg width="440" height="480" viewBox="0 0 440 480">
      <rect x="16" y="14" width="408" height="440" rx="34" fill={SHELL} />
      <rect x="38" y="36" width="364" height="396" rx="22" fill={CHAMBER} />
      {/* knobs */}
      {[80, 140, 300, 360].map((x) => (
        <circle key={x} cx={x} cy="25" r="7" fill="#59616B" />
      ))}
      <Coil x={100} y={78} w={240} glow={coilGlow} />
      {/* lazy still-air squiggles, barely drifting */}
      {[150, 205, 260].map((y, i) => (
        <path
          key={y}
          d={`M ${86 + Math.sin(frame / 46 + i) * 6} ${y} q 30 -12 60 0 t 60 0 t 60 0 t 60 0`}
          fill="none"
          stroke={theme.secondDim}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.55"
        />
      ))}
      {/* heat arrows: creep from the coil and stall at the blanket */}
      {frame >= 535
        ? [140, 220, 300].map((x, i) => {
            const t = ((frame - 535) / 70 + i * 0.33) % 1;
            const y = 118 + t * 130;
            return (
              <g key={x} opacity={Math.min(1, (1 - t) * 2) * 0.9}>
                <line x1={x} y1={y - 26} x2={x} y2={y} stroke={theme.accent} strokeWidth="6" strokeLinecap="round" />
                <path d={`M ${x - 9} ${y - 8} L ${x} ${y + 4} L ${x + 9} ${y - 8}`} fill="none" stroke={theme.accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            );
          })
        : null}
      {/* dish + roast */}
      <ellipse cx="220" cy="372" rx="110" ry="20" fill={TRAY} />
      <ellipse cx="220" cy="336" rx="74" ry="44" fill="#C98A5B" stroke={INK} strokeWidth="3" />
      <ellipse cx="196" cy="322" rx="20" ry="11" fill="#E0AC7E" />
      {/* the cool blanket hugging the roast */}
      <Blanket cx={220} cy={334} rx={100} ry={66} appearAt={468} />
    </svg>
  );
};

export const Machine: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // beats snapped to narration: "heating coil" ~f83, "fan" ~f132, "that's
  // it" ~f207, "your big oven" ~f242, "same coil" ~f272, "terrible cook"
  // ~f377-421, "cool blanket" ~f471, "heat slowly soaks" ~f541+
  const enter = useEnter(10);
  const coilGlow = interpolate(frame, [70, 95], [0, 1], clamp);
  // phase B: fryer steps aside, oven slides in
  const aside = useEnter(240);
  const fryerX = interpolate(aside, [0, 1], [260, 570]);
  const fryerY = interpolate(aside, [0, 1], [420, 560]);
  const fryerScale = interpolate(aside, [0, 1], [1, 0.72]);
  const ovenIn = useEnter(262);

  return (
    <AbsoluteFill>
      {/* the air fryer cutaway */}
      <div
        style={{
          position: "absolute",
          left: fryerX,
          top: fryerY,
          opacity: enter,
          transform: `scale(${enter * fryerScale})`,
          transformOrigin: "top left",
        }}
      >
        <Cutaway w={560} spin={frame * 2.2} coilGlow={coilGlow} />
      </div>

      {frame >= 85 && frame < 235 ? (
        <RiseIn delay={85} style={{ position: "absolute", left: 96, top: 560 }}>
          <Chip color={theme.accent}>heating coil</Chip>
        </RiseIn>
      ) : null}
      {frame >= 135 && frame < 235 ? (
        <RiseIn delay={135} style={{ position: "absolute", left: 700, top: 460 }}>
          <Chip>a fan</Chip>
        </RiseIn>
      ) : null}
      {frame >= 210 && frame < 260 ? (
        <RiseIn delay={210} style={{ position: "absolute", left: 0, right: 0, top: 1160, textAlign: "center" }}>
          <Headline style={{ fontSize: 62 }}>that&apos;s it.</Headline>
        </RiseIn>
      ) : null}

      {/* the big oven */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 500,
          opacity: ovenIn,
          transform: `translateX(${interpolate(ovenIn, [0, 1], [-320, 0])}px)`,
        }}
      >
        <OvenCutaway coilGlow={interpolate(frame, [270, 295], [0, 1], clamp)} />
      </div>

      {frame >= 280 ? (
        <RiseIn delay={280} style={{ position: "absolute", left: 120, top: 448 }}>
          <Chip color={theme.accent}>same coil</Chip>
        </RiseIn>
      ) : null}
      {frame >= 482 ? (
        <RiseIn delay={482} style={{ position: "absolute", left: 96, top: 1010 }}>
          <Chip color={theme.second} style={{ fontWeight: 700 }}>cool air blanket</Chip>
        </RiseIn>
      ) : null}
      {frame >= 300 && aside > 0.5 ? (
        <RiseIn delay={300} style={{ position: "absolute", left: 640, top: 1010 }}>
          <MonoLabel style={{ fontSize: 24 }}>vs</MonoLabel>
        </RiseIn>
      ) : null}

      <RiseIn delay={385} style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center" }}>
        <Headline>
          still air is a <span style={{ color: theme.second }}>terrible cook</span>
        </Headline>
      </RiseIn>
    </AbsoluteFill>
  );
};
