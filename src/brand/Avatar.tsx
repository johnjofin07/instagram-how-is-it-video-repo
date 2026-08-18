import React from "react";
import { AbsoluteFill } from "remotion";
import { CHANNEL, FONTS } from "../theme";
import { galaxy } from "../themes/galaxy";

// Channel profile picture (1080×1080 still). Original mark — galaxy bg,
// mono "SUPER" over a big red "HOW". Must read at 40px (Instagram grid size),
// hence huge type and no fine detail.

type Star = { x: number; y: number; r: number; o: number };

const makeStars = (count: number, seed: number, size: number): Star[] =>
  Array.from({ length: count }, (_, i) => {
    const h = (n: number) => {
      const s = Math.sin((i + 1) * 127.1 + seed * 311.7 + n * 74.7) * 43758.5453;
      return s - Math.floor(s);
    };
    return { x: h(1) * size, y: h(2) * size, r: 0.8 + h(3) * 2.2, o: 0.3 + h(4) * 0.6 };
  });

export const Avatar: React.FC = () => {
  const stars = makeStars(70, 11, 1080);
  return (
    <AbsoluteFill style={{ backgroundColor: galaxy.bg }}>
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse 620px 480px at 22% 18%, rgba(88, 60, 180, 0.16), transparent 70%),
            radial-gradient(ellipse 560px 460px at 82% 80%, rgba(30, 90, 180, 0.13), transparent 70%),
            radial-gradient(ellipse 640px 560px at 50% 56%, ${galaxy.accentGlow}, transparent 72%)
          `,
          opacity: 0.6,
        }}
      />
      <svg width="1080" height="1080" style={{ position: "absolute" }}>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e8ecf8" opacity={s.o * 0.6} />
        ))}
      </svg>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 30 }}>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 96,
            fontWeight: 600,
            letterSpacing: "0.52em",
            marginRight: "-0.52em",
            color: galaxy.text,
            textTransform: "uppercase",
          }}
        >
          super
        </div>
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 330,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: galaxy.accent,
            textShadow: `0 0 90px ${galaxy.accentGlow}, 0 0 34px rgba(229, 9, 20, 0.45)`,
          }}
        >
          HOW
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 88% 88% at 50% 50%, transparent 52%, rgba(0,0,8,0.72) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Emblem variant (1080×1080 still): hex-nut crest — engineering-coded original
// geometry (deliberately NOT a diamond/shield: that's Superman trade dress).
// Bold single "H" so it reads at 40px grid size.
export const Emblem: React.FC = () => {
  const stars = makeStars(60, 17, 1080);
  const cx = 540;
  const cy = 540;
  const R = 350;
  // flat-top hexagon
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i);
    return `${cx + R * Math.cos(a)},${cy + R * Math.sin(a)}`;
  }).join(" ");
  const hexInner = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i);
    return `${cx + (R - 26) * Math.cos(a)},${cy + (R - 26) * Math.sin(a)}`;
  }).join(" ");
  return (
    <AbsoluteFill style={{ backgroundColor: galaxy.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 700px 640px at 50% 52%, ${galaxy.accentGlow}, transparent 70%)`,
          opacity: 0.5,
        }}
      />
      <svg width="1080" height="1080" style={{ position: "absolute" }}>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e8ecf8" opacity={s.o * 0.55} />
        ))}
        <polygon
          points={hex}
          fill="rgba(10, 10, 22, 0.9)"
          stroke={galaxy.accent}
          strokeWidth="16"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 60px ${galaxy.accentGlow})` }}
        />
        <polygon
          points={hexInner}
          fill="none"
          stroke="rgba(148, 163, 200, 0.35)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            fontFamily: FONTS.sans,
            fontSize: 420,
            fontWeight: 800,
            lineHeight: 1,
            color: galaxy.text,
            textShadow: `0 0 70px ${galaxy.accentGlow}`,
            marginTop: -20,
          }}
        >
          H
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 54,
            fontWeight: 600,
            letterSpacing: "0.5em",
            marginRight: "-0.5em",
            color: galaxy.accent,
            textTransform: "uppercase",
            marginTop: -6,
          }}
        >
          super
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// YouTube banner (2048×1152 still). All text inside the ~1235×338 center-safe
// area so it survives TV/desktop/mobile crops.
export const Banner: React.FC = () => {
  const stars = makeStars(110, 23, 2048);
  return (
    <AbsoluteFill style={{ backgroundColor: galaxy.bg }}>
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse 900px 500px at 15% 20%, rgba(88, 60, 180, 0.15), transparent 70%),
            radial-gradient(ellipse 800px 480px at 88% 75%, rgba(30, 90, 180, 0.12), transparent 70%),
            radial-gradient(ellipse 900px 520px at 50% 55%, ${galaxy.accentGlow}, transparent 74%)
          `,
          opacity: 0.55,
        }}
      />
      <svg width="2048" height="1152" style={{ position: "absolute" }}>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y % 1152} r={s.r} fill="#e8ecf8" opacity={s.o * 0.55} />
        ))}
      </svg>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 26 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 34 }}>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 72,
              fontWeight: 600,
              letterSpacing: "0.5em",
              color: galaxy.text,
              textTransform: "uppercase",
            }}
          >
            super
          </span>
          <span
            style={{
              fontFamily: FONTS.sans,
              fontSize: 150,
              fontWeight: 800,
              lineHeight: 1,
              color: galaxy.accent,
              textShadow: `0 0 70px ${galaxy.accentGlow}`,
            }}
          >
            HOW
          </span>
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 34,
            letterSpacing: "0.42em",
            marginRight: "-0.42em",
            color: galaxy.textDim,
            textTransform: "uppercase",
          }}
        >
          {CHANNEL.tagline}
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 92% 80% at 50% 50%, transparent 55%, rgba(0,0,8,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
