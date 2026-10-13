import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CURRENT_PROJECTS } from "@/views/projects/model/projects";
import { ProjectDetailPage } from "@/views/project-detail";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CURRENT_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = CURRENT_PROJECTS.find((item) => item.slug === slug);
  return project
    ? { title: `Проект ${project.title} — Дом журналистики`, description: project.description }
    : { title: "Проект не найден — Дом журналистики" };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const project = CURRENT_PROJECTS.find((item) => item.slug === slug);
  if (!project) notFound();

  return <ProjectDetailPage project={project} />;
}
