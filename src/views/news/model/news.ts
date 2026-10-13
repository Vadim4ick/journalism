import { HOME_NEWS } from "@/modules/home/home-news/model/news";
import type { NewsCardData } from "@/components/news-card";

// Eight demo slots from Figma 381:1439, all showing the same available article.
// Replace with distinct articles when a news data source is available.
export const NEWS: readonly NewsCardData[] = [0, 1, 0, 1, 2, 0, 2, 1].map(
  (source, index) => ({ ...HOME_NEWS[source], id: `news-preview-${index + 1}` }),
);
