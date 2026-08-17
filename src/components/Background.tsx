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

export const Background: React.FC<{ glowY?: number }> = ({ glowY = 0.42 }) => {
  const theme = useTheme();
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      {theme.background.kind === "galaxy" ? <Galaxy glowY={glowY} /> : null}
      {theme.background.kind === "blueprint" ? <Blueprint glowY={glowY} /> : null}
      {theme.background.kind === "map" ? <MapCanvas glowY={glowY} /> : null}
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
