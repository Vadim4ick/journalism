import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import axios from "axios";
import { contentServices } from "@/shared/services/content";
import { GalleryAlbumPage, toGalleryAlbum } from "@/views/gallery";

export const revalidate = 0;

type PageProps = { params: Promise<{ slug: string }> };

const getAlbum = cache(async (slug: string) => {
  try {
    const response = await contentServices.getMediaItem(slug);
    if (response.status !== "success" || !response.data?.element) {
      throw new Error("Некорректный ответ сервера при загрузке фотоальбома");
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAlbum(slug);
  if (!data) return { title: "Фотоальбом не найден — Дом журналистики" };
  return {
    title: data.seo?.meta_title || data.seo?.browser_title || `${data.element.title} — Дом журналистики`,
    description: data.seo?.meta_description || data.element.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const data = await getAlbum(slug);
  if (!data) notFound();
  return <GalleryAlbumPage album={toGalleryAlbum(data.element)} detailText={data.element.detail_text} />;
}
