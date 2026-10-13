import type { Metadata } from "next";
import { NewspapersPage } from "@/views/newspapers";

export const metadata: Metadata = {
  title: "Газетный киоск — Дом журналистики",
  description: "Редакции газет Краснодарского края в газетном киоске Дома журналистики.",
};

export default function Page() {
  return <NewspapersPage />;
}
