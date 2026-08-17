import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { CountUp, MonoLabel, RiseIn } from "../../../components/ui";
import { Car, CAR_COLORS, Chip, SignalRings, TopCar } from "./carto";

// Scene 2 (~27s): top-down street grid. Every car pings its location+speed.
// Beat 1: anonymous pings. Beat 2: one phone is noise, millions are a map.
// Beat 3: fast road paints green, crawling road paints red — with the happy
// 60 km/h car vs the grumpy 5 km/h car.

const ROAD_TOP = 620; // eastbound, stays smooth
const ROAD_BOT = 960; // westbound, jams up
const V_ROADS = [250, 830];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Probes: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // beat boundaries (frames)
  const SOLO = { dim: 200, undim: 300 };
  const TRAFFIC = 430; // roads start taking color

  const dimOthers =
    interpolate(frame, [SOLO.dim, SOLO.dim + 26], [1, 0.18], clamp) +
    interpolate(frame, [SOLO.undim, SOLO.undim + 26], [0, 0.82], clamp);

  const greenIn = interpolate(frame, [TRAFFIC, TRAFFIC + 50], [0, 1], clamp);
  const redIn = interpolate(frame, [TRAFFIC + 60, TRAFFIC + 130], [0, 1], clamp);
  const jamBlend = interpolate(frame, [TRAFFIC + 40, TRAFFIC + 150], [0, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 2),
  });

  // top road: eastbound cruisers (wrap around)
  const topCars = [0, 1, 2].map((i) => ({
    x: ((i * 420 + frame * 3.4) % 1360) - 140,
    color: CAR_COLORS[i % 5],
    hero: i === 1,
  }));

  // bottom road: westbound; after TRAFFIC they compress into a queue
  const botCars = [0, 1, 2, 3].map((i) => {
    const cruise = 1180 + i * 150 - frame * 1.15;
    const queued = 330 + i * 78;
    return { x: cruise + (queued - cruise) * jamBlend, color: CAR_COLORS[(i + 2) % 5] };
  });

  // vertical connector cars
  const vCars = V_ROADS.map((x, i) => ({
    x,
    y: ((i * 300 + frame * (2.2 + i)) % 900) + 480,
  }));

  const swarmIn = interpolate(frame, [SOLO.undim, SOLO.undim + 40], [0, 0.9], clamp);

  return (
    <AbsoluteFill>
      {/* the grid */}
      <svg width="1080" height="1920" style={{ position: "absolute" }}>
        {[ROAD_TOP, ROAD_BOT].map((y) => (
          <g key={y}>
            <rect x="0" y={y - 40} width="1080" height="80" fill="rgba(32,48,60,0.08)" />
            <rect x="0" y={y - 34} width="1080" height="68" fill="#FFFFFF" />
            <line x1="0" y1={y} x2="1080" y2={y} stroke="rgba(32,48,60,0.16)" strokeWidth="3" strokeDasharray="26 30" />
          </g>
        ))}
        {V_ROADS.map((x) => (
          <g key={x}>
            <rect x={x - 34} y={440} width="68" height="960" fill="rgba(32,48,60,0.08)" />
            <rect x={x - 28} y={440} width="56" height="960" fill="#FFFFFF" />
          </g>
        ))}
        {/* traffic paint — color plus a label, never color alone */}
        <rect x="0" y={ROAD_TOP - 26} width="1080" height="52" rx="26" fill={theme.good} opacity={greenIn * 0.5} />
        <rect x="0" y={ROAD_BOT - 26} width="1080" height="52" rx="26" fill={theme.brand} opacity={redIn * 0.55} />
        {/* probe swarm: the city as moving dots */}
        {swarmIn > 0.01
          ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => {
              const onTop = i % 2 === 0;
              const x = ((i * 173 + frame * (onTop ? 2.6 : 1.4)) % 1180) - 50;
              return (
                <circle
                  key={i}
                  cx={onTop ? x : 1080 - x}
                  cy={(onTop ? ROAD_TOP : ROAD_BOT) + (i % 3 - 1) * 14}
                  r="7"
                  fill={theme.accent}
                  opacity={swarmIn * 0.75}
                />
              );
            })
          : null}
      </svg>

      {/* cars */}
      {vCars.map((c, i) => (
        <div key={`v${i}`} style={{ position: "absolute", left: c.x - 16, top: c.y, opacity: dimOthers }}>
          <TopCar color={CAR_COLORS[(i + 3) % 5]} angle={90} />
        </div>
      ))}
      {topCars.map((c, i) => (
        <div key={`t${i}`} style={{ position: "absolute", left: c.x, top: ROAD_TOP - 16, opacity: c.hero ? 1 : dimOthers }}>
          <TopCar color={c.color} />
          {frame % 46 < 40 ? (
            <SignalRings x={29} y={16} size={46} phase={i * 17} />
          ) : null}
        </div>
      ))}
      {botCars.map((c, i) => (
        <div key={`b${i}`} style={{ position: "absolute", left: c.x, top: ROAD_BOT - 16, opacity: i === 0 ? 1 : dimOthers }}>
          <TopCar color={c.color} angle={180} />
          <SignalRings x={29} y={16} size={42} phase={i * 23 + 9} />
        </div>
      ))}

      {/* what's being reported */}
      <RiseIn delay={36} style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center" }}>
        <Chip>where · how fast</Chip>
      </RiseIn>
      {frame < TRAFFIC ? (
        <RiseIn delay={120} style={{ position: "absolute", top: 1180, left: 0, right: 0, textAlign: "center" }}>
          <Chip>anonymous · every few seconds</Chip>
        </RiseIn>
      ) : null}

      {/* one vs millions */}
      {frame >= SOLO.dim && frame < SOLO.undim + 30 ? (
        <RiseIn delay={SOLO.dim + 10} style={{ position: "absolute", top: 1270, left: 0, right: 0, textAlign: "center" }}>
          <Chip color={theme.textDim}>1 phone ≈ noise</Chip>
        </RiseIn>
      ) : null}
      {frame >= SOLO.undim + 20 && frame < TRAFFIC + 40 ? (
        <RiseIn delay={SOLO.undim + 30} style={{ position: "absolute", top: 1270, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 52, color: theme.text }}>
            millions = <span style={{ color: theme.accent }}>a live speed map</span>
          </div>
          <MonoLabel style={{ marginTop: 14, fontSize: 24 }}>
            <CountUp to={2400000} delay={SOLO.undim + 40} durationFrames={70} /> probes / min
          </MonoLabel>
        </RiseIn>
      ) : null}

      {/* the 60 vs 5 gag */}
      {frame >= TRAFFIC + 20 ? (
        <>
          <RiseIn delay={TRAFFIC + 24} style={{ position: "absolute", left: 96, top: 1250, textAlign: "center" }}>
            <Car color={CAR_COLORS[1]} w={170} face="happy" />
            <Chip color={theme.good} style={{ marginTop: 8 }}>60 · smooth</Chip>
          </RiseIn>
          <RiseIn delay={TRAFFIC + 78} style={{ position: "absolute", right: 96, top: 1250, textAlign: "center" }}>
            <Car color={CAR_COLORS[2]} w={170} face="grumpy" />
            <Chip color={theme.brand} style={{ marginTop: 8 }}>5 · jam</Chip>
          </RiseIn>
        </>
      ) : null}
      {redIn > 0.6 ? (
        <div style={{ position: "absolute", left: 40, top: ROAD_BOT - 110 }}>
          <Chip color={theme.brand}>jam detected</Chip>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
