import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectVotingPage } from "@/views/account";
import { CURRENT_PROJECTS } from "@/views/projects/model/projects";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CURRENT_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = CURRENT_PROJECTS.find((item) => item.slug === slug);
  return {
    title: project
      ? `Голосование — ${project.title} — Дом журналистики`
      : "Проект не найден — Дом журналистики",
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const project = CURRENT_PROJECTS.find((item) => item.slug === slug);
  if (!project) notFound();

  return <ProjectVotingPage project={project} />;
}
