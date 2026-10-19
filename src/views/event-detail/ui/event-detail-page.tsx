import Link from "next/link";
import { MapPin } from "lucide-react";
import { UpcomingEventsSection } from "@/components/upcoming-events";
import { SiteImage } from "@/components/site-image";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import type { ContentEvent, ContentEventDetail } from "@/shared/types/model/content.type";
import { eventCardData, eventImageUrl } from "@/components/event-card";
import { EventGallery } from "./event-gallery";
import { EventSocialLinks } from "./event-share";
import styles from "./event-detail-page.module.css";

function eventDate(event: ContentEventDetail) {
  if (!event.event_start_at) return event.date || event.published_at;
  const date = new Date(event.event_start_at);
  if (Number.isNaN(date.getTime())) return event.date || event.published_at;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Moscow",
  }).format(date);
}

export function EventDetailPage({ event, related }: { event: ContentEventDetail; related: ContentEvent[] }) {
  const gallery = (event.images ?? [])
    .map((image) => ({ src: eventImageUrl(image.url), alt: image.description || `Фото события «${event.title}»` }))
    .filter((image): image is { src: string; alt: string } => Boolean(image.src));
  const cover = eventImageUrl(event.image);
  if (gallery.length === 0 && cover) gallery.push({ src: cover, alt: `Фото события «${event.title}»` });

  return (
    <>
      <Container className="w-full">
        <div data-text-flow>
          <article className="mx-auto mt-6 w-full max-w-[1200px] pb-12 pt-4 mobile:mt-8 mobile:pb-16 mobile:pt-6 desktop:mt-20 desktop:pb-20 desktop:pt-0">
            <nav aria-label="Хлебные крошки" className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] font-medium text-foreground">
              <Link href="/" className="hover:underline focus-visible:underline">Главная</Link>
              <span aria-hidden="true" className={styles.breadcrumbSeparator}>
                <SiteImage src="/images/news/breadcrumb.svg" alt="" width={15} height={15} />
                <span className="text-mode-only">›</span>
              </span>
              <Link href="/events" className="hover:underline focus-visible:underline">Предстоящие события</Link>
              <span aria-hidden="true" className={styles.breadcrumbSeparator}>
                <SiteImage src="/images/news/breadcrumb.svg" alt="" width={15} height={15} />
                <span className="text-mode-only">›</span>
              </span>
              <span aria-current="page" className="line-clamp-1">{event.title}</span>
            </nav>

            <ScrollReveal>
              <header className="mb-8">
                <Typography as="h1" variant="heading-medium" className="mb-8 text-xl leading-[1.25] mobile:text-2xl">{event.title}</Typography>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mobile:text-base">
                  {event.event_start_at ? (
                    <time dateTime={event.event_start_at} className="inline-flex min-h-10 items-center rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground">{eventDate(event)}</time>
                  ) : (
                    <span className="inline-flex min-h-10 items-center rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground">{eventDate(event)}</span>
                  )}
                  {event.place && <span className="flex items-center gap-2 text-muted-foreground"><MapPin aria-hidden="true" className="size-4 shrink-0" />{event.place}</span>}
                  {event.format && <span className="text-muted-foreground">{event.format}</span>}
                </div>
              </header>
            </ScrollReveal>

            {gallery.length > 0 && <ScrollReveal><EventGallery images={gallery} title={event.title} source={event.source} /></ScrollReveal>}

            <ScrollReveal>
              <div className="mt-8 border-t border-border pt-10">
                {event.description && <p className="mb-5 text-lg font-semibold leading-[1.4]">{event.description}</p>}
                {event.detail_text && <div className={styles.articleBody} dangerouslySetInnerHTML={{ __html: event.detail_text }} />}
                <EventSocialLinks />
              </div>
            </ScrollReveal>
          </article>
        </div>
      </Container>

      {related.length > 0 && <ScrollReveal dataTextFlow>
        <UpcomingEventsSection events={related.map(eventCardData)} id="event-detail-upcoming-events" className="pb-12 mobile:pb-16" />
      </ScrollReveal>}
    </>
  );
}
