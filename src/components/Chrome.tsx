import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../theme";
import { useTheme } from "../themes";

// Top chrome (v1 style, kept): mono uppercase section label + counter, and the
// pipeline stepper with red squares. Intro mode shows just the active stage.
//
// Both rows span x140–940 (symmetric 140 margins = centred on x=540). This
// replaced the old asymmetric left:65/right:140 container, which read
// left-aligned. Margins still clear every safe-zone rule: x≥65, and the right
// edge sits on the x940 line the YT 140px reserve drives. Changing it here
// changes the look of any episode that is re-rendered — that is intended.

export const SectionHeader: React.FC<{
  label: string;
  index: number;
  total: number;
  top?: number; // per-episode: IG/YT top chrome ends ~y269 (see CLAUDE.md)
  // Skip the entrance fade. Scenes that cut HARD (zack mode) re-mount this
  // component every cut, and a 0.4s fade-in there reads as the header blinking
  // out. Opt-in per episode; the default keeps the original fade.
  instant?: boolean;
}> = ({ label, index, total, top = 96, instant = false }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const opacity = instant
    ? 1
    : interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 140,
        right: 140,
        display: "flex",
        justifyContent: "space-between",
        fontFamily: FONTS.mono,
        fontSize: 30,
        letterSpacing: "0.35em",
        color: theme.textDim,
        opacity,
      }}
    >
      <span>{label}</span>
      <span>
        {String(index + 1).padStart(2, "0")}
        <span style={{ color: theme.textFaint }}> / {String(total).padStart(2, "0")}</span>
      </span>
    </div>
  );
};

export const Stepper: React.FC<{
  steps: readonly string[]; // per-episode pipeline labels
  activeIndex: number;
  allDone?: boolean;
  intro?: boolean;
  top?: number;
  // Scene-local [from, to] frame window in which the active square must NOT
  // pulse. For "total stillness" beats (009's silence pattern interrupt): the
  // pulse is the only thing on screen still moving, and a 2px breathing
  // square is enough to break the illusion the beat is built on. Optional and
  // absent by default — every other episode keeps the pulse.
  quietFrames?: readonly [number, number];
  instant?: boolean; // see SectionHeader.instant
}> = ({
  steps,
  activeIndex,
  allDone = false,
  intro = false,
  top = 176,
  quietFrames,
  instant = false,
}) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const enter = instant
    ? 1
    : interpolate(frame, [4, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 140,
        right: 140,
        opacity: enter,
      }}
    >
      <div style={{ position: "relative", height: 22 }}>
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 8,
            right: 8,
            height: 2,
            background: theme.lineFaint,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 8,
            width: intro
              ? 0
              : `${(activeIndex / (steps.length - 1)) * 100}%`,
            maxWidth: "calc(100% - 16px)",
            height: 2,
            background: theme.accentDim,
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {steps.map((step, i) => {
            const done = !intro && (allDone || i < activeIndex);
            const active = !allDone && i === activeIndex;
            const quiet =
              quietFrames !== undefined &&
              frame >= quietFrames[0] &&
              frame <= quietFrames[1];
            const pulse = active && !quiet ? 1 + 0.12 * Math.sin(frame / 7) : 1;
            return (
              <div
                key={step}
                style={{
                  width: 22,
                  height: 22,
                  transform: `scale(${pulse})`,
                  background: (active && !intro) || done ? theme.accent : "transparent",
                  border: `3px solid ${active || done ? theme.accent : theme.textFaint}`,
                  borderRadius: 4,
                  boxShadow: active ? `0 0 24px ${theme.accentGlow}` : "none",
                  opacity: done && !active ? 0.55 : 1,
                }}
              />
            );
          })}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 14,
          fontFamily: FONTS.mono,
          fontSize: 21,
          letterSpacing: "0.12em",
        }}
      >
        {steps.map((step, i) => {
          const active = !allDone && i === activeIndex;
          return (
            <span
              key={step}
              style={{
                width: 120,
                textAlign:
                  i === 0 ? "left" : i === steps.length - 1 ? "right" : "center",
                color: active ? theme.accent : theme.textFaint,
                fontWeight: active ? 700 : 400,
              }}
            >
              {step}
            </span>
          );
        })}
      </div>
    </div>
  );
};
