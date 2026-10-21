import type { Metadata } from "next";
import { connection } from "next/server";
import { getDocumentsAction } from "@/shared/server-actions/get-documents";
import { DocumentsPage } from "@/views/documents";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Документы",
  description:
    "Официальные документы ГКУ КК «Медиацентр „Дом журналистики“». Персональные данные, нормативные акты и противодействие коррупции.",
};

export default async function Page() {
  await connection();
  const { sections, error } = await getDocumentsAction();

  return <DocumentsPage sections={sections} error={error} />;
}
