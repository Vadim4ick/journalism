import type { Metadata } from "next";
import { EventsPage } from "@/views/events";

export const metadata: Metadata = {
  title: "Предстоящие события — Дом журналистики",
  description:
    "Анонсы встреч, мастер-классов, лекций и мероприятий Дома журналистики.",
};

export default function Page() {
  return <EventsPage />;
}
