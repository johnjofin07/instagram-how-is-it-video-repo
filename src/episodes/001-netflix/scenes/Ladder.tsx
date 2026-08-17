import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { Card, CountUp, MonoLabel, Poster, RiseIn } from "../../../components/ui";

// Scene 2 (18s): MASTER file drops into the transcoder → the bitrate ladder
// grows (the reference's bar chart, same numbers) → per-title comparison:
// cartoon = short ladder, action = tall ladder.
const RUNGS = [
  { label: "4K", mbps: 15.0, w: 420 },
  { label: "1080p", mbps: 5.0, w: 260 },
  { label: "720p", mbps: 3.0, w: 180 },
  { label: "480p", mbps: 1.5, w: 110 },
];

export const Ladder: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Master file slides in, then "feeds" the ladder
  const masterIn = interpolate(frame, [12, 49], [-360, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const masterFade = interpolate(frame, [139, 170], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const compareIn = frame > 433;

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      {/* Master file card */}
      <div style={{ position: "absolute", top: 330, transform: `translateX(${masterIn}px)`, opacity: masterFade }}>
        <Card style={{ padding: "24px 40px", display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 54,
              height: 66,
              borderRadius: 8,
              border: `3px solid ${theme.textDim}`,
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ fontFamily: FONTS.mono, fontSize: 17, color: theme.textDim }}>RAW</span>
          </div>
          <div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 34, color: theme.text, fontWeight: 700 }}>
              master.mov
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 24, color: theme.textFaint }}>
              1 file · huge
            </div>
          </div>
        </Card>
      </div>

      {/* Down arrow pulse */}
      <div
        style={{
          position: "absolute",
          top: 452,
          opacity: interpolate(frame, [58, 87], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <svg width="40" height="70" viewBox="0 0 40 70">
          <line x1="20" y1={4 + 3 * Math.sin(frame / 8)} x2="20" y2="46" stroke={theme.accent} strokeWidth="5" />
          <path d="M6 42 L20 62 L34 42" fill="none" stroke={theme.accent} strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Bitrate ladder */}
      <div style={{ position: "absolute", top: 560, width: 760 }}>
        <MonoLabel style={{ marginBottom: 26 }}>one title → the ladder</MonoLabel>
        {RUNGS.map((rung, i) => {
          const delay = 101 + i * 26;
          const grow = interpolate(frame, [delay, delay + 30], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: (t) => 1 - Math.pow(1 - t, 3),
          });
          return (
            <div key={rung.label} style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 26, opacity: grow ? 1 : 0 }}>
              <Poster hue={38} w={54} h={78} style={{ opacity: 0.35 + 0.65 * (1 - i * 0.2) }} />
              <span style={{ fontFamily: FONTS.mono, fontSize: 34, color: theme.text, width: 130, fontWeight: 700 }}>
                {rung.label}
              </span>
              <div
                style={{
                  width: rung.w * grow,
                  height: 46,
                  borderRadius: 6,
                  background: `linear-gradient(90deg, rgba(229,9,20,0.35), ${i === 0 ? theme.accent : "rgba(229,9,20,0.6)"})`,
                  boxShadow: i === 0 ? `0 0 30px ${theme.accentGlow}` : "none",
                }}
              />
              <span style={{ fontFamily: FONTS.mono, fontSize: 32, color: theme.text }}>
                <CountUp to={rung.mbps} delay={delay} decimals={1} durationFrames={30} />
                <span style={{ color: theme.textFaint, fontSize: 24 }}> Mbps</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Per-title comparison */}
      {compareIn ? (
        <RiseIn delay={440} style={{ position: "absolute", top: 1120, display: "flex", gap: 60 }}>
          {[
            { name: "CARTOON", hue: 200, rungs: 2, note: "compresses easily" },
            { name: "GRAINY ACTION", hue: 8, rungs: 5, note: "fights back" },
          ].map((t, i) => (
            <Card key={t.name} style={{ padding: 28, width: 350 }}>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
                <Poster hue={t.hue} w={80} h={116} />
                <div style={{ display: "flex", flexDirection: "column-reverse", gap: 8, flex: 1 }}>
                  {Array.from({ length: t.rungs }).map((_, r) => {
                    const d = 455 + i * 14 + r * 12;
                    const g = interpolate(frame, [d, d + 14], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    });
                    return (
                      <div
                        key={r}
                        style={{
                          height: 16,
                          width: `${(40 + r * 15) * g}%`,
                          borderRadius: 4,
                          background: r === t.rungs - 1 ? theme.accent : "rgba(229,9,20,0.35)",
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              <MonoLabel style={{ marginTop: 20, fontSize: 22 }}>{t.name}</MonoLabel>
              <div style={{ fontFamily: FONTS.mono, fontSize: 24, color: theme.textFaint, marginTop: 6 }}>
                {t.note} · {t.rungs} rungs
              </div>
            </Card>
          ))}
        </RiseIn>
      ) : null}
    </AbsoluteFill>
  );
};
