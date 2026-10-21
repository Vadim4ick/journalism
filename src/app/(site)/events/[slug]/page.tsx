import type { Metadata } from "next";
import { notFound } from "next/navigation";
import axios from "axios";
import { cache } from "react";
import { contentServices } from "@/shared/services/content";
import { EventDetailPage } from "@/views/event-detail";

export const revalidate = 0;

type PageProps = { params: Promise<{ slug: string }> };

const getEvent = cache(async (slug: string) => {
  try {
    const response = await contentServices.getEvent(slug);
    if (response.status !== "success" || !response.data?.element) {
      throw new Error("Некорректный ответ сервера при загрузке события");
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getEvent(slug);
  if (!data) return { title: "Событие не найдено — Дом журналистики" };
  return {
    title: data.seo?.meta_title || data.seo?.browser_title || `${data.element.title} — Дом журналистики`,
    description: data.seo?.meta_description || data.element.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const data = await getEvent(slug);
  if (!data) notFound();

  return <EventDetailPage event={data.element} related={data.related ?? []} />;
}
