import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useTheme } from "../themes";

// Theme-driven canvas. Renders the skin's background variant:
// galaxy (starfield + nebula), blueprint (graph-paper grid), or plain.

type Star = { x: number; y: number; r: number; phase: number; speed: number };

const makeStars = (count: number, seed: number): Star[] =>
  Array.from({ length: count }, (_, i) => {
    const h = (n: number) => {
      const s = Math.sin((i + 1) * 127.1 + seed * 311.7 + n * 74.7) * 43758.5453;
      return s - Math.floor(s);
    };
    return {
      x: h(1) * 1080,
      y: h(2) * 1920,
      r: 0.8 + h(3) * 1.8,
      phase: h(4) * Math.PI * 2,
      speed: 0.02 + h(5) * 0.05,
    };
  });

const Galaxy: React.FC<{ glowY: number }> = ({ glowY }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const stars = useMemo(() => makeStars(150, 7), []);
  const drift = frame * 0.02;

  return (
    <>
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(ellipse 700px 500px at 18% 22%, rgba(88, 60, 180, 0.14), transparent 70%),
            radial-gradient(ellipse 620px 520px at 85% 68%, rgba(30, 90, 180, 0.12), transparent 70%),
            radial-gradient(ellipse 600px 520px at 50% ${glowY * 100}%, ${theme.accentGlow}, transparent 74%)
          `,
          opacity: 0.55,
        }}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", top: 0, left: 0 }}>
        {stars.map((s, i) => {
          const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(s.phase + frame * s.speed));
          const y = (s.y + drift * (s.r > 1.8 ? 1.6 : 0.7)) % 1920;
          return (
            <circle
              key={i}
              cx={s.x}
              cy={y}
              r={s.r}
              fill={i % 9 === 0 ? "#aecdff" : i % 13 === 0 ? "#ffd9c9" : "#e8ecf8"}
              opacity={tw * (s.r > 2 ? 0.9 : 0.55)}
            />
          );
        })}
      </svg>
    </>
  );
};

const Blueprint: React.FC<{ glowY: number }> = ({ glowY }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const drift = (frame * 0.06) % 220;
  const fine = "rgba(125, 160, 220, 0.07)";
  const bold = "rgba(125, 160, 220, 0.13)";

  return (
    <>
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${fine} 1px, transparent 1px),
            linear-gradient(90deg, ${fine} 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          backgroundPosition: `${drift * 0.3}px ${drift * 0.2}px`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(${bold} 1px, transparent 1px),
            linear-gradient(90deg, ${bold} 1px, transparent 1px)
          `,
          backgroundSize: "220px 220px",
          backgroundPosition: `${drift * 0.3}px ${drift * 0.2}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 640px 540px at 50% ${glowY * 100}%, ${theme.accentGlow}, transparent 72%)`,
          opacity: 0.22,
        }}
      />
    </>
  );
};

// Light street-map canvas: pastel park + water patches behind a faint white
// road grid, like an out-of-focus city. Everything low-contrast so scene
// content reads on top.
const MapCanvas: React.FC<{ glowY: number }> = ({ glowY }) => {
  const theme = useTheme();
  const road = "rgba(255, 255, 255, 0.75)";
  const casing = "rgba(32, 48, 60, 0.06)";
  const parks: Array<[number, number, number, number]> = [
    [-60, 180, 340, 260],
    [820, 620, 380, 300],
    [120, 1500, 300, 280],
  ];
  return (
    <>
      <svg width="1080" height="1920" style={{ position: "absolute", top: 0, left: 0 }}>
        {/* water */}
        <path
          d="M 1080 1250 Q 900 1330 940 1520 Q 980 1700 1080 1760 Z"
          fill="rgba(178, 214, 240, 0.55)"
        />
        {/* parks */}
        {parks.map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx={46} fill="rgba(196, 224, 182, 0.5)" />
        ))}
        {/* road grid: casing then fill so streets read as streets */}
        {[70, 340, 640, 930].map((x) => (
          <g key={`v${x}`}>
            <rect x={x - 13} y={0} width={26} height={1920} fill={casing} />
            <rect x={x - 9} y={0} width={18} height={1920} fill={road} />
          </g>
        ))}
        {[150, 480, 830, 1180, 1560, 1840].map((y) => (
          <g key={`h${y}`}>
            <rect x={0} y={y - 13} width={1080} height={26} fill={casing} />
            <rect x={0} y={y - 9} width={1080} height={18} fill={road} />
          </g>
        ))}
      </svg>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 640px 540px at 50% ${glowY * 100}%, ${theme.accentGlow}, transparent 72%)`,
          opacity: 0.16,
        }}
      />
    </>
  );
};

// Light warehouse-floor canvas: taped work lanes, soft kraft "packing zones"
// with corner tape marks — an out-of-focus depot floor. Low contrast so the
// cargo (scene content) reads on top.
const DepotFloor: React.FC<{ glowY: number }> = ({ glowY }) => {
  const theme = useTheme();
  const tape = "rgba(37, 49, 58, 0.09)";
  const zones: Array<[number, number, number, number]> = [
    [-80, 260, 400, 300],
    [790, 700, 380, 320],
    [90, 1470, 340, 300],
  ];
  return (
    <>
      <svg width="1080" height="1920" style={{ position: "absolute", top: 0, left: 0 }}>
        {/* packing zones: soft kraft patches with corner tape "L" marks */}
        {zones.map(([x, y, w, h], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} rx={30} fill="rgba(201, 168, 118, 0.14)" />
            {(
              [
                [x + 18, y + 18, 1, 1],
                [x + w - 18, y + 18, -1, 1],
                [x + 18, y + h - 18, 1, -1],
                [x + w - 18, y + h - 18, -1, -1],
              ] as const
            ).map(([cx, cy, sx, sy], k) => (
              <path
                key={k}
                d={`M ${cx + sx * 46} ${cy} L ${cx} ${cy} L ${cx} ${cy + sy * 46}`}
                fill="none"
                stroke="rgba(148, 118, 70, 0.28)"
                strokeWidth="7"
              />
            ))}
          </g>
        ))}
        {/* taped floor lanes */}
        {[140, 560, 1000, 1420, 1800].map((y) => (
          <line
            key={`h${y}`}
            x1="0"
            y1={y}
            x2="1080"
            y2={y}
            stroke={tape}
            strokeWidth="5"
            strokeDasharray="52 34"
          />
        ))}
        {[120, 950].map((x) => (
          <line
            key={`v${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="1920"
            stroke={tape}
            strokeWidth="5"
            strokeDasharray="52 34"
          />
        ))}
      </svg>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 640px 540px at 50% ${glowY * 100}%, ${theme.accentGlow}, transparent 72%)`,
          opacity: 0.14,
        }}
      />
    </>
  );
};

// Deep water column: the canvas IS the depth cue. A vertical gradient from
// dim surface light to black, soft caustic shafts near the top, slow-falling
// marine snow, and a silt seabed behind the caption zone. Everything is low
// contrast so the cable and its light read on top.
const Abyss: React.FC<{ glowY: number }> = ({ glowY }) => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const snow = useMemo(() => makeStars(60, 23), []);

  return (
    <>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, #12384A 0%, #0B2333 24%, #07131C 47%, #050E15 70%, #03090E 100%)",
        }}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <linearGradient id="caustic" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(143, 227, 240, 0.07)" />
            <stop offset="100%" stopColor="rgba(143, 227, 240, 0)" />
          </linearGradient>
        </defs>
        {/* surface caustics — light shafts fanning down from above the frame */}
        {[-260, -120, 40, 190, 330].map((dx, i) => {
          const sway = Math.sin(frame * 0.006 + i * 1.7) * 14;
          const topX = 540 + dx * 0.25 + sway;
          const botX = 540 + dx + sway * 2.2;
          return (
            <path
              key={i}
              d={`M ${topX - 26} -100 L ${topX + 26} -100 L ${botX + 92} 520 L ${botX - 92} 520 Z`}
              fill="url(#caustic)"
            />
          );
        })}
        {/* marine snow — silt falling, deliberately slower than the starfield */}
        {snow.map((p, i) => {
          const y = (p.y + frame * 0.18 * (p.r > 1.8 ? 1.5 : 1)) % 1920;
          return (
            <circle
              key={i}
              cx={p.x}
              cy={y}
              r={p.r * 0.85}
              fill="rgba(214, 234, 244, 0.34)"
              opacity={0.25 + 0.5 * (0.5 + 0.5 * Math.sin(p.phase + frame * p.speed * 0.4))}
            />
          );
        })}
        {/* seabed — pure depth cueing, sits behind the caption zone */}
        <path
          d="M 0 1620 Q 240 1546, 520 1580 Q 800 1614, 1080 1552 L 1080 1920 L 0 1920 Z"
          fill="#1A2A2E"
        />
        <path
          d="M 0 1620 Q 240 1546, 520 1580 Q 800 1614, 1080 1552"
          fill="none"
          stroke="rgba(180, 214, 232, 0.12)"
          strokeWidth="2"
        />
      </svg>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 640px 540px at 50% ${glowY * 100}%, ${theme.accentGlow}, transparent 72%)`,
          opacity: 0.18,
        }}
      />
    </>
  );
};

export const Background: React.FC<{ glowY?: number }> = ({ glowY = 0.42 }) => {
  const theme = useTheme();
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {theme.background.kind === "galaxy" ? <Galaxy glowY={glowY} /> : null}
      {theme.background.kind === "blueprint" ? <Blueprint glowY={glowY} /> : null}
      {theme.background.kind === "map" ? <MapCanvas glowY={glowY} /> : null}
      {theme.background.kind === "depot" ? <DepotFloor glowY={glowY} /> : null}
      {theme.background.kind === "abyss" ? <Abyss glowY={glowY} /> : null}
      {theme.background.kind === "plain" ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 640px 540px at 50% ${glowY * 100}%, ${theme.accentGlow}, transparent 72%)`,
            opacity: 0.3,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 92% 78% at 50% 45%, transparent 55%, ${theme.vignette} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
