import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HOME_EVENTS } from "@/modules/home/home-events/model/events";
import { EventDetailPage } from "@/views/event-detail";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = HOME_EVENTS.find((item) => item.slug === slug);
  return event
    ? { title: `${event.title} — Дом журналистики`, description: event.description }
    : { title: "Событие не найдено — Дом журналистики" };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const event = HOME_EVENTS.find((item) => item.slug === slug);
  if (!event) notFound();

  return <EventDetailPage event={event} />;
}
