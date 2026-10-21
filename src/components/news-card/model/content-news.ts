import type { NewsCardData } from "../ui/news-card";
import type { ContentNews } from "@/shared/types/model/content.type";
import { contentImageUrl } from "@/shared/lib/content-image-url";
import { newsDate } from "@/shared/lib/news-date";

export function newsCardData(news: ContentNews): NewsCardData {
  return {
    id: String(news.id),
    title: news.title,
    description: news.description,
    date: news.published_at_iso ?? newsDate(news),
    dateLabel: news.published_at,
    image: contentImageUrl(news.image),
    imageAlt: news.title,
    href: `/news/${news.slug || news.id}`,
  };
}
