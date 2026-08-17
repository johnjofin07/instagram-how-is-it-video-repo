import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { Card, MonoLabel, Poster, RiseIn } from "../../../components/ui";

// Scene 1 (6s): phone with a play button; the camera pushes PAST it to reveal
// a glowing cache server inside an "ISP BUILDING" outline. One camera move,
// nothing else — the hook does the work.
export const Hook: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Camera: hold on phone until ~f90, then push in and slide to the server
  const push = interpolate(frame, [90, 172], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ease = interpolate(push, [0, 1], [0, 1], {
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  const phoneOpacity = interpolate(ease, [0.45, 0.8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const serverOpacity = interpolate(ease, [0.35, 0.75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = interpolate(ease, [0, 1], [1, 1.65]);
  const playPulse = 1 + 0.06 * Math.sin(frame / 6);
  const led = Math.sin(frame / 5) > 0 ? theme.brand : theme.brandDim;

  return (
    <AbsoluteFill>
      {/* Phone layer */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: phoneOpacity,
          transform: `scale(${zoom})`,
        }}
      >
        <Card style={{ width: 380, height: 780, borderRadius: 44, padding: 14 }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 32,
              background: "#08080c",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 44,
            }}
          >
            {/* Netflix-style ribbon N with soft glow */}
            <svg
              width="150"
              height="270"
              viewBox="0 0 100 180"
              style={{ filter: `drop-shadow(0 0 34px ${theme.brandGlow})` }}
            >
              <rect x="14" y="0" width="24" height="180" fill="#9d060f" />
              <rect x="62" y="0" width="24" height="180" fill="#9d060f" />
              <polygon points="14,0 38,0 86,180 62,180" fill={theme.brand} />
            </svg>
            {/* play button */}
            <div
              style={{
                width: 104,
                height: 104,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.95)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transform: `scale(${playPulse})`,
                boxShadow: "0 12px 40px rgba(0,0,0,0.65)",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  marginLeft: 9,
                  borderTop: "24px solid transparent",
                  borderBottom: "24px solid transparent",
                  borderLeft: `38px solid ${theme.brand}`,
                }}
              />
            </div>
            {/* app-home poster shelf */}
            <div style={{ position: "absolute", bottom: 26, display: "flex", gap: 14 }}>
              {[38, 200, 280, 8].map((hue) => (
                <Poster key={hue} hue={hue} w={64} h={92} style={{ opacity: 0.8 }} />
              ))}
            </div>
          </div>
        </Card>
      </AbsoluteFill>

      {/* Server-in-ISP layer */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: serverOpacity,
          transform: `scale(${interpolate(ease, [0, 1], [0.8, 1])})`,
        }}
      >
        <div
          style={{
            border: `3px dashed ${theme.line}`,
            borderRadius: 20,
            padding: "70px 90px 50px",
            position: "relative",
          }}
        >
          <MonoLabel
            style={{
              position: "absolute",
              top: -16,
              left: 50,
              background: theme.bg,
              padding: "0 16px",
              whiteSpace: "nowrap",
              fontSize: 24,
            }}
          >
            ISP building · 3 km away
          </MonoLabel>
          <Card brand style={{ width: 300, padding: 28 }}>
            {[0, 1, 2, 3].map((row) => (
              <div
                key={row}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "13px 6px",
                  borderBottom: row < 3 ? `1px solid ${theme.cardBorder}` : "none",
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: row === 1 ? led : theme.textFaint }} />
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(148,180,230,0.18)" }} />
                <div style={{ width: 26, height: 8, borderRadius: 4, background: row % 2 ? theme.brandDim : "#2a2a31" }} />
              </div>
            ))}
          </Card>
          <RiseIn delay={152} style={{ marginTop: 30, textAlign: "center" }}>
            <MonoLabel style={{ color: theme.accent, letterSpacing: "0.4em" }}>already there</MonoLabel>
          </RiseIn>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
