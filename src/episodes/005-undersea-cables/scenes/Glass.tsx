import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { RiseIn, useEnter } from "../../../components/ui";
import { CableSection, Chip, Satellite, Stamp } from "./kit";

// Scene 2 (~12s): the cable turns to face camera. Four layer labels, then
// everything but the core mutes — "almost all armor". A magnifier inset (not a
// camera zoom, so it stays deterministic and cheap) isolates one fiber next to
// a human hair; the hair is visibly THICKER, which is the whole gag. Closes on
// two bars: one cable vs every internet satellite. No numbers — the length
// ratio is the argument.

const LAYERS: Array<{ at: number; label: string; side: -1 | 1; y: number }> = [
  { at: 26, label: "plastic", side: -1, y: 618 },
  { at: 40, label: "steel wire", side: 1, y: 716 },
  { at: 54, label: "copper", side: -1, y: 962 },
  { at: 68, label: "gel", side: 1, y: 1046 },
];

export const Glass: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const reveal = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dim = interpolate(frame, [110, 134], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelsOut = interpolate(frame, [118, 140], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const armorIn = useEnter(58);
  const armorOut = interpolate(frame, [196, 214], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const netIn = useEnter(210);

  // magnifier inset
  const lensIn = useEnter(140);
  const lensOut = interpolate(frame, [240, 258], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hairIn = interpolate(frame, [155, 185], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // closing bars
  const barA = interpolate(frame, [252, 286], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barB = interpolate(frame, [268, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulseY = ((frame % 26) / 26) * 250;

  return (
    <AbsoluteFill>
      {/* the cross-section, centred */}
      <div
        style={{
          position: "absolute",
          left: 280,
          top: 580,
          transform: `scale(${0.86 + 0.14 * reveal})`,
          transformOrigin: "center",
          opacity: interpolate(frame, [240, 258], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <CableSection d={520} reveal={reveal} dim={dim} />
      </div>

      {/* layer callouts */}
      {LAYERS.map(({ at, label, side, y }) => {
        const p = interpolate(frame, [at, at + 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: side === -1 ? 92 : 706,
              top: y,
              opacity: p * labelsOut,
              transform: `translateX(${interpolate(p, [0, 1], [side * 20, 0])}px)`,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexDirection: side === -1 ? "row" : "row-reverse",
            }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 27,
                letterSpacing: "0.16em",
                color: theme.textDim,
              }}
            >
              {label}
            </span>
            <div style={{ width: 74, height: 1.5, background: theme.lineFaint }} />
          </div>
        );
      })}

      {/* "almost all armor" */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 452,
          textAlign: "center",
          opacity: armorIn * armorOut,
          transform: `scale(${0.94 + 0.06 * armorIn})`,
        }}
      >
        <Stamp fontSize={50} rotate={-1.8}>
          almost all armor
        </Stamp>
      </div>

      {/* "that's the internet" */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 452,
          textAlign: "center",
          opacity: netIn,
          transform: `scale(${0.94 + 0.06 * netIn})`,
        }}
      >
        <Stamp fontSize={50} rotate={1.4}>
          that&apos;s the internet
        </Stamp>
      </div>

      {/* magnifier inset: one fiber vs one hair */}
      <div
        style={{
          position: "absolute",
          left: 270,
          top: 570,
          opacity: lensIn * lensOut,
          transform: `scale(${0.82 + 0.18 * lensIn})`,
          transformOrigin: "center",
        }}
      >
        <svg width="540" height="540">
          <circle
            cx="270"
            cy="270"
            r="252"
            fill="rgba(7, 19, 28, 0.94)"
            stroke={theme.accent}
            strokeWidth="4"
          />
          {/* the fiber — 3px */}
          <line x1="212" y1="72" x2="212" y2="468" stroke={theme.accent} strokeWidth="3" />
          <circle cx="212" cy={72 + pulseY * 1.58} r="9" fill={theme.accent} opacity={0.95} />
          {/* the hair — 5px, deliberately thicker */}
          <line
            x1="336"
            y1="72"
            x2="336"
            y2="468"
            stroke={theme.textDim}
            strokeWidth="5"
            opacity={hairIn}
          />
          <text
            x="212"
            y="508"
            textAnchor="middle"
            fill={theme.accent}
            fontFamily={FONTS.mono}
            fontSize="24"
            letterSpacing="2"
          >
            FIBER
          </text>
          <text
            x="336"
            y="508"
            textAnchor="middle"
            fill={theme.textDim}
            fontFamily={FONTS.mono}
            fontSize="24"
            letterSpacing="2"
            opacity={hairIn}
          >
            HAIR
          </text>
        </svg>
      </div>
      <RiseIn
        delay={160}
        style={{ position: "absolute", left: 0, right: 0, top: 1178, textAlign: "center" }}
      >
        <div style={{ opacity: lensOut }}>
          <Chip>thinner than your hair</Chip>
        </div>
      </RiseIn>

      {/* closing comparison bars */}
      <div style={{ position: "absolute", left: 120, top: 1160, opacity: barA }}>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 24,
            letterSpacing: "0.16em",
            color: theme.accent,
            marginBottom: 10,
          }}
        >
          ONE CABLE
        </div>
        <div
          style={{
            width: barA * 780,
            height: 30,
            borderRadius: 15,
            background: theme.accent,
            boxShadow: `0 0 30px ${theme.accentGlow}`,
          }}
        />
      </div>
      <div style={{ position: "absolute", left: 120, top: 1268, opacity: barB }}>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 24,
            letterSpacing: "0.16em",
            color: theme.textDim,
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          EVERY INTERNET SATELLITE
          <Satellite w={60} />
        </div>
        <div
          style={{
            width: barB * 132,
            height: 30,
            borderRadius: 15,
            background: theme.textDim,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
