import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import { MonoLabel, RiseIn, useEnter } from "../../../components/ui";
import { Car, CAR_COLORS, Chip, HandcartWalker, Phone, SideRoad, SignalRings, Stamp, INK } from "./carto";

// Scene 1 (~12.5s): a nav-phone showing a route hitting a red jam opens the
// scene — the instantly-recognizable "Maps traffic" image, so the subject
// reads with the sound off. It flies away as the debunk beat takes over:
// "no cameras" and "no road sensors" get stamped out; the hero car stops and
// a glowing phone rises out of it — the sensor is you. A tiny handcart scoots
// past as a tease.

const Cloud: React.FC<{ x: number; y: number; s?: number; drift?: number }> = ({
  x,
  y,
  s = 1,
  drift = 0.14,
}) => {
  const frame = useCurrentFrame();
  return (
    <svg
      width={200 * s}
      height={80 * s}
      viewBox="0 0 200 80"
      style={{ position: "absolute", left: x + frame * drift, top: y, opacity: 0.85 }}
    >
      <ellipse cx="60" cy="52" rx="52" ry="26" fill="#FFFFFF" />
      <ellipse cx="110" cy="40" rx="46" ry="30" fill="#FFFFFF" />
      <ellipse cx="152" cy="54" rx="42" ry="22" fill="#FFFFFF" />
    </svg>
  );
};

// A "not this" card: icon with a red slash, popped in with a spring.
const DebunkCard: React.FC<{
  delay: number;
  label: string;
  x: number;
  y: number;
  icon: React.ReactNode;
}> = ({ delay, label, x, y, icon }) => {
  const theme = useTheme();
  const p = useEnter(delay, { damping: 11 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${p})`,
        transformOrigin: "center",
        background: theme.card,
        border: `1.5px solid ${theme.cardBorder}`,
        borderRadius: 18,
        boxShadow: theme.cardShadow,
        padding: "22px 26px 16px",
        textAlign: "center",
      }}
    >
      <div style={{ position: "relative", display: "inline-block" }}>
        {icon}
        <svg width="110" height="110" viewBox="0 0 110 110" style={{ position: "absolute", inset: 0 }}>
          <circle cx="55" cy="55" r="49" fill="none" stroke={theme.brand} strokeWidth="7" />
          <line x1="21" y1="21" x2="89" y2="89" stroke={theme.brand} strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>
      <MonoLabel style={{ fontSize: 22, marginTop: 10, color: theme.text }}>{label}</MonoLabel>
    </div>
  );
};

// The opening nav-phone: same map language as the Payoff city (white rounded
// roads, accent probe dots), route in accent blue hitting a brand-red jam.
const NavPhone: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const jamPulse = 0.72 + 0.28 * Math.abs(Math.sin(frame / 9));
  return (
    <div
      style={{
        width: 250,
        height: 456,
        borderRadius: 54,
        background: INK,
        padding: 22,
        boxShadow: `0 0 110px ${theme.accentGlow}, ${theme.cardShadow}`,
      }}
    >
      <div style={{ width: "100%", height: "100%", borderRadius: 34, overflow: "hidden", background: "#F2F5F0" }}>
        <svg width="206" height="412" viewBox="0 0 206 412">
          {/* roads, same language as the payoff city map */}
          <rect x="50" y="-10" width="32" height="432" rx="16" fill="#FFFFFF" stroke="rgba(32,48,60,0.09)" strokeWidth="2" />
          <rect x="136" y="-10" width="24" height="432" rx="12" fill="#FFFFFF" stroke="rgba(32,48,60,0.09)" strokeWidth="2" />
          <rect x="-10" y="198" width="226" height="32" rx="16" fill="#FFFFFF" stroke="rgba(32,48,60,0.09)" strokeWidth="2" />
          {/* free-flowing probe dots on the cross street */}
          {[0, 1].map((i) => {
            const cx = ((frame * 1.2 + i * 105) % 226 + 226) % 226 - 10;
            return <circle key={i} cx={cx} cy={214} r={5.5} fill={theme.accent} opacity={0.45} />;
          })}
          {/* the route: blue... until the jam */}
          <path
            d="M 66 396 L 66 214 L 148 214 L 148 152"
            fill="none"
            stroke={theme.accent}
            strokeWidth={14}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 148 152 L 148 62"
            fill="none"
            stroke={theme.brand}
            strokeWidth={14}
            strokeLinecap="round"
            opacity={jamPulse}
          />
          {/* stuck cars crawling on the red stretch */}
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={141}
              y={64 + i * 30 + Math.sin(frame / 9 + i * 2) * 1.5}
              width={14}
              height={20}
              rx={5}
              fill={CAR_COLORS[(i + 2) % 5]}
            />
          ))}
          {/* destination pin + you-dot */}
          <circle cx="148" cy="54" r="13" fill={theme.brand} />
          <circle cx="148" cy="54" r="4.5" fill="#FFFFFF" />
          <circle cx="66" cy="396" r="10" fill={theme.accent} stroke="#FFFFFF" strokeWidth="3.5" />
        </svg>
      </div>
    </div>
  );
};

export const Hook: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // hero car: rolls in from the left, eases to a stop center-stage
  const heroX = interpolate(frame, [130, 215], [-320, 380], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const heroBob = Math.sin(frame / 4) * (frame < 215 ? 2.5 : 0.8);

  // phone rises out of the hero car
  const phoneUp = useEnter(228, { damping: 12 });

  // opening nav-phone: springs in immediately, flies up and away as the
  // "sensor is you" beat takes over (right before the car's phone rises)
  const navIn = useEnter(4, { damping: 11 });
  const navOut = interpolate(frame, [204, 236], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t,
  });

  // handcart tease scooting right-to-left along the road
  const teaseX = interpolate(frame, [312, 372], [1140, -420], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Cloud x={80} y={380} s={1.1} />
      <Cloud x={620} y={470} s={0.8} drift={-0.1} />

      {/* opening beat: the recognizable "traffic on the map" phone */}
      {navOut < 1 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1 - navOut,
            transform: `translateY(${-navOut * 380}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 415,
              top: 330,
              transform: `scale(${navIn}) rotate(-3deg)`,
              transformOrigin: "center",
            }}
          >
            <NavPhone />
          </div>
          <RiseIn delay={26} style={{ position: "absolute", left: 322, top: 756 }}>
            <Chip color={theme.brand} style={{ fontWeight: 700, transform: "rotate(3deg)" }}>
              heavy traffic
            </Chip>
          </RiseIn>
        </div>
      ) : null}

      <SideRoad y={1080} />
      {/* far-lane background traffic (smaller, keeps moving the whole scene) */}
      {[0, 1].map((i) => {
        const x = (((frame * (3.2 + i * 1.1) + i * 560) % 1500) + 1500) % 1500 - 210;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 1006, opacity: 0.8 }}>
            <Car color={CAR_COLORS[(i * 2 + 1) % 5]} w={120} />
          </div>
        );
      })}
      {/* hero car, near lane */}
      <div style={{ position: "absolute", left: heroX, top: 1042, transform: `translateY(${heroBob}px)` }}>
        <Car color={CAR_COLORS[0]} w={200} />
      </div>

      {/* debunk cards */}
      <DebunkCard
        delay={48}
        label="no cameras"
        x={96}
        y={460}
        icon={
          <svg width="110" height="110" viewBox="0 0 110 110">
            <rect x="20" y="34" width="52" height="36" rx="8" fill={INK} />
            <path d="M72 44 L94 34 L94 70 L72 60 Z" fill={INK} />
            <circle cx="40" cy="52" r="9" fill="#B9C4CC" />
          </svg>
        }
      />
      <DebunkCard
        delay={112}
        label="no road sensors"
        x={700}
        y={560}
        icon={
          <svg width="110" height="110" viewBox="0 0 110 110">
            <rect x="18" y="60" width="74" height="16" rx="4" fill="#DFE5E8" stroke={INK} strokeWidth="2.5" />
            <rect x="44" y="64" width="22" height="8" rx="3" fill={theme.second} />
            <path d="M42 48 Q55 36 68 48" stroke={theme.second} strokeWidth="4" fill="none" />
            <path d="M34 40 Q55 20 76 40" stroke={theme.second} strokeWidth="4" fill="none" opacity="0.55" />
          </svg>
        }
      />

      {/* the sensor is you */}
      <div
        style={{
          position: "absolute",
          left: heroX + 62,
          top: 880,
          opacity: phoneUp,
          transform: `translateY(${interpolate(phoneUp, [0, 1], [70, 0])}px)`,
        }}
      >
        <Phone w={64} />
      </div>
      {frame >= 240 ? <SignalRings x={heroX + 94} y={870} size={72} /> : null}

      <RiseIn delay={252} style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center" }}>
        <Stamp fontSize={38} rotate={2}>
          the sensor... <span style={{ color: theme.accent }}>is you</span>
        </Stamp>
      </RiseIn>

      {/* handcart tease — person leads, wagon trails */}
      {frame >= 312 ? (
        <div style={{ position: "absolute", left: teaseX, top: 968, transform: "scale(0.62)", transformOrigin: "bottom left" }}>
          <HandcartWalker />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
