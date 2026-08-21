import React from "react";
import { AbsoluteFill } from "remotion";
import { FONTS } from "../theme";
import { galaxy } from "../themes/galaxy";
import { delivery } from "../themes/delivery";
import { maps } from "../themes/maps";
import { kitchen } from "../themes/kitchen";
import { flightlab } from "../themes/flightlab";
import { abyss } from "../themes/abyss";
import { inkwell } from "../themes/inkwell";
import { blueprint } from "../themes/blueprint";
import { lobby } from "../themes/lobby";
import { papersky } from "../themes/papersky";
import { PaperCloud, PaperPlane, SkyStage } from "../episodes/012-airplane-toilet/scenes/kit";

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

const CoverBrokenCable: React.FC = () => (
  <svg width="1080" height="360" viewBox="0 0 1080 360">
    {/* two parted halves, frayed ends, resting angle */}
    <g transform="rotate(-2 540 180)">
      <rect x="-40" y="150" width="500" height="52" rx="26" fill="#20323E" stroke="#7C93A3" strokeWidth="5" />
      <rect x="-40" y="150" width="500" height="10" rx="5" fill="#7C93A3" opacity="0.85" />
      <path d="M460 158 L502 172 M460 176 L494 182 M460 194 L500 196" stroke={abyss.accent} strokeWidth="6" strokeLinecap="round" />
    </g>
    <g transform="rotate(2.5 540 180)">
      <rect x="620" y="158" width="500" height="52" rx="26" fill="#20323E" stroke="#7C93A3" strokeWidth="5" />
      <rect x="620" y="158" width="500" height="10" rx="5" fill="#7C93A3" opacity="0.85" />
      <path d="M620 166 L578 180 M620 184 L586 190 M620 202 L580 204" stroke={abyss.accent} strokeWidth="6" strokeLinecap="round" />
    </g>
    {/* light spilling from the break */}
    <circle cx="540" cy="182" r="86" fill={abyss.accentGlow} opacity="0.9" />
    <circle cx="540" cy="182" r="34" fill={abyss.accent} opacity="0.25" />
  </svg>
);

export const Cover005: React.FC = () => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, #12384A 0%, ${abyss.bg} 46%, #03090E 100%)` }}>
    {/* marine snow */}
    <svg width="1080" height="1920" style={{ position: "absolute" }}>
      {makeStars(70, 23).map((st, i) => (
        <circle key={i} cx={st.x * 1080} cy={st.y * 1920} r={0.8 + st.r * 1.6} fill="rgba(214,234,244,0.30)" opacity={st.o} />
      ))}
    </svg>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 760px 640px at 50% 44%, ${abyss.accentGlow}, transparent 72%)`,
        opacity: 0.35,
      }}
    />
    <div style={{ position: "absolute", left: 0, top: 1180 }}>
      <CoverBrokenCable />
    </div>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 44, paddingBottom: 240 }}>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 900,
          fontSize: 118,
          lineHeight: 1.06,
          textAlign: "center",
          color: abyss.text,
          letterSpacing: "-0.02em",
        }}
      >
        THE INTERNET
        <br />
        IS LYING ON THE
        <br />
        <span style={{ color: abyss.accent, textShadow: `0 0 70px ${abyss.accentGlow}` }}>
          OCEAN FLOOR
        </span>
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 29,
          letterSpacing: "0.32em",
          marginRight: "-0.32em",
          color: abyss.second,
          textTransform: "uppercase",
        }}
      >
        and it keeps snapping
      </div>
    </AbsoluteFill>
    <AbsoluteFill
      style={{ background: `radial-gradient(ellipse 92% 78% at 50% 46%, transparent 55%, ${abyss.vignette} 100%)` }}
    />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Covers 007-010. Same title-card grammar as 001-006: episode art in one half,
// big 2-3 line title centered in the middle 4:5 band (Instagram's grid crop
// keeps the middle), subject word in the skin's accent, mono eyebrow beneath.
// Each cover is self-contained — local SVG only, never an import from an
// episode kit, so covers stay renderable if a kit is refactored.
// ---------------------------------------------------------------------------

// 007 — a cream page whose hidden marks are DEVELOPING under a warm scan lamp.
// The three lit words are drawn in `accent` clay (5.3:1 on the paper) with the
// terracotta bloom behind them; grey-kraft bars are the ordinary text. The
// lamp band is the episode's money shot frozen mid-sweep.
const CoverPage: React.FC = () => {
  const PAPER = "#FCFAF4";
  const KRAFT = "#D4A27F";
  // seeded bar layout: 9 rows, ragged right edge, some words "developed"
  const rows = Array.from({ length: 9 }, (_, r) => {
    const h = (n: number) => {
      const s = Math.sin((r + 1) * 91.3 + n * 47.7) * 43758.5453;
      return s - Math.floor(s);
    };
    const count = 3 + Math.floor(h(1) * 2);
    let x = 0;
    return Array.from({ length: count }, (_, c) => {
      const w = 70 + h(c + 2) * 120;
      const item = { x, w, lit: h(c + 9) > 0.78 };
      x += w + 26;
      return item;
    }).filter((it) => it.x + it.w < 560);
  });
  return (
    <svg width="700" height="560" viewBox="0 0 700 560">
      <rect x="0" y="0" width="700" height="560" rx="18" fill={PAPER} />
      <rect x="0" y="0" width="700" height="560" rx="18" fill="none" stroke="rgba(43,37,25,0.14)" strokeWidth="3" />
      {rows.map((row, r) =>
        row.map((it, c) => (
          <g key={`${r}-${c}`}>
            {it.lit && (
              <rect
                x={70 + it.x - 8}
                y={92 + r * 48 - 10}
                width={it.w + 16}
                height={40}
                rx={12}
                fill={inkwell.accentGlow}
              />
            )}
            <rect
              x={70 + it.x}
              y={92 + r * 48}
              width={it.w}
              height={20}
              rx={10}
              fill={it.lit ? inkwell.accent : KRAFT}
              opacity={it.lit ? 1 : 0.75}
            />
          </g>
        ))
      )}
      {/* the scan lamp, frozen mid-sweep */}
      <defs>
        <linearGradient id="lampBand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(217,119,87,0)" />
          <stop offset="50%" stopColor="rgba(217,119,87,0.42)" />
          <stop offset="100%" stopColor="rgba(217,119,87,0)" />
        </linearGradient>
      </defs>
      <rect x="330" y="0" width="190" height="560" fill="url(#lampBand)" />
      <rect x="422" y="0" width="6" height="560" fill={inkwell.brand} opacity="0.55" />
    </svg>
  );
};

export const Cover007: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: inkwell.bg }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 780px 660px at 50% 40%, ${inkwell.brandGlow}, transparent 70%)`,
        opacity: 0.7,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 190,
        top: 250,
        transform: "rotate(-3deg)",
        filter: "drop-shadow(0 26px 44px rgba(60,52,40,0.28))",
      }}
    >
      <CoverPage />
    </div>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40, paddingTop: 620 }}>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 900,
          fontSize: 112,
          lineHeight: 1.03,
          textAlign: "center",
          color: inkwell.text,
          letterSpacing: "-0.02em",
        }}
      >
        ANTHROPIC IS
        <br />
        WATERMARKING
        <br />
        <span style={{ color: inkwell.accent }}>YOUR TEXT</span>
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 29,
          letterSpacing: "0.32em",
          marginRight: "-0.32em",
          color: inkwell.second,
          textTransform: "uppercase",
        }}
      >
        you can&rsquo;t see the signature
      </div>
    </AbsoluteFill>
    <AbsoluteFill
      style={{ background: `radial-gradient(ellipse 92% 78% at 50% 46%, transparent 58%, ${inkwell.vignette} 100%)` }}
    />
  </AbsoluteFill>
);

// 008 — the cheese tray that photographs the invisible map: molten stripes sit
// exactly under the heat lobes. HOT/COLD are episode consts (the kitchen skin
// has no thermal tokens), matching scenes/kit.tsx.
const CoverTray: React.FC = () => {
  const HOT = "#FF6B4A";
  const HOT_CORE = "#FFD166";
  const COLD = "#4AA3FF";
  // Cheese bed spans x 86..674. Lobe centers sit at 180/380/580 so every
  // molten stripe lands wholly inside the bed, and the cold gaps fall between
  // them — same registration the `spin` scene proves on screen.
  const lobes = [180, 380, 580];
  const gaps = [280, 480];
  return (
    <svg width="760" height="420" viewBox="0 0 760 420">
      {/* cavity */}
      <rect x="0" y="0" width="760" height="420" rx="22" fill="#1E262C" />
      <rect x="0" y="0" width="760" height="420" rx="22" fill="none" stroke="#8E9BA6" strokeWidth="6" />
      {/* tray */}
      <rect x="70" y="90" width="620" height="240" rx="16" fill="#2B353D" stroke="#8E9BA6" strokeWidth="4" />
      <defs>
        {/* clip guarantees nothing spills past the cheese bed */}
        <clipPath id="cheeseBed">
          <rect x="86" y="106" width="588" height="208" rx="10" />
        </clipPath>
      </defs>
      <g clipPath="url(#cheeseBed)">
        {/* unmelted cheese — solid, so it reads as food not a test pattern */}
        <rect x="86" y="106" width="588" height="208" fill="#EFE2BE" />
        {/* cold gaps: still pale, tinted blue */}
        {gaps.map((cx, i) => (
          <rect key={i} x={cx - 34} y="106" width="68" height="208" fill={COLD} opacity="0.30" />
        ))}
        {/* molten stripes, exactly under the lobes */}
        {lobes.map((cx, i) => (
          <g key={i}>
            <rect x={cx - 54} y="106" width="108" height="208" fill={HOT} opacity="0.92" />
            <rect x={cx - 26} y="106" width="52" height="208" fill={HOT_CORE} />
          </g>
        ))}
      </g>
      <rect x="86" y="106" width="588" height="208" rx="10" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
    </svg>
  );
};

export const Cover008: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: kitchen.bg }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 760px 620px at 50% 36%, rgba(255,107,74,0.22), transparent 72%)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 160,
        top: 300,
        filter: "drop-shadow(0 28px 44px rgba(59,47,38,0.32))",
      }}
    >
      <CoverTray />
    </div>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40, paddingTop: 560 }}>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 900,
          // 118 ran the long first line edge-to-edge; 96 keeps ~70px of side air
          fontSize: 96,
          lineHeight: 1.05,
          textAlign: "center",
          color: kitchen.text,
          letterSpacing: "-0.02em",
        }}
      >
        YOUR MICROWAVE
        <br />
        HAS
        <br />
        <span style={{ color: "#2E7FD1" }}>COLD SPOTS</span>
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 29,
          letterSpacing: "0.32em",
          marginRight: "-0.32em",
          color: kitchen.textDim,
          textTransform: "uppercase",
        }}
      >
        that&rsquo;s why the plate spins
      </div>
    </AbsoluteFill>
    <AbsoluteFill
      style={{ background: `radial-gradient(ellipse 92% 78% at 50% 46%, transparent 58%, ${kitchen.vignette} 100%)` }}
    />
  </AbsoluteFill>
);

// 009 — noise and anti-noise interlocked, with the white flat segment between
// them. NOISE/ANTI/SUM are the episode's wave-law consts.
const CoverWaves: React.FC = () => {
  const NOISE = "#F5A83C";
  const ANTI = "#3CC8F5";
  const SUM = "#FFFFFF";
  const path = (amp: number, phase: number) => {
    const pts = [];
    for (let x = 0; x <= 900; x += 6) {
      const y = 170 + Math.sin((x / 900) * Math.PI * 4 + phase) * amp;
      pts.push(`${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };
  return (
    <svg width="900" height="340" viewBox="0 0 900 340">
      <path d={path(96, 0)} stroke={NOISE} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d={path(96, Math.PI)} stroke={ANTI} strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* the sum: a dead-flat white line, the brightest thing in the frame */}
      <line x1="0" y1="170" x2="900" y2="170" stroke={SUM} strokeWidth="10" strokeLinecap="round" />
      <line x1="0" y1="170" x2="900" y2="170" stroke={SUM} strokeWidth="26" strokeLinecap="round" opacity="0.18" />
    </svg>
  );
};

export const Cover009: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: blueprint.bg }}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${blueprint.lineFaint} 1px, transparent 1px), linear-gradient(90deg, ${blueprint.lineFaint} 1px, transparent 1px)`,
        backgroundSize: "44px 44px",
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 780px 560px at 50% 34%, rgba(60,200,245,0.20), transparent 72%)`,
      }}
    />
    <div style={{ position: "absolute", left: 90, top: 330 }}>
      <CoverWaves />
    </div>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 42, paddingTop: 540 }}>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 900,
          // 132 clipped "MANUFACTURED" at both frame edges; 104 fits with air
          fontSize: 104,
          lineHeight: 1.04,
          textAlign: "center",
          color: blueprint.text,
          letterSpacing: "-0.02em",
        }}
      >
        SILENCE,
        <br />
        <span style={{ color: "#3CC8F5", textShadow: "0 0 70px rgba(60,200,245,0.45)" }}>
          MANUFACTURED
        </span>
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 29,
          letterSpacing: "0.32em",
          marginRight: "-0.32em",
          color: blueprint.second,
          textTransform: "uppercase",
        }}
      >
        they fight noise with noise
      </div>
    </AbsoluteFill>
    <AbsoluteFill
      style={{ background: `radial-gradient(ellipse 92% 78% at 50% 46%, transparent 55%, ${blueprint.vignette} 100%)` }}
    />
  </AbsoluteFill>
);

// 010 — the brass button mid-press with a DEAD grey ring (the machine didn't
// hear it), teal route lines in the corners doing the real thinking.
const CoverButton: React.FC = () => (
  <svg width="620" height="620" viewBox="0 0 620 620">
    {/* dead ring flash — grey, not teal: the press went nowhere */}
    <circle cx="310" cy="310" r="286" fill="none" stroke={lobby.textFaint} strokeWidth="10" opacity="0.45" />
    <circle cx="310" cy="310" r="242" fill="none" stroke={lobby.textFaint} strokeWidth="6" opacity="0.3" />
    {/* plate */}
    <circle cx="310" cy="310" r="200" fill="#E6E0D2" stroke="rgba(45,40,32,0.18)" strokeWidth="5" />
    {/* brass button */}
    <circle cx="310" cy="310" r="162" fill="#C8A24A" stroke="#866224" strokeWidth="9" />
    <circle cx="310" cy="310" r="162" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="4" />
    {/* the >|< glyph */}
    <g stroke="#4A3A14" strokeWidth="17" strokeLinecap="round" fill="none">
      <path d="M232 250 L288 310 L232 370" />
      <path d="M388 250 L332 310 L388 370" />
      <path d="M310 236 L310 384" strokeWidth="13" />
    </g>
  </svg>
);

export const Cover010: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: lobby.bg }}>
    {/* the algorithm, thinking in the corners */}
    <svg width="1080" height="1920" style={{ position: "absolute" }}>
      <g stroke={lobby.accent} strokeWidth="4" fill="none" opacity="0.28" strokeDasharray="16 12">
        <path d="M-20 210 L210 210 L210 470" />
        <path d="M1100 250 L880 250 L880 520" />
        <path d="M-20 1700 L250 1700 L250 1430" />
        <path d="M1100 1660 L840 1660 L840 1400" />
      </g>
    </svg>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 720px 620px at 50% 38%, ${lobby.brandGlow}, transparent 72%)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 230,
        top: 330,
        filter: "drop-shadow(0 26px 40px rgba(40,32,18,0.22))",
      }}
    >
      <CoverButton />
    </div>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40, paddingTop: 640 }}>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 900,
          fontSize: 138,
          lineHeight: 1.02,
          textAlign: "center",
          color: lobby.text,
          letterSpacing: "-0.02em",
        }}
      >
        IT DOES
        <br />
        <span style={{ color: lobby.second }}>NOTHING</span>
      </div>
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 29,
          letterSpacing: "0.32em",
          marginRight: "-0.32em",
          color: lobby.accent,
          textTransform: "uppercase",
        }}
      >
        the close button is a dummy
      </div>
    </AbsoluteFill>
    <AbsoluteFill
      style={{ background: `radial-gradient(ellipse 92% 78% at 50% 46%, transparent 58%, ${lobby.vignette} 100%)` }}
    />
  </AbsoluteFill>
);

// ── 011 · Every Song Is a Constellation ───────────────────────────────────
const COVER_STARS = [
  { x: 0.18, y: 0.22 }, { x: 0.31, y: 0.4 }, { x: 0.46, y: 0.28 },
  { x: 0.58, y: 0.47 }, { x: 0.42, y: 0.61 }, { x: 0.26, y: 0.68 },
  { x: 0.7, y: 0.34 }, { x: 0.8, y: 0.55 }, { x: 0.64, y: 0.72 },
  { x: 0.5, y: 0.83 }, { x: 0.33, y: 0.86 }, { x: 0.86, y: 0.2 },
];
const COVER_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [1, 4], [2, 6],
  [6, 11], [6, 7], [7, 8], [8, 3], [8, 9], [9, 10], [10, 5],
];

const CoverConstellation: React.FC = () => {
  const W = 760;
  const H = 660;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {COVER_EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={COVER_STARS[a].x * W}
          y1={COVER_STARS[a].y * H}
          x2={COVER_STARS[b].x * W}
          y2={COVER_STARS[b].y * H}
          stroke="rgba(125,211,252,0.8)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      ))}
      {COVER_STARS.map((s, i) => {
        // one star carries the match flare — the only red in the image
        const locked = i === 6;
        return (
          <g key={i}>
            <circle cx={s.x * W} cy={s.y * H} r={locked ? 46 : 30} fill={locked ? galaxy.accent : "#EAF2FF"} opacity={locked ? 0.22 : 0.14} />
            <circle cx={s.x * W} cy={s.y * H} r={locked ? 17 : 12} fill={locked ? galaxy.accent : "#EAF2FF"} />
          </g>
        );
      })}
    </svg>
  );
};

export const Cover011: React.FC = () => {
  const stars = makeStars(130, 47);
  return (
    <AbsoluteFill style={{ backgroundColor: galaxy.bg }}>
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse 700px 520px at 22% 22%, rgba(88, 60, 180, 0.16), transparent 70%),
            radial-gradient(ellipse 680px 560px at 78% 74%, rgba(30, 90, 180, 0.13), transparent 70%),
            radial-gradient(ellipse 700px 600px at 50% 40%, ${galaxy.accentGlow}, transparent 74%)
          `,
          opacity: 0.6,
        }}
      />
      <svg width="1080" height="1920" style={{ position: "absolute" }}>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#e8ecf8" opacity={s.o * 0.5} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 160, top: 300, filter: "drop-shadow(0 0 60px rgba(125,211,252,0.35))" }}>
        <CoverConstellation />
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 42, paddingTop: 700 }}>
        <div
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 900,
            fontSize: 104,
            lineHeight: 1.03,
            textAlign: "center",
            color: galaxy.text,
            letterSpacing: "-0.02em",
          }}
        >
          EVERY SONG
          <br />
          IS A
          <br />
          <span style={{ color: galaxy.second, textShadow: "0 0 70px rgba(125,211,252,0.45)" }}>CONSTELLATION</span>
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 29,
            letterSpacing: "0.32em",
            marginRight: "-0.32em",
            color: galaxy.textDim,
            textTransform: "uppercase",
          }}
        >
          how your phone names a song
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 92% 78% at 50% 44%, transparent 56%, ${galaxy.vignette} 100%)` }} />
    </AbsoluteFill>
  );
};

// ── 012 · The 300 MPH Flush ───────────────────────────────────────────────
// 012 cover — the paper diorama itself: layered sky, white cloud cutouts,
// the red papercraft plane with its marked window. Drawn from the episode's
// own kit so the cover IS a frame of the world.
export const Cover012: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: papersky.bg }}>
    <SkyStage />
    <div style={{ position: "absolute", left: 90, top: 300 }}>
      <PaperCloud w={260} />
    </div>
    <div style={{ position: "absolute", left: 700, top: 820 }}>
      <PaperCloud w={300} />
    </div>
    <div style={{ position: "absolute", left: 210, top: 960 }}>
      <PaperCloud w={190} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 420 }}>
      <PaperPlane w={900} markOn={1} />
    </div>
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 42, paddingTop: 560 }}>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 900,
          fontSize: 132,
          lineHeight: 1.02,
          textAlign: "center",
          color: papersky.text,
          letterSpacing: "-0.02em",
          textShadow: "0 6px 18px rgba(24,56,84,0.25)",
        }}
      >
        THE 300 MPH
        <br />
        <span style={{ color: papersky.brand }}>FLUSH</span>
      </div>
      <div
        style={{
          display: "inline-block",
          padding: "12px 30px",
          borderRadius: 12,
          background: "#FFFFFF",
          boxShadow: "0 12px 28px rgba(24,56,84,0.30)",
          fontFamily: FONTS.sans,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: "0.22em",
          marginRight: "-0.22em",
          color: papersky.second,
          textTransform: "uppercase",
        }}
      >
        the sky does the flushing
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
