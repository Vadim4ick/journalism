import type { Metadata } from "next";
import { AboutPage } from "@/views/about";

export const metadata: Metadata = {
  title: "О нас — Дом журналистики",
  description: "О медиацентре «Дом журналистики», его команде и проектах.",
};

export default function Page() {
  return <AboutPage />;
}
