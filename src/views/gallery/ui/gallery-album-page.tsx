import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import { Container } from "@/shared/ui/container";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import type { GalleryAlbum } from "../model/albums";
import styles from "./gallery-album-page.module.css";

function photoCountLabel(count: number) {
  const ending = new Intl.PluralRules("ru").select(count);
  const noun = ending === "one" ? "фотография" : ending === "few" ? "фотографии" : "фотографий";
  return `${count} ${noun}`;
}

export function GalleryAlbumPage({ album }: { album: GalleryAlbum }) {
  return (
    <Container className="w-full">
      <article className={styles.article}>
        <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
          <Link href="/" className="hover:underline focus-visible:underline">
            Главная
          </Link>
          <span aria-hidden="true" className={styles.breadcrumbSeparator}>›</span>
          <Link href="/gallery" className="hover:underline focus-visible:underline">
            Фотогалерея
          </Link>
          <span aria-hidden="true" className={styles.breadcrumbSeparator}>›</span>
          <span aria-current="page">{album.title}</span>
        </nav>

        <header className={styles.header}>
          <div className={styles.albumMeta}>
            <Typography as="time" variant="caption" dateTime={album.dateTime} className={styles.metaText}>
              {album.date}
            </Typography>
            <Typography as="span" variant="caption" className={styles.metaText}>
              {photoCountLabel(album.photos.length)}
            </Typography>
          </div>
          <Typography as="h1" variant="heading-medium" id="album-heading" className={styles.title}>
            {album.title}
          </Typography>
        </header>

        <section aria-labelledby="album-heading">
          <ul data-a11y-content-grid className={styles.photosGrid}>
            {album.photos.map((photo, index) => (
              <li key={photo.id}>
                <ScrollReveal>
                  <figure className={styles.photoFrame}>
                    <SiteImage
                      src={photo.src}
                      alt={photo.alt}
                      textLinkLabel={"Фотография из альбома «" + album.title + "»: " + photo.alt}
                      fill
                      priority={index === 0}
                      sizes="(min-width: 1792px) 582px, (min-width: 1150px) calc((100vw - 80px) / 3), (min-width: 768px) calc((100vw - 56px) / 2), calc(100vw - 32px)"
                      className={styles.photo}
                    />
                    <figcaption className="sr-only">{photo.alt}</figcaption>
                  </figure>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </Container>
  );
}
