import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProjectVotingPage, VOTING_PROJECTS } from "@/views/account";
import { CURRENT_PROJECTS } from "@/views/projects/model/projects";

type PageProps = { params: Promise<{ slug: string }> };
const legacySlugs = new Set(CURRENT_PROJECTS.map((project) => project.slug));

export function generateStaticParams() {
  return [...VOTING_PROJECTS, ...CURRENT_PROJECTS].map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = VOTING_PROJECTS.find((item) => item.slug === slug)
    ?? (legacySlugs.has(slug) ? VOTING_PROJECTS[0] : undefined);
  return {
    title: project
      ? `Голосование — ${project.title} — Дом журналистики`
      : "Проект не найден — Дом журналистики",
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  if (legacySlugs.has(slug)) {
    redirect(`/account/voting/${VOTING_PROJECTS[0].slug}`);
  }
  const project = VOTING_PROJECTS.find((item) => item.slug === slug);
  if (!project) notFound();

  return <ProjectVotingPage project={project} />;
}
