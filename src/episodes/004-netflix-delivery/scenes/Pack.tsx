import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { Card, MonoLabel, Poster, RiseIn, useEnter } from "../../../components/ui";
import { Belt, Carton, Chip, KRAFT_LINE, Stamp } from "./kit";

// Scene 2 (~20.5s): the packing floor. The studio's master crate arrives,
// the conveyor repacks it into every box size — 4K down to POTATO — then the
// per-title packing list: cartoons take tiny boxes, grainy action needs XL.

const SIZES = [
  { label: "4K", w: 190, tag: "glorious" },
  { label: "1080", w: 148 },
  { label: "720", w: 116 },
  { label: "POTATO", w: 88, tag: "still watchable" },
];

// pop-in wrapper (own component so the spring hook stays out of .map loops)
const PopIn: React.FC<{ delay: number; damping?: number; children: React.ReactNode }> = ({
  delay,
  damping = 10,
  children,
}) => {
  const p = useEnter(delay, { damping });
  return (
    <div style={{ transform: `scale(${p})`, transformOrigin: "bottom center", textAlign: "center" }}>
      {children}
    </div>
  );
};

export const Pack: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // master crate rolls in on the belt
  const masterX = interpolate(frame, [10, 95], [-300, 372], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const masterFade = interpolate(frame, [200, 235], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* the handoff */}
      <RiseIn delay={16} style={{ position: "absolute", left: 84, top: 372 }}>
        <Chip>from the studio</Chip>
      </RiseIn>
      <Belt x={64} y={608} w={952} speed={frame < 110 ? 3 : 0.6} />
      <div style={{ position: "absolute", left: masterX, top: 434, opacity: masterFade }}>
        <Carton w={210} label="MASTER" />
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 218,
            fontFamily: FONTS.mono,
            fontSize: 24,
            color: theme.textDim,
            whiteSpace: "nowrap",
          }}
        >
          1 file · enormous
        </div>
      </div>

      {/* repacked: the size run */}
      <RiseIn delay={150} style={{ position: "absolute", left: 84, top: 726 }}>
        <MonoLabel>repacked → every box size</MonoLabel>
      </RiseIn>
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 780,
          width: 952,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        {SIZES.map((s, i) => (
          <PopIn key={s.label} delay={196 + i * 34}>
            <Carton w={s.w} label={s.label} />
            {s.tag ? (
              <div style={{ fontFamily: FONTS.mono, fontSize: 21, color: theme.textDim, marginTop: 2 }}>
                {s.tag}
              </div>
            ) : null}
          </PopIn>
        ))}
      </div>

      {/* per-title packing list */}
      <RiseIn delay={368} style={{ position: "absolute", left: 0, right: 0, top: 1074, textAlign: "center" }}>
        <Stamp fontSize={34} rotate={-1.6} color={theme.second}>
          custom packed per title
        </Stamp>
      </RiseIn>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1188, display: "flex", justifyContent: "center", gap: 56 }}>
        {[
          { name: "CARTOON", hue: 200, w: 92, note: "squeezes tiny", delay: 452 },
          { name: "GRAINY ACTION", hue: 8, w: 176, note: "fights back · XL", delay: 528 },
        ].map((t) => (
          <PopIn key={t.name} delay={t.delay} damping={9}>
            <Card style={{ padding: "24px 30px 18px", width: 330 }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 22, height: 190 }}>
                <Poster hue={t.hue} w={74} h={108} />
                <Carton w={t.w} />
              </div>
              <MonoLabel style={{ marginTop: 14, fontSize: 22, color: theme.text }}>{t.name}</MonoLabel>
              <div style={{ fontFamily: FONTS.mono, fontSize: 23, color: theme.textDim, marginTop: 4 }}>
                {t.note}
              </div>
            </Card>
          </PopIn>
        ))}
      </div>
      {/* strain lines on the action box */}
      {frame >= 560 ? (
        <svg width="60" height="52" viewBox="0 0 60 52" style={{ position: "absolute", left: 762, top: 1206 }}>
          {[0, 1, 2].map((i) => (
            <line
              key={i}
              x1={10 + i * 18}
              y1={44 - (i === 1 ? 10 : 0)}
              x2={2 + i * 18}
              y2={8 - (i === 1 ? 6 : 0)}
              stroke={KRAFT_LINE}
              strokeWidth="4.5"
              strokeLinecap="round"
              opacity={0.5 + 0.5 * Math.abs(Math.sin(frame / 6 + i))}
            />
          ))}
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
