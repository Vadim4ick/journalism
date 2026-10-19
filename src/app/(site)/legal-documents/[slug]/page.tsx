import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import axios from "axios";
import { contentServices } from "@/shared/services/content";
import { LegalDocumentPage } from "@/views/legal-document";

type PageProps = { params: Promise<{ slug: string }> };

const getLegalDocument = cache(async (slug: string) => {
  try {
    const response = await contentServices.getLegalDocument(slug);
    if (response.status !== "success" || !response.data?.element) {
      throw new Error("Некорректный ответ сервера при загрузке правового документа");
    }
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getLegalDocument(slug);
  if (!data) return { title: "Правовой документ не найден — Дом журналистики" };

  return {
    title: data.seo?.meta_title || data.seo?.browser_title || `${data.element.title} — Дом журналистики`,
    description: data.seo?.meta_description || data.element.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const data = await getLegalDocument(slug);
  if (!data) notFound();

  return <LegalDocumentPage document={data.element} />;
}
