import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONTS } from "../../../theme";
import { useTheme } from "../../../themes";
import {
  easeOut,
  gate,
  hash,
  PAPER,
  PAPER_EDGE,
  PAPER_LINE,
  PAPER_SHADOW,
  ScanLamp,
  Stamp,
  Tally,
} from "./kit";

// count — THE COUNT. One rigged flip is invisible; a page of them is a visible
// warm drift. The scene is one continuous zoom-out from a single word to a
// whole page, then the detector sweeps it and says the quiet part out loud.
//
// [v2] The grid now sits ON a PAPER card. On the cream skin a bare grid of
// bars floated in the middle of the background with nothing to say it was a
// page; on paper it reads as the document the whole episode argues about.
//
// D = timing.json sceneSeconds[3] (16.2s) * 30. Beats re-anchored to the
// recorded narration: "hundreds of rigged flips" f100-206, "a detector that
// knows the trick counts them" f247-313, "too many heads" f313, "This was
// Claude" f453.
const D = 486;
const f = (p: number) => Math.round(D * p);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// page geometry (comp space) — clipped to the stage band so the 3.6x zoom
// never spills over the chrome or the verdict card
const CLIP = { left: 65, top: 650, w: 950, h: 420 };
const GRID = { left: 27, top: 16, w: 896, rows: 22, rowH: 18, bh: 7 };
const GRID_X = CLIP.left + GRID.left; // 92
const GRID_Y = CLIP.top + GRID.top; // 666

// Words FLOW across each row with seeded widths (a fixed column grid read as
// a barcode, not as prose — caught in the f180 still).
type GCell = { k: number; x: number; y: number; w: number; picked: boolean };
const CELLS: GCell[] = (() => {
  const out: GCell[] = [];
  let k = 0;
  for (let r = 0; r < GRID.rows; r += 1) {
    let x = r === 0 ? 34 : 0; // paragraph indent
    for (;;) {
      const w = Math.round(24 + hash(k, 1, 17) * 38);
      if (x + w > GRID.w) break;
      // ~40% of the word choices carry the mark. Seeded — never random.
      out.push({ k, x, y: r * GRID.rowH, w, picked: hash(k, 4, 17) > 0.6 });
      x += w + 13;
      k += 1;
    }
  }
  return out;
})();

// the one flip we start on: the word closest to comp x=540 in row 9
const LONE = CELLS.filter((c) => c.y === 9 * GRID.rowH).reduce((best, c) =>
  Math.abs(c.x + c.w / 2 - 450) < Math.abs(best.x + best.w / 2 - 450) ? c : best,
);
// the word the scene opens on always carries a mark (the hash may not have
// picked it) — otherwise the opening beat shows a kraft bar with a clay tick
LONE.picked = true;
const loneCX = LONE.x + LONE.w / 2;
const loneCY = LONE.y + GRID.bh / 2;

const VERDICT = ["TOO MANY HEADS.", "NO HUMAN WRITES LIKE THIS."];

export const Count: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // ---- the zoom-out: one word -> a full page ("hundreds of rigged flips")
  const zoom = interpolate(frame, [f(0.205), f(0.425)], [3.6, 1], { ...clamp, easing: easeOut });
  const crowd = interpolate(frame, [f(0.245), f(0.41)], [0, 1], clamp);

  // headline slot: "one flip? invisible." out at 46%, the tally takes over at
  // 50% ("A detector that knows the trick", f247) — a 9f gap, not a crossfade
  const claimIn = gate(frame, 2, f(0.46), 10);
  const tallyIn = gate(frame, f(0.5), undefined, 8);

  // ---- the sweep and the count
  const sweepStart = f(0.515); // 250 — "a detector that knows the trick"
  const sweepEnd = f(0.64); // 311
  const sweepX = interpolate(frame, [sweepStart, sweepEnd], [30, 1030], clamp);
  const sweepOn = gate(frame, sweepStart, sweepEnd - 10, 8);
  const count = interpolate(frame, [sweepStart, sweepEnd], [0, 214], clamp);

  // ---- the verdict
  const gridDim = interpolate(frame, [f(0.66), f(0.72)], [1, 0.45], clamp);
  const typeStart = f(0.645); // 313 — "and goes, too many heads"
  const typed = Math.max(0, Math.floor((frame - typeStart) / 2));
  const cardIn = gate(frame, typeStart - 8, undefined, 10);
  const cardRise = interpolate(cardIn, [0, 1], [46, 0]);
  const finalIn = gate(frame, f(0.905), undefined, 9);

  const litOf = (cell: GCell) => {
    // the opening word develops on its own until the page crowds in around it
    const solo = cell === LONE ? 0.72 * (1 - crowd) : 0;
    if (frame < sweepStart) return solo;
    const d = sweepX - (GRID_X + cell.x + cell.w / 2);
    const beam = Math.max(0, 1 - Math.abs(d) / 120);
    return Math.max(solo, beam, d > 0 ? 0.62 : 0);
  };

  return (
    <AbsoluteFill>
      {/* headline slot */}
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
          <Stamp fontSize={44} rotate={-1.2}>
            one flip? <span style={{ color: theme.accent }}>invisible.</span>
          </Stamp>
        </div>
      ) : null}

      {/* the detector's counter takes the same slot, hard-sequenced */}
      {tallyIn > 0.01 ? (
        <div style={{ opacity: tallyIn }}>
          <Tally value={count} label="marks found" w={240} style={{ left: 670, top: 496 }} />
        </div>
      ) : null}

      {/* the page */}
      <div
        style={{
          position: "absolute",
          left: CLIP.left,
          top: CLIP.top,
          width: CLIP.w,
          height: CLIP.h,
          overflow: "hidden",
          background: PAPER,
          borderRadius: 14,
          border: `3px solid ${PAPER_EDGE}`,
          boxShadow: PAPER_SHADOW,
          opacity: gridDim,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: GRID.left,
            top: GRID.top,
            transform: `scale(${zoom})`,
            transformOrigin: `${loneCX}px ${loneCY}px`,
          }}
        >
          <svg
            width={GRID.w}
            height={GRID.rows * GRID.rowH}
            viewBox={`0 0 ${GRID.w} ${GRID.rows * GRID.rowH}`}
            style={{ display: "block", overflow: "visible" }}
          >
            {CELLS.map((cell) => {
              const lit = cell.picked ? litOf(cell) : 0;
              const base = cell === LONE ? 1 : crowd;
              if (base <= 0.001) return null;
              return (
                <g key={cell.k}>
                  {lit > 0.02 ? (
                    <rect
                      x={cell.x - 5}
                      y={cell.y - 4}
                      width={cell.w + 10}
                      height={GRID.bh + 8}
                      rx={(GRID.bh + 8) / 2}
                      fill={theme.accentGlow}
                      opacity={lit * base * 0.8}
                    />
                  ) : null}
                  <rect
                    x={cell.x}
                    y={cell.y}
                    width={cell.w}
                    height={GRID.bh}
                    rx={GRID.bh / 2}
                    // [v2] clay at 0.4 over kraft at 0.9 was the SAME VALUE on
                    // cream — the "visible drift" beat showed a plain page.
                    // Marked words now sit ~2 steps darker than the kraft.
                    fill={cell.picked ? theme.accent : PAPER_LINE}
                    opacity={base * (cell.picked ? 0.58 + lit * 0.42 : 0.8)}
                  />
                </g>
              );
            })}
            {/* the one flip we started on */}
            <path
              d={`M${loneCX - 9} ${loneCY - 16} L${loneCX - 3} ${loneCY - 10} L${loneCX + 9} ${loneCY - 26}`}
              fill="none"
              stroke={theme.accent}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {sweepOn > 0.01 ? (
        <ScanLamp
          x={sweepX}
          top={GRID_Y - 14}
          height={GRID.rows * GRID.rowH + 28}
          opacity={sweepOn}
          lamp={false}
        />
      ) : null}

      {/* the verdict, typed out 2f/char */}
      {cardIn > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 230,
            top: 1090,
            width: 620,
            padding: "18px 20px",
            borderRadius: 10,
            background: theme.card,
            border: `3px solid ${theme.line}`,
            boxShadow: PAPER_SHADOW,
            opacity: cardIn,
            transform: `translateY(${cardRise}px)`,
            fontFamily: FONTS.mono,
            fontSize: 30,
            lineHeight: 1.5,
            letterSpacing: "0.08em",
            color: theme.text,
            textAlign: "center",
          }}
        >
          <div>{VERDICT[0].slice(0, Math.min(typed, VERDICT[0].length))}</div>
          <div style={{ color: theme.textDim }}>
            {VERDICT[1].slice(0, Math.max(0, typed - VERDICT[0].length))}
          </div>
        </div>
      ) : null}

      {/* the detector speaks */}
      {finalIn > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1250,
            display: "flex",
            justifyContent: "center",
            opacity: finalIn,
            transform: `scale(${0.92 + finalIn * 0.08})`,
          }}
        >
          <Stamp fontSize={50} rotate={1.4} color={theme.accent} textColor={theme.accent}>
            this was Claude.
          </Stamp>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
