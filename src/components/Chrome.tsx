import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../theme";
import { useTheme } from "../themes";

// Top chrome (v1 style, kept): mono uppercase section label + counter, and the
// pipeline stepper with red squares. Intro mode shows just the active stage.

export const SectionHeader: React.FC<{
  label: string;
  index: number;
  total: number;
}> = ({ label, index, total }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 96,
        left: 64,
        right: 64,
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
}> = ({ steps, activeIndex, allDone = false, intro = false }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [4, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 176,
        left: 64,
        right: 64,
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
            const pulse = active ? 1 + 0.12 * Math.sin(frame / 7) : 1;
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
