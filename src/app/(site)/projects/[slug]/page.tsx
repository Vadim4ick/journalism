import type { Metadata } from "next";
import { notFound } from "next/navigation";
import axios from "axios";
import { cache } from "react";
import { contentServices } from "@/shared/services/content";
import { NEIGHBORS_API_SLUG } from "@/components/project-card";
import { ProjectDetailPage } from "@/views/project-detail";

export const revalidate = 0;

type PageProps = { params: Promise<{ slug: string }> };

const getProject = cache(async (slug: string) => {
  try {
    const response = await contentServices.getProject(slug === "sosedi" ? NEIGHBORS_API_SLUG : slug);
    if (response.status !== "success" || !response.data?.element || !Array.isArray(response.data.element.blocks)) {
      throw new Error("Некорректный ответ сервера при загрузке проекта");
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProject(slug);
  if (!data) return { title: "Проект не найден — Дом журналистики" };
  return {
    title: data.seo?.meta_title || data.seo?.browser_title || `${data.element.title} — Дом журналистики`,
    description: data.seo?.meta_description || data.element.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const data = await getProject(slug);
  if (!data) notFound();

  return <ProjectDetailPage project={data.element} />;
}
