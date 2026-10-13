import type { Metadata } from "next";
import { NewsDetailPage, RURAL_BLOGGER_ARTICLE } from "@/views/news-detail";

export const metadata: Metadata = {
  title: `${RURAL_BLOGGER_ARTICLE.title} — Дом журналистики`,
  description: RURAL_BLOGGER_ARTICLE.lead,
};

export default function Page() {
  return <NewsDetailPage article={RURAL_BLOGGER_ARTICLE} />;
}
