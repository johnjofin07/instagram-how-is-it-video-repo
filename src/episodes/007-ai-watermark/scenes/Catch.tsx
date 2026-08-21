import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import {
  Chip,
  DocCard,
  docWords,
  easeOut,
  gate,
  hash,
  INK,
  LampGlyph,
  PAPER,
  PAPER_EDGE,
  PAPER_LINE,
  PAPER_SHADOW,
  Stamp,
  Tally,
} from "./kit";

// catch — THE CATCH. Three weak spots, then the payoff: the AI checker that
// failed someone's essay was guessing. All three weak spots share one stage
// slot and are hard-sequenced (out fully, ~10f gap, in) — 005 §8.
//
// [v2] Two additions:
//   * the CALLBACK. "IT WAS GUESSING." hard-sequences to "THERE'S THE FLAW."
//     in `warn` — the same words, the same red, as the hook's rehook stamp 70
//     seconds earlier. That is the loop closing (§0.7 device 4).
//   * the ON-SCREEN CTA (§0.7.4). The spoken "what system should I break down
//     next?" was cut from the recording, so the comment bait is a card chip
//     during the allDone hold. Ends at y1355 — above the y1370 caption line.
//
// D = timing.json sceneSeconds[4] (19.47s) * 30. Beats re-anchored to the
// recorded narration: weak spot 1 f37, 2 f125, 3 f267, the essay f353, "it was
// guessing" f471, "there's the flaw" f542.
const D = 584;
const f = (p: number) => Math.round(D * p);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// weak spot #2's page — a marked doc that gets rewritten
const W2 = { w: 560, h: 300, lines: 5, x: 260, y: 700 };
const W2_WORDS = docWords(W2.w, W2.h, W2.lines, 5);
const W2_MARKED = W2_WORDS.filter((w) => hash(w.i, 6, 13) > 0.6)
  .slice(0, 11)
  .map((w) => w.i);

export const Catch: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // headline holds across all three weak spots, then clears for the payoff
  const headIn = gate(frame, 2, f(0.6), 10);

  // ---- weak spot 1: too short to count
  const w1 = gate(frame, f(0.05), f(0.205), 10);
  const shortCount = interpolate(frame, [f(0.09), f(0.16)], [0, 6], clamp);
  const shrug = frame > f(0.175) ? Math.sin((frame - f(0.175)) / 5) * 2 : 0;
  const shrugging = frame > f(0.175);

  // ---- weak spot 2: rewrite it and the mark washes away
  const w2 = gate(frame, f(0.236), f(0.437), 10);
  const scramble = interpolate(frame, [f(0.29), f(0.41)], [0, 1], clamp);
  const wash = interpolate(frame, [f(0.308), f(0.42)], [1, 0], clamp);

  // ---- weak spot 3: the counting tool is not out yet
  const w3 = gate(frame, f(0.454), f(0.6), 10);
  const band = interpolate(frame, [f(0.48), f(0.53)], [0, 1], { ...clamp, easing: easeOut });

  // ---- the payoff
  const essay = gate(frame, f(0.63), undefined, 10);
  const gradeAt = f(0.727);
  const grade = interpolate(frame, [gradeAt, gradeAt + 8], [0, 1], { ...clamp, easing: easeOut });

  // ---- the closer, and the callback that closes the hook's loop
  const guessing = gate(frame, f(0.806), f(0.9), 10);
  const flaw = gate(frame, f(0.928), undefined, 8);
  const cta = gate(frame, f(0.865), undefined, 12);

  return (
    <AbsoluteFill>
      {/* headline */}
      {headIn > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 460,
            display: "flex",
            justifyContent: "center",
            opacity: headIn,
          }}
        >
          <Stamp fontSize={38} rotate={-1.4}>
            the trick has <span style={{ color: theme.accent }}>weak spots</span>
          </Stamp>
        </div>
      ) : null}

      {/* ---------------------------------------------- weak spot 1: too short */}
      {w1 > 0.01 ? (
        <div style={{ opacity: w1 }}>
          <DocCard w={320} h={200} lines={3} seed={7} style={{ left: 230, top: 740 }} />
          <div style={{ transform: `rotate(${shrug}deg)`, transformOrigin: "710px 820px" }}>
            <Tally
              value={shrugging ? 0 : shortCount}
              text={shrugging ? "?" : undefined}
              label="flips to count"
              w={220}
              color={shrugging ? theme.warn : theme.second}
              style={{ left: 600, top: 750 }}
            />
          </div>
          <div style={{ position: "absolute", left: 200, top: 1040, width: 640, textAlign: "center" }}>
            <Chip color={theme.warn}>too few flips</Chip>
          </div>
        </div>
      ) : null}

      {/* --------------------------------------- weak spot 2: rewritten = gone */}
      {w2 > 0.01 ? (
        <div style={{ opacity: w2 }}>
          <DocCard
            w={W2.w}
            h={W2.h}
            lines={W2.lines}
            seed={5}
            revealed={W2_MARKED}
            reveal={wash}
            scramble={scramble}
            style={{ left: W2.x, top: W2.y }}
          />
          <div style={{ position: "absolute", left: 200, top: 1040, width: 680, textAlign: "center" }}>
            <Chip color={theme.warn}>rewritten = washed away</Chip>
          </div>
        </div>
      ) : null}

      {/* ------------------------------------ weak spot 3: the tool isn't out */}
      {w3 > 0.01 ? (
        <div style={{ opacity: w3 }}>
          <div
            style={{
              position: "absolute",
              left: 350,
              top: 700,
              width: 380,
              height: 290,
              borderRadius: 16,
              background: theme.card,
              border: `3px solid ${theme.line}`,
              boxShadow: PAPER_SHADOW,
              overflow: "hidden",
            }}
          >
            <LampGlyph size={190} style={{ position: "absolute", left: 95, top: 52 }} />
            <div
              style={{
                position: "absolute",
                left: -60,
                top: 150,
                width: 500,
                padding: "12px 0",
                background: theme.warn,
                transform: `rotate(-14deg) scaleX(${band})`,
                transformOrigin: "center",
                textAlign: "center",
                fontFamily: FONTS.mono,
                fontWeight: 800,
                fontSize: 30,
                letterSpacing: "0.14em",
                // cream on deep red — the reverse of everywhere else, because
                // this is the one place `warn` is the SHAPE and not the ink
                color: PAPER,
              }}
            >
              NOT RELEASED YET
            </div>
          </div>
          <div style={{ position: "absolute", left: 200, top: 1040, width: 680, textAlign: "center" }}>
            <Chip color={theme.warn}>the official counting tool</Chip>
          </div>
        </div>
      ) : null}

      {/* ------------------------------------------------- payoff: the essay */}
      {essay > 0.01 ? (
        <div style={{ opacity: essay }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 490,
              textAlign: "center",
            }}
          >
            <Chip color={theme.warn}>an AI checker flagged this</Chip>
          </div>
          <div
            style={{
              position: "absolute",
              left: 280,
              top: 660,
              width: 520,
              height: 420,
              background: PAPER,
              borderRadius: 14,
              border: `3px solid ${PAPER_EDGE}`,
              boxShadow: PAPER_SHADOW,
              overflow: "hidden",
            }}
          >
            <svg width="520" height="420" viewBox="0 0 520 420" style={{ display: "block" }}>
              <rect x="44" y="42" width="240" height="20" rx="10" fill={INK} opacity="0.75" />
              {Array.from({ length: 11 }, (_, i) => (
                <rect
                  key={i}
                  x="44"
                  y={100 + i * 27}
                  width={(i === 10 ? 0.55 : 1) * (280 + hash(i, 2, 31) * 150)}
                  height="11"
                  rx="5.5"
                  fill={PAPER_LINE}
                />
              ))}
            </svg>
          </div>
          {/* the grade — warn ink on a cream plate is 7:1; the old dark plate
              was a hole punched in a light skin */}
          <div
            style={{
              position: "absolute",
              left: 420,
              top: 900,
              padding: "14px 26px",
              borderRadius: 10,
              background: PAPER,
              border: `6px solid ${theme.warn}`,
              boxShadow: PAPER_SHADOW,
              transform: `rotate(10deg) scale(${interpolate(grade, [0, 1], [1.5, 1])})`,
              opacity: grade,
              fontFamily: FONTS.mono,
              fontWeight: 800,
              fontSize: 62,
              letterSpacing: "0.06em",
              color: theme.warn,
              whiteSpace: "nowrap",
            }}
          >
            AI: 98%
          </div>
        </div>
      ) : null}

      {/* the closer */}
      {guessing > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1160,
            display: "flex",
            justifyContent: "center",
            opacity: guessing,
            transform: `scale(${0.92 + guessing * 0.08})`,
          }}
        >
          <Stamp fontSize={56} rotate={1.6} color={theme.warn}>
            it was guessing.
          </Stamp>
        </div>
      ) : null}

      {/* the callback — same slot, hard-sequenced, closing the hook's loop */}
      {flaw > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1160,
            display: "flex",
            justifyContent: "center",
            opacity: flaw,
            transform: `scale(${0.9 + flaw * 0.1})`,
          }}
        >
          <Stamp fontSize={56} rotate={-1.6} color={theme.warn} textColor={theme.warn}>
            there&apos;s the flaw.
          </Stamp>
        </div>
      ) : null}

      {/* the on-screen CTA (§0.7.4) — the spoken line was cut from the take */}
      {cta > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1300,
            textAlign: "center",
            opacity: cta,
            transform: `translateY(${interpolate(cta, [0, 1], [16, 0])}px)`,
          }}
        >
          <Chip>what system should I break down next? ↓</Chip>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
