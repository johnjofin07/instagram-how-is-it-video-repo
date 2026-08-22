// Episode registry — add new episodes here and they appear in Remotion Studio.
import { episode as netflix } from "./001-netflix";
import { episode as gmapsTraffic } from "./002-google-maps-traffic";
import { episode as airFryer } from "./003-air-fryer";
import { episode as netflixDelivery } from "./004-netflix-delivery";
import { episode as underseaCables } from "./005-undersea-cables";
import { episode as blackBox } from "./006-black-box";
import { episode as aiWatermark } from "./007-ai-watermark";
import { episode as microwave } from "./008-microwave";
import { episode as noiseCancel } from "./009-noise-cancel";
import { episode as elevator } from "./010-elevator";
import { episode as shazam } from "./011-shazam";
import { episode as airplaneToilet } from "./012-airplane-toilet";
import { episode as netflixPapersky } from "./013-netflix-papersky";
import type { Episode } from "./types";

export const EPISODES: Episode[] = [
  netflix,
  gmapsTraffic,
  airFryer,
  netflixDelivery,
  underseaCables,
  blackBox,
  aiWatermark,
  microwave,
  noiseCancel,
  elevator,
  shazam,
  airplaneToilet,
  netflixPapersky,
];
