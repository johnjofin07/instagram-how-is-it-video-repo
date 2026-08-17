import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { Card, CountUp, MonoLabel, Poster, RiseIn } from "../../../components/ui";

// Scene 4 (17s): Netflix gives ISPs free cache boxes (Open Connect). At night
// the box pre-fills with tomorrow's binge. Split card: AWS = brains, box = video.
export const OpenConnect: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Box slides into the ISP outline
  const boxIn = interpolate(frame, [27, 80], [-500, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  // Night falls at ~f130
  const night = interpolate(frame, [174, 228], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fill = interpolate(frame, [228, 442], [0, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const posterHues = [38, 200, 280, 8, 130, 320, 55, 220];

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      {/* night dimmer + moon */}
      <AbsoluteFill style={{ background: "#04040a", opacity: night * 0.5 }} />
      <div
        style={{
          position: "absolute",
          top: 330,
          right: 110,
          opacity: night,
          transform: `translateY(${(1 - night) * 40}px)`,
        }}
      >
        <svg width="90" height="90" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="30" fill="#d8d8e2" />
          <circle cx="58" cy="38" r="26" fill={theme.bg} opacity="0.92" />
        </svg>
      </div>

      {/* ISP building outline + the gifted box */}
      <div style={{ position: "absolute", top: 420 }}>
        <div style={{ border: `3px dashed ${theme.line}`, borderRadius: 20, padding: "64px 70px 44px", position: "relative" }}>
          <MonoLabel style={{ position: "absolute", top: -16, left: 50, background: theme.bg, padding: "0 16px" }}>
            your ISP
          </MonoLabel>

          <div style={{ transform: `translateX(${boxIn}px)` }}>
            <Card brand style={{ width: 420, padding: 26, position: "relative" }}>
              {/* gift ribbon while arriving */}
              <div
                style={{
                  position: "absolute",
                  top: -18,
                  right: 26,
                  opacity: interpolate(frame, [80, 161, 201], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}
              >
                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 21,
                    letterSpacing: "0.2em",
                    background: theme.brand,
                    color: "#fff",
                    padding: "8px 18px",
                    borderRadius: 6,
                  }}
                >
                  FREE · FROM NETFLIX
                </div>
              </div>

              <MonoLabel style={{ marginBottom: 16 }}>open connect appliance</MonoLabel>

              {/* fill gauge */}
              <div style={{ height: 26, borderRadius: 13, background: "rgba(148,180,230,0.12)", overflow: "hidden", marginBottom: 18 }}>
                <div
                  style={{
                    height: "100%",
                    width: `${fill * 100}%`,
                    background: `linear-gradient(90deg, ${theme.brandDim}, ${theme.brand})`,
                    borderRadius: 13,
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONTS.mono, fontSize: 24 }}>
                <span style={{ color: theme.textFaint }}>tomorrow's binge</span>
                <span style={{ color: theme.text }}>
                  <CountUp to={94} delay={228} durationFrames={214} />%
                </span>
              </div>

              {/* posters raining into the box at night */}
              {night > 0.5
                ? posterHues.map((hue, i) => {
                    const d = 235 + i * 23;
                    const t = frame - d;
                    if (t < 0 || t > 34) return null;
                    const y = interpolate(t, [0, 34], [-160, 20]);
                    const op = interpolate(t, [0, 6, 28, 34], [0, 1, 1, 0]);
                    return (
                      <div key={i} style={{ position: "absolute", top: y, left: 50 + (i % 4) * 90, opacity: op }}>
                        <Poster hue={hue} w={44} h={64} />
                      </div>
                    );
                  })
                : null}
            </Card>
          </div>
        </div>
      </div>

      {/* Brains vs video split */}
      <RiseIn delay={456} style={{ position: "absolute", top: 900, display: "flex", gap: 36 }}>
        <Card style={{ width: 350, height: 200, padding: 28 }}>
          <MonoLabel style={{ fontSize: 22, color: theme.second, whiteSpace: "nowrap" }}>
            brains · AWS
          </MonoLabel>
          <div style={{ fontFamily: FONTS.sans, fontSize: 30, color: theme.text, marginTop: 14, fontWeight: 700 }}>
            login · homepage · "which box to ask"
          </div>
        </Card>
        <Card brand style={{ width: 350, height: 200, padding: 28 }}>
          <MonoLabel style={{ fontSize: 22, color: theme.brand, whiteSpace: "nowrap" }}>
            video · the box
          </MonoLabel>
          <div style={{ fontFamily: FONTS.sans, fontSize: 30, color: theme.text, marginTop: 14, fontWeight: 700 }}>
            every chunk you watch · 3 km away
          </div>
        </Card>
      </RiseIn>

      {/* distance callout */}
      <RiseIn delay={536} style={{ position: "absolute", top: 1150 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="360" height="40">
            <line x1="10" y1="20" x2="350" y2="20" stroke={theme.line} strokeWidth="3" />
            <circle cx="10" cy="20" r="8" fill={theme.brand} />
            <circle cx="350" cy="20" r="8" fill={theme.second} />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: 360,
            fontFamily: FONTS.mono,
            fontSize: 22,
            color: theme.textDim,
            marginTop: 8,
          }}
        >
          <span>the box</span>
          <span style={{ color: theme.accent }}>down the road</span>
          <span>your couch</span>
        </div>
      </RiseIn>
    </AbsoluteFill>
  );
};
