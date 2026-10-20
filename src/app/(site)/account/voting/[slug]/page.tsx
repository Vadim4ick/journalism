import { notFound, redirect } from "next/navigation";
import { VOTING_PROJECTS } from "@/views/account";
import { CURRENT_PROJECTS } from "@/views/projects/model/projects";

type PageProps = { params: Promise<{ slug: string }> };
const knownSlugs = new Set(
  [...VOTING_PROJECTS, ...CURRENT_PROJECTS].map((project) => project.slug),
);

export function generateStaticParams() {
  return [...knownSlugs].map((slug) => ({ slug }));
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  if (!knownSlugs.has(slug)) notFound();
  redirect("/account/voting");
}
