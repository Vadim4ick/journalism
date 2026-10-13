import type { Metadata } from "next";
import { DocumentsPage } from "@/views/documents";

export const metadata: Metadata = {
  title: "Документы",
  description: "Официальные документы ГКУ КК «Медиацентр „Дом журналистики“». Персональные данные, нормативные акты и противодействие коррупции.",
};

export default function Page() {
  return <DocumentsPage />;
}
