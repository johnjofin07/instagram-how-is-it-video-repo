import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import {
  Chip,
  CloseButton,
  DoorPanel,
  FireKey,
  HandPress,
  Keyhole,
  Stamp,
  TimerArc,
  Wheelchair,
  clamp,
  doorPanelLayout,
  fadeIn,
  fadeOut,
} from "./kit";

// Scene 4 — THE TIMER · D = 410f (13.68s, timing.json).
// The teal arc is the law. It sweeps, and NOTHING a finger does moves it —
// seven dead grey flashes across the scene. Then the fire key turns, the ring
// flashes ACCENT for the first time in the episode, and the doors snap shut
// in 6 frames. Every other door move in this episode is >= 20f; that speed
// contrast IS the payoff, so don't soften it.
//
// [v2] REHOOK PAYOFF: the closing stamp carries the SAME bare `Keyhole` glyph
// the hook parked next to "it works for exactly one person" — the loop closes
// on the glyph, and the words finally name him. (The `FireKey` beside the
// plate is that same escutcheon with a key in it — see kit's `KeyholeFace`.)
//
// Beats pinned to the recording (frames from timing.json):
//   f0-63    "So why does the close button exist?"
//   f86-185  "By law, the doors must stay open long enough for a wheelchair."
//   f217-257 "The button can't skip that timer."   -> the 5-press montage
//   f268-331 "And the one person it truly works for?"
//   f346-407 "A firefighter with a key."           -> key turns f352, SNAP f366
// The audio runs to the last frame, so the closing hold is only ~38f.

const PANEL_W = 430;
const PANEL_LEFT = (1080 - PANEL_W) / 2; // 325
const PANEL_TOP = 678;
const L = doorPanelLayout(PANEL_W, true);
const PLATE_CY = PANEL_TOP + L.doorsH + L.gap + L.plateH / 2; // 1244
const DOOR_BOTTOM = PANEL_TOP + L.doorsH; // 1134

const DEAD_PRESSES = [128, 160, 222, 236, 250, 264, 278];
const KEY_TURN = 352;
const SNAP = 366;

const pressAmount = (frame: number, start: number) =>
  interpolate(frame, [start, start + 4, start + 12], [0, 1, 0], clamp);

export const Timer: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const press = Math.max(0, ...DEAD_PRESSES.map((p) => pressAmount(frame, p)));
  const deadRing = (() => {
    const active = DEAD_PRESSES.filter((p) => frame >= p + 2 && frame < p + 26);
    return active.length
      ? interpolate(frame, [active[active.length - 1] + 2, active[active.length - 1] + 26], [0, 1], clamp)
      : 0;
  })();

  // the law: unmoved by every press, and still not finished when the key wins
  const t = interpolate(frame, [88, 356], [0, 0.82], clamp);
  const arcO = fadeIn(frame, 84, 12);

  const chairX = interpolate(frame, [100, 190], [70, 200], clamp);
  const chairO = Math.min(fadeIn(frame, 94, 10), fadeOut(frame, 194, 20));
  const chairS = interpolate(frame, [194, 214], [1, 0.72], clamp);

  const keyO = fadeIn(frame, 334, 10);
  const turned = interpolate(frame, [KEY_TURN, KEY_TURN + 12], [0, 1], clamp);
  const keyRing = interpolate(frame, [SNAP - 2, SNAP + 40], [0, 1], clamp);
  const live = frame >= SNAP - 2;

  const open = interpolate(frame, [SNAP, SNAP + 6], [1, 0], clamp);
  const handO = interpolate(frame, [318, 332], [1, 0], clamp);

  const stampA = Math.min(fadeIn(frame, 8, 10), fadeOut(frame, 322, 10));
  const stampB = fadeIn(frame, 342, 10);
  const chipLaw = Math.min(fadeIn(frame, 120, 10), fadeOut(frame, 318, 10));

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: PANEL_LEFT, top: PANEL_TOP }}>
        <DoorPanel w={PANEL_W} open={open}>
          <CloseButton
            size={150}
            pressed={press}
            ring={live ? keyRing : deadRing}
            dead={!live}
          />
        </DoorPanel>
      </div>

      {/* the law, drawn around the plate — teal, and utterly unbothered */}
      <div style={{ position: "absolute", left: 540 - 95, top: PLATE_CY - 95, opacity: arcO }}>
        <TimerArc size={190} t={t} />
      </div>

      {/* the reason the timer exists */}
      {chairO > 0 ? (
        <Wheelchair
          size={130}
          style={{
            position: "absolute",
            left: chairX,
            top: DOOR_BOTTOM - 130,
            opacity: chairO,
            transform: `scale(${chairS})`,
            transformOrigin: "bottom right",
          }}
        />
      ) : null}

      <HandPress size={105} press={press} style={{ position: "absolute", left: 588, top: 1217, opacity: handO }} />

      {/* the one person the button truly works for */}
      {keyO > 0 ? (
        <FireKey size={130} turned={turned} style={{ position: "absolute", left: 686, top: 1178, opacity: keyO }} />
      ) : null}

      {/* --- type --------------------------------------------------------- */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 452,
          display: "flex",
          justifyContent: "center",
          opacity: stampA,
          transform: `translateY(${(1 - stampA) * 14}px)`,
        }}
      >
        <Stamp fontSize={44}>so why does it exist?</Stamp>
      </div>
      {/* the loop from the hook, closed — same glyph, now with a name */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 452,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          opacity: stampB,
          transform: `translateY(${(1 - stampB) * 14}px)`,
        }}
      >
        <Keyhole size={86} turned={turned} />
        <Stamp fontSize={44} color={theme.second}>
          the one person:
          <br />
          a firefighter
        </Stamp>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 612,
          textAlign: "center",
          opacity: chipLaw,
          transform: `translateY(${(1 - chipLaw) * 14}px)`,
        }}
      >
        <Chip color={theme.accent}>the law holds the door</Chip>
      </div>
    </AbsoluteFill>
  );
};
