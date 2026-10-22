"use client";

import { useAccessibilityStore } from "@/state/accessibility";
import Link from "next/link";
import { ArrowUpRight } from "@/shared/icons/arrow-up-right";
import { SiteImage } from "@/components/site-image";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/shared/ui/carousel";
import styles from "./home-gallery.module.css";
import { contentImageUrl } from "@/shared/lib/content-image-url";
import type { ContentMedia } from "@/shared/types/model/content.type";
import { ContentEmptyState } from "@/components/content-empty-state";

function GalleryControls() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();

  return (
    <div className="flex items-center gap-2.5">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Предыдущие альбомы"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        className="size-[52px] rounded-full border-0 bg-transparent p-0 shadow-none"
      >
        <SiteImage
          src="/images/home/arrows/gallery-prev.svg"
          alt=""
          aria-hidden="true"
          width={52}
          height={52}
          className="size-[52px]"
        />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Следующие альбомы"
        disabled={!canScrollNext}
        onClick={scrollNext}
        className="size-[52px] rounded-full border-0 bg-transparent p-0 shadow-none"
      >
        <SiteImage
          src="/images/home/arrows/gallery-next.svg"
          alt=""
          aria-hidden="true"
          width={52}
          height={52}
          className="size-[52px] rotate-180"
        />
      </Button>
    </div>
  );
}

function GallerySlide({
  album,
  staticMode,
}: {
  album: ContentMedia;
  staticMode: boolean;
}) {
  const cover =
    contentImageUrl(album.image) ?? contentImageUrl(album.images?.[0]?.url);
  return (
    <Link
      href={`/gallery/${album.slug}`}
      className={styles.slide}
      aria-label={`${album.title}, ${album.photo_count} фото`}
    >
      <SiteImage
        src={cover}
        unoptimized={cover?.startsWith("http")}
        alt=""
        fill
        sizes={
          staticMode
            ? "(min-width: 1792px) 1760px, calc(100vw - 32px)"
            : "(min-width: 1792px) 668px, (min-width: 768px) 38vw, 85vw"
        }
        className={styles.cover}
      />
      <span aria-hidden="true" data-text-decorative className={styles.shade} />
      <span className={styles.slideDetails}>
        <Typography
          as="span"
          variant="heading-small"
          className={styles.slideTitle}
        >
          {album.title}
        </Typography>
        <Typography as="span" variant="caption" className={styles.slideCount}>
          {album.photo_count} фото
        </Typography>
      </span>
    </Link>
  );
}

export function HomeGallery({
  albums,
  error = false,
}: {
  albums: readonly ContentMedia[];
  error?: boolean;
}) {
  const enabled = useAccessibilityStore((state) => state.enabled);
  const textMode = useAccessibilityStore((state) => state.textMode);
  const hydrated = useAccessibilityStore((state) => state.hydrated);
  const staticMode = enabled || textMode || !hydrated || albums.length === 0;

  const content = (
    <section
      id="home-gallery"
      aria-labelledby="home-gallery-heading"
      className="overflow-x-clip pt-16 pb-15 mobile:pt-20 mobile:pb-20 desktop:pt-[120px] desktop:pb-[120px]"
    >
      <Container>
        <div className="mb-7 flex flex-wrap items-center justify-between gap-5 mobile:mb-[50px]">
          <Typography as="h2" variant="section-title" id="home-gallery-heading">
            Фотогалерея
          </Typography>
          {!staticMode && <GalleryControls />}
          <Button
            variant="pill"
            nativeButton={false}
            render={
              <Link href="/gallery" aria-label="Все фотографии и альбомы" />
            }
            addonRight={
              <span
                data-text-decorative
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground mobile:size-11 desktop1250:size-[50px]"
              >
                <ArrowUpRight aria-hidden="true" className="size-[22px]" />
              </span>
            }
          >
            Все фото
          </Button>
        </div>
        {error ? (
          <p role="alert">
            Не удалось загрузить фотоальбомы. Попробуйте обновить страницу.
          </p>
        ) : albums.length === 0 ? (
          <ContentEmptyState kind="gallery" headingLevel="h3" />
        ) : staticMode ? (
          <ul
            data-a11y-content-grid
            className="grid gap-5"
            aria-label="Фотоальбомы медиацентра"
          >
            {albums.map((album) => (
              <li key={album.slug}>
                <GallerySlide album={album} staticMode={staticMode} />
              </li>
            ))}
          </ul>
        ) : (
          <CarouselContent className="-ml-5">
            {albums.map((album) => (
              <CarouselItem
                key={album.slug}
                className="basis-[85%] pl-5 mobile:basis-[70%] desktop:basis-[38%]"
              >
                <GallerySlide album={album} staticMode={staticMode} />
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
      </Container>
    </section>
  );

  if (staticMode) return content;
  return (
    <Carousel aria-label="Фотоальбомы" opts={{ loop: false, align: "start" }}>
      {content}
    </Carousel>
  );
}
