import { HomePage } from "@/views/home";
import { contentServices } from "@/shared/services/content";
import type { ContentEvent, ContentNews, ContentMedia, ContentProject } from "@/shared/types/model/content.type";
import { connection } from "next/server";

export const revalidate = 0;

export default async function Page() {
  await connection();

  const [eventsResult, newsResult, mediaResult, projectsResult] = await Promise.allSettled([
    contentServices.getEvents({ per_page: 3 }),
    contentServices.getNews({ per_page: 3 }),
    contentServices.getMedia({ page: 1, per_page: 12 }),
    contentServices.getProjects({ page: 1, per_page: 3 }),
  ]);

  let events: ContentEvent[] = [];
  let news: ContentNews[] = [];
  let albums: ContentMedia[] = [];
  let projects: ContentProject[] = [];
  let eventsError = false;
  let newsError = false;
  let albumsError = false;
  let projectsError = false;

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

  if (mediaResult.status === "fulfilled" && mediaResult.value.status === "success" && Array.isArray(mediaResult.value.data?.items)) {
    albums = mediaResult.value.data.items;
  } else {
    console.error("Не удалось загрузить фотоальбомы для главной", mediaResult.status === "rejected" ? mediaResult.reason : mediaResult.value);
    albumsError = true;
  }

  if (projectsResult.status === "fulfilled" && projectsResult.value.status === "success" && Array.isArray(projectsResult.value.data?.items)) {
    projects = projectsResult.value.data.items;
  } else {
    console.error("Не удалось загрузить проекты для главной", projectsResult.status === "rejected" ? projectsResult.reason : projectsResult.value);
    projectsError = true;
  }

  return <HomePage events={events} news={news} albums={albums} projects={projects} eventsError={eventsError} newsError={newsError} albumsError={albumsError} projectsError={projectsError} />;
}
