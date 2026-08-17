import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { Card, MonoLabel, RiseIn } from "../../../components/ui";
import { Chip, TopCar, CAR_COLORS } from "./carto";

// Scene 3 (~26s): NOW (live probes) + HISTORY (how this road usually behaves)
// merge into a prediction — a blue route that bends around a jam before you
// reach it. Then the loop: rerouted cars visibly drain the jam.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The route inside the map card (viewBox 880x700, drawn bottom → top):
// up the main road, right at the connector, up the parallel road, back left.
const PTS: Array<[number, number]> = [
  [330, 700],
  [330, 520],
  [640, 520],
  [640, 140],
  [330, 140],
  [330, 10],
];
const SEGS = PTS.slice(1).map((p, i) => {
  const [x0, y0] = PTS[i];
  return { x0, y0, x1: p[0], y1: p[1], len: Math.abs(p[0] - x0) + Math.abs(p[1] - y0) };
});
const ROUTE_LEN = SEGS.reduce((n, s) => n + s.len, 0);

const routePoint = (dist: number): { x: number; y: number; angle: number } => {
  let d = Math.max(0, Math.min(dist, ROUTE_LEN - 0.01));
  for (const s of SEGS) {
    if (d <= s.len) {
      const t = d / s.len;
      const x = s.x0 + (s.x1 - s.x0) * t;
      const y = s.y0 + (s.y1 - s.y0) * t;
      const angle = Math.abs(s.x1 - s.x0) > 0 ? (s.x1 > s.x0 ? 0 : 180) : s.y1 > s.y0 ? 90 : -90;
      return { x, y, angle };
    }
    d -= s.len;
  }
  return { x: PTS[5][0], y: PTS[5][1], angle: -90 };
};

const pathD = `M ${PTS.map(([x, y]) => `${x} ${y}`).join(" L ")}`;

export const Brain: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const squeeze = interpolate(frame, [150, 210], [0, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  const draw = interpolate(frame, [300, 440], [0, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 2),
  });
  const heroDist = interpolate(frame, [450, 580], [0, ROUTE_LEN], clamp);
  const hero = routePoint(heroDist);

  // the loop: rerouted followers + the jam draining red → orange
  const drain = interpolate(frame, [580, 720], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      {/* NOW + HISTORY */}
      <div style={{ position: "absolute", top: 380, display: "flex", gap: interpolate(squeeze, [0, 1], [48, 20]) }}>
        <RiseIn delay={10}>
          <Card style={{ width: 400, padding: 26, transform: `translateX(${squeeze * 12}px)` }}>
            <MonoLabel style={{ fontSize: 22, color: theme.accent }}>now · live probes</MonoLabel>
            <svg width="348" height="120" viewBox="0 0 348 120">
              <rect x="0" y="46" width="348" height="30" rx="15" fill="#EFF3F1" stroke={theme.lineFaint} strokeWidth="2" />
              {[0, 1, 2, 3, 4].map((i) => (
                <circle
                  key={i}
                  cx={30 + i * 72 + Math.sin(frame / 9 + i) * 8}
                  cy="61"
                  r="9"
                  fill={theme.accent}
                  opacity={0.55 + 0.45 * Math.abs(Math.sin(frame / 7 + i * 1.3))}
                />
              ))}
            </svg>
          </Card>
        </RiseIn>
        <RiseIn delay={64}>
          <Card style={{ width: 400, padding: 26, transform: `translateX(${-squeeze * 12}px)` }}>
            <MonoLabel style={{ fontSize: 22, color: theme.second }}>history · years</MonoLabel>
            <svg width="348" height="120" viewBox="0 0 348 120">
              {[0, 1, 2, 3, 4, 5, 6].map((c) =>
                [0, 1, 2].map((r) => {
                  const busy = (c * 7 + r * 3) % 5; // deterministic "usual traffic"
                  return (
                    <rect
                      key={`${c}-${r}`}
                      x={8 + c * 40}
                      y={14 + r * 34}
                      width="30"
                      height="24"
                      rx="5"
                      fill={theme.second}
                      opacity={0.12 + busy * 0.16}
                    />
                  );
                })
              )}
              <text x="290" y="108" fontFamily={FONTS.mono} fontSize="19" fill={theme.textDim} textAnchor="end">
                tue · 6pm · rain
              </text>
            </svg>
          </Card>
        </RiseIn>
      </div>

      {/* merge arrow */}
      <RiseIn delay={190} style={{ position: "absolute", top: 646 }}>
        <svg width="60" height="70" viewBox="0 0 60 70">
          <line x1="30" y1="0" x2="30" y2="46" stroke={theme.accent} strokeWidth="6" strokeLinecap="round" />
          <path d="M14 40 L30 62 L46 40" fill="none" stroke={theme.accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </RiseIn>

      {/* prediction map */}
      <RiseIn delay={230} style={{ position: "absolute", top: 690 }}>
        <Card accent style={{ width: 940, padding: 30 }}>
          <MonoLabel style={{ fontSize: 22, color: theme.accent, marginBottom: 8 }}>prediction</MonoLabel>
          <svg width="880" height="700" viewBox="0 0 880 700">
            {/* streets */}
            {[
              { x: 296, y: 0, w: 68, h: 700 },
              { x: 606, y: 106, w: 68, h: 448 },
            ].map((r, i) => (
              <g key={i}>
                <rect x={r.x - 5} y={r.y} width={r.w + 10} height={r.h} fill="rgba(32,48,60,0.08)" />
                <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="#FFFFFF" />
              </g>
            ))}
            {[
              { x: 296, y: 486, w: 378, h: 68 },
              { x: 296, y: 106, w: 378, h: 68 },
            ].map((r, i) => (
              <g key={`h${i}`}>
                <rect x={r.x} y={r.y - 5} width={r.w} height={r.h + 10} fill="rgba(32,48,60,0.08)" />
                <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="#FFFFFF" />
              </g>
            ))}
            {/* the jam on the main road, red draining to orange as cars reroute */}
            <rect x="304" y="180" width="52" height="290" rx="26" fill={theme.brand} opacity={0.85 * (1 - drain)} />
            <rect x="304" y="180" width="52" height="290" rx="26" fill={theme.warn} opacity={0.7 * drain} />
            {/* stuck cars fading away as the jam drains */}
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(314 ${210 + i * 78}) rotate(0)`} opacity={1 - drain}>
                <rect width="32" height="17" rx="6" fill={CAR_COLORS[(i + 1) % 5]} transform="rotate(-90 16 8.5)" />
              </g>
            ))}
            {/* blue route drawing around it */}
            <path
              d={pathD}
              fill="none"
              stroke={theme.accent}
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={ROUTE_LEN}
              strokeDashoffset={ROUTE_LEN * (1 - draw)}
              opacity={draw > 0 ? 0.9 : 0}
            />
          </svg>
          {/* hero + rerouted followers riding the route */}
          {[0, 1, 2].map((i) => {
            const dist =
              i === 0
                ? heroDist
                : interpolate(frame, [560 + i * 45, 700 + i * 45], [0, ROUTE_LEN], clamp);
            if (i > 0 && (frame < 560 + i * 45 || dist <= 0)) return null;
            const p = routePoint(dist);
            return (
              <div key={i} style={{ position: "absolute", left: 30 + p.x - 29, top: 98 + p.y - 16, opacity: i === 0 && frame < 450 ? 0 : 1 }}>
                <TopCar color={i === 0 ? CAR_COLORS[0] : CAR_COLORS[(i + 3) % 5]} angle={p.angle} />
              </div>
            );
          })}
        </Card>
      </RiseIn>

      {/* beat labels */}
      {frame >= 320 && frame < 560 ? (
        <RiseIn delay={320} style={{ position: "absolute", top: 1466 }}>
          <Chip color={theme.brand}>jam predicted · before you arrive</Chip>
        </RiseIn>
      ) : null}
      {frame >= 600 ? (
        <RiseIn delay={600} style={{ position: "absolute", top: 1458, textAlign: "center" }}>
          <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 48, color: theme.text }}>
            rerouting <span style={{ color: theme.accent }}>reshapes</span> traffic
          </div>
        </RiseIn>
      ) : null}
    </AbsoluteFill>
  );
};
