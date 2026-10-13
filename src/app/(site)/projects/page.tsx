import type { Metadata } from "next";
import { ProjectsPage } from "@/views/projects";

export const metadata: Metadata = {
  title: "Проекты медиацентра — Дом журналистики",
  description: "Текущие и завершённые проекты медиацентра «Дом журналистики».",
};

export default function Page() {
  return <ProjectsPage />;
}
