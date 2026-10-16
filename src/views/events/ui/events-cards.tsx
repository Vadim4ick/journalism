"use client";

import { useSyncExternalStore } from "react";
import { EventCard, type EventCardData } from "@/components/event-card";
import { SiteImage } from "@/components/site-image";
import { useAccessibilityStore, useEffectiveReducedMotion } from "@/state/accessibility";
import { Button } from "@/shared/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/shared/ui/carousel";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import styles from "./events-page.module.css";

const mobileQuery = "(max-width: 767px)";

function subscribeToMobile(callback: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getMobileSnapshot() {
  return window.matchMedia(mobileQuery).matches;
}

function getServerSnapshot() {
  return false;
}

function EventControls() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <div className="mb-4 flex justify-end gap-2.5">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Предыдущее событие"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        className="size-[52px] rounded-full border-0 bg-transparent p-0 shadow-none"
      >
        <SiteImage src="/images/home/arrows/gallery-prev.svg" alt="" aria-hidden="true" width={52} height={52} className="size-[52px]" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Следующее событие"
        disabled={!canScrollNext}
        onClick={scrollNext}
        className="size-[52px] rounded-full border-0 bg-transparent p-0 shadow-none"
      >
        <SiteImage src="/images/home/arrows/gallery-next.svg" alt="" aria-hidden="true" width={52} height={52} className="size-[52px] rotate-180" />
      </Button>
    </div>
  );
}

export function EventsCards({ events }: { events: EventCardData[] }) {
  const isMobile = useSyncExternalStore(subscribeToMobile, getMobileSnapshot, getServerSnapshot);
  const enabled = useAccessibilityStore((state) => state.enabled);
  const textMode = useAccessibilityStore((state) => state.textMode);
  const hydrated = useAccessibilityStore((state) => state.hydrated);
  const reducedMotion = useEffectiveReducedMotion();
  const staticMode = !isMobile || enabled || textMode || !hydrated || events.length < 2;

  if (staticMode) {
    return (
      <ul data-a11y-content-grid className={styles.eventsList}>
        {events.map((event) => (
          <li key={event.slug}>
            <ScrollReveal><EventCard event={event} /></ScrollReveal>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Carousel aria-label="Предстоящие события" opts={{ loop: false, align: "start", duration: reducedMotion ? 0 : 25 }}>
      <EventControls />
      <CarouselContent>
        {events.map((event, index) => (
          <CarouselItem
            key={event.slug}
            aria-label={`${index + 1} из ${events.length}: ${event.title}`}
            className="basis-[88%] max-w-[360px]"
          >
            <EventCard event={event} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
