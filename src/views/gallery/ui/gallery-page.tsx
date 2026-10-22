import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { ContentEmptyState } from "@/components/content-empty-state";
import { Container } from "@/shared/ui/container";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import { toGalleryAlbum, type GalleryAlbum } from "../model/album";
import type { ContentMedia } from "@/shared/types/model/content.type";
import styles from "./gallery-page.module.css";

function pageHref(page: number) {
  return page === 1 ? "/gallery#albums-heading" : `/gallery?page=${page}#albums-heading`;
}

function photoCountLabel(count: number) {
  const ending = new Intl.PluralRules("ru").select(count);
  const noun = ending === "one" ? "фотография" : ending === "few" ? "фотографии" : "фотографий";
  return `${count} ${noun}`;
}

function AlbumCard({ album, priority = false }: { album: GalleryAlbum; priority?: boolean }) {
  return (
    <Link
      href={"/gallery/" + album.slug}
      aria-label={album.title + ", " + album.date + ", " + photoCountLabel(album.photoCount)}
      className={styles.albumCard}
    >
      <SiteImage
        src={album.cover}
        unoptimized={album.cover?.startsWith("http")}
        alt=""
        fill
        sizes="(min-width: 1792px) 582px, (min-width: 1150px) calc((100vw - 80px) / 3), (min-width: 768px) calc((100vw - 56px) / 2), calc(100vw - 32px)"
        priority={priority}
        className={styles.albumCover}
      />
      <span aria-hidden="true" data-text-decorative className={styles.albumShade} />
      <div className={styles.albumDetails}>
        <Typography as="h3" variant="heading-small" className={styles.albumTitle}>
          {album.title}
        </Typography>
        <span className={styles.albumMeta}>
          {album.dateTime ? (
            <Typography as="time" variant="caption" dateTime={album.dateTime} className={styles.albumDate}>{album.date}</Typography>
          ) : (
            <Typography as="span" variant="caption" className={styles.albumDate}>{album.date}</Typography>
          )}
          <Typography as="span" variant="caption" className={styles.albumCount}>
            {album.photoCount} фото
          </Typography>
        </span>
      </div>
    </Link>
  );
}

export function GalleryPage({ albums, pagination, error = false }: { albums: ContentMedia[]; pagination?: Pagination; error?: boolean }) {
  const visibleAlbums = albums.map(toGalleryAlbum);
  const pageCount = pagination?.last_page ?? 1;
  const currentPage = pagination?.current_page ?? 1;

  return (
    <>
      <section aria-labelledby="gallery-heading" className={styles.heroSection}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
              <Link href="/" className="underline-offset-4 hover:underline focus-visible:underline">
                Главная
              </Link>
              <span aria-hidden="true" className={styles.breadcrumbSeparator}>
                <SiteImage src="/images/news/breadcrumb.svg" alt="" width={15} height={15} className="-rotate-90" />
                <span className="text-mode-only">›</span>
              </span>
              <span aria-current="page">Фотогалерея</span>
            </nav>
            <Typography as="h1" variant="hero-title" id="gallery-heading" className={styles.title}>
              Фотогалерея
            </Typography>
          </div>
        </div>
      </section>

      <section aria-labelledby="albums-heading" className={styles.albumsSection}>
        <Container>
          <Typography as="h2" variant="heading-medium" id="albums-heading" className="sr-only">
            Фотоальбомы
          </Typography>
          {error && <p role="alert">Не удалось загрузить фотоальбомы. Попробуйте обновить страницу.</p>}
          {!error && visibleAlbums.length > 0 && <ul data-a11y-content-grid className={styles.albumsGrid}>
            {visibleAlbums.map((album, index) => (
              <li key={album.slug}>
                <ScrollReveal><AlbumCard album={album} priority={index === 0} /></ScrollReveal>
              </li>
            ))}
          </ul>}
          {!error && visibleAlbums.length === 0 && (
            <ScrollReveal><ContentEmptyState kind="gallery" /></ScrollReveal>
          )}
          {!error && pageCount > 1 && (
            <ScrollReveal>
              <nav aria-label="Страницы фотоальбомов" className={styles.pagination}>
                {currentPage > 1 ? (
                  <Link href={pageHref(currentPage - 1)} aria-label="Предыдущая страница" className={styles.pageArrow}>
                    <ChevronLeft aria-hidden="true" size={18} />
                  </Link>
                ) : (
                  <span aria-hidden="true" className={styles.pageArrowDisabled}>
                    <ChevronLeft size={18} />
                  </span>
                )}
                {Array.from({ length: pageCount }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <Link
                      key={pageNumber}
                      href={pageHref(pageNumber)}
                      aria-label={`Страница ${pageNumber}`}
                      aria-current={pageNumber === currentPage ? "page" : undefined}
                      className={styles.pageNumber}
                    >
                      {pageNumber}
                    </Link>
                  );
                })}
                {currentPage < pageCount ? (
                  <Link href={pageHref(currentPage + 1)} aria-label="Следующая страница" className={styles.pageArrow}>
                    <ChevronRight aria-hidden="true" size={18} />
                  </Link>
                ) : (
                  <span aria-hidden="true" className={styles.pageArrowDisabled}>
                    <ChevronRight size={18} />
                  </span>
                )}
              </nav>
            </ScrollReveal>
          )}
        </Container>
      </section>
    </>
  );
}
