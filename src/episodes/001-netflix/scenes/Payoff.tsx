import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { Card, MonoLabel, RiseIn } from "../../../components/ui";

// Scene 5 (12s): the payoff — a sweating wifi router vs a server that did
// everything right, then the whole pipeline in one connected mini-diagram
// and the comment CTA.
export const Payoff: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const shake = frame < 115 ? Math.sin(frame / 2.2) * 3 : 0;

  const NODES = ["master", "ladder", "chunks", "the box", "you"];
  const lineProgress = interpolate(frame, [122, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      {/* blame comparison */}
      <div style={{ position: "absolute", top: 420, display: "flex", gap: 44 }}>
        {/* wifi router — guilty */}
        <RiseIn delay={6}>
          <Card style={{ width: 330, padding: 30, transform: `translateX(${shake}px)` }}>
            <svg width="120" height="90" viewBox="0 0 120 90" style={{ display: "block", margin: "0 auto" }}>
              <rect x="14" y="52" width="92" height="28" rx="8" fill="#26262d" stroke={theme.line} strokeWidth="2" />
              <circle cx="34" cy="66" r="5" fill={theme.warn} opacity={0.4 + 0.6 * Math.abs(Math.sin(frame / 4))} />
              <circle cx="52" cy="66" r="5" fill={theme.second} opacity={0.4 + 0.6 * Math.abs(Math.sin(frame / 3))} />
              <line x1="30" y1="52" x2="22" y2="24" stroke={theme.line} strokeWidth="5" strokeLinecap="round" />
              <line x1="90" y1="52" x2="98" y2="24" stroke={theme.line} strokeWidth="5" strokeLinecap="round" />
              {/* weak signal arcs */}
              <path d="M50 40 Q60 32 70 40" stroke={theme.warn} strokeWidth="4" fill="none" opacity={Math.sin(frame / 5) > 0 ? 1 : 0.2} />
              {/* sweat drops */}
              <circle cx="104" cy={30 + ((frame * 1.8) % 26)} r="4" fill={theme.second} opacity="0.8" />
              <circle cx="12" cy={36 + ((frame * 2.3) % 20)} r="3.4" fill={theme.second} opacity="0.7" />
            </svg>
            <MonoLabel style={{ textAlign: "center", marginTop: 16, color: theme.warn, fontSize: 24 }}>
              your wifi · struggling
            </MonoLabel>
          </Card>
        </RiseIn>

        {/* server — innocent */}
        <RiseIn delay={26}>
          <Card brand style={{ width: 330, padding: 30 }}>
            <svg width="120" height="90" viewBox="0 0 120 90" style={{ display: "block", margin: "0 auto" }}>
              <rect x="22" y="12" width="76" height="66" rx="8" fill="#131b30" stroke={theme.brandDim} strokeWidth="2" />
              {[0, 1, 2].map((r) => (
                <g key={r}>
                  <circle cx="36" cy={26 + r * 20} r="4" fill={r === 0 ? theme.good : theme.textFaint} />
                  <rect x="48" y={22 + r * 20} width="40" height="7" rx="3" fill="#2a2a31" />
                </g>
              ))}
              {/* check mark */}
              <circle cx="98" cy="18" r="13" fill={theme.good} />
              <path d="M92 18 L96 23 L104 13" stroke="#04140c" strokeWidth="3.6" fill="none" strokeLinecap="round" />
            </svg>
            <MonoLabel style={{ textAlign: "center", marginTop: 16, color: theme.good, fontSize: 24 }}>
              the box · did everything right
            </MonoLabel>
          </Card>
        </RiseIn>
      </div>

      {/* pipeline recap diagram */}
      <RiseIn delay={118} style={{ position: "absolute", top: 880, width: 860 }}>
        <MonoLabel style={{ textAlign: "center", marginBottom: 26 }}>the whole trick</MonoLabel>
        <div style={{ position: "relative", height: 120 }}>
          <svg width="860" height="120" style={{ position: "absolute" }}>
            <line
              x1="60"
              y1="46"
              x2={60 + 740 * lineProgress}
              y2="46"
              stroke={theme.accent}
              strokeWidth="4"
              strokeDasharray="2 10"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", padding: "0 20px" }}>
            {NODES.map((n, i) => {
              const visible = lineProgress >= i / (NODES.length - 1) - 0.02;
              return (
                <div key={n} style={{ textAlign: "center", opacity: visible ? 1 : 0.15, width: 130 }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      margin: "20px auto 0",
                      borderRadius: 10,
                      border: `3px solid ${visible ? theme.accent : theme.line}`,
                      background: visible ? "rgba(229,9,20,0.12)" : "transparent",
                      boxShadow: visible ? `0 0 22px ${theme.accentGlow}` : "none",
                    }}
                  />
                  <div style={{ fontFamily: FONTS.mono, fontSize: 22, color: visible ? theme.text : theme.textFaint, marginTop: 12 }}>
                    {n}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </RiseIn>

      {/* CTA */}
      <RiseIn delay={200} style={{ position: "absolute", top: 1180, textAlign: "center" }}>
        <div style={{ fontFamily: FONTS.sans, fontWeight: 800, fontSize: 54, color: theme.text }}>
          your <span style={{ color: theme.accent }}>turn</span>.
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 28,
            color: theme.textDim,
            marginTop: 18,
            letterSpacing: "0.15em",
          }}
        >
          drop a topic in the comments ↓
        </div>
      </RiseIn>
    </AbsoluteFill>
  );
};
