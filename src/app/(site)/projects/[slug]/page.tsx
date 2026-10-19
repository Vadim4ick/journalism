import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NEIGHBORS_PROJECT } from "@/views/projects/model/projects";
import { NEIGHBORS_API_SLUG } from "@/components/project-card";
import { ProjectDetailPage } from "@/views/project-detail";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [{ slug: NEIGHBORS_PROJECT.slug }, { slug: NEIGHBORS_API_SLUG }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = slug === NEIGHBORS_PROJECT.slug || slug === NEIGHBORS_API_SLUG ? NEIGHBORS_PROJECT : null;
  return project
    ? { title: `Проект ${project.title} — Дом журналистики`, description: project.description }
    : { title: "Проект не найден — Дом журналистики" };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const project = slug === NEIGHBORS_PROJECT.slug || slug === NEIGHBORS_API_SLUG ? NEIGHBORS_PROJECT : null;
  if (!project) notFound();

  return <ProjectDetailPage project={project} />;
}
