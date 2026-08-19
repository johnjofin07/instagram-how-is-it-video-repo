import React from "react";
import { AbsoluteFill } from "remotion";
import { FONTS } from "../theme";
import { galaxy } from "../themes/galaxy";
import { delivery } from "../themes/delivery";
import { maps } from "../themes/maps";
import { kitchen } from "../themes/kitchen";
import { flightlab } from "../themes/flightlab";

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

// Small cover parcel: kraft box, red tape cross (matches ep-004's kit).
const CoverParcel: React.FC<{ x: number; y: number; s: number; r: number }> = ({ x, y, s, r }) => (
  <svg
    width={s}
    height={s}
    viewBox="0 0 40 40"
    style={{ position: "absolute", left: x, top: y, transform: `rotate(${r}deg)` }}
  >
    <rect x="3" y="6" width="34" height="31" rx="5" fill="#C9A876" stroke="#7C6237" strokeWidth="2.5" />
    <rect x="16" y="6" width="8" height="31" fill={delivery.brand} opacity="0.92" />
    <rect x="3" y="18" width="34" height="7" fill={delivery.brand} opacity="0.65" />
  </svg>
);

export const Cover004: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: delivery.bg }}>
    {/* taped depot-floor lanes */}
    <svg width="1080" height="1920" style={{ position: "absolute" }}>
      {[190, 640, 1090, 1540].map((y) => (
        <line
          key={`h${y}`}
          x1={0}
          y1={y}
          x2={1080}
          y2={y}
          stroke="rgba(37, 49, 58, 0.09)"
          strokeWidth={5}
          strokeDasharray="52 34"
        />
      ))}
      {[120, 950].map((x) => (
        <line
          key={`v${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={1920}
          stroke="rgba(37, 49, 58, 0.09)"
          strokeWidth={5}
          strokeDasharray="52 34"
        />
      ))}
    </svg>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 720px 620px at 50% 46%, ${delivery.accentGlow}, transparent 72%)`,
        opacity: 0.2,
      }}
    />
    {/* stray parcels */}
    <CoverParcel x={140} y={330} s={110} r={-10} />
    <CoverParcel x={830} y={430} s={86} r={14} />
    <CoverParcel x={200} y={1440} s={90} r={8} />
    <CoverParcel x={800} y={1380} s={124} r={-7} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 54 }}>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 800,
          fontSize: 132,
          lineHeight: 1.08,
          textAlign: "center",
          color: delivery.text,
          letterSpacing: "-0.01em",
        }}
      >
        NETFLIX
        <br />
        IS A{" "}
        <span style={{ color: delivery.brand, textShadow: `0 0 70px ${delivery.brandGlow}` }}>
          DELIVERY
        </span>
        <br />
        COMPANY
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 30,
          letterSpacing: "0.4em",
          marginRight: "-0.4em",
          color: delivery.textFaint,
          textTransform: "uppercase",
        }}
      >
        in 90 seconds
      </div>
    </AbsoluteFill>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 92% 78% at 50% 46%, transparent 55%, ${delivery.vignette} 100%)`,
      }}
    />
  </AbsoluteFill>
);

const CoverRecorder: React.FC = () => (
  <svg width="620" height="400" viewBox="0 0 620 400">
    <defs>
      <linearGradient id="cover-recorder" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FF9A3D" />
        <stop offset="0.58" stopColor={flightlab.accent} />
        <stop offset="1" stopColor="#A93C07" />
      </linearGradient>
    </defs>
    <rect x="62" y="62" width="496" height="278" rx="34" fill="url(#cover-recorder)" stroke="#702B09" strokeWidth="10" />
    <path d="M72 112 H548 M72 288 H548" stroke="#FFF3DE" strokeWidth="25" opacity="0.9" />
    <path d="M72 112 H548 M72 288 H548" stroke="#59656E" strokeWidth="5" strokeDasharray="30 18" />
    <rect x="155" y="145" width="280" height="110" rx="15" fill="rgba(94,29,4,.58)" stroke="rgba(255,255,255,.35)" strokeWidth="5" />
    <text x="295" y="190" textAnchor="middle" fontFamily={FONTS.mono} fontSize="30" fontWeight="800" fill="#FFF7EC" letterSpacing="3">FLIGHT RECORDER</text>
    <text x="295" y="229" textAnchor="middle" fontFamily={FONTS.mono} fontSize="21" fill="#FFE2C0" letterSpacing="2">DO NOT OPEN</text>
    <rect x="493" y="122" width="86" height="160" rx="40" fill="#F07A1C" stroke="#6E2B0A" strokeWidth="8" />
    <rect x="513" y="142" width="46" height="106" rx="22" fill={flightlab.second} opacity="0.75" />
    {/* deterministic test damage */}
    <path d="M108 70 L148 128 L124 172 M421 244 L384 286 L413 333" fill="none" stroke="#4A1C09" strokeWidth="9" strokeLinecap="round" />
  </svg>
);

export const Cover006: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: flightlab.bg }}>
    {/* reuse the episode's technical blueprint language */}
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${flightlab.lineFaint} 1px, transparent 1px), linear-gradient(90deg, ${flightlab.lineFaint} 1px, transparent 1px)`,
        backgroundSize: "44px 44px",
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 720px 620px at 50% 50%, ${flightlab.accentGlow}, transparent 72%)`,
        opacity: 0.5,
      }}
    />
    <div style={{ position: "absolute", left: 230, top: 300, transform: "rotate(-5deg)", filter: `drop-shadow(0 28px 40px rgba(0,0,0,.55))` }}>
      <CoverRecorder />
    </div>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 42, paddingTop: 250 }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 31, fontWeight: 700, letterSpacing: "0.4em", marginRight: "-0.4em", color: flightlab.textDim, textTransform: "uppercase" }}>
        EP.006 · Everyday machines
      </div>
      <div style={{ fontFamily: FONTS.sans, fontWeight: 900, fontSize: 124, lineHeight: 1.02, textAlign: "center", color: flightlab.text, letterSpacing: "-0.02em" }}>
        FIRST,
        <br />
        THEY TRY TO
        <br />
        <span style={{ color: flightlab.accent, textShadow: `0 0 70px ${flightlab.accentGlow}` }}>DESTROY IT</span>
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 29, letterSpacing: "0.32em", marginRight: "-0.32em", color: flightlab.second, textTransform: "uppercase" }}>
        inside the black box
      </div>
    </AbsoluteFill>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 92% 78% at 50% 46%, transparent 55%, ${flightlab.vignette} 100%)` }} />
  </AbsoluteFill>
);
