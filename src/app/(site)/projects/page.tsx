import type { Metadata } from "next";
import { ProjectsPage } from "@/views/projects";
import { contentServices } from "@/shared/services/content";
import type { ContentProject } from "@/shared/types/model/content.type";

export const metadata: Metadata = {
  title: "Проекты медиацентра — Дом журналистики",
  description: "Текущие и завершённые проекты медиацентра «Дом журналистики».",
};

type PageProps = { searchParams: Promise<{ page?: string | string[] }> };

export default async function Page({ searchParams }: PageProps) {
  const { page: rawPage } = await searchParams;
  const parsed = typeof rawPage === "string" && /^[1-9]\d*$/.test(rawPage) ? Number(rawPage) : 1;
  const page = Number.isSafeInteger(parsed) ? parsed : 1;
  let projects: ContentProject[] = [];
  let pagination: Pagination | undefined;
  let error = false;

  try {
    const response = await contentServices.getProjects({ page, per_page: 12 });
    if (response.status !== "success" || !Array.isArray(response.data?.items) || !response.data.pagination) {
      throw new Error("Некорректный ответ сервера при загрузке проектов");
    }
    projects = response.data.items;
    pagination = response.data.pagination;
  } catch (cause) {
    console.error("Не удалось загрузить проекты", cause);
    error = true;
  }

  return <ProjectsPage projects={projects} pagination={pagination} error={error} />;
}
