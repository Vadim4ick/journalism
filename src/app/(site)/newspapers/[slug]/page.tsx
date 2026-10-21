import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import axios from "axios";
import { contentServices } from "@/shared/services/content";
import { NewspaperDetailPage } from "@/views/newspapers";

export const revalidate = 0;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[]; date?: string | string[] }>;
};

function parsePage(value: string | string[] | undefined) {
  const parsed = typeof value === "string" && /^[1-9]\d*$/.test(value) ? Number(value) : 1;
  return Number.isSafeInteger(parsed) ? parsed : 1;
}

function validDate(value: string | string[] | undefined) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value ? value : undefined;
}

const getNewspaperData = cache(async (slug: string, page: number, date?: string) => {
  try {
    const response = await contentServices.getNewspaper(slug, { page, per_page: 12, date });
    if (response.status !== "success" || !response.data?.section || !Array.isArray(response.data.items) || !response.data.pagination) {
      throw new Error("Некорректный ответ сервера при загрузке газеты");
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
});

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const data = await getNewspaperData(slug, parsePage(query.page), validDate(query.date));
  if (!data) return { title: "Редакция не найдена — Дом журналистики" };
  return {
    title: data.seo?.meta_title || data.seo?.browser_title || `${data.section.short_name || data.section.name} — Газетный киоск Дома журналистики`,
    description: data.seo?.meta_description || data.section.description || `Информация и выпуски редакции «${data.section.short_name || data.section.name}».`,
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const date = validDate(query.date);
  const data = await getNewspaperData(slug, parsePage(query.page), date);
  if (!data) notFound();
  return <NewspaperDetailPage newspaper={data.section} issues={data.items} pagination={data.pagination} date={date} />;
}
