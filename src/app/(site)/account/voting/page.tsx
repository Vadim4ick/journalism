import type { Metadata } from "next";
import { ProjectVotingPage } from "@/views/account";

export const metadata: Metadata = {
  title: "Голосование — Дом журналистики",
  description: "Выберите номинацию и проект, затем оцените его по критериям.",
};

export default function Page() {
  return <ProjectVotingPage />;
}
