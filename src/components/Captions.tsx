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

  return (
    <div
      style={{
        position: "absolute",
        bottom: 226,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: FONTS.mono,
        fontWeight: 600,
        fontSize: 50,
        lineHeight: 1.45,
        letterSpacing: "0.03em",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 14}px)`,
      }}
    >
      {line.words.map((w, i) => {
        const spoken = ms >= w.s;
        const speaking = ms >= w.s && ms < w.e + 80;
        return (
          <span
            key={i}
            style={{
              color: speaking
                ? theme.accent
                : spoken
                  ? theme.caption.spoken
                  : theme.caption.unspoken,
              textShadow: speaking
                ? `0 0 26px ${theme.accentGlow}, ${theme.caption.halo}`
                : theme.caption.halo,
              marginRight: 15,
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};
