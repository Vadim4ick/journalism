import type { Metadata } from "next";
import { contentServices } from "@/shared/services/content";
import type { ContentMedia } from "@/shared/types/model/content.type";
import { GalleryPage } from "@/views/gallery";

export const metadata: Metadata = {
  title: "Фотогалерея — Дом журналистики",
  description: "Фотографии и альбомы мероприятий Дома журналистики.",
};

type PageProps = { searchParams: Promise<{ page?: string | string[] }> };

export default async function Page({ searchParams }: PageProps) {
  const { page: rawPage } = await searchParams;
  const parsed = typeof rawPage === "string" && /^[1-9]\d*$/.test(rawPage) ? Number(rawPage) : 1;
  const page = Number.isSafeInteger(parsed) ? parsed : 1;
  let albums: ContentMedia[] = [];
  let pagination: Pagination | undefined;
  let error = false;

  try {
    const response = await contentServices.getMedia({ page, per_page: 12 });
    if (response.status !== "success" || !Array.isArray(response.data?.items) || !response.data.pagination) {
      throw new Error("Некорректный ответ сервера при загрузке фотоальбомов");
    }
    albums = response.data.items;
    pagination = response.data.pagination;
  } catch (cause) {
    console.error("Не удалось загрузить фотоальбомы", cause);
    error = true;
  }

  return <GalleryPage albums={albums} pagination={pagination} error={error} />;
}
