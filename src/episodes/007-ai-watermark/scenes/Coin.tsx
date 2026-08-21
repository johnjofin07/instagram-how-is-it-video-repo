import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useEnter } from "../../../components/ui";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import {
  Chip,
  Coin as GoldCoin,
  COIN_GOLD,
  easeOut,
  gate,
  Stamp,
  TickMark,
  UMBER_DIM,
  WordChip,
} from "./kit";

// coin — THE COIN. The mechanism, given room: two quick "both these words
// work" examples, then the hero sentence with two endings, a coin that picks
// one, the reveal that the coin is weighted, then ten flips landing 7-3.
// Bronze/gold is the CAUSE (coin, word chips), clay is the EVIDENCE (a tick
// for every rigged head).
//
// [v2] THE PATTERN INTERRUPT (§0.7 device 5) lives here at ~63%: on "Wait.
// [whispers] Come closer." a UMBER_DIM veil DROPS over the stage in 4 frames —
// hard, not a fade — the coin alone is lit and turned to profile so the weight
// crescent reads as mass, and "THE COIN IS RIGGED" stamps in COIN_GOLD on the
// umber ground for ~58f before the veil lifts. The veil starts below the
// stepper (y430): the shared Chrome draws espresso-on-cream text ABOVE the
// scene layer, and a full-frame veil would swallow it for two seconds.
//
// Screen slots, all hard-sequenced (005 §8 — no crossfade collisions):
//   headline y470 : "hide a mark inside words" -> "the coin is rigged"
//   stage         : examples -> hero sentence + coin -> the veil -> flip run
//
// D = timing.json sceneSeconds[2] (21.07s) * 30. Beats are re-anchored to the
// recorded narration: "The cat sat on the mat" f207, "it flips a coin" f335,
// "Wait, come closer" f378, "the coin is rigged" f438, "it lands on one side"
// f500, "than it should" f596.
const D = 632;
const f = (p: number) => Math.round(D * p);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const SENTENCE = "The cat sat on the";
// non-breaking: three plain spaces collapse to one and the blank slot rendered
// as a 12px tick instead of a word-sized gap
const BLANK = "\u00A0\u00A0\u00A0\u00A0";

// "two words that both work" — quick establishing examples, before the hero
// sentence. No coin in these rows: the coin is the reveal, 130 frames later.
const REPEATS = [
  { lead: "She left the", a: "house", b: "flat" },
  { lead: "It was very", a: "quiet", b: "still" },
];
const REPEAT_IN = [f(0.16), f(0.235)];
const REPEAT_HOLD = 38;

// ten flips, 8f apart, 7 heads / 3 tails, laid out 5 + 5
const FLIPS: ("H" | "T")[] = ["H", "T", "H", "H", "H", "T", "H", "H", "T", "H"];
const flipX = (i: number) => 150 + (i % 5) * 170; // 150..830 (+90 = 920)
const flipY = (i: number) => (i < 5 ? 800 : 950);

export const Coin: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // ---- act 1: the question, and two examples of "both words work"
  // holds to 42%: nothing else takes the headline slot until the PI stamp at
  // 70%, and an empty top band for 250f reads as a dropped frame
  const question = gate(frame, 2, f(0.42), 10);
  const repeat = (i: number) => gate(frame, REPEAT_IN[i], REPEAT_IN[i] + REPEAT_HOLD, 7);

  // ---- act 2: the hero sentence and its two candidate endings
  const firstPass = gate(frame, f(0.31), f(0.62), 10);
  const sentence = useEnter(f(0.31));
  const chipsIn = gate(frame, f(0.38), f(0.6), 10);
  const bothWork = gate(frame, f(0.45), f(0.62), 10);

  const flip1Start = f(0.5); // 316 — the coin lands on "it flips a coin to pick"
  const spin1 = interpolate(frame, [flip1Start, flip1Start + 36], [0, 1], clamp);
  const landed1 = frame >= flip1Start + 36;
  const coin1 = gate(frame, flip1Start, f(0.6), 7);
  const fly = interpolate(frame, [f(0.56), f(0.588)], [0, 1], { ...clamp, easing: easeOut });
  const picked = fly > 0.85;

  // ---- act 3: THE PATTERN INTERRUPT
  const piAt = f(0.63); // 398 — "Wait. Come closer."
  const piEnd = f(0.785); // 496 — the veil lifts into the flip run
  // <=4 frames: this must read as a light being switched off, not a dissolve
  const veil =
    interpolate(frame, [piAt, piAt + 4], [0, 1], clamp) *
    interpolate(frame, [piEnd, piEnd + 10], [1, 0], clamp);
  const secretIn = gate(frame, piAt, piEnd, 6);
  const bigCoin = interpolate(frame, [piAt, piAt + 32], [0, 1], { ...clamp, easing: easeOut });
  const riggedStamp = gate(frame, f(0.705), f(0.782), 8);
  const weighted = gate(frame, f(0.665), f(0.785), 8);

  // ---- act 4: ten rigged flips
  const runStart = piEnd; // 496
  const runIn = gate(frame, runStart, undefined, 8);

  // ---- act 5: the evidence gathers into a row
  // the last coin settles at f592 and drops its tick at f594 — the gather must
  // start after that or the final ticks pop already halfway to the row
  const gather = interpolate(frame, [f(0.945), f(0.98)], [0, 1], { ...clamp, easing: easeOut });
  const heads = FLIPS.map((v, i) => ({ v, i })).filter((x) => x.v === "H");
  const closeIn = gate(frame, f(0.93), undefined, 12);

  return (
    <AbsoluteFill>
      {/* headline slot A */}
      {question > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            display: "flex",
            justifyContent: "center",
            opacity: question,
          }}
        >
          <Stamp fontSize={44} rotate={-1.2}>
            hide a mark <span style={{ color: theme.accent }}>inside words</span>
          </Stamp>
        </div>
      ) : null}

      {/* two quick examples: same slot, hard-sequenced */}
      {REPEATS.map((r, i) =>
        repeat(i) > 0.01 ? (
          <div
            key={r.lead}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 880,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 26,
              opacity: repeat(i),
              fontFamily: FONTS.mono,
              fontSize: 34,
              color: theme.textDim,
            }}
          >
            <span>{r.lead}</span>
            <WordChip size={24} active>
              {r.a}
            </WordChip>
            <WordChip size={24}>{r.b}</WordChip>
          </div>
        ) : null,
      )}

      {/* sub-chip */}
      {bothWork > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 620,
            textAlign: "center",
            opacity: bothWork,
          }}
        >
          <Chip color={theme.second}>both work</Chip>
        </div>
      ) : null}

      {/* the hero sentence and its two candidate endings */}
      {firstPass > 0.01 ? (
        <div style={{ opacity: firstPass }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 760,
              textAlign: "center",
              fontFamily: FONTS.mono,
              fontSize: 44,
              letterSpacing: "0.05em",
              color: theme.text,
              opacity: sentence,
            }}
          >
            {SENTENCE}{" "}
            <span
              style={{
                color: picked ? theme.second : theme.textDim,
                borderBottom: `5px solid ${picked ? theme.second : theme.textDim}`,
                padding: "0 12px",
                fontWeight: picked ? 800 : 400,
              }}
            >
              {picked ? "mat" : BLANK}
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 950,
              display: "flex",
              justifyContent: "center",
              gap: 60,
              opacity: chipsIn,
              transform: `translateY(${interpolate(chipsIn, [0, 1], [40, 0])}px)`,
            }}
          >
            <div style={{ opacity: 1 - fly, transform: `translateY(${-fly * 70}px)` }}>
              <WordChip active={landed1 && !picked}>mat</WordChip>
            </div>
            <WordChip ghost={landed1}>rug</WordChip>
          </div>
        </div>
      ) : null}

      {/* the pick */}
      {coin1 > 0.01 ? (
        <div style={{ position: "absolute", left: 440, top: 1080, opacity: coin1 }}>
          <GoldCoin size={200} spin={spin1} face="H" glow={landed1 ? 1 : 0} />
        </div>
      ) : null}

      {/* ---------------------------------------------- THE PATTERN INTERRUPT */}
      {/* the veil starts below the stepper so the chrome stays readable */}
      {veil > 0.005 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 430,
            bottom: 0,
            background: UMBER_DIM,
            opacity: veil,
          }}
        />
      ) : null}

      {secretIn > 0.01 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 380,
              top: 740,
              opacity: secretIn,
              transform: `scale(${0.72 + bigCoin * 0.28})`,
              transformOrigin: "center",
            }}
          >
            <GoldCoin size={320} spin={1} face="H" rigged tilt={bigCoin * 0.5} glow={bigCoin} />
          </div>
          {weighted > 0.01 ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 1180,
                textAlign: "center",
                opacity: weighted,
              }}
            >
              <Chip color={COIN_GOLD} style={{ background: "rgba(24, 17, 10, 0.94)" }}>
                weighted on one side
              </Chip>
            </div>
          ) : null}
        </>
      ) : null}

      {/* headline slot B — A is fully gone 200f earlier. Gold on umber = 8.3:1 */}
      {riggedStamp > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            display: "flex",
            justifyContent: "center",
            opacity: riggedStamp,
            transform: `scale(${0.94 + riggedStamp * 0.06})`,
          }}
        >
          <Stamp
            fontSize={54}
            rotate={1.5}
            color={COIN_GOLD}
            textColor={COIN_GOLD}
            bg="rgba(24, 17, 10, 0.94)"
          >
            the coin is rigged
          </Stamp>
        </div>
      ) : null}

      {/* ten flips — every head drops a clay tick where it landed */}
      {runIn > 0.01 ? (
        <div style={{ opacity: runIn }}>
          {FLIPS.map((face, i) => {
            const start = runStart + 8 + i * 8;
            if (frame < start) return null;
            const spin = interpolate(frame, [start, start + 16], [0, 1], clamp);
            const settled = frame > start + 16;
            return (
              <div key={i} style={{ position: "absolute", left: flipX(i), top: flipY(i) }}>
                <GoldCoin
                  size={90}
                  spin={spin}
                  face={face}
                  rigged
                  glow={settled && face === "H" ? 0.7 : 0}
                />
              </div>
            );
          })}
          {heads.map(({ i }, k) => {
            const start = runStart + 8 + i * 8 + 18;
            if (frame < start) return null;
            const pop = interpolate(frame, [start, start + 6], [0, 1], clamp);
            const x = interpolate(gather, [0, 1], [flipX(i) + 28, 330 + k * 60]);
            const y = interpolate(gather, [0, 1], [flipY(i) - 40, 1180]);
            return (
              <div
                key={`t${i}`}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  opacity: pop,
                  transform: `scale(${0.6 + pop * 0.4 + gather * 0.4})`,
                }}
              >
                <TickMark size={34} />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* closing chip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1272,
          textAlign: "center",
          opacity: closeIn,
          transform: `translateY(${interpolate(closeIn, [0, 1], [18, 0])}px)`,
        }}
      >
        <Chip color={theme.accent}>more often than it should</Chip>
      </div>
    </AbsoluteFill>
  );
};
