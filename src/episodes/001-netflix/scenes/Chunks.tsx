import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { Card, MonoLabel, RiseIn } from "../../../components/ui";

// Scene 3 (21s): a video bar splits into 4s chunks that stream toward a phone.
// The player checks bandwidth before each chunk and picks a rung. Mid-scene a
// "video call" starts, wifi dips, quality steps down — with NO buffer wheel.
const QUALITIES = ["4K", "1080p", "720p", "480p"];

export const Chunks: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Phase 1: bar splits into chunks
  const split = interpolate(frame, [39, 104], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Wifi health: strong until the call starts at ~f330, dips, partially recovers
  const wifi =
    frame < 500
      ? 0.9 + 0.06 * Math.sin(frame / 17)
      : interpolate(frame, [500, 560, 700], [0.9, 0.34, 0.5], {
          extrapolateRight: "clamp",
        });
  // Which rung is selected (derived from wifi)
  const qualityIndex = wifi > 0.75 ? 0 : wifi > 0.55 ? 1 : wifi > 0.4 ? 2 : 2;
  const callVisible = frame >= 500;

  // Streaming chunks: a belt of tiles moving right, one per ~14 frames
  const chunks = Array.from({ length: 36 }).map((_, i) => {
    const born = 117 + i * 18;
    const t = frame - born;
    if (t < 0) return null;
    const x = interpolate(t, [0, 55], [180, 760], { extrapolateRight: "clamp" });
    const arrived = t > 55;
    return { i, x, arrived, born };
  });

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      {/* The version bar that splits into chunks */}
      <div style={{ position: "absolute", top: 380, width: 800 }}>
        <MonoLabel style={{ marginBottom: 22 }}>1080p version → 4-second chunks</MonoLabel>
        <div style={{ display: "flex", gap: `${4 + split * 14}px` }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 54,
                borderRadius: 6,
                background: "rgba(229,9,20,0.2)",
                border: `2px solid ${split > 0.5 ? theme.accent : "transparent"}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: FONTS.mono,
                fontSize: 20,
                color: split > 0.6 ? theme.text : "transparent",
              }}
            >
              4s
            </div>
          ))}
        </div>
      </div>

      {/* Streaming belt: server → phone */}
      <div style={{ position: "absolute", top: 620, width: 900, height: 240 }}>
        {/* server */}
        <Card style={{ position: "absolute", left: 20, top: 40, width: 150, padding: 18 }}>
          {[0, 1, 2].map((r) => (
            <div key={r} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 2px" }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: r === 0 ? theme.good : theme.textFaint }} />
              <div style={{ flex: 1, height: 6, background: "#2a2a31", borderRadius: 3 }} />
            </div>
          ))}
          <MonoLabel style={{ fontSize: 17, marginTop: 8 }}>cache</MonoLabel>
        </Card>

        {/* dotted path */}
        <svg width="900" height="240" style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1="180" y1="110" x2="760" y2="110" stroke={theme.line} strokeWidth="3" strokeDasharray="4 12" />
        </svg>

        {/* moving chunks */}
        {chunks.map((c) =>
          c && !c.arrived ? (
            <div
              key={c.i}
              style={{
                position: "absolute",
                left: c.x,
                top: 88,
                width: 44,
                height: 44,
                borderRadius: 6,
                background: theme.accent,
                boxShadow: `0 0 18px ${theme.accentGlow}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: FONTS.mono,
                fontSize: 16,
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              4s
            </div>
          ) : null
        )}

        {/* phone */}
        <Card style={{ position: "absolute", right: 20, top: 20, width: 120, height: 190, borderRadius: 22, padding: 8 }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 16,
              background: "#0a0f1e",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: `${interpolate(frame, [117, 780], [10, 92], { extrapolateRight: "clamp" })}%`,
                background: `linear-gradient(180deg, ${theme.brandDim}, #3f1010)`,
              }}
            />
          </div>
        </Card>
      </div>

      {/* Decision HUD: wifi meter + rung selector */}
      <RiseIn delay={182} style={{ position: "absolute", top: 940, width: 800 }}>
        <Card style={{ padding: 30, display: "flex", gap: 44, alignItems: "center" }}>
          {/* wifi meter */}
          <div style={{ width: 250 }}>
            <MonoLabel style={{ fontSize: 20, marginBottom: 12 }}>wifi</MonoLabel>
            <div style={{ height: 20, borderRadius: 10, background: "rgba(148,180,230,0.12)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${wifi * 100}%`,
                  background: wifi > 0.6 ? theme.good : theme.warn,
                  borderRadius: 10,
                }}
              />
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 20, color: theme.textFaint, marginTop: 10 }}>
              checked before every chunk
            </div>
          </div>
          {/* rung selector */}
          <div style={{ flex: 1, display: "flex", gap: 14 }}>
            {QUALITIES.map((q, i) => {
              const active = i === qualityIndex;
              return (
                <div
                  key={q}
                  style={{
                    flex: 1,
                    padding: "16px 0",
                    textAlign: "center",
                    fontFamily: FONTS.mono,
                    fontSize: 26,
                    fontWeight: active ? 700 : 400,
                    color: active ? "#ffffff" : theme.textFaint,
                    background: active ? theme.accent : "transparent",
                    border: `2px solid ${active ? theme.accent : theme.line}`,
                    borderRadius: 8,
                    boxShadow: active ? `0 0 24px ${theme.accentGlow}` : "none",
                  }}
                >
                  {q}
                </div>
              );
            })}
          </div>
        </Card>
      </RiseIn>

      {/* Video call interruption */}
      {callVisible ? (
        <RiseIn delay={502} style={{ position: "absolute", top: 1180 }}>
          <Card style={{ padding: "20px 36px", display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: theme.good,
                opacity: 0.5 + 0.5 * Math.sin(frame / 6),
              }}
            />
            <span style={{ fontFamily: FONTS.mono, fontSize: 28, color: theme.text }}>
              video call joined → bandwidth shared
            </span>
          </Card>
        </RiseIn>
      ) : null}

      {/* crossed-out buffer wheel */}
      {frame > 620 ? (
        <RiseIn delay={622} style={{ position: "absolute", top: 1300 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="54" height="54" viewBox="0 0 54 54">
              <circle
                cx="27"
                cy="27"
                r="18"
                fill="none"
                stroke={theme.textFaint}
                strokeWidth="5"
                strokeDasharray="80 34"
                transform={`rotate(${frame * 6} 27 27)`}
              />
              <line x1="8" y1="46" x2="46" y2="8" stroke={theme.warn} strokeWidth="6" strokeLinecap="round" />
            </svg>
            <MonoLabel style={{ color: theme.warn, fontSize: 26 }}>no buffering wheel</MonoLabel>
          </div>
        </RiseIn>
      ) : null}
    </AbsoluteFill>
  );
};
