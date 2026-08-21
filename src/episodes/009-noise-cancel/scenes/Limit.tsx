import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../../themes";
import {
  ANTI,
  BabyCry,
  ChipBadge,
  Chip,
  MonoTag,
  NOISE,
  PlaneRow,
  ScopeFrame,
  SUM,
  Wave,
  clamp,
  easeOut,
} from "./kit";

// limit — THE LIMIT. Payoff + CTA.
// v2 retime: 540f (18s), DOWN from ~570f — the spoken CTA was cut from the
// recording (§0.7.4), so the scene lost ~2s of tail and the whole act-2 block
// had to move earlier and tighten.
//
// Act 1 (scope): a steady hum is cancelled perfectly, then two jagged bursts
// break it — the anti-noise copy arrives 12 frames late, so the SUM line (a
// real point-wise sum) spikes exactly where the two shapes disagree.
// Act 2 (cabin): the drone gets erased by a sweeping `flatten`, and then the
// cry sails straight through the quiet. Acts are hard-sequenced, never
// crossfaded (005 lesson).
//
// [v2] The CTA is now ON SCREEN ONLY. It is a theme `card` chip in `textDim`
// during the `allDone` hold, hard-sequenced AFTER the closing punchline chip
// in the same bottom slot — they never share a frame. The recording ends at
// f498, so the CTA owns the last ~1.3s of the episode (and the loop point).
//
// Beat table (D = 540; narration frames from timing.json):
//   f1-189   "But the chip can only fight ... Engine hum? Easy. It never changes."
//   f14-190  "predictable = erasable"
//   f190-250 jagged burst #1 ("A crying baby?", f191-233)
//   f236-338 "too sudden to predict"; chip badge wobbles, recalculating
//   f268-332 jagged burst #2 ("Gone before the anti-noise fires.")
//   f344     hard cut to the cabin ("That's why headphones can silence…")
//   f368-442 the drone is erased left→right ("the whole plane", f414-451)
//   f452-480 the cry bursts through the quiet ("but never the baby", f454)
//   f444-494 closing chip: "the plane: silenced. the baby: never."
//   f500-540 [v2] CTA chip: "what machine should I break down next? ↓"
const D = 540;

// Row labels sit OUTSIDE the scope: inside, the frame's own dashed centre axis
// ran straight through "result" and killed it.
const SCOPE = { x: 262, y: 660, w: 738, h: 520 };
const LABEL_X = 88;
const ROW_NOISE = 750;
const ROW_SUM = 920;
const ROW_ANTI = 1090;
const WX = 290;
const WW = 690;
const K = (Math.PI * 2 * 5) / WW;
const AMP = 40; // 52 let the jagged peaks collide with the neighbouring row
const LAG = 12; // frames the chip is behind when the sound is unpredictable

const PLANE = { x: 80, y: 700, w: 900 };
const DRONE_X = 140; // local x60 of the cabin — just past the engine wedge
const DRONE_W = 640; // stops short of the window
const DRONE_ROWS = [790, 850, 910];

// Burst envelope: two jagged events, each with a soft in/out so the wave
// *becomes* jagged rather than popping.
const envAt = (f: number) =>
  Math.max(
    interpolate(f, [190, 204, 236, 250], [0, 1, 1, 0], clamp),
    interpolate(f, [268, 282, 318, 332], [0, 1, 1, 0], clamp),
  );

// Bottom slot, sequenced: the punchline, then the CTA. 6f of clear air between.
const CLOSE_IN = D - 96; // 444
const CLOSE_OUT = D - 46; // 494
const CTA_IN = CLOSE_OUT + 6; // 500 — CTA owns the last 40f (and the loop point)

export const Limit: React.FC = () => {
  const theme = useTheme();
  const frame = useCurrentFrame();

  const jag = envAt(frame);
  const jagAnti = envAt(frame - LAG);
  const lag = LAG * jag;

  // The acts hand over on ONE frame: the scope is still fading at f343 and the
  // cabin owns f344. (An earlier split left the stage empty for ~10f.)
  const scopeFade = interpolate(frame, [0, 14, 336, 344], [0, 1, 1, 0], clamp);
  const act1 = frame < 344;
  const act2 = frame >= 344;

  const badgeLit = 0.92 - 0.55 * jag * (0.5 + 0.5 * Math.sin(frame * 0.9));
  const badgeWobble = frame >= 236 && frame < 336 ? Math.sin(frame * 0.55) * 5 : 0;

  const planeIn = interpolate(frame, [344, 360], [0, 1], clamp);
  const burst = interpolate(frame, [452, 484], [0, 1], { ...clamp, easing: easeOut });
  const sweepAvg = interpolate(frame, [368, 430], [0, 1], { ...clamp, easing: easeOut });

  return (
    <AbsoluteFill>
      {/* ------------------------------------------- top slot, one at a time */}
      {frame < 194 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            textAlign: "center",
            opacity: interpolate(frame, [14, 30, 180, 192], [0, 1, 1, 0], clamp),
          }}
        >
          <Chip color={theme.good}>predictable = erasable</Chip>
        </div>
      ) : null}
      {frame >= 234 && frame < 340 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            textAlign: "center",
            opacity: interpolate(frame, [234, 250, 328, 338], [0, 1, 1, 0], clamp),
          }}
        >
          <Chip color={theme.warn}>too sudden to predict</Chip>
        </div>
      ) : null}
      {frame >= 424 && frame < 484 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            textAlign: "center",
            opacity: interpolate(frame, [424, 440, 474, 482], [0, 1, 1, 0], clamp),
          }}
        >
          <Chip color={ANTI}>engine hum: erased</Chip>
        </div>
      ) : null}
      {frame >= 490 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            textAlign: "center",
            opacity: interpolate(frame, [490, 504], [0, 1], clamp),
          }}
        >
          <Chip color={NOISE}>a cry is not</Chip>
        </div>
      ) : null}

      {/* ------------------------------------------------------------- act 1 */}
      {act1 ? (
        <>
          <div style={{ opacity: scopeFade }}>
            <ChipBadge x={392} y={600} size={84} lit={badgeLit} rotate={badgeWobble} />
            {frame < 232 ? (
              <MonoTag x={448} y={588} size={22} color={ANTI} opacity={interpolate(frame, [26, 42, 218, 230], [0, 1, 1, 0], clamp)}>
                locked on
              </MonoTag>
            ) : (
              <MonoTag x={448} y={588} size={22} color={theme.warn} opacity={interpolate(frame, [238, 254], [0, 1], clamp)}>
                recalculating
              </MonoTag>
            )}
          </div>

          <ScopeFrame x={SCOPE.x} y={SCOPE.y} w={SCOPE.w} h={SCOPE.h} opacity={scopeFade} />

          <MonoTag x={LABEL_X} y={ROW_NOISE - 14} size={22} color={NOISE} opacity={scopeFade}>
            engine hum
          </MonoTag>
          <MonoTag x={LABEL_X} y={ROW_SUM - 14} size={22} opacity={scopeFade}>
            result
          </MonoTag>
          <MonoTag x={LABEL_X} y={ROW_ANTI - 14} size={22} color={ANTI} opacity={scopeFade}>
            anti-noise
          </MonoTag>

          <Wave
            x={WX}
            y={ROW_NOISE}
            w={WW}
            amp={AMP * (1 + jag * 0.12)}
            freq={K}
            phase={-frame * 0.16}
            jagged={jag}
            seed={3}
            color={NOISE}
            strokeWidth={6}
            glow={10}
            opacity={scopeFade}
          />
          <Wave
            x={WX}
            y={ROW_ANTI}
            w={WW}
            amp={AMP * (1 + jagAnti * 0.12)}
            freq={K}
            phase={-(frame - lag) * 0.16 + Math.PI}
            jagged={jagAnti}
            seed={3}
            color={ANTI}
            strokeWidth={6}
            glow={10}
            opacity={scopeFade}
          />
          {/* the sum of the two rows above — flat while they agree, spiking
              exactly where the late copy no longer matches */}
          <Wave
            x={WX}
            y={ROW_SUM}
            w={WW}
            amp={AMP * (1 + jag * 0.12)}
            freq={K}
            phase={-frame * 0.16}
            jagged={jag}
            seed={3}
            add={{
              amp: AMP * (1 + jagAnti * 0.12),
              freq: K,
              phase: -(frame - lag) * 0.16 + Math.PI,
              jagged: jagAnti,
              seed: 3,
            }}
            color={SUM}
            strokeWidth={8}
            glow={12 + jag * 16}
            opacity={scopeFade}
          />
        </>
      ) : null}

      {/* ------------------------------------------------------------- act 2 */}
      {act2 ? (
        <div style={{ opacity: planeIn }}>
          <PlaneRow x={PLANE.x} y={PLANE.y} w={PLANE.w} />

          {DRONE_ROWS.map((ry, i) => {
            const flat = interpolate(frame, [366 + i * 8, 424 + i * 8], [0, 1], {
              ...clamp,
              easing: easeOut,
            });
            return (
              <Wave
                key={ry}
                x={DRONE_X}
                y={ry}
                w={DRONE_W}
                amp={20}
                freq={0.0509}
                phase={-frame * 0.2 - i * 1.1}
                flatten={flat}
                color={NOISE}
                strokeWidth={5}
                glow={6}
                opacity={1 - flat * 0.72}
              />
            );
          })}

          {/* the anti-noise sweep doing the erasing */}
          {sweepAvg > 0.01 && sweepAvg < 0.995 ? (
            <div
              style={{
                position: "absolute",
                left: DRONE_X + sweepAvg * DRONE_W - 4,
                top: 756,
                width: 8,
                height: 198,
                borderRadius: 4,
                background: ANTI,
                opacity: 0.85,
                boxShadow: `0 0 34px ${ANTI}`,
              }}
            />
          ) : null}

          {frame < 438 ? (
            <MonoTag
              x={LABEL_X}
              y={1128}
              size={22}
              color={NOISE}
              opacity={interpolate(frame, [350, 366, 428, 436], [0, 1, 1, 0], clamp)}
            >
              engine drone
            </MonoTag>
          ) : (
            <MonoTag x={LABEL_X} y={1128} size={22} color={ANTI} opacity={interpolate(frame, [442, 456], [0, 1], clamp)}>
              erased
            </MonoTag>
          )}

          {burst > 0.01 ? <BabyCry x={528} y={1002} size={92} burst={burst} /> : null}

          {/* -------------------------------------- bottom slot, hard-sequenced */}
          {frame < CTA_IN ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 1280,
                textAlign: "center",
                opacity: interpolate(
                  frame,
                  [CLOSE_IN, CLOSE_IN + 16, CLOSE_OUT - 10, CLOSE_OUT],
                  [0, 1, 1, 0],
                  clamp,
                ),
                transform: `translateY(${interpolate(frame, [CLOSE_IN, CLOSE_IN + 16], [18, 0], { ...clamp, easing: easeOut })}px)`,
              }}
            >
              <Chip color={theme.text}>the plane: silenced. the baby: never.</Chip>
            </div>
          ) : (
            /* [v2] on-screen CTA (§0.7.4) — the spoken line was cut from the
               take. Theme `card` chip in `textDim`, same slot as the punchline
               it replaces, so nothing collides. Bottom edge ≈ y1337 < 1370. */
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 1280,
                textAlign: "center",
                opacity: interpolate(frame, [CTA_IN, CTA_IN + 12], [0, 1], clamp),
                transform: `translateY(${interpolate(frame, [CTA_IN, CTA_IN + 12], [14, 0], { ...clamp, easing: easeOut })}px)`,
              }}
            >
              <Chip style={{ fontSize: 23, letterSpacing: "0.1em" }}>
                what machine should I break down next? ↓
              </Chip>
            </div>
          )}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
