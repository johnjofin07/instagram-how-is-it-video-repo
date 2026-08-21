import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useEnter } from "../../../components/ui";
import { useTheme } from "../../../themes";
import {
  Chip,
  ChipGlyph,
  DocCard,
  docWords,
  easeOut,
  gate,
  hash,
  LampGlyph,
  ScanLamp,
  Stamp,
} from "./kit";

// hook — THE MARK.
//
// [v2] RESTRUCTURED: the scene opens ON the money shot. At frame 0 the scan
// lamp is ALREADY mid-sweep across the page with ~7 words developed behind it
// (§0.7 device 2 — the viewer sees something happening before they can blink),
// and the title stamp pops in the same 9 frames (device 1). Then the lamp goes
// out, the marks sink back into ordinary kraft text, the page gets copied (a
// re-flash proves the marks rode along), and the scene closes on the REHOOK
// (device 4): "one embarrassing flaw / already failing students" — the loop
// that `catch` pays off 60 seconds later.
//
// Beats live as fractions of D so a post-timing retune is one number.
// D = timing.json sceneSeconds[0] (18.75s) * 30, rounded the way Root.tsx
// rounds it (562.5 -> 563).
const D = 563;
const f = (p: number) => Math.round(D * p);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Stage geometry (comp space). Safe band: y 440-1370, x 65-1015.
const DOC_W = 700;
const DOC_H = 420;
const DOC_X = 190; // 190 -> 890 (centered on 540)
const DOC_Y = 740; // 740 -> 1160
const DOC_LINES = 8;
const COPY_DX = 30;
const COPY_DY = 26;

const WORDS = docWords(DOC_W, DOC_H, DOC_LINES);
// ~14 scattered word choices carry the mark. Seeded — never random.
const MARKED = WORDS.filter((w) => hash(w.i, 9, 21) > 0.655)
  .slice(0, 14)
  .map((w) => w.i);
const MARK_X = new Map(MARKED.map((i) => [i, DOC_X + WORDS[i].x + WORDS[i].w / 2]));

export const Hook: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();
  // title hook — near-instant pop, legible by f9, no fade-ahead
  const claim = useEnter(0, { damping: 11 });

  // ---- the sweep is ALREADY IN PROGRESS at frame 0 (x520 of a 190..890 page)
  const sweepEnd = f(0.26); // 146 — "carries a hidden signature"
  const sweepX = interpolate(frame, [0, sweepEnd], [520, 950], clamp);
  const lampOn = gate(frame, -20, f(0.28), 8);

  // the lamp goes out and the marks sink back into ordinary text, so
  // "You can't see it" (f214) lands on a page that looks like any other
  const marksOut = interpolate(frame, [f(0.30), f(0.37)], [1, 0], clamp);

  const chipSig = gate(frame, f(0.19), f(0.41), 9);

  // ---- copy-paste: the duplicate lands with a thunk, marks intact
  const pasteAt = f(0.47); // 264 — "Copy paste won't remove it"
  const paste = gate(frame, pasteAt, undefined, 7);
  const thunk = interpolate(frame, [pasteAt, pasteAt + 7], [1.06, 1], {
    ...clamp,
    easing: easeOut,
  });

  // ---- the re-flash: a quick second pass proves the marks rode along
  const flashAt = f(0.53); // 298
  const flashEnd = f(0.605); // 340
  const flashX = interpolate(frame, [flashAt, flashEnd], [200, 960], clamp);
  const flashLamp = gate(frame, flashAt, f(0.594), 6);
  const flashHold = interpolate(frame, [flashEnd, f(0.645)], [1, 0], clamp);

  // develop strength for a word whose center sits at comp-x `wx`
  const developOf = (wx: number) => {
    const d1 = sweepX - wx;
    const beam1 = Math.max(0, 1 - Math.abs(d1) / 120);
    let g = Math.max(beam1, d1 > 0 ? 0.62 : 0) * marksOut;
    if (frame >= flashAt) {
      const d2 = flashX - wx;
      const beam2 = Math.max(0, 1 - Math.abs(d2) / 120);
      g = Math.max(g, Math.max(beam2, d2 > 0 ? 0.55 : 0) * flashHold);
    }
    return g;
  };

  const chipCopy = gate(frame, f(0.5), f(0.68), 10);

  // ---- the rehook (§0.7 device 4) — lands exactly on "one embarrassing"
  const rehook = gate(frame, f(0.715), undefined, 8);
  const rehookChip = gate(frame, f(0.91), undefined, 10);

  return (
    <AbsoluteFill>
      {/* title hook — instant pop, legible by f9 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 452,
          display: "flex",
          justifyContent: "center",
          // the spring peaks at ~1.18 around f7; unclamped, a full-width
          // stamp punches through the x65/x1015 margins on the way up
          transform: `scale(${Math.min(claim, 1.05)})`,
        }}
      >
        {/* 40px, not the plan's 58: mono at 25 chars/line, plus the spring's
            ~1.18 overshoot at f9, blew straight through the x65/x1015 margins
            at anything larger */}
        <Stamp fontSize={40} rotate={-1.5}>
          Anthropic is watermarking
          <br />
          <span style={{ color: theme.accent }}>your text</span>
        </Stamp>
      </div>

      {/* sub-chip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 630,
          textAlign: "center",
          opacity: chipSig,
          transform: `translateY(${interpolate(chipSig, [0, 1], [18, 0])}px)`,
        }}
      >
        <Chip color={theme.accent}>a hidden signature</Chip>
      </div>

      {/* the original page */}
      <DocCard
        w={DOC_W}
        h={DOC_H}
        lines={DOC_LINES}
        revealed={MARKED}
        reveal={(i) => developOf(MARK_X.get(i) ?? 0)}
        style={{ left: DOC_X, top: DOC_Y }}
      />

      {/* the copy — lands offset, carrying the same marks */}
      {frame >= pasteAt ? (
        <div
          style={{
            position: "absolute",
            left: DOC_X + COPY_DX,
            top: DOC_Y + COPY_DY,
            opacity: paste,
            transform: `scale(${thunk})`,
            transformOrigin: "center",
          }}
        >
          <DocCard
            w={DOC_W}
            h={DOC_H}
            lines={DOC_LINES}
            revealed={MARKED}
            reveal={(i) => developOf((MARK_X.get(i) ?? 0) + COPY_DX)}
          />
        </div>
      ) : null}

      {/* the subject — an original AI tile with a blinking caret, no logo (§0.4) */}
      <ChipGlyph
        size={90}
        style={{ position: "absolute", left: DOC_X - 34, top: DOC_Y - 34 }}
      />

      {/* the money shot — the band is clipped to the page so it reads as light
          ON the paper, not as a warm rectangle floating beside it */}
      {lampOn > 0.01 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: DOC_X,
              top: DOC_Y,
              width: DOC_W,
              height: DOC_H,
              overflow: "hidden",
              borderRadius: 14,
            }}
          >
            <ScanLamp
              x={sweepX - DOC_X}
              top={0}
              height={DOC_H}
              opacity={lampOn}
              lamp={false}
            />
          </div>
          <LampGlyph
            size={130}
            style={{
              position: "absolute",
              left: sweepX - 65,
              top: DOC_Y - 112,
              opacity: lampOn,
            }}
          />
        </>
      ) : null}

      {/* the re-flash over the copy */}
      {flashLamp > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: DOC_X + COPY_DX,
            top: DOC_Y + COPY_DY,
            width: DOC_W,
            height: DOC_H,
            overflow: "hidden",
            borderRadius: 14,
          }}
        >
          <ScanLamp
            x={flashX - DOC_X - COPY_DX}
            top={0}
            height={DOC_H}
            opacity={flashLamp}
            lamp={false}
          />
        </div>
      ) : null}

      {/* the copy-paste line */}
      {chipCopy > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1290,
            textAlign: "center",
            opacity: chipCopy,
            transform: `translateY(${interpolate(chipCopy, [0, 1], [18, 0])}px)`,
          }}
        >
          <Chip color={theme.accent}>copy-paste won&apos;t remove it</Chip>
        </div>
      ) : null}

      {/* ---- the REHOOK: the loop `catch` closes 60 seconds later */}
      {rehook > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1156,
            display: "flex",
            justifyContent: "center",
            opacity: rehook,
            transform: `scale(${0.93 + rehook * 0.07})`,
          }}
        >
          <Stamp fontSize={44} rotate={1.4}>
            one embarrassing <span style={{ color: theme.warn }}>flaw</span>
          </Stamp>
        </div>
      ) : null}

      {rehookChip > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1298,
            textAlign: "center",
            opacity: rehookChip,
            transform: `translateY(${interpolate(rehookChip, [0, 1], [18, 0])}px)`,
          }}
        >
          <Chip color={theme.warn}>already failing students</Chip>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
