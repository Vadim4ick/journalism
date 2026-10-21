import type { Metadata } from "next";
import { NewspapersPage } from "@/views/newspapers";
import { contentServices } from "@/shared/services/content";
import type { ContentNewspaper } from "@/shared/types/model/content.type";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Газетный киоск — Дом журналистики",
  description: "Редакции газет Краснодарского края в газетном киоске Дома журналистики.",
};

type PageProps = { searchParams: Promise<{ page?: string | string[] }> };

export default async function Page({ searchParams }: PageProps) {
  const { page: rawPage } = await searchParams;
  const parsed = typeof rawPage === "string" && /^[1-9]\d*$/.test(rawPage) ? Number(rawPage) : 1;
  const page = Number.isSafeInteger(parsed) ? parsed : 1;
  let newspapers: ContentNewspaper[] = [];
  let pagination: Pagination | undefined;
  let error = false;

  try {
    const response = await contentServices.getNewspapers({ page, per_page: 12 });
    if (response.status !== "success" || !Array.isArray(response.data?.items) || !response.data.pagination) {
      throw new Error("Некорректный ответ сервера при загрузке газет");
    }
    newspapers = response.data.items;
    pagination = response.data.pagination;
  } catch (cause) {
    console.error("Не удалось загрузить газеты", cause);
    error = true;
  }

  return <NewspapersPage newspapers={newspapers} pagination={pagination} error={error} />;
}
