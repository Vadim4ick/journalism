import { Typography } from "@/shared/ui/typography";
import { SiteImage as Image } from "@/components/site-image";
import Link from "next/link";

export type NewsCardData = {
  id: string;
  title: string;
  description: string;
  date: string;
  dateLabel: string;
  image?: string;
  imageAlt: string;
  href?: string;
};

export function NewsCard({ news, headingLevel = "h3" }: { news: NewsCardData; headingLevel?: "h2" | "h3" }) {
  const content = (
    <>
      <div className="relative aspect-[43/30] shrink-0 overflow-hidden rounded-[20px] bg-muted">
        <Image
          src={news.image}
          alt={news.imageAlt}
          textLinkLabel={`Фото: ${news.imageAlt || news.title}`}
          textModeLink={!news.href}
          fill
          unoptimized={news.image?.startsWith("http")}
          sizes="(min-width: 1792px) 573px, (min-width: 1150px) calc((100vw - 72px) / 3), (min-width: 768px) calc((100vw - 52px) / 2), calc(100vw - 32px)"
          className="object-cover transition-[opacity,scale] duration-1000 ease-out motion-safe:group-hover:scale-[1.045] motion-safe:group-focus-within:scale-[1.045] motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-1 flex-col gap-5 px-2 mobile:px-4">
        <Typography as={headingLevel} variant="news-title" className={news.href ? "group-hover:underline group-focus-visible:underline" : undefined}>
          {news.title}
        </Typography>
        <Typography className="line-clamp-2" as="p" variant="news-description">
          {news.description}
        </Typography>
        <Typography
          as="time"
          variant="date"
          dateTime={news.date}
          className="mt-auto text-muted-foreground"
        >
          {news.dateLabel}
        </Typography>
      </div>
    </>
  );

  return (
    <article className="h-full min-w-0">
      {news.href ? (
        <Link
          href={news.href}
          aria-label={`Читать новость: ${news.title}`}
          className="group flex h-full min-w-0 flex-col gap-5 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {content}
        </Link>
      ) : (
        <div className="group flex h-full min-w-0 flex-col gap-5">{content}</div>
      )}
    </article>
  );
}
