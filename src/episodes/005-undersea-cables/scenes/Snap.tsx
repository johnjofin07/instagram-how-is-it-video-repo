import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import { RiseIn, useEnter } from "../../../components/ui";
import {
  AnchorIcon,
  Cable,
  Chip,
  Island,
  Pulse,
  SILT_LIGHT,
  SeabedLine,
  Ship,
  Stamp,
  Trawler,
} from "./kit";

// Scene 3 (~12s): three routes on the floor. An anchor drops and parts the
// middle one — the ONLY red in the scene, and it always lands on a cable that
// is visibly opening a gap, so the break still reads without color. Then the
// mechanism beat: traffic reaches the break and simply bends down onto a spare
// cable. Finally the spares are taken away, leaving one island on one cable —
// and a volcano takes it.

const CABLE_Y = [1000, 1100, 1200];
const BREAK_X = 540;

// the reroute dot: along the cut cable, down the bend, away on the spare
const rerouteAt = (p: number) => {
  if (p < 0.42) return { x: interpolate(p, [0, 0.42], [-40, BREAK_X - 70]), y: CABLE_Y[1] };
  if (p < 0.56) {
    const k = (p - 0.42) / 0.14;
    const x0 = BREAK_X - 70;
    const y0 = CABLE_Y[1];
    const cx = BREAK_X + 20;
    const cy = CABLE_Y[1] + 70;
    const x1 = BREAK_X + 110;
    const y1 = CABLE_Y[2];
    return {
      x: (1 - k) * (1 - k) * x0 + 2 * (1 - k) * k * cx + k * k * x1,
      y: (1 - k) * (1 - k) * y0 + 2 * (1 - k) * k * cy + k * k * y1,
    };
  }
  return { x: interpolate(p, [0.56, 1], [BREAK_X + 110, 1140]), y: CABLE_Y[2] };
};

export const Snap: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const shipOut = interpolate(frame, [100, 130], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // the anchor drop
  const anchorY = interpolate(frame, [20, 58], [712, 1052], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t,
  });
  const anchorGone = interpolate(frame, [84, 108], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const anchorBroken = interpolate(frame, [58, 72], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash = interpolate(frame, [58, 65, 80], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // the trawler sweeps through as the second cause
  const trawlerX = interpolate(frame, [70, 140], [-260, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 2),
  });
  const trawlerOut = interpolate(frame, [126, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // spares are taken away — now you only have one
  const sparesOut = interpolate(frame, [215, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const islandIn = useEnter(228);

  // Tonga
  const volcano = interpolate(frame, [284, 318], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const soleBroken = interpolate(frame, [305, 320], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const soleFlash = interpolate(frame, [305, 312, 328], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // STORY FIX: when the spares fade and this becomes the island's ONLY cable,
  // it must visibly heal first — the volcano has to break an intact line, not
  // an already-broken one.
  const midBroken =
    frame < 215
      ? anchorBroken
      : frame < 232
        ? interpolate(frame, [215, 232], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : soleBroken;
  const dark = frame >= 315;

  const t = ((frame % 40) / 40 + 1) % 1;

  return (
    <AbsoluteFill>
      <SeabedLine y={1236} />

      {/* the three routes */}
      {CABLE_Y.map((y, i) => (
        <div
          key={y}
          style={{
            position: "absolute",
            left: -60,
            top: y - 13,
            opacity: i === 1 ? 1 : sparesOut,
          }}
        >
          <Cable
            w={1200}
            thickness={i === 1 ? 24 : 18}
            broken={i === 1 ? midBroken : 0}
            glow
          />
        </div>
      ))}

      {/* traffic on the spares */}
      {[0, 2].map((i) => (
        <Pulse
          key={i}
          w={1200}
          t={((t + i * 0.3) % 1 + 1) % 1}
          count={2}
          size={7}
          style={{ position: "absolute", left: -60, top: CABLE_Y[i], opacity: sparesOut * 0.8 }}
        />
      ))}

      {/* traffic on the healed single cable, until the volcano */}
      {frame >= 232 && frame < 300 ? (
        <Pulse
          w={1200}
          t={t}
          count={2}
          style={{ position: "absolute", left: -60, top: CABLE_Y[1] }}
        />
      ) : null}

      {/* traffic on the middle cable, until it's cut */}
      {frame < 58 ? (
        <Pulse
          w={1200}
          t={t}
          count={3}
          style={{ position: "absolute", left: -60, top: CABLE_Y[1] }}
        />
      ) : null}

      {/* the reroute — three of them, this is the mechanism beat */}
      {[0, 1, 2].map((i) => {
        const start = 144 + i * 22;
        const p = interpolate(frame, [start, start + 56], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        if (p <= 0 || p >= 1) return null;
        const { x, y } = rerouteAt(p);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 7,
              top: y - 7,
              width: 14,
              height: 14,
              borderRadius: 7,
              background: theme.accent,
              boxShadow: `0 0 22px ${theme.accentGlow}`,
              opacity: interpolate(frame, [210, 228], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
        );
      })}

      {/* break flashes — red appears ONLY here, on a cable that is parting */}
      {[
        { o: flash, y: CABLE_Y[1] },
        { o: soleFlash, y: CABLE_Y[1] },
      ].map(({ o, y }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: BREAK_X - 70,
            top: y - 62,
            width: 140,
            height: 130,
            borderRadius: 70,
            background: theme.warn,
            opacity: o * 0.5,
            filter: "blur(18px)",
          }}
        />
      ))}

      {/* the ship and its anchor */}
      <div style={{ position: "absolute", left: 440, top: 640, opacity: shipOut }}>
        <Ship w={200} />
      </div>
      <div style={{ position: "absolute", left: 528, top: 712, opacity: anchorGone * shipOut }}>
        <div style={{ width: 3, height: Math.max(0, anchorY - 712), background: theme.textFaint }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 504,
          top: anchorY,
          opacity: anchorGone,
        }}
      >
        <AnchorIcon w={58} />
      </div>

      {/* opening claim — the narration's first words */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 452,
          textAlign: "center",
          opacity: interpolate(frame, [6, 20, 96, 120], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Stamp fontSize={42} rotate={-1.8}>
          what cuts them is us
        </Stamp>
      </div>

      {/* the trawler, second cause */}
      <div style={{ position: "absolute", left: trawlerX, top: 750, opacity: trawlerOut }}>
        <Trawler w={210} />
      </div>

      <RiseIn
        delay={64}
        style={{ position: "absolute", left: 0, right: 0, top: 576, textAlign: "center" }}
      >
        <div style={{ opacity: interpolate(frame, [126, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Chip>anchors · fishing nets</Chip>
        </div>
      </RiseIn>

      {/* the payoff of the reroute */}
      <RiseIn
        delay={124}
        style={{ position: "absolute", left: 0, right: 0, top: 1296, textAlign: "center" }}
      >
        <div style={{ opacity: interpolate(frame, [215, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Chip color={theme.good}>you never notice</Chip>
        </div>
      </RiseIn>

      {/* one island, one cable */}
      <div
        style={{
          position: "absolute",
          left: 762,
          top: 986,
          opacity: islandIn,
          transform: `scale(${0.88 + 0.12 * islandIn})`,
          transformOrigin: "bottom center",
        }}
      >
        <Island w={230} dark={dark} />
      </div>
      {/* volcano plume */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 852 - (30 + i * 16) + i * 6,
            top: 975 - volcano * (52 + i * 30) - i * 8,
            width: (30 + i * 16) * 2,
            height: (30 + i * 16) * 2,
            borderRadius: "50%",
            background: SILT_LIGHT,
            opacity: volcano * (0.5 - i * 0.12),
          }}
        />
      ))}

      <RiseIn
        delay={226}
        style={{ position: "absolute", left: 0, right: 0, top: 576, textAlign: "center" }}
      >
        <div style={{ opacity: interpolate(frame, [280, 300], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Chip color={theme.warn}>unless you only have one</Chip>
        </div>
      </RiseIn>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 452,
          textAlign: "center",
          opacity: interpolate(frame, [340, 358], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Stamp fontSize={52} rotate={-2} color={theme.warn}>
          5 weeks offline
        </Stamp>
      </div>
    </AbsoluteFill>
  );
};
