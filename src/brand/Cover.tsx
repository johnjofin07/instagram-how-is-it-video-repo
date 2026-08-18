import React from "react";
import { AbsoluteFill } from "remotion";
import { FONTS } from "../theme";
import { galaxy } from "../themes/galaxy";
import { maps } from "../themes/maps";
import { kitchen } from "../themes/kitchen";

// Episode cover / reel thumbnail (1080×1920 still). Title-card layout: episode
// tag up top, big two-line title centered, subject word in accent red.
// Critical text sits in the middle 4:5 band so Instagram's grid crop keeps it.

type Star = { x: number; y: number; r: number; o: number };
const makeStars = (count: number, seed: number): Star[] =>
  Array.from({ length: count }, (_, i) => {
    const h = (n: number) => {
      const s = Math.sin((i + 1) * 127.1 + seed * 311.7 + n * 74.7) * 43758.5453;
      return s - Math.floor(s);
    };
    return { x: h(1) * 1080, y: h(2) * 1920, r: 0.8 + h(3) * 2, o: 0.3 + h(4) * 0.6 };
  });

export const Cover001: React.FC = () => {
  const stars = makeStars(120, 31);
  return (
    <AbsoluteFill style={{ backgroundColor: galaxy.bg }}>
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse 700px 500px at 20% 18%, rgba(88, 60, 180, 0.15), transparent 70%),
            radial-gradient(ellipse 640px 520px at 82% 78%, rgba(30, 90, 180, 0.12), transparent 70%),
            radial-gradient(ellipse 720px 620px at 50% 48%, ${galaxy.accentGlow}, transparent 72%)
          `,
          opacity: 0.55,
        }}
      />
      <svg width="1080" height="1920" style={{ position: "absolute" }}>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e8ecf8" opacity={s.o * 0.55} />
        ))}
      </svg>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 54 }}>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: "0.45em",
            marginRight: "-0.45em",
            color: galaxy.textDim,
            textTransform: "uppercase",
          }}
        >
          EP.001 · System design
        </div>
        <div
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 800,
            fontSize: 150,
            lineHeight: 1.06,
            textAlign: "center",
            color: galaxy.text,
            letterSpacing: "-0.01em",
          }}
        >
          HOW
          <br />
          <span
            style={{
              color: galaxy.accent,
              textShadow: `0 0 70px ${galaxy.accentGlow}`,
            }}
          >
            NETFLIX
          </span>
          <br />
          WORKS
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 30,
            letterSpacing: "0.4em",
            marginRight: "-0.4em",
            color: galaxy.textFaint,
            textTransform: "uppercase",
          }}
        >
          in 90 seconds
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 92% 78% at 50% 46%, transparent 55%, rgba(0,0,8,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Cover002: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: maps.bg }}>
    {/* faint street grid */}
    <svg width="1080" height="1920" style={{ position: "absolute" }}>
      {[135, 355, 575, 795, 1015].map((x) => (
        <line key={`v${x}`} x1={x} y1={0} x2={x} y2={1920} stroke={maps.lineFaint} strokeWidth={6} />
      ))}
      {[190, 480, 770, 1060, 1350, 1640].map((y) => (
        <line key={`h${y}`} x1={0} y1={y} x2={1080} y2={y} stroke={maps.lineFaint} strokeWidth={6} />
      ))}
      {/* route: blue → congestion amber/red, ending at a pin */}
      <g strokeWidth={16} strokeLinecap="round" fill="none" opacity={0.5}>
        <path d="M 135 1760 L 135 1640 L 575 1640" stroke={maps.accent} />
        <path d="M 575 1640 L 1015 1640 L 1015 1350" stroke={maps.good} />
        <path d="M 1015 1350 L 1015 770" stroke={maps.warn} />
        <path d="M 1015 770 L 1015 480" stroke={maps.brand} />
      </g>
      <circle cx={1015} cy={480} r={26} fill={maps.brand} opacity={0.75} />
      <circle cx={1015} cy={480} r={10} fill={maps.bgLifted} />
    </svg>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 54 }}>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 34,
          fontWeight: 600,
          letterSpacing: "0.45em",
          marginRight: "-0.45em",
          color: maps.textDim,
          textTransform: "uppercase",
        }}
      >
        EP.002 · System design
      </div>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 800,
          fontSize: 118,
          lineHeight: 1.08,
          textAlign: "center",
          color: maps.text,
          letterSpacing: "-0.01em",
        }}
      >
        HOW
        <br />
        <span style={{ color: maps.accent }}>GOOGLE MAPS</span>
        <br />
        SEES TRAFFIC
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 30,
          letterSpacing: "0.4em",
          marginRight: "-0.4em",
          color: maps.textFaint,
          textTransform: "uppercase",
        }}
      >
        no cameras involved
      </div>
    </AbsoluteFill>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 92% 78% at 50% 46%, transparent 60%, ${maps.vignette} 100%)`,
      }}
    />
  </AbsoluteFill>
);

export const Cover003: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: kitchen.bg }}>
    {/* rising heat waves */}
    <svg width="1080" height="1920" style={{ position: "absolute" }} opacity={0.4}>
      {[220, 430, 650, 860].map((x, i) => (
        <path
          key={x}
          d={`M ${x} 1820 C ${x - 60} 1560, ${x + 60} 1300, ${x} 1040 C ${x - 60} 780, ${x + 60} 520, ${x} 260`}
          stroke={i % 2 ? kitchen.accentDim : kitchen.accent}
          strokeWidth={i % 2 ? 10 : 7}
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </svg>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 48 }}>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 34,
          fontWeight: 600,
          letterSpacing: "0.45em",
          marginRight: "-0.45em",
          color: kitchen.textDim,
          textTransform: "uppercase",
        }}
      >
        EP.003 · Everyday machines
      </div>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 800,
          fontSize: 96,
          lineHeight: 1.1,
          textAlign: "center",
          color: kitchen.text,
          letterSpacing: "-0.01em",
        }}
      >
        THERE IS NO
        <br />
        <span style={{ position: "relative", display: "inline-block", fontSize: 190, lineHeight: 1.15, color: kitchen.brand }}>
          FRYING
          <span
            style={{
              position: "absolute",
              left: "-4%",
              right: "-4%",
              top: "50%",
              height: 16,
              background: kitchen.text,
              transform: "rotate(-5deg)",
              borderRadius: 8,
            }}
          />
        </span>
        <br />
        IN YOUR AIR FRYER
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 30,
          letterSpacing: "0.4em",
          marginRight: "-0.4em",
          color: kitchen.textFaint,
          textTransform: "uppercase",
        }}
      >
        in 90 seconds
      </div>
    </AbsoluteFill>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 92% 78% at 50% 46%, transparent 60%, ${kitchen.vignette} 100%)`,
      }}
    />
  </AbsoluteFill>
);
