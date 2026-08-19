import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { RiseIn, useEnter } from "../../../components/ui";
import { Belt, Carton, Chip, House, INK, Parcel, Stamp, Wifi } from "./kit";

// Scene 3 (~23s): the parcel line. A big carton gets sliced into a stream of
// four-second parcels running down the belt to your home — and the home is
// the one ordering: wifi strong → 4K-sized parcels; a video call joins →
// quietly smaller parcels, and the buffering wheel never shows.

export const Ship: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const cartonX = interpolate(frame, [6, 66], [-260, 130], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // parcel size follows the wifi story: medium → 4K big → call joins → small
  const parcelW = interpolate(frame, [380, 400, 468, 496], [44, 58, 58, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bars: 0 | 1 | 2 | 3 = frame < 300 ? 2 : frame < 468 ? 3 : 1;

  const bladeY = 6 * Math.sin(frame / 3.2);

  return (
    <AbsoluteFill>
      {/* source carton + slicer */}
      <div style={{ position: "absolute", left: cartonX, top: 742 }}>
        <Carton w={200} label="1080" />
      </div>
      <svg width="70" height="220" viewBox="0 0 70 220" style={{ position: "absolute", left: 316, top: 700 }}>
        <rect x="24" y="0" width="22" height="52" rx="6" fill={INK} />
        <g transform={`translate(0 ${bladeY})`}>
          <line x1="35" y1="52" x2="35" y2="196" stroke={theme.second} strokeWidth="5" strokeDasharray="14 10" />
          <path d="M 26 196 L 35 214 L 44 196 Z" fill={theme.second} />
        </g>
      </svg>

      {/* the parcel stream */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 400 + ((((frame * 2.6 + i * 94) % 560) + 560) % 560);
        return x < 890 ? (
          <div key={i} style={{ position: "absolute", left: x, top: 900 - parcelW }}>
            <Parcel w={parcelW} />
          </div>
        ) : null;
      })}
      <Belt x={44} y={904} w={806} speed={2.6} />

      {/* your home, doing the ordering */}
      <div style={{ position: "absolute", left: 856, top: 764 }}>
        <House w={168} glow="watching" />
      </div>
      <RiseIn delay={186} style={{ position: "absolute", left: 636, top: 576 }}>
        <Chip color={theme.second}>next parcel, please!</Chip>
      </RiseIn>
      {frame >= 268 ? (
        <div style={{ position: "absolute", left: 906, top: 664 }}>
          <Wifi bars={bars} w={78} />
        </div>
      ) : null}

      {/* labels */}
      <RiseIn delay={126} style={{ position: "absolute", left: 84, top: 1042 }}>
        <Chip>1 parcel ≈ 4 seconds of video</Chip>
      </RiseIn>
      <RiseIn
        delay={392}
        style={{
          position: "absolute",
          left: 84,
          top: 480,
          opacity: interpolate(frame, [468, 496], [1, 0.35], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Stamp fontSize={33} rotate={-1.8} color={theme.good}>
          strong wifi → send the 4K
        </Stamp>
      </RiseIn>
      <RiseIn delay={472} style={{ position: "absolute", left: 470, top: 396 }}>
        <Chip color={theme.brand}>a video call joins the wifi</Chip>
      </RiseIn>

      {/* the payoff of the mechanism: no wheel, ever */}
      {frame >= 588 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1160,
            textAlign: "center",
            transform: `scale(${(0.9 + 0.1 * Math.min(1, (frame - 588) / 10)) * (frame >= 588 ? 1 : 0)})`,
          }}
        >
          <Stamp fontSize={40} rotate={1.8}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 18 }}>
              <svg width="46" height="46" viewBox="0 0 46 46">
                <circle
                  cx="23"
                  cy="23"
                  r="16"
                  fill="none"
                  stroke={theme.textDim}
                  strokeWidth="6"
                  strokeDasharray="72 28"
                  transform={`rotate(${frame * 6} 23 23)`}
                />
                <line x1="8" y1="8" x2="38" y2="38" stroke={theme.brand} strokeWidth="7" strokeLinecap="round" />
              </svg>
              no buffering wheel
            </span>
          </Stamp>
        </div>
      ) : null}

      {/* tiny sizing note under the stream once the call kicks in */}
      {frame >= 520 ? (
        <div
          style={{
            position: "absolute",
            left: 440,
            top: 1000,
            fontFamily: FONTS.mono,
            fontSize: 23,
            color: theme.textDim,
          }}
        >
          smaller boxes, same show
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
