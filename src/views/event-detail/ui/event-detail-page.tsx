import Link from "next/link";
import { UpcomingEventsSection } from "@/components/upcoming-events";
import type { EventCardData } from "@/components/event-card";
import { HOME_EVENTS } from "@/modules/home/home-events/model/events";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { EventGallery } from "./event-gallery";
import { EventSocialLinks } from "./event-share";
import { MapPin } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import styles from "./event-detail-page.module.css";

export function EventDetailPage({ event }: { event: EventCardData }) {
  const gallery = event.gallery?.length
    ? event.gallery
    : [{ src: event.image, alt: event.imageAlt ?? `Фото: ${event.title}` }];

  return (
    <>
      <Container className="w-full">
        <div data-text-flow>
          <article className="mx-auto mt-6 w-full max-w-[1200px] pb-12 pt-4 mobile:mt-8 mobile:pb-16 mobile:pt-6 desktop:mt-20 desktop:pb-20 desktop:pt-0">
            <nav
              aria-label="Хлебные крошки"
              className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] font-medium text-foreground"
            >
              <Link href="/" className="hover:underline focus-visible:underline">
                Главная
              </Link>
              <span aria-hidden="true" className={styles.breadcrumbSeparator}>
                <SiteImage src="/images/news/breadcrumb.svg" alt="" width={15} height={15} />
                <span className="text-mode-only">›</span>
              </span>
              <Link
                href="/events"
                className="hover:underline focus-visible:underline"
              >
                Предстоящие события
              </Link>
              <span aria-hidden="true" className={styles.breadcrumbSeparator}>
                <SiteImage src="/images/news/breadcrumb.svg" alt="" width={15} height={15} />
                <span className="text-mode-only">›</span>
              </span>
              <span aria-current="page" className="line-clamp-1">
                {event.title}
              </span>
            </nav>

            <ScrollReveal>
              <header className="mb-8">
                <Typography
                  as="h1"
                  variant="heading-medium"
                  className="mb-8 text-xl leading-[1.25] mobile:text-2xl"
                >
                  {event.title}
                </Typography>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mobile:text-base">
                  {event.dateTime ? (
                    <time
                      dateTime={event.dateTime}
                      className="inline-flex min-h-10 items-center rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground"
                    >
                      {event.detailDate ?? event.date}
                    </time>
                  ) : (
                    <span className="inline-flex min-h-10 items-center rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground">
                      {event.detailDate ?? event.date}
                    </span>
                  )}
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <MapPin aria-hidden="true" className="size-4 shrink-0" />
                    {event.location}
                  </span>
                </div>
              </header>
            </ScrollReveal>

            <ScrollReveal>
              <EventGallery images={gallery} title={event.title} />
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-8 border-t border-border pt-10">
                <div className="space-y-3 text-base leading-[1.5] text-foreground">
                  {event.article?.lead && (
                    <p className="text-lg font-semibold leading-[1.4]">
                      {event.article.lead}
                    </p>
                  )}
                  {(event.article?.paragraphs ?? [event.description]).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <EventSocialLinks />
              </div>
            </ScrollReveal>
          </article>
        </div>
      </Container>

      <ScrollReveal dataTextFlow>
        <UpcomingEventsSection
          events={HOME_EVENTS}
          id="event-detail-upcoming-events"
          className="pb-12 mobile:pb-16"
        />
      </ScrollReveal>
    </>
  );
}
