import type { Metadata } from "next";
import { EventsPage } from "@/views/events";
import { contentServices } from "@/shared/services/content";

export const metadata: Metadata = {
  title: "Предстоящие события — Дом журналистики",
  description:
    "Анонсы встреч, мастер-классов, лекций и мероприятий Дома журналистики.",
};

type PageProps = { searchParams: Promise<{ page?: string | string[] }> };

export default async function Page({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const requestedPage = typeof page === "string" && /^[1-9]\d*$/.test(page) ? Number(page) : 1;
  const currentPage = Number.isSafeInteger(requestedPage) ? requestedPage : 1;

  let events = [] as Awaited<ReturnType<typeof contentServices.getEvents>>["data"]["items"];
  let pagination: Pagination | undefined;
  let error = false;
  try {
    const response = await contentServices.getEvents({ page: currentPage });
    if (response.status !== "success" || !Array.isArray(response.data?.items) || !response.data.pagination) {
      throw new Error("Некорректный ответ сервера при загрузке событий");
    }
    events = response.data.items;
    pagination = response.data.pagination;
  } catch (cause) {
    console.error("Не удалось загрузить события", cause);
    error = true;
  }
  return <EventsPage events={events} pagination={pagination} error={error} />;
}
