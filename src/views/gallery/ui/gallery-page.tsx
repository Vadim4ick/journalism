import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { Container } from "@/shared/ui/container";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import { GALLERY_ALBUMS, type GalleryAlbum } from "../model/albums";
import styles from "./gallery-page.module.css";

const PAGE_SIZE = 3;

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
      aria-label={album.title + ", " + album.date + ", " + photoCountLabel(album.photos.length)}
      className={styles.albumCard}
    >
      <SiteImage
        src={album.cover.src}
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
          <Typography as="time" variant="caption" dateTime={album.dateTime} className={styles.albumDate}>
            {album.date}
          </Typography>
          <Typography as="span" variant="caption" className={styles.albumCount}>
            {album.photos.length} фото
          </Typography>
        </span>
      </div>
    </Link>
  );
}

export function GalleryPage({ page }: { page?: string | string[] }) {
  const pageCount = Math.ceil(GALLERY_ALBUMS.length / PAGE_SIZE);
  const parsedPage = typeof page === "string" && /^[1-9]\d*$/.test(page) ? Number(page) : 1;
  const currentPage = Math.min(Number.isSafeInteger(parsedPage) ? parsedPage : 1, Math.max(pageCount, 1));
  const visibleAlbums = GALLERY_ALBUMS.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <section aria-labelledby="gallery-heading" className={styles.heroSection}>
        <Container className="w-full max-w-[1840px] px-0">
          <div className={styles.hero}>
            <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
              <Link href="/" className="underline-offset-4 hover:underline focus-visible:underline">
                Главная
              </Link>
              <span aria-hidden="true">›</span>
              <span aria-current="page">Фотогалерея</span>
            </nav>
            <Typography as="h1" variant="hero-title" id="gallery-heading" className={styles.title}>
              Фотогалерея
            </Typography>
          </div>
        </Container>
      </section>

      <section aria-labelledby="albums-heading" className={styles.albumsSection}>
        <Container>
          <Typography as="h2" variant="heading-medium" id="albums-heading" className="sr-only">
            Фотоальбомы
          </Typography>
          <ul data-a11y-content-grid className={styles.albumsGrid}>
            {visibleAlbums.map((album, index) => (
              <li key={album.slug}>
                <ScrollReveal><AlbumCard album={album} priority={index === 0} /></ScrollReveal>
              </li>
            ))}
          </ul>
          {visibleAlbums.length === 0 && <p>Фотоальбомов пока нет.</p>}
          {pageCount > 1 && (
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
          )}
        </Container>
      </section>
    </>
  );
}
