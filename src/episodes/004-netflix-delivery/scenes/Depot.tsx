import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import { RiseIn, useEnter } from "../../../components/ui";
import { Chip, Depot as DepotBuilding, Parcel, Stamp } from "./kit";

// Scene 4 (~22s): Open Connect — the genius part, and the hook's payoff.
// The faraway cloud gets struck out; the free mini-warehouse pops in at the
// internet provider; night falls and it stocks up on tomorrow's binge.
// "That's how Netflix knew."

export const Depot: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const cloudIn = useEnter(10, { damping: 12 });
  const cloudOut = interpolate(frame, [262, 298], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slashIn = interpolate(frame, [82, 102], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const depotIn = useEnter(152, { damping: 10 });

  // night falls while the shelves stock up
  const night = interpolate(frame, [356, 420, 590, 650], [0, 0.34, 0.34, 0.16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stocking = frame >= 388 && frame < 545;

  return (
    <AbsoluteFill>
      {/* the faraway cloud, struck out */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 400,
          textAlign: "center",
          opacity: cloudOut,
          transform: `scale(${cloudIn})`,
        }}
      >
        <svg width="300" height="190" viewBox="0 0 300 190" style={{ display: "block", margin: "0 auto" }}>
          <ellipse cx="105" cy="102" rx="72" ry="42" fill="#FFFFFF" stroke={theme.line} strokeWidth="3" />
          <ellipse cx="172" cy="80" rx="66" ry="48" fill="#FFFFFF" stroke={theme.line} strokeWidth="3" />
          <ellipse cx="216" cy="112" rx="56" ry="34" fill="#FFFFFF" stroke={theme.line} strokeWidth="3" />
          <line
            x1={40}
            y1={172}
            x2={40 + 225 * slashIn}
            y2={172 - 150 * slashIn}
            stroke={theme.brand}
            strokeWidth="11"
            strokeLinecap="round"
          />
        </svg>
        <Chip style={{ marginTop: 6 }}>some faraway cloud · 3,000 km</Chip>
      </div>

      {/* the mini-warehouse at your internet provider */}
      <div style={{ position: "absolute", left: 96, top: 820, transform: `scale(${depotIn})`, transformOrigin: "bottom center" }}>
        <DepotBuilding w={430} sign="OCA" doorGlow={frame >= 388 ? 1 : 0.4} />
      </div>
      <RiseIn delay={188} style={{ position: "absolute", left: 570, top: 872 }}>
        <Chip color={theme.good}>free, from netflix</Chip>
      </RiseIn>
      <RiseIn delay={222} style={{ position: "absolute", left: 570, top: 944 }}>
        <Chip>at your internet provider</Chip>
      </RiseIn>
      <RiseIn delay={306} style={{ position: "absolute", left: 0, right: 0, top: 452, textAlign: "center" }}>
        <Stamp fontSize={46} rotate={-2}>
          open connect
        </Stamp>
      </RiseIn>

      {/* nightly stocking: parcels drop into the door */}
      {stocking
        ? [0, 1, 2].map((i) => {
            const t = (((frame - 388 + i * 22) % 66) + 66) % 66;
            const drop = t / 66;
            return drop < 0.92 ? (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 292 + i * 30,
                  top: 640 + drop * 330,
                  opacity: 1 - drop * 0.6,
                  transform: `rotate(${drop * 40 - 20}deg)`,
                }}
              >
                <Parcel w={34} />
              </div>
            ) : null;
          })
        : null}
      {frame >= 430 ? (
        <RiseIn delay={430} style={{ position: "absolute", left: 96, top: 1180 }}>
          <Chip color={theme.second}>tomorrow's binge · pre-stocked overnight</Chip>
        </RiseIn>
      ) : null}

      {/* the hook pays off */}
      {frame >= 548 ? (
        <RiseIn delay={548} style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center" }}>
          <Stamp fontSize={38} rotate={1.5} color={theme.brand}>
            on the shelf <span style={{ color: theme.brand }}>before you asked</span>
          </Stamp>
        </RiseIn>
      ) : null}

      {/* night tint + moon (above content, below chrome/captions) */}
      <AbsoluteFill style={{ background: `rgba(15, 30, 50, ${night})`, pointerEvents: "none" }} />
      {night > 0.05 ? (
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: "absolute", right: 90, top: 330, opacity: night * 2.6 }}>
          <path d="M 78 22 A 42 42 0 1 0 78 98 A 34 34 0 1 1 78 22 Z" fill="#F2E9C8" />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
