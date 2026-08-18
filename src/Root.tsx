import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, Still, staticFile } from "remotion";
import { Avatar, Banner, Emblem } from "./brand/Avatar";
import { Cover001, Cover002, Cover003 } from "./brand/Cover";
import { Background } from "./components/Background";
import { Captions } from "./components/Captions";
import { SectionHeader, Stepper } from "./components/Chrome";
import { EPISODES } from "./episodes";
import type { Episode } from "./episodes/types";
import { VIDEO } from "./theme";
import { ThemeProvider } from "./themes";

const toFrames = (s: number) => Math.round(s * VIDEO.fps);

const sceneSeconds = (ep: Episode, i: number) =>
  ep.timing.sceneSeconds[i] ?? ep.scenes[i].seconds;

const totalFrames = (ep: Episode) =>
  ep.scenes.reduce((n, _s, i) => n + toFrames(sceneSeconds(ep, i)), 0);

const EpisodeVideo: React.FC<{ episode: Episode }> = ({ episode }) => {
  let cursor = 0;
  return (
    <ThemeProvider theme={episode.theme}>
      <AbsoluteFill>
      {episode.hasNarration ? (
        <Audio src={staticFile(episode.audioPath)} />
      ) : null}
      {episode.scenes.map((scene, i) => {
        const from = cursor;
        const durationInFrames = toFrames(sceneSeconds(episode, i));
        cursor += durationInFrames;
        const SceneComp = episode.components[scene.id];
        return (
          <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
            <Background />
            <SceneComp />
            <SectionHeader label={scene.label} index={i} total={episode.scenes.length} />
            <Stepper
              steps={episode.steps}
              activeIndex={scene.stepIndex}
              allDone={i === episode.scenes.length - 1}
              intro={i === 0}
            />
            <Captions lines={episode.timing.sceneCaptions[i] ?? []} />
          </Sequence>
        );
      })}
      </AbsoluteFill>
    </ThemeProvider>
  );
};

// Bind each episode via closure — components can't travel through
// defaultProps (Remotion JSON-serializes those, stripping functions).
const EPISODE_COMPONENTS = EPISODES.map((ep) => {
  const Comp: React.FC = () => <EpisodeVideo episode={ep} />;
  return { ep, Comp };
});

export const RemotionRoot: React.FC = () => (
  <>
    {EPISODE_COMPONENTS.map(({ ep, Comp }) => (
      <Composition
        key={ep.slug}
        id={ep.slug}
        component={Comp}
        durationInFrames={totalFrames(ep)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    ))}
    <Still id="brand-avatar" component={Avatar} width={1080} height={1080} />
    <Still id="brand-emblem" component={Emblem} width={1080} height={1080} />
    <Still id="brand-banner" component={Banner} width={2048} height={1152} />
    <Still id="cover-001" component={Cover001} width={1080} height={1920} />
    <Still id="cover-002" component={Cover002} width={1080} height={1920} />
    <Still id="cover-003" component={Cover003} width={1080} height={1920} />
  </>
);
