import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { CountUp, RiseIn, useEnter } from "../../../components/ui";
import {
  Cable,
  Chip,
  DepthGauge,
  Grapnel,
  HULL,
  Pulse,
  SHEATH,
  STEEL,
  SeabedLine,
  Ship,
  SiltPuff,
  Stamp,
  hash,
} from "./kit";

// Scene 4 (~19s): the payoff. Two images have to land — fishing BLIND in the
// dark, and a human hand splicing glass — so everything else is transit. The
// long grapnel descent is doing real work: it's the only thing that sells four
// kilometres. The deck is the one warm-dominant moment in the whole episode.

const DECK_IN = 246;
const FLEET_IN = 350;

export const Fix: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // --- act 1: the water column
  const water = interpolate(frame, [DECK_IN, DECK_IN + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const descent = interpolate(frame, [43, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  });
  const hookY = 516 + descent * 584;
  const dragX = interpolate(frame, [140, 183], [260, 640], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taut = frame >= 183;
  const jerk = interpolate(frame, [183, 192, 200], [0, -22, -8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const haul = interpolate(frame, [196, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 2),
  });
  // single source of truth for the hook — the winch line hangs from the ship
  // to THIS point, so it can never detach or overshoot
  const hookX = frame >= 140 ? dragX : 540;
  const hookTop = hookY + jerk - haul * 540;

  // --- act 2: the deck
  const deck = interpolate(frame, [DECK_IN + 8, DECK_IN + 20, FLEET_IN - 10, FLEET_IN + 2], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const handsIn = useEnter(DECK_IN + 22);

  // --- act 3: the fleet
  const fleet = interpolate(frame, [FLEET_IN + 8, FLEET_IN + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fleetDim = interpolate(frame, [420, 442], [1, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const closing = useEnter(430);
  const mendedPulse = ((frame % 34) / 34 + 1) % 1;

  return (
    <AbsoluteFill>
      {/* ------------------------------------------------ act 1: the descent */}
      <AbsoluteFill style={{ opacity: water }}>
        <SeabedLine y={1160} />

        <div style={{ position: "absolute", left: 100, top: 440 }}>
          <DepthGauge h={740} progress={descent} />
        </div>
        <div style={{ position: "absolute", left: 196, top: 440 + descent * 740 - 44 }}>
          <CountUp
            to={4000}
            delay={43}
            durationFrames={90}
            style={{ fontSize: 34, color: theme.second, letterSpacing: "0.04em" }}
          />
          <span style={{ fontFamily: FONTS.mono, fontSize: 34, color: theme.second }}> m</span>
        </div>

        {/* the cut cable waiting on the floor — lifts away as the haul starts */}
        <div style={{ position: "absolute", left: -60, top: 1176, opacity: 1 - haul * 0.85 }}>
          <Cable w={1200} thickness={24} broken={1} />
        </div>

        <div style={{ position: "absolute", left: 440, top: 424 }}>
          <Ship w={200} lights gantry />
        </div>

        {/* the hook line, and the hook itself */}
        <div
          style={{
            position: "absolute",
            left: hookX - 1.5,
            top: 516,
            width: 3,
            height: Math.max(0, hookTop - 372),
            background: taut ? theme.second : theme.textFaint,
            opacity: taut ? 0.8 : 0.55,
          }}
        />
        <div style={{ position: "absolute", left: hookX - 38, top: hookTop }}>
          <Grapnel w={76} taut={taut} />
        </div>

        {/* silt kicked up along the drag */}
        {[150, 165, 178].map((f, i) => (
          <SiltPuff
            key={i}
            x={interpolate(f, [140, 183], [260, 640])}
            y={1196}
            age={frame - f}
          />
        ))}

        {/* the recovered ends hang from the hook as it winches up */}
        {haul > 0 ? (
          <div
            style={{
              position: "absolute",
              left: hookX - 90,
              top: hookTop + 58,
              opacity: Math.min(1, haul * 4),
            }}
          >
            <svg width="180" height="130" style={{ overflow: "visible" }}>
              {([-1, 1] as const).map((side) => (
                <g key={side} transform={`rotate(${side * 34} 90 0)`}>
                  <rect x={82} y={0} width={16} height={96} rx={8} fill={SHEATH} />
                  <rect x={82} y={0} width={16} height={5} fill={STEEL} opacity={0.7} />
                  {[-4, 0, 4].map((dx, i) => (
                    <line
                      key={i}
                      x1={90 + dx}
                      y1={96}
                      x2={90 + dx * 2.4}
                      y2={110 + i * 3}
                      stroke={theme.accentDim}
                      strokeWidth="2"
                    />
                  ))}
                </g>
              ))}
            </svg>
          </div>
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 548,
            textAlign: "center",
            opacity: interpolate(frame, [8, 26, 128, 146], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Stamp fontSize={44} rotate={-1.8} color={theme.second}>
            four kilometres down
          </Stamp>
        </div>
        <RiseIn
          delay={152}
          style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center" }}
        >
          <div
            style={{
              opacity: interpolate(frame, [176, 192], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <Chip color={theme.second}>fishing blind</Chip>
          </div>
        </RiseIn>
      </AbsoluteFill>

      {/* --------------------------------------------------- act 2: the deck */}
      <AbsoluteFill style={{ opacity: deck }}>
        {/* opaque panel — this is a hard cut to the deck, not a dissolve over
            the water, so the caustics must not show through */}
        <AbsoluteFill style={{ background: "#0A1720" }} />
        {/* the one warm-dominant frame in the episode */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 760px 660px at 50% 46%, ${theme.secondDim}, transparent 74%)`,
            opacity: 0.34,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 452,
            textAlign: "center",
            transform: `scale(${0.94 + 0.06 * handsIn})`,
          }}
        >
          <Stamp fontSize={54} rotate={1.5} color={theme.second}>
            by hand
          </Stamp>
        </div>

        <svg width="1080" height="520" style={{ position: "absolute", left: 0, top: 640 }}>
          {/* the two cable ends on the bench */}
          <rect x="0" y="196" width="330" height="46" rx="23" fill={SHEATH} />
          <rect x="750" y="196" width="330" height="46" rx="23" fill={SHEATH} />
          <rect x="300" y="204" width="34" height="30" rx="6" fill={STEEL} opacity={0.6} />
          <rect x="746" y="204" width="34" height="30" rx="6" fill={STEEL} opacity={0.6} />

          {/* eight fiber pairs, fused one at a time */}
          {Array.from({ length: 8 }, (_, i) => {
            const at = DECK_IN + 28 + i * 9;
            const done = frame >= at;
            const spark = interpolate(frame, [at, at + 2, at + 6], [0, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const y = 219 + (i - 3.5) * 15;
            return (
              <g key={i}>
                <line x1="334" y1={y} x2={done ? 540 : 470} y2={done ? y : y + 4} stroke={theme.accent} strokeWidth="2.5" opacity={done ? 1 : 0.45} />
                <line x1="746" y1={y} x2={done ? 540 : 610} y2={done ? y : y - 4} stroke={theme.accent} strokeWidth="2.5" opacity={done ? 1 : 0.45} />
                <circle cx="540" cy={y} r={4 + spark * 16} fill="#FFFFFF" opacity={spark} />
                {done ? <circle cx="540" cy={y} r="3.5" fill={theme.accent} /> : null}
              </g>
            );
          })}

          {/* the hands — mitts reaching in from the bottom corners, finger
              grooves at the tip, warm rim light along the top edge */}
          <g opacity={handsIn}>
            {([-1, 1] as const).map((side) => {
              const cx = 540 + side * 132;
              return (
                <g key={side} transform={`translate(${cx} 268) rotate(${side * 26})`}>
                  <path
                    d="M -54 210 L -54 46 Q -54 6, -16 4 L 20 2 Q 56 4, 56 44 L 56 210 Z"
                    fill={HULL}
                  />
                  <path
                    d="M -54 46 Q -54 6, -16 4 L 20 2 Q 56 4, 56 44"
                    fill="none"
                    stroke={theme.second}
                    strokeWidth="3.5"
                    opacity={0.7}
                  />
                  {[-24, 0, 24].map((dx) => (
                    <line
                      key={dx}
                      x1={dx}
                      y1={10}
                      x2={dx}
                      y2={62}
                      stroke="#0A1720"
                      strokeWidth="3"
                      opacity={0.55}
                    />
                  ))}
                </g>
              );
            })}
          </g>
        </svg>

        <RiseIn
          delay={DECK_IN + 38}
          style={{ position: "absolute", left: 0, right: 0, top: 1236, textAlign: "center" }}
        >
          <Chip color={theme.second}>one fiber at a time</Chip>
        </RiseIn>
      </AbsoluteFill>

      {/* -------------------------------------------------- act 3: the fleet */}
      <AbsoluteFill style={{ opacity: fleet }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center" }}>
          <CountUp
            to={60}
            delay={FLEET_IN + 14}
            durationFrames={34}
            style={{ fontSize: 132, fontWeight: 800, color: theme.second, lineHeight: 1 }}
          />
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 30,
              letterSpacing: "0.3em",
              color: theme.textDim,
              marginTop: 10,
            }}
          >
            REPAIR SHIPS
          </div>
        </div>

        <div style={{ position: "absolute", left: 0, top: 0, opacity: fleetDim, filter: "brightness(2)" }}>
          {Array.from({ length: 60 }, (_, i) => {
            const col = i % 10;
            const row = Math.floor(i / 10);
            const at = FLEET_IN + 22 + i * 0.5;
            const p = interpolate(frame, [at, at + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 108 + col * 88 + (hash(i, 5, 1) - 0.5) * 6,
                  top: 636 + row * 62 + (hash(i, 5, 2) - 0.5) * 6,
                  opacity: p,
                  transform: `scale(${0.7 + 0.3 * p})`,
                }}
              >
                <Ship w={44} />
              </div>
            );
          })}
        </div>

        <RiseIn
          delay={FLEET_IN + 40}
          style={{ position: "absolute", left: 0, right: 0, top: 1046, textAlign: "center" }}
        >
          <Chip>for the whole planet</Chip>
        </RiseIn>

        {/* the mended cable, carrying light again */}
        <div style={{ position: "absolute", left: -60, top: 1168, opacity: closing }}>
          <Cable w={1200} thickness={24} glow />
        </div>
        <div style={{ opacity: closing }}>
          <Pulse
            w={1200}
            t={mendedPulse}
            count={3}
            style={{ position: "absolute", left: -60, top: 1181 }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1246,
            textAlign: "center",
            opacity: closing,
            transform: `scale(${0.94 + 0.06 * closing})`,
          }}
        >
          <Stamp fontSize={44} rotate={-1.4}>
            held together by boats
          </Stamp>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
