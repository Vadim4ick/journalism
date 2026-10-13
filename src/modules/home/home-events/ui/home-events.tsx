import { UpcomingEventsSection } from "@/components/upcoming-events";
import { HOME_EVENTS } from "../model/events";

export function HomeEvents() {
  return <UpcomingEventsSection events={HOME_EVENTS} id="home-events" />;
}
