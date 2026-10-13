import Link from "next/link";
import { EventCard, type EventCardData } from "@/components/event-card";
import { ArrowUpRight } from "@/shared/icons/arrow-up-right";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Typography, typographyVariants } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/utils";

type UpcomingEventsSectionProps = {
  events: EventCardData[];
  id?: string;
  className?: string;
};

export function UpcomingEventsSection({
  events,
  id = "upcoming-events",
  className,
}: UpcomingEventsSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("overflow-x-clip pt-12 pb-0 mobile:pt-16 desktop:pt-20", className)}
    >
      <Container>
        <div className="mb-7 flex flex-wrap items-center justify-between gap-5 mobile:mb-[50px]">
          <Typography as="h2" variant="section-title" id={headingId}>
            Предстоящие события
          </Typography>
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

        {events.length > 0 ? (
          <ul
            data-a11y-content-grid
            className="grid gap-5 mobile:grid-cols-2 desktop:grid-cols-3 desktop:gap-[30px]"
            aria-label="Предстоящие события"
          >
            {events.map((event) => (
              <li key={event.slug}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        ) : (
          <Typography variant="body" className="text-muted-foreground">
            Пока нет предстоящих событий.
          </Typography>
        )}
      </Container>
    </section>
  );
}
