import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useEnter } from "../../../components/ui";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import { Chip, easeOut, gate, LawCard, PAPER_SHADOW, Stamp, WorldDots } from "./kit";

// law — THE LAW. A statute + the date it bit, then the map: the ripple starts
// in Europe and keeps going until every dot is clay. Two blocks share the
// stage slot (law card group -> world map) and two share the headline slot,
// so both swaps are hard-sequenced with a ~10f gap (005 §8).
//
// D = timing.json sceneSeconds[1] (15.37s) * 30. Beats are re-anchored to the
// recorded narration rather than a flat rescale: whisper puts "since August
// 2nd" at f177 (38%) and "not just in Europe / everywhere" at f377-417 (82-90%),
// where the plan's provisional table had them at 13% and 62%.
const D = 461;
const f = (p: number) => Math.round(D * p);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const MAP_W = 900;
const MAP_X = 90;
const MAP_Y = 730;

export const Law: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const card = useEnter(4);
  // 4f overshoot on the date slam — a lower damping than the skin's default
  const date = useEnter(f(0.37), { damping: 8 });

  // stage slot: law card group out at 50%, map in at 55% (11f gap)
  const paperIn = gate(frame, 0, f(0.5), 12);
  const mapIn = gate(frame, f(0.55), undefined, 14);
  const mapRise = interpolate(frame, [f(0.55), f(0.75)], [70, 0], {
    ...clamp,
    easing: easeOut,
  });

  // the ripple: Europe first, then past the map edges until everything tints —
  // full spread lands on the spoken word "everywhere" (f417)
  const wave = interpolate(frame, [f(0.56), f(0.8), f(0.93)], [0, 6, 27], clamp);

  // headline slot: "if a computer wrote it" out at 75%, "not just europe" at 81%
  const claimIn = gate(frame, 2, f(0.75), 10);
  const swapIn = gate(frame, f(0.81), undefined, 8);

  const closeIn = gate(frame, f(0.9), undefined, 12);

  return (
    <AbsoluteFill>
      {/* headline slot A */}
      {claimIn > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            display: "flex",
            justifyContent: "center",
            opacity: claimIn,
          }}
        >
          <Stamp fontSize={42} rotate={-1.2}>
            if a computer wrote it,
            <br />
            <span style={{ color: theme.accent }}>people can find out</span>
          </Stamp>
        </div>
      ) : null}

      {/* headline slot B — hard-sequenced, never crossfaded with A */}
      {swapIn > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            display: "flex",
            justifyContent: "center",
            opacity: swapIn,
            transform: `scale(${0.94 + swapIn * 0.06})`,
          }}
        >
          <Stamp fontSize={56} rotate={1.4} color={theme.accent}>
            not just europe.
          </Stamp>
        </div>
      ) : null}

      {/* stage slot A — the statute and the day it started biting */}
      {paperIn > 0.01 ? (
        <div style={{ opacity: paperIn }}>
          <LawCard
            w={300}
            style={{
              position: "absolute",
              left: 230,
              top: 660,
              transform: `scale(${0.86 + card * 0.14})`,
              transformOrigin: "center",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 620,
              top: 700,
              width: 170,
              height: 170,
              borderRadius: 12,
              background: theme.card,
              border: `6px solid ${theme.second}`,
              boxShadow: PAPER_SHADOW,
              transform: `rotate(8deg) scale(${date})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONTS.mono,
            }}
          >
            <div style={{ fontSize: 26, letterSpacing: "0.2em", color: theme.textDim }}>AUG</div>
            <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1, color: theme.second }}>2</div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 520,
              top: 930,
              width: 370,
              textAlign: "center",
              opacity: gate(frame, f(0.44)),
            }}
          >
            <Chip color={theme.second}>the rule kicked in</Chip>
          </div>
        </div>
      ) : null}

      {/* stage slot B — the world, tinting outward from Europe */}
      {mapIn > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: MAP_X,
            top: MAP_Y + mapRise,
            opacity: mapIn,
          }}
        >
          <WorldDots w={MAP_W} wave={wave} />
        </div>
      ) : null}

      {/* closing chip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1290,
          textAlign: "center",
          opacity: closeIn,
          transform: `translateY(${interpolate(closeIn, [0, 1], [18, 0])}px)`,
        }}
      >
        <Chip color={theme.accent}>every new Claude model, everywhere</Chip>
      </div>
    </AbsoluteFill>
  );
};
