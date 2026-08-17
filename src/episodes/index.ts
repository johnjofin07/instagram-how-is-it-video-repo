// Episode registry — add new episodes here and they appear in Remotion Studio.
import { episode as netflix } from "./001-netflix";
import { episode as gmapsTraffic } from "./002-google-maps-traffic";
import type { Episode } from "./types";

export const EPISODES: Episode[] = [netflix, gmapsTraffic];
