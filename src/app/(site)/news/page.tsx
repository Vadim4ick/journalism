import type { Metadata } from "next";
import { NewsPage } from "@/views/news";
import { contentServices } from "@/shared/services/content";
import type { ContentNews } from "@/shared/types/model/content.type";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Новости — Дом журналистики",
  description: "Новости и события Медиацентра «Дом журналистики».",
};

type PageProps = { searchParams: Promise<{ page?: string | string[]; date_from?: string | string[]; date_to?: string | string[] }> };

function validDate(value: string | string[] | undefined) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value ? value : undefined;
}

export default async function Page({ searchParams }: PageProps) {
  const query = await searchParams;
  const parsedPage = typeof query.page === "string" && /^[1-9]\d*$/.test(query.page) ? Number(query.page) : 1;
  const page = Number.isSafeInteger(parsedPage) ? parsedPage : 1;
  const from = validDate(query.date_from) ?? validDate(query.date_to);
  const to = from && validDate(query.date_to);
  const selected = from ? { from, to: to && to >= from ? to : undefined } : undefined;
  let news: ContentNews[] = [];
  let pagination: Pagination | undefined;
  let error = false;

  try {
    const response = await contentServices.getNews({ page, date_from: selected?.from, date_to: selected?.to });
    if (response.status !== "success" || !Array.isArray(response.data?.items) || !response.data.pagination) {
      throw new Error("Некорректный ответ сервера при загрузке новостей");
    }
    news = response.data.items;
    pagination = response.data.pagination;
  } catch (cause) {
    console.error("Не удалось загрузить новости", cause);
    error = true;
  }

  return <NewsPage news={news} pagination={pagination} selected={selected} error={error} calendarDate={new Date().toISOString().slice(0, 10)} />;
}
