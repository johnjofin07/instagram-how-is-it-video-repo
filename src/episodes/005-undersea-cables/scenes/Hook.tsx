import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { CountUp, RiseIn, useEnter } from "../../../components/ui";
import { Cable, CableSection, Chip, Pulse, SILT_LIGHT, SeabedLine, Stamp } from "./kit";

// Scene 1 (~14s): the claim is legible by frame 9 (0.3s) — an instant scale
// pop, never a fade. The seabed, cable and continents are ALREADY on screen at
// frame 0 so nothing has to arrive before the words. Beat 2 is the garden-hose
// comparison, beat 3 swaps the claim slot for the 99% stat, and at 79% the
// cable snaps — the curiosity loop, left deliberately unresolved.

const Continents: React.FC = () => {
  const theme = useTheme();
  return (
    <svg width={1080} height={520} style={{ position: "absolute", left: 0, top: 700 }}>
      <path d="M -20 460 L -20 150 Q 90 140, 150 210 Q 205 280, 250 460 Z" fill={SILT_LIGHT} />
      <path d="M 1100 460 L 1100 172 Q 990 164, 930 232 Q 878 296, 840 460 Z" fill={SILT_LIGHT} />
      <path
        d="M -20 150 Q 90 140, 150 210 Q 205 280, 250 460"
        fill="none"
        stroke={theme.lineFaint}
        strokeWidth="2"
      />
      <path
        d="M 1100 172 Q 990 164, 930 232 Q 878 296, 840 460"
        fill="none"
        stroke={theme.lineFaint}
        strokeWidth="2"
      />
    </svg>
  );
};

export const Hook: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // beat 1 — the claim, effectively instant
  const claimIn = useEnter(2, { damping: 11 });
  const claimOut = interpolate(frame, [162, 180], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // beat 2 — garden hose comparison
  const hoseIn = useEnter(98);
  const hoseOut = interpolate(frame, [176, 198], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // beat 3 — the 99% stat takes over the headline slot
  const statIn = useEnter(184);

  // beat 4 — the snap
  const broken = interpolate(frame, [376, 392, 411], [0, 1, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash = interpolate(frame, [376, 382, 394], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const snapped = frame >= 378;

  // pulse cadence tightens as "traffic" builds, then dies at the break
  const period = frame < 240 ? 45 : 22;
  const t = ((frame % period) / period + 1) % 1;

  return (
    <AbsoluteFill>
      <SeabedLine y={1120} />

      {/* the cable — on screen from frame 0, no entrance */}
      <div style={{ position: "absolute", left: -60, top: 1128 }}>
        <Cable w={1200} thickness={26} broken={broken} glow />
      </div>

      {/* light running through it — left half only once it's cut */}
      <Pulse
        w={snapped ? 500 : 1200}
        t={t}
        count={snapped ? 2 : 3}
        style={{ position: "absolute", left: -60, top: 1141 }}
      />
      {/* traffic piling up at the break */}
      {snapped
        ? [0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 452 - i * 26,
                top: 1136,
                width: 10,
                height: 10,
                borderRadius: 5,
                background: theme.accent,
                opacity: 0.85 - i * 0.22,
              }}
            />
          ))
        : null}
      {/* continents drawn OVER the cable so it visibly runs into land */}
      <Continents />

      {/* the break flash */}
      <div
        style={{
          position: "absolute",
          left: 484,
          top: 1090,
          width: 112,
          height: 104,
          borderRadius: 56,
          background: theme.warn,
          opacity: flash * 0.45,
          filter: "blur(13px)",
        }}
      />

      {/* ---------------------------------------------- headline slot (y340) */}
      <div
        style={{
          position: "absolute",
          left: 65,
          right: 65,
          top: 452,
          textAlign: "center",
          opacity: claimOut,
          transform: `scale(${0.94 + 0.06 * claimIn})`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontWeight: 800,
            fontSize: 78,
            letterSpacing: "0.04em",
            color: theme.text,
            lineHeight: 1.02,
          }}
        >
          THE INTERNET
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 32,
            letterSpacing: "0.32em",
            color: theme.textDim,
            marginTop: 16,
          }}
        >
          IS LYING ON THE
        </div>
        <div style={{ marginTop: 18 }}>
          <Stamp fontSize={66} rotate={-1.6}>
            sea floor
          </Stamp>
        </div>
      </div>

      {/* the 99% stat replaces it */}
      <div
        style={{
          position: "absolute",
          left: 65,
          right: 65,
          top: 470,
          textAlign: "center",
          opacity: statIn,
          transform: `scale(${0.92 + 0.08 * statIn})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center" }}>
          <CountUp
            to={99}
            delay={192}
            durationFrames={44}
            style={{ fontSize: 138, fontWeight: 800, color: theme.accent, lineHeight: 1 }}
          />
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 72,
              fontWeight: 800,
              color: theme.accent,
            }}
          >
            %
          </span>
        </div>
        <div style={{ marginTop: 26 }}>
          <Chip>of all data between continents</Chip>
        </div>
      </div>

      {/* --------------------------------------- garden hose comparison */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 830,
          textAlign: "center",
          opacity: hoseIn * hoseOut,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 44,
            transform: `scale(${0.9 + 0.1 * hoseIn})`,
          }}
        >
          <CableSection d={150} reveal={1} />
          <svg width="150" height="150">
            <circle
              cx="75"
              cy="75"
              r="73"
              fill="none"
              stroke={theme.textDim}
              strokeWidth="3"
              strokeDasharray="12 10"
            />
          </svg>
        </div>
        <div style={{ marginTop: 18 }}>
          <Chip>same width as a garden hose</Chip>
        </div>
      </div>

      {/* ----------------------------------------------- the loop, unresolved */}
      <RiseIn
        delay={350}
        style={{ position: "absolute", left: 0, right: 0, top: 1268, textAlign: "center" }}
      >
        <Chip color={theme.warn}>and every couple of days · one snaps</Chip>
      </RiseIn>
    </AbsoluteFill>
  );
};
