import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RiseIn, useEnter } from "../../../components/ui";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { Beacon, Chip, Recorder, Stamp } from "./kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Locate: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const fall = interpolate(frame, [0, 58], [0, 1], { ...clamp, easing: (t) => t * t });
  const recorderRotate = fall * 26;
  const ping = frame < 68 ? 0 : ((frame - 68) % 52) / 52;
  const lock = interpolate(frame, [136, 160], [0, 1], clamp);
  const claim = useEnter(92, { damping: 12 });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,43,59,.92), rgba(2,14,22,.98))" }}>
      <svg width="1080" height="1920" style={{ position: "absolute" }}>
        <path d="M0 610 Q180 575 350 614 T700 606 T1080 610" stroke={theme.secondDim} strokeWidth="6" fill="none" />
        <path d="M0 1230 Q240 1185 520 1220 T1080 1200 L1080 1920 L0 1920 Z" fill="#101D22" />
        {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={150 + i * 168} cy={500 + ((i * 137) % 530)} r={2 + (i % 2) * 2} fill={theme.textDim} opacity="0.24" />)}
      </svg>

      <div style={{ position: "absolute", left: 360, top: 410 }}>
        <svg width="360" height="240" viewBox="0 0 540 360">
          <path d="M80 190 H460 L414 258 H128 Z" fill="#35444D" stroke={theme.line} strokeWidth="5" />
          <rect x="220" y="116" width="118" height="75" rx="8" fill="#43535D" />
          <line x1="280" y1="116" x2="280" y2="64" stroke={theme.textDim} strokeWidth="6" />
          <path d="M280 70 Q370 110 422 170" fill="none" stroke={lock > 0 ? theme.good : theme.second} strokeWidth="5" strokeDasharray="9 12" opacity="0.75" />
        </svg>
      </div>

      {frame >= 68 ? <div style={{ position: "absolute", left: 190, top: 720 }}><Beacon pulse={ping} /></div> : null}

      <div style={{ position: "absolute", left: 398, top: 610 + fall * 430, transform: `rotate(${recorderRotate}deg)` }}>
        <Recorder w={280} damage={0.58} beaconOn={frame >= 68} />
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 680, display: "flex", justifyContent: "center", transform: `scale(${claim})` }}>
        <Stamp fontSize={39} rotate={-1} color={theme.accent}>why it&apos;s bright orange</Stamp>
      </div>

      {frame >= 76 ? (
        <div style={{ position: "absolute", left: 720, top: 760, fontFamily: FONTS.mono, fontSize: 32, fontWeight: 800, letterSpacing: "0.18em", color: theme.second, opacity: 0.45 + 0.55 * Math.sin((frame - 68) / 5) ** 2 }}>
          PING
        </div>
      ) : null}

      {frame >= 142 ? (
        <RiseIn delay={142} style={{ position: "absolute", left: 0, right: 0, top: 1260, textAlign: "center" }}>
          <Chip color={theme.good}>signal found</Chip>
        </RiseIn>
      ) : null}
    </AbsoluteFill>
  );
};
