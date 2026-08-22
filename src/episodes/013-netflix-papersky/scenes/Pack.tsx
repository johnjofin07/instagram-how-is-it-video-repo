import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { RiseIn, useEnter } from "../../../components/ui";
import { Belt, CARTON_RATIO, Carton, Chip, FloorStage, RUSH } from "./kit";

// Scene 2 (~7.6s / 228f): the packing floor. "That shelf gets stocked like any
// parcel: one enormous file, repacked into every box size, from glorious 4K
// down to potato." The master crate rides in on the paper conveyor, then the
// four-box size run pops up underneath it. (v1's per-title compare cards are
// gone — that beat is no longer in the script.)

const SIZES = [
  { label: "4K", w: 200, tag: "glorious" },
  { label: "1080", w: 156 },
  { label: "720", w: 122 },
  { label: "POTATO", w: 92, tag: "still watchable" },
];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const BELT_Y = 640;
const RUN_BASE = 1040;

const PopIn: React.FC<{
  delay: number;
  damping?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, damping = 11, children, style }) => {
  const p = useEnter(delay, { damping });
  return (
    <div
      style={{
        transform: `scale(${p})`,
        transformOrigin: "bottom center",
        textAlign: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Pack: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const masterW = 190;
  const masterX = interpolate(frame, [0, 52], [-300, 380], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <AbsoluteFill>
      <FloorStage floorFrom={580} />

      <RiseIn delay={64} style={{ position: "absolute", left: 84, top: 450 }}>
        <Chip>one enormous file</Chip>
      </RiseIn>

      <Belt x={64} y={BELT_Y} w={952} speed={frame < 60 ? 3.4 : 0.7} />
      <div style={{ position: "absolute", left: masterX, top: BELT_Y - masterW * CARTON_RATIO }}>
        <Carton w={masterW} label="MASTER" depth={2} />
        <div
          style={{
            position: "absolute",
            top: 42,
            left: masterW + 16,
            fontFamily: FONTS.sans,
            fontWeight: 800,
            fontSize: 26,
            color: theme.textDim,
            whiteSpace: "nowrap",
            opacity: interpolate(frame, [44, 60], [0, 1], clamp),
          }}
        >
          from the studio
        </div>
      </div>

      {/* repacked: the size run */}
      <RiseIn delay={124} style={{ position: "absolute", left: 84, top: 760 }}>
        <Chip color={RUSH} fontSize={25}>
          repacked → every box size
        </Chip>
      </RiseIn>
      <div
        style={{
          position: "absolute",
          left: 84,
          width: 856,
          top: RUN_BASE - 200,
          height: 236,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        {SIZES.map((s, i) => (
          <PopIn
            key={s.label}
            delay={198 + i * 18}
            style={{
              width: Math.max(s.w, 168),
              height: 236,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Carton w={s.w} label={s.label} depth={2} />
            <div
              style={{
                height: 36,
                paddingTop: 4,
                fontFamily: FONTS.sans,
                fontWeight: 700,
                fontSize: 22,
                color: theme.textDim,
                whiteSpace: "nowrap",
              }}
            >
              {s.tag ?? ""}
            </div>
          </PopIn>
        ))}
      </div>
    </AbsoluteFill>
  );
};
