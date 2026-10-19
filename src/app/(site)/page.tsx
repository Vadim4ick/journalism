import { HomePage } from "@/views/home";
import { contentServices } from "@/shared/services/content";
import type { ContentEvent, ContentNews } from "@/shared/types/model/content.type";
import { connection } from "next/server";

export default async function Page() {
  await connection();

  const [eventsResult, newsResult] = await Promise.allSettled([
    contentServices.getEvents({ per_page: 3 }),
    contentServices.getNews({ per_page: 3 }),
  ]);

  let events: ContentEvent[] = [];
  let news: ContentNews[] = [];
  let eventsError = false;
  let newsError = false;

  if (eventsResult.status === "fulfilled" && eventsResult.value.status === "success" && Array.isArray(eventsResult.value.data?.items)) {
    events = eventsResult.value.data.items;
  } else {
    console.error("Не удалось загрузить предстоящие события для главной", eventsResult.status === "rejected" ? eventsResult.reason : eventsResult.value);
    eventsError = true;
  }

  if (newsResult.status === "fulfilled" && newsResult.value.status === "success" && Array.isArray(newsResult.value.data?.items)) {
    news = newsResult.value.data.items;
  } else {
    console.error("Не удалось загрузить новости для главной", newsResult.status === "rejected" ? newsResult.reason : newsResult.value);
    newsError = true;
  }

  return <HomePage events={events} news={news} eventsError={eventsError} newsError={newsError} />;
}
