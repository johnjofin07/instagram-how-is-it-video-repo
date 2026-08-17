import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../theme";
import { useTheme } from "../themes";

// Small shared primitives used across scenes. All colors come from the active
// theme; motion personality (spring feel) comes from theme.motion.

export const useEnter = (delay: number, config?: { damping?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  return spring({
    frame: frame - delay,
    fps,
    config: {
      damping: config?.damping ?? theme.motion.damping,
      stiffness: theme.motion.stiffness,
      mass: theme.motion.mass,
    },
  });
};

// Card that rises 24px while fading in
export const RiseIn: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, children, style }) => {
  const p = useEnter(delay);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: boolean;
  brand?: boolean; // subject-brand element (e.g. Netflix's box)
}> = ({ children, style, accent, brand }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        background: theme.card,
        border: `1.5px solid ${brand ? theme.brandDim : accent ? theme.accent : theme.cardBorder}`,
        borderRadius: 14,
        boxShadow: brand
          ? `0 0 36px ${theme.brandGlow}`
          : accent
            ? `0 0 36px ${theme.accentGlow}`
            : theme.cardShadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const MonoLabel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        fontFamily: FONTS.mono,
        fontSize: 26,
        letterSpacing: "0.25em",
        color: theme.textDim,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Animated count-up number, mono
export const CountUp: React.FC<{
  to: number;
  delay: number;
  durationFrames?: number;
  decimals?: number;
  style?: React.CSSProperties;
}> = ({ to, delay, durationFrames = 40, decimals = 0, style }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay, delay + durationFrames], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span style={{ fontFamily: FONTS.mono, fontVariantNumeric: "tabular-nums", ...style }}>
      {v.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
};

// A tiny movie "poster" placeholder — dark card with a colored gradient
export const Poster: React.FC<{
  hue: number;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
}> = ({ hue, w = 72, h = 104, style }) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 6,
      background: `linear-gradient(180deg, hsl(${hue}, 45%, 38%) 0%, hsl(${hue}, 50%, 14%) 70%, #0b0b0e 100%)`,
      border: "1px solid rgba(255,255,255,0.08)",
      position: "relative",
      overflow: "hidden",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        bottom: 8,
        left: "15%",
        right: "15%",
        height: 3,
        background: "rgba(255,255,255,0.55)",
        borderRadius: 2,
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: "30%",
        right: "30%",
        height: 3,
        background: "rgba(255,255,255,0.3)",
        borderRadius: 2,
      }}
    />
  </div>
);
