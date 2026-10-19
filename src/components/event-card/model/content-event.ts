import type { EventCardData } from "@/components/event-card";
import type { ContentEvent } from "@/shared/types/model/content.type";
import { contentImageUrl } from "@/shared/lib/content-image-url";

export const eventImageUrl = contentImageUrl;

export function eventCardData(event: ContentEvent): EventCardData {
  const startDate = event.event_start_at ? new Date(event.event_start_at) : null;
  const date = startDate && !Number.isNaN(startDate.getTime())
    ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", timeZone: "Europe/Moscow" }).format(startDate)
    : event.date || event.published_at;
  return {
    slug: event.slug || String(event.id),
    title: event.title,
    date,
    format: event.format,
    location: event.place,
    description: event.description,
    image: eventImageUrl(event.image),
  };
}
