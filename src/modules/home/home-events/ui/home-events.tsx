import { UpcomingEventsSection } from "@/components/upcoming-events";
import { eventCardData } from "@/components/event-card";
import type { ContentEvent } from "@/shared/types/model/content.type";

export function HomeEvents({ events, error }: { events: ContentEvent[]; error: boolean }) {
  return <UpcomingEventsSection events={events.slice(0, 3).map(eventCardData)} id="home-events" error={error} />;
}
