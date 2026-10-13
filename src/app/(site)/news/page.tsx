import type { Metadata } from "next";
import { NewsPage } from "@/views/news";

export const metadata: Metadata = {
  title: "Новости — Дом журналистики",
  description: "Новости и события Медиацентра «Дом журналистики».",
};

export default function Page() {
  return <NewsPage />;
}
