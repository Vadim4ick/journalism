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

type HomeGalleryAlbum = {
  slug: string;
  title: string;
  cover: { src: string };
  photos: readonly unknown[];
};

function GalleryControls() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

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
        <SiteImage src="/images/home/arrows/gallery-prev.svg" alt="" aria-hidden="true" width={52} height={52} className="size-[52px]" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Следующие альбомы"
        disabled={!canScrollNext}
        onClick={scrollNext}
        className="size-[52px] rounded-full border-0 bg-transparent p-0 shadow-none"
      >
        <SiteImage src="/images/home/arrows/gallery-next.svg" alt="" aria-hidden="true" width={52} height={52} className="size-[52px] rotate-180" />
      </Button>
    </div>
  );
}

function GallerySlide({ album, staticMode }: { album: HomeGalleryAlbum; staticMode: boolean }) {
  return (
    <Link href={`/gallery/${album.slug}`} className={styles.slide} aria-label={`${album.title}, ${album.photos.length} фото`}>
      <SiteImage
        src={album.cover.src}
        alt=""
        fill
        sizes={staticMode
          ? "(min-width: 1792px) 1760px, calc(100vw - 32px)"
          : "(min-width: 1792px) 668px, (min-width: 768px) 38vw, 85vw"}
        className={styles.cover}
      />
      <span aria-hidden="true" data-text-decorative className={styles.shade} />
      <span className={styles.slideDetails}>
        <Typography as="span" variant="heading-small" className={styles.slideTitle}>
          {album.title}
        </Typography>
        <Typography as="span" variant="caption" className={styles.slideCount}>
          {album.photos.length} фото
        </Typography>
      </span>
    </Link>
  );
}

export function HomeGallery({ albums }: { albums: readonly HomeGalleryAlbum[] }) {
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
            render={<Link href="/gallery" aria-label="Все фотографии и альбомы" />}
            addonRight={
              <span data-text-decorative className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground mobile:size-11 desktop1250:size-[50px]">
                <ArrowUpRight aria-hidden="true" className="size-[22px]" />
              </span>
            }
          >
            Все фото
          </Button>
        </div>
        {albums.length === 0 ? (
          <p>Фотоальбомов пока нет.</p>
        ) : staticMode ? (
          <ul data-a11y-content-grid className="grid gap-5" aria-label="Фотоальбомы медиацентра">
            {albums.map((album) => (
              <li key={album.slug}>
                <GallerySlide album={album} staticMode={staticMode} />
              </li>
            ))}
          </ul>
        ) : (
          <CarouselContent className="-ml-5">
            {albums.map((album) => (
              <CarouselItem key={album.slug} className="basis-[85%] pl-5 mobile:basis-[70%] desktop:basis-[38%]">
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
