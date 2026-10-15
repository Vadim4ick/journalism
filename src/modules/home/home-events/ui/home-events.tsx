"use client";

import Link from "next/link";
import { EventCard } from "@/components/event-card";
import { SiteImage } from "@/components/site-image";
import { ArrowUpRight } from "@/shared/icons/arrow-up-right";
import { Button } from "@/shared/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/shared/ui/carousel";
import { Container } from "@/shared/ui/container";
import { Typography, typographyVariants } from "@/shared/ui/typography";
import { useAccessibilityStore, useEffectiveReducedMotion } from "@/state/accessibility";
import { HOME_EVENTS } from "../model/events";

function EventControls() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <div className="flex items-center gap-2.5">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Предыдущие события"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        className="size-[52px] rounded-full border-0 bg-transparent p-0 shadow-none"
      >
        <SiteImage src="/images/home/arrows/gallery-prev.svg" alt="" aria-hidden="true" width={52} height={52} className="size-[52px]" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Следующие события"
        disabled={!canScrollNext}
        onClick={scrollNext}
        className="size-[52px] rounded-full border-0 bg-transparent p-0 shadow-none"
      >
        <SiteImage src="/images/home/arrows/gallery-next.svg" alt="" aria-hidden="true" width={52} height={52} className="size-[52px] rotate-180" />
      </Button>
    </div>
  );
}

export function HomeEvents() {
  const enabled = useAccessibilityStore((state) => state.enabled);
  const textMode = useAccessibilityStore((state) => state.textMode);
  const hydrated = useAccessibilityStore((state) => state.hydrated);
  const reducedMotion = useEffectiveReducedMotion();
  const staticMode = enabled || textMode || !hydrated || HOME_EVENTS.length < 2;

  const content = (
    <section
      id="home-events"
      aria-labelledby="home-events-heading"
      className="overflow-x-clip pt-12 pb-0 mobile:pt-16 desktop:pt-20"
    >
      <Container>
        <div className="mb-7 flex flex-wrap items-center justify-between gap-5 mobile:mb-[50px]">
          <Typography as="h2" variant="section-title" id="home-events-heading">
            Предстоящие события
          </Typography>
          {!staticMode && <EventControls />}
          <Button
            variant="pill"
            nativeButton={false}
            render={<Link href="/events" />}
            className={typographyVariants["button-responsive"]}
            addonRight={
              <span data-text-decorative className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground mobile:size-11 desktop1250:size-[50px]">
                <ArrowUpRight aria-hidden="true" className="size-[22px]" />
              </span>
            }
          >
            Все события
          </Button>
        </div>

        {HOME_EVENTS.length === 0 ? (
          <Typography variant="body" className="text-muted-foreground">
            Пока нет предстоящих событий.
          </Typography>
        ) : staticMode ? (
          <ul data-a11y-content-grid className="grid gap-5" aria-label="Предстоящие события">
            {HOME_EVENTS.map((event) => (
              <li key={event.slug}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        ) : (
          <CarouselContent className="-ml-5">
            {HOME_EVENTS.map((event, index) => (
              <CarouselItem
                key={event.slug}
                aria-label={`${index + 1} из ${HOME_EVENTS.length}: ${event.title}`}
                className="basis-[85%] pl-5 mobile:basis-[70%] desktop:basis-[38%]"
              >
                <EventCard
                  event={event}
                  imageSizes="(min-width: 1792px) 668px, (min-width: 1150px) 38vw, (min-width: 768px) 70vw, 85vw"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
      </Container>
    </section>
  );

  if (staticMode) return content;
  return (
    <Carousel aria-label="Предстоящие события" opts={{ loop: false, align: "start", duration: reducedMotion ? 0 : 25 }}>
      {content}
    </Carousel>
  );
}
