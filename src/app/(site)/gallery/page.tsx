import type { Metadata } from "next";
import { GalleryPage } from "@/views/gallery";

export const metadata: Metadata = {
  title: "Фотогалерея — Дом журналистики",
  description: "Фотографии и альбомы мероприятий Дома журналистики.",
};

type PageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { page } = await searchParams;
  return <GalleryPage page={page} />;
}
