import Link from "next/link";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { GalleryPhotos } from "./gallery-photos";
import type { GalleryAlbum } from "../model/album";
import styles from "./gallery-album-page.module.css";

function photoCountLabel(count: number) {
  const ending = new Intl.PluralRules("ru").select(count);
  const noun = ending === "one" ? "фотография" : ending === "few" ? "фотографии" : "фотографий";
  return `${count} ${noun}`;
}

export function GalleryAlbumPage({ album, detailText }: { album: GalleryAlbum; detailText?: string | null }) {
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
            {album.dateTime ? (
              <Typography as="time" variant="caption" dateTime={album.dateTime} className={styles.metaText}>{album.date}</Typography>
            ) : (
              <Typography as="span" variant="caption" className={styles.metaText}>{album.date}</Typography>
            )}
            <Typography as="span" variant="caption" className={styles.metaText}>
              {photoCountLabel(album.photoCount)}
            </Typography>
          </div>
          <Typography as="h1" variant="heading-medium" id="album-heading" className={styles.title}>
            {album.title}
          </Typography>
        </header>

        {album.description && <Typography variant="body" className={styles.description}>{album.description}</Typography>}
        {detailText && <div className={styles.description} dangerouslySetInnerHTML={{ __html: detailText }} />}

        <section aria-labelledby="album-heading">
          {album.photos.length ? <GalleryPhotos album={album} /> : <p>Фотографий пока нет.</p>}
        </section>
      </article>
    </Container>
  );
}
