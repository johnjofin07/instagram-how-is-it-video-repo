import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RiseIn, useEnter } from "../../../components/ui";
import { useTheme } from "../../../themes";
import { Chip, HOT, MeshZoom, MicrowaveBody, Stamp, cavityRect } from "./kit";

// Scene 4 — THE DOOR (D = 321f, from timing.json).
// The magnifier grows out of the door window, plays the two-size gag (thin
// light threads a hole / fat wave slams into the plate), then pulls back.
// The gag lives or dies on the SIZE CONTRAST, so the arc is drawn 6.6x the
// hole width with an 18px stroke — thin lines vanish at delivery scale.
//
// This is the SHORTEST scene and the one that LOST frames vs the v1 estimate
// (~330f -> 321f), so the tail is the tight end: the pull-back, the glint and
// the closing chip all have to land before f321. Both light and wave beats are
// exactly two passes so nothing is cut off mid-cycle.
//
// Beats are synced to the recorded narration (timing.json, scene 3):
//   f2-50 "and that mesh on the door?"  ·  f52-158 "light slips through ...
//   so you can watch"  ·  f161-225 "the waves are too big to fit"
//   f228-320 "to them, it's a solid wall"

const D = 319; // scene length in frames — timing.json sceneSeconds[3] * 30

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const BODY = { left: 80, top: 686, w: 920 };
const WIN = cavityRect(BODY.left, BODY.top, BODY.w);
const WINDOW_C = { x: WIN.x + WIN.w / 2, y: WIN.y + WIN.h / 2 };

export const Door: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [8, 58], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });
  const pull = interpolate(frame, [268, 302], [0, 1], { ...clamp, easing: (t) => t * t });
  const z = zoom * (1 - pull * 0.62);

  const size = 220 + z * 460; // 220 -> 680
  const cx = WINDOW_C.x + (540 - WINDOW_C.x) * z;
  const cy = WINDOW_C.y + (910 - WINDOW_C.y) * z;

  // light beat f54-160 (two 53f passes), wave beat f166-266 (two 50f passes)
  const lightT = frame >= 54 && frame < 160 ? (((frame - 54) % 53) / 53) : 0;
  const waveT = frame >= 166 && frame < 266 ? (((frame - 166) % 50) / 50) : 0;
  const glint = frame >= 296 && frame < 318 ? (frame - 296) / 22 : 0;

  const eyeIn = useEnter(116, { damping: 12 });
  const stampIn = useEnter(164, { damping: 11 });

  return (
    <AbsoluteFill>
      {/* opening label — sequenced OUT before the stamp takes the slot */}
      {frame < 156 ? (
        <RiseIn
          delay={10}
          style={{ position: "absolute", left: 0, right: 0, top: 478, textAlign: "center" }}
        >
          <div style={{ opacity: interpolate(frame, [142, 154], [1, 0], clamp) }}>
            <Chip color={theme.accent}>that mesh on the door</Chip>
          </div>
        </RiseIn>
      ) : null}

      {frame >= 164 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 462,
            textAlign: "center",
            transform: `scale(${stampIn})`,
          }}
        >
          <Stamp fontSize={60}>
            too big <span style={{ color: HOT }}>to fit</span>
          </Stamp>
        </div>
      ) : null}

      {/* the machine */}
      <div style={{ position: "absolute", left: BODY.left, top: BODY.top, opacity: 1 - z * 0.55 }}>
        <MicrowaveBody w={BODY.w} />
      </div>

      {/* the magnifier */}
      <MeshZoom
        size={size}
        lightT={lightT}
        waveT={waveT}
        glint={glint}
        style={{ position: "absolute", left: cx - size / 2, top: cy - size / 2 }}
      />

      {/* the light gets out — that is all "watching" is */}
      {frame >= 116 && frame < 162 ? (
        <div
          style={{
            position: "absolute",
            left: 884,
            top: 636,
            opacity: eyeIn,
            transform: `scale(${0.7 + eyeIn * 0.3})`,
            transformOrigin: "center",
          }}
        >
          <svg width="112" height="86" viewBox="0 0 112 86">
            <path
              d="M6 43 Q56 6 106 43 Q56 80 6 43 Z"
              fill={theme.bgLifted}
              stroke={theme.text}
              strokeWidth="5"
            />
            <circle cx="56" cy="43" r="18" fill={theme.accent} />
            <circle cx="56" cy="43" r="7" fill={theme.text} />
          </svg>
        </div>
      ) : null}

      {frame >= 110 && frame < 162 ? (
        <RiseIn delay={110} style={{ position: "absolute", left: 0, right: 0, top: 1268, textAlign: "center" }}>
          <Chip color={theme.accent} style={{ maxWidth: 780 }}>
            light fits. so you can watch.
          </Chip>
        </RiseIn>
      ) : null}

      {/* closing chip — holds the last ~77f of the scene (through D = 321) */}
      {frame >= D - 77 ? (
        <RiseIn delay={D - 77} style={{ position: "absolute", left: 0, right: 0, top: 1268, textAlign: "center" }}>
          <Chip color={HOT} style={{ maxWidth: 780 }}>
            a window to you. a wall to them.
          </Chip>
        </RiseIn>
      ) : null}
    </AbsoluteFill>
  );
};
