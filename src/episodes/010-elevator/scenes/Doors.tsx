import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import {
  Chip,
  CloseButton,
  DoorPanel,
  HandPress,
  Stamp,
  TimerArc,
  clamp,
  doorPanelLayout,
  fadeIn,
} from "./kit";

// Scene 5 — THE DOORS · D = 212f (7.08s, timing.json). The hook's shot,
// resolved. One press. The doors close right after — and the 30%-opacity ghost
// arc behind the plate shows the timer had just hit zero anyway.
//
// Beats pinned to the recording:
//   f0-96    "So next time the doors shut right after you press it,"
//            -> the press lands on "press" @f84
//   f108-148 "they were closing anyway."
//            -> doors slide shut f96-116, closing stamp in at f112
//   f164-212 stepper `allDone` hold -> [v2] on-screen CTA chip (§0.7.4). The
//            spoken CTA is not in this recording, so the chip carries it.
//
// [v2] This scene lost ~43 frames, and it now has to seat TWO stacked pieces
// of type under the panel. So the panel sits higher than v1 (452, not 470):
// panel bottom 1108 · stamp 1128-1285 · CTA chip 1298-1353 · safe line 1370.
const PANEL_W = 430;
const PANEL_LEFT = (1080 - PANEL_W) / 2; // 325
const PANEL_TOP = 452;
const L = doorPanelLayout(PANEL_W, true);
const PLATE_CY = PANEL_TOP + L.doorsH + L.gap + L.plateH / 2; // 1018

const PRESS = 82;

export const Doors: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const press = interpolate(frame, [PRESS, PRESS + 5, PRESS + 14], [0, 1, 0], clamp);
  const ring = interpolate(frame, [PRESS + 2, PRESS + 28], [0, 1], clamp);

  // it was already at zero when the finger arrived
  const t = interpolate(frame, [0, 94], [0.8, 0.985], clamp);
  const open = interpolate(frame, [96, 116], [1, 0], clamp);

  const closer = fadeIn(frame, 112, 14);
  const cta = fadeIn(frame, 152, 12);
  const handO = interpolate(frame, [98, 118], [1, 0], clamp);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: PANEL_LEFT, top: PANEL_TOP }}>
        <DoorPanel w={PANEL_W} open={open}>
          <CloseButton size={150} pressed={press} ring={ring} dead />
        </DoorPanel>
      </div>

      {/* the ghost of the law, still doing all the work */}
      <div style={{ position: "absolute", left: 540 - 95, top: PLATE_CY - 95, opacity: 0.3 }}>
        <TimerArc size={190} t={t} />
      </div>

      <HandPress
        size={105}
        press={press}
        style={{ position: "absolute", left: 588, top: 991, opacity: handO }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1128,
          display: "flex",
          justifyContent: "center",
          opacity: closer,
          transform: `translateY(${(1 - closer) * 16}px)`,
        }}
      >
        <Stamp fontSize={48} rotate={-1.6} color={theme.second}>
          they were
          <br />
          closing anyway.
        </Stamp>
      </div>

      {/* [v2] the CTA the recording no longer speaks */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1298,
          textAlign: "center",
          opacity: cta,
          transform: `translateY(${(1 - cta) * 12}px)`,
        }}
      >
        <Chip style={{ fontSize: 24, letterSpacing: "0.10em" }}>
          what machine should I break down next? ↓
        </Chip>
      </div>
    </AbsoluteFill>
  );
};
