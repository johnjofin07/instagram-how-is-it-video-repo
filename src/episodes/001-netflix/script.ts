// The v3 "How Netflix Works" script as data. Scene durations are estimates
// until real narration audio exists; after `npm run tts` the render should be
// re-timed against public/audio/alignment.json (word-level timestamps).

import type { CaptionWord, SceneData } from "../types";

export type { CaptionWord, CaptionPhrase, SceneData } from "../types";

const w = (t: string, accent?: "red" | "blue"): CaptionWord => ({ t, accent });

export const SCENES: SceneData[] = [
  {
    id: "hook",
    label: "SYSTEM DESIGN",
    stepIndex: 5, // SCREEN — we start where the viewer is
    seconds: 9.6,
    narration:
      "Last night's episode was already sitting inside your internet provider's building... before you pressed play. And that's only half the trick.",
    phrases: [
      { words: [w("last"), w("night's"), w("episode"), w("was"), w("already", "red")] },
      { words: [w("inside"), w("your"), w("internet"), w("provider's", "blue"), w("building")] },
      { words: [w("before"), w("you"), w("pressed"), w("play.", "red")] },
      { words: [w("and"), w("that's"), w("only"), w("half"), w("the"), w("trick.", "blue")] },
    ],
  },
  {
    id: "ladder",
    label: "TRANSCODE",
    stepIndex: 2,
    seconds: 26,
    narration:
      "When a studio hands Netflix a movie, it's one giant master file. Netflix re-encodes it into a whole ladder of versions... from glorious 4K down to potato quality. And the ladder is custom-built for every single title: cartoons compress easily, so they get a short ladder. Grainy action films fight back, so they get a taller one.",
    phrases: [
      { words: [w("a"), w("studio"), w("hands"), w("netflix"), w("one"), w("giant")] },
      { words: [w("master", "red"), w("file.")] },
      { words: [w("netflix"), w("re-encodes"), w("it"), w("into")] },
      { words: [w("a"), w("whole"), w("ladder", "red"), w("of"), w("versions")] },
      { words: [w("from"), w("glorious"), w("4K", "blue")] },
      { words: [w("down"), w("to"), w("potato", "red"), w("quality.")] },
      { words: [w("and"), w("the"), w("ladder"), w("is"), w("custom", "blue")] },
      { words: [w("for"), w("every"), w("single"), w("title:")] },
      { words: [w("cartoons"), w("compress"), w("easily", "blue")] },
      { words: [w("action"), w("films"), w("fight"), w("back.", "red")] },
    ],
  },
  {
    id: "chunks",
    label: "PLAYER",
    stepIndex: 4,
    seconds: 27.3,
    narration:
      "Every version is then chopped into little chunks, about four seconds each. And here's the part nobody notices: your player is the one making decisions. Before every chunk, it checks how your wifi is doing... and picks a rung. Smooth connection? Here's 4K. Someone starts a video call? It quietly drops to 720, and you never see a buffering wheel.",
    phrases: [
      { words: [w("every"), w("version"), w("is"), w("chopped"), w("into")] },
      { words: [w("little"), w("chunks", "red"), w("—"), w("four"), w("seconds"), w("each.")] },
      { words: [w("and"), w("nobody"), w("notices:")] },
      { words: [w("your"), w("player", "blue"), w("makes"), w("the"), w("decisions.")] },
      { words: [w("before"), w("every", "red"), w("chunk")] },
      { words: [w("it"), w("checks"), w("your"), w("wifi", "blue")] },
      { words: [w("and"), w("picks"), w("a"), w("rung.", "red")] },
      { words: [w("smooth?"), w("here's"), w("4K.", "blue")] },
      { words: [w("video"), w("call"), w("starts?")] },
      { words: [w("it"), w("drops"), w("to"), w("720", "red")] },
      { words: [w("no"), w("buffering"), w("wheel.", "blue")] },
    ],
  },
  {
    id: "openconnect",
    label: "OPEN CONNECT",
    stepIndex: 3,
    seconds: 22.8,
    narration:
      "But Netflix's real flex? Those chunks don't come from the cloud. Netflix builds free caching servers for internet providers... it's called Open Connect. And every night, those boxes pre-download what your city will binge tomorrow. Amazon's cloud runs your login and homepage. The actual video comes from down the road.",
    phrases: [
      { words: [w("netflix's"), w("real"), w("flex?", "red")] },
      { words: [w("chunks"), w("don't"), w("come"), w("from"), w("the"), w("cloud.", "blue")] },
      { words: [w("netflix"), w("gives"), w("ISPs"), w("free", "red"), w("servers")] },
      { words: [w("it's"), w("called"), w("open"), w("connect.", "red")] },
      { words: [w("every"), w("night"), w("they"), w("pre-download", "blue")] },
      { words: [w("what"), w("your"), w("city"), w("binges"), w("tomorrow.", "red")] },
      { words: [w("AWS"), w("runs"), w("your"), w("homepage.", "blue")] },
      { words: [w("the"), w("video"), w("comes"), w("from")] },
      { words: [w("down"), w("the"), w("road.", "red")] },
    ],
  },
  {
    id: "payoff",
    label: "SCREEN",
    stepIndex: 5,
    seconds: 12.8,
    narration:
      "So when it buffers... that's not Netflix being slow. That's your wifi failing a server that did everything right. What should I break down next?",
    phrases: [
      { words: [w("so"), w("when"), w("it"), w("buffers...", "red")] },
      { words: [w("that's"), w("not"), w("netflix"), w("being"), w("slow.")] },
      { words: [w("that's"), w("your"), w("wifi", "blue"), w("failing"), w("a"), w("server")] },
      { words: [w("that"), w("did"), w("everything"), w("right.", "red")] },
      { words: [w("what"), w("should"), w("I"), w("break"), w("down"), w("next?", "blue")] },
    ],
  },
];

export const FULL_NARRATION = SCENES.map((s) => s.narration).join("\n\n");

// Set to true once public/audio/narration.mp3 exists (via `npm run tts` or web UI).
export const HAS_NARRATION = true;
