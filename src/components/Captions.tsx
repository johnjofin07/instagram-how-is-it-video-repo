import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FONTS } from "../theme";
import { useTheme } from "../themes";
import type { TimedLine } from "../episodes/types";

// Word-synced captions driven by whisper timestamps (episode timing.json).
// Style: boxless monospace, karaoke reveal — upcoming words faint, spoken words
// bright, the word being spoken right now glows red. Lines fade+rise in.
export const Captions: React.FC<{ lines: TimedLine[] }> = ({ lines }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;

  const line = lines.find((l) => ms >= l.start && ms < l.end);
  if (!line) return null;

  const sinceStart = ms - line.start;
  const enter = interpolate(sinceStart, [0, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sans = theme.caption.font === "sans";
  const words = line.words.map((w, i) => {
    const spoken = ms >= w.s;
    const speaking = ms >= w.s && ms < w.e + 80;
    return (
      <span
        key={i}
        style={{
          display: "inline-block", // lets the current word pop without reflow
          color: speaking
            ? theme.accent
            : spoken
              ? theme.caption.spoken
              : theme.caption.unspoken,
          textShadow: speaking
            ? `0 0 26px ${theme.accentGlow}, ${theme.caption.halo}`
            : theme.caption.halo,
          transform: speaking ? "scale(1.05)" : "scale(1)",
          marginRight: sans ? 19 : 15,
        }}
      >
        {w.t}
      </span>
    );
  });

  return (
    <div
      style={{
        position: "absolute",
        // lifted clear of the IG Reels bottom UI overlay (was 226 ≈ 12%; the
        // full spec says no text in bottom 35% — captions are the deliberate
        // exception, but give the platform chrome ~22% of breathing room).
        // Scene-closing headlines must end above ~y1370 to clear the pill.
        bottom: 420,
        left: 65,
        right: 140,
        textAlign: "center",
        fontFamily: sans ? FONTS.sans : FONTS.mono,
        fontWeight: sans ? 800 : 600,
        fontSize: 50,
        lineHeight: 1.45,
        letterSpacing: sans ? "0.005em" : "0.03em",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 14}px)`,
      }}
    >
      {theme.caption.boxed ? (
        <div
          style={{
            display: "inline-block",
            background: theme.card,
            border: `1.5px solid ${theme.cardBorder}`,
            borderRadius: theme.caption.radius ?? 999,
            boxShadow: theme.cardShadow,
            padding: "14px 42px 16px",
            maxWidth: "100%",
          }}
        >
          {words}
        </div>
      ) : (
        words
      )}
    </div>
  );
};
