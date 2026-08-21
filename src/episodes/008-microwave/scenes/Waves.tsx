import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RiseIn, useEnter } from "../../../components/ui";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import {
  COLD,
  COLD_COLS,
  CavityStage,
  Chip,
  INNER,
  STAGE,
  HOT,
  HOT_CORE,
  HeatLobes,
  LOBE_COLS,
  LOBE_ROWS,
  STEEL_LIGHT,
  Stamp,
  StandingWave,
  WAVE_AMP_RATIO,
} from "./kit";

// Scene 2 — THE WAVES (D = 392f, from timing.json).
// The physics moment. One wave travels, hits the right wall, comes back, and
// the SUM of the two locks into place. There is no crossfade anywhere: the
// polyline itself morphs from travelling to standing (mix 0 -> 1), which is
// exactly what superposition does.
//
// Beats are synced to the recorded v3 narration (timing.json, scene 1):
//   f56 "bounce" (wall flash)  ·  f128-163 "get stuck" (the freeze lands here)
//   f164-186 "hot spots here"  ·  f204-229 "cold spots there"
//   f252-306 "always the same places" (the ruler)

const D = 370; // scene length in frames — timing.json sceneSeconds[1] * 30

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const ux = (u: number) => INNER.x + u * INNER.w;
const uy = (v: number) => STAGE.y + v * STAGE.h;

export const Waves: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const phase = frame * 0.155;
  // the freeze completes on "stuck" (f130-143)
  const mix = interpolate(frame, [104, 144], [0, 1], clamp);
  const reflect = interpolate(frame, [52, 72, 96, 116], [0, 1, 1, 0], clamp);
  const wallFlash = interpolate(frame, [48, 58, 84], [0, 1, 0], clamp);
  const lobes = interpolate(frame, [152, 200], [0, 1], clamp);
  const ruler = interpolate(frame, [258, 284], [0, 1], clamp);
  const stageIn = interpolate(frame, [0, 14], [0, 1], clamp);
  const claimA = useEnter(4, { damping: 11 });
  const claimB = useEnter(130, { damping: 11 });

  const amp = STAGE.h * WAVE_AMP_RATIO;

  return (
    <AbsoluteFill>
      <div style={{ opacity: stageIn }}>
        <CavityStage
          w={STAGE.w}
          h={STAGE.h}
          style={{ position: "absolute", left: STAGE.x, top: STAGE.y }}
        />

        {/* the wall it bounces off, lighting up on impact */}
        <svg
          width={STAGE.w}
          height={STAGE.h}
          viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
          style={{ position: "absolute", left: STAGE.x, top: STAGE.y }}
        >
          <rect x={STAGE.w - 22} y="0" width="22" height={STAGE.h} rx="11" fill={HOT_CORE} opacity={wallFlash} />
          <rect x="0" y="0" width="22" height={STAGE.h} rx="11" fill={HOT_CORE} opacity={wallFlash * 0.4} />
          <text
            x={STAGE.w - 34}
            y={STAGE.h - 30}
            textAnchor="end"
            fontFamily={FONTS.mono}
            fontSize="24"
            letterSpacing="3"
            fill={STEEL_LIGHT}
            opacity="0.6"
          >
            METAL WALL
          </text>
          <text
            x="34"
            y={STAGE.h - 30}
            fontFamily={FONTS.mono}
            fontSize="24"
            letterSpacing="3"
            fill={STEEL_LIGHT}
            opacity="0.6"
          >
            METAL WALL
          </text>
        </svg>

        {/* the lobes, born out of the frozen wave's peaks */}
        <HeatLobes
          w={INNER.w}
          h={STAGE.h}
          on={lobes}
          pulse={0.5 + 0.5 * Math.sin(frame / 15)}
          style={{ position: "absolute", left: INNER.x, top: STAGE.y }}
        />

        {/* the reflected component, shown only while the bounce is happening */}
        {reflect > 0.01 ? (
          <StandingWave
            w={INNER.w}
            h={STAGE.h}
            phase={phase}
            dir={-1}
            amp={amp}
            color={HOT}
            strokeWidth={5}
            opacity={reflect * 0.5}
            style={{ position: "absolute", left: INNER.x, top: STAGE.y }}
          />
        ) : null}

        {/* THE wave */}
        <StandingWave
          w={INNER.w}
          h={STAGE.h}
          phase={phase}
          mix={mix}
          amp={amp}
          color={HOT}
          strokeWidth={8}
          style={{ position: "absolute", left: INNER.x, top: STAGE.y }}
        />

        {/* the ruler: the map never moves */}
        {ruler > 0.01 ? (
          <svg
            width={STAGE.w}
            height={STAGE.h}
            viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
            style={{ position: "absolute", left: STAGE.x, top: STAGE.y, opacity: ruler }}
          >
            {LOBE_COLS.map((c) => (
              <g key={`h${c}`}>
                <line
                  x1={22 + c * INNER.w}
                  y1="26"
                  x2={22 + c * INNER.w}
                  y2={STAGE.h - 62}
                  stroke={HOT_CORE}
                  strokeWidth="4"
                  strokeDasharray="12 12"
                  opacity="0.85"
                />
                <rect x={22 + c * INNER.w - 8} y={STAGE.h - 62} width="16" height="16" fill={HOT_CORE} />
              </g>
            ))}
            {COLD_COLS.map((c) => (
              <g key={`c${c}`}>
                <line
                  x1={22 + c * INNER.w}
                  y1="26"
                  x2={22 + c * INNER.w}
                  y2={STAGE.h - 62}
                  stroke={COLD}
                  strokeWidth="4"
                  strokeDasharray="12 12"
                  opacity="0.85"
                />
                <rect x={22 + c * INNER.w - 8} y={STAGE.h - 62} width="16" height="16" fill={COLD} />
              </g>
            ))}
            <line x1="22" y1={STAGE.h - 54} x2={STAGE.w - 22} y2={STAGE.h - 54} stroke={STEEL_LIGHT} strokeWidth="4" opacity="0.7" />
            <text
              x={STAGE.w / 2}
              y={STAGE.h - 84}
              textAnchor="middle"
              fontFamily={FONTS.mono}
              fontSize="24"
              letterSpacing="4"
              fill={STEEL_LIGHT}
              opacity="0.9"
            >
              12 CM APART. EVERY TIME.
            </text>
          </svg>
        ) : null}
      </div>

      {/* the claim, hard-sequenced in one slot: bounce -> stuck */}
      {frame < 128 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 462,
            textAlign: "center",
            transform: `scale(${claimA})`,
            opacity: interpolate(frame, [114, 126], [1, 0], clamp),
          }}
        >
          <Stamp fontSize={52}>invisible waves, bouncing</Stamp>
        </div>
      ) : null}

      {frame >= 130 ? (
        <div
          style={{ position: "absolute", left: 0, right: 0, top: 462, textAlign: "center", transform: `scale(${claimB})` }}
        >
          <Stamp fontSize={52}>
            and then they get <span style={{ color: HOT }}>stuck</span>
          </Stamp>
        </div>
      ) : null}

      {/* callouts, each in its own slot */}
      {frame >= 168 && frame < 258 ? (
        <RiseIn
          delay={168}
          style={{
            position: "absolute",
            left: ux(LOBE_COLS[1]) - 200,
            top: uy(LOBE_ROWS[0]) - 118,
            width: 400,
            textAlign: "center",
          }}
        >
          <Chip color={HOT}>hot spots here</Chip>
          <div style={{ width: 4, height: 44, background: HOT, margin: "0 auto", opacity: 0.9 }} />
        </RiseIn>
      ) : null}

      {frame >= 208 && frame < 258 ? (
        <RiseIn
          delay={208}
          style={{
            position: "absolute",
            left: ux(COLD_COLS[0]) - 200,
            top: uy(LOBE_ROWS[1]) + 34,
            width: 400,
            textAlign: "center",
          }}
        >
          <div style={{ width: 4, height: 44, background: COLD, margin: "0 auto", opacity: 0.9 }} />
          <Chip color={COLD}>cold spots there</Chip>
        </RiseIn>
      ) : null}

      {/* closing chip — holds the last ~80f of the scene (through D = 392) */}
      {frame >= D - 80 ? (
        <RiseIn delay={D - 80} style={{ position: "absolute", left: 0, right: 0, top: 1246, textAlign: "center" }}>
          <Chip color={theme.accent} style={{ maxWidth: 780 }}>
            always the same places
          </Chip>
        </RiseIn>
      ) : null}
    </AbsoluteFill>
  );
};
