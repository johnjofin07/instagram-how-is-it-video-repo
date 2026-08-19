// Episode registry — add new episodes here and they appear in Remotion Studio.
import { episode as netflix } from "./001-netflix";
import { episode as gmapsTraffic } from "./002-google-maps-traffic";
import { episode as airFryer } from "./003-air-fryer";
import { episode as netflixDelivery } from "./004-netflix-delivery";
import { episode as underseaCables } from "./005-undersea-cables";
import { episode as blackBox } from "./006-black-box";
import type { Episode } from "./types";

export const EPISODES: Episode[] = [
  netflix,
  gmapsTraffic,
  airFryer,
  netflixDelivery,
  underseaCables,
  blackBox,
];
