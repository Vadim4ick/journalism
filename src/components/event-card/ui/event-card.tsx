import Link from "next/link";
import { Typography } from "@/shared/ui/typography";
import { SiteImage as Image } from "@/components/site-image";
import { ArrowUpRight } from "@/shared/icons/arrow-up-right";

export type EventCardData = {
  slug: string;
  title: string;
  date: string;
  format: string;
  location: string;
  description: string;
  image?: string;
  imageAlt?: string;
  gallery?: { src: string; alt: string }[];
  article?: {
    lead: string;
    paragraphs: string[];
  };
  detailDate?: string;
  dateTime?: string;
};

export function EventCard({ event, imageSizes }: { event: EventCardData; imageSizes?: string }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex h-full min-w-0 flex-col gap-6 rounded-3xl bg-card p-3 pb-6 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none mobile:p-4"
      aria-label={`Подробнее: ${event.title}`}
    >
      <div className="relative aspect-[535/400] w-full shrink-0 overflow-hidden rounded-[20px] bg-muted">
        {event.image && <Image
          src={event.image}
          alt={event.imageAlt ?? ""}
          textLinkLabel={`Фото события: ${event.title}`}
          textModeLink={false}
          fill
          sizes={imageSizes ?? "(min-width: 1150px) calc((min(100vw, 1792px) - 204px) / 3), (min-width: 768px) calc((100vw - 132px) / 2), calc(100vw - 72px)"}
          quality={60}
          unoptimized={event.image.startsWith("http")}
          className="object-cover transition-[opacity,scale] duration-1000 ease-out motion-safe:group-hover:scale-[1.045] motion-reduce:transition-none"
        />}
        <span data-text-flow-inline className="absolute top-4 left-4 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-bold text-primary-foreground mobile:text-base desktop1250:text-xl">
          {event.date}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-6 px-1 mobile:px-2">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <Typography as="h3" variant="event-title" className="min-w-0">
            {event.title}
          </Typography>
          <span aria-hidden="true" data-text-decorative className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground mobile:size-11 desktop1250:size-[50px]">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
        <Typography as="p" variant="event-description" className="line-clamp-3">
          {event.description}
        </Typography>
      </div>
    </Link>
  );
}
