import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewspaper, NEWSPAPERS, NewspaperDetailPage } from "@/views/newspapers";

export function generateStaticParams() {
  return NEWSPAPERS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const newspaper = getNewspaper(slug);
  if (!newspaper) return { title: "Редакция не найдена — Дом журналистики" };
  return {
    title: `${newspaper.shortName} — Газетный киоск Дома журналистики`,
    description: `Информация и выпуски редакции «${newspaper.shortName}».`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const newspaper = getNewspaper(slug);
  if (!newspaper) notFound();
  return <NewspaperDetailPage newspaper={newspaper} />;
}
