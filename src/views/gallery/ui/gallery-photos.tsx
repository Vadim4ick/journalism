"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Download, X } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { useAccessibilityStore } from "@/state/accessibility";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import type { GalleryAlbum } from "../model/albums";
import styles from "./gallery-album-page.module.css";

export function GalleryPhotos({ album }: { album: GalleryAlbum }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const textMode = useAccessibilityStore((state) => state.textMode);
  const activePhoto = album.photos[activeIndex ?? 0];
  const count = album.photos.length;

  function changePhoto(step: number) {
    setActiveIndex((current) => current === null ? null : (current + step + count) % count);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (count < 2) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      changePhoto(event.key === "ArrowLeft" ? -1 : 1);
    }
  }

  return (
    <Dialog open={activeIndex !== null} onOpenChange={(open) => {
      if (!open) setActiveIndex(null);
    }}>
      <ul data-a11y-content-grid className={styles.photosGrid}>
        {album.photos.map((photo, index) => (
          <li key={photo.id}>
            <ScrollReveal>
              <figure className={styles.photoFrame}>
                {textMode ? (
                  <a href={photo.src} className={styles.textPhotoLink}>
                    Открыть фотографию {index + 1}: {photo.alt}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={styles.photoOpen}
                    aria-label={`Открыть фотографию ${index + 1}: ${photo.alt}`}
                    onClick={(event) => {
                      openerRef.current = event.currentTarget;
                      setActiveIndex(index);
                    }}
                  >
                    <SiteImage
                      src={photo.src}
                      alt=""
                      fill
                      priority={index === 0}
                      sizes="(min-width: 1792px) 582px, (min-width: 1150px) calc((100vw - 80px) / 3), (min-width: 768px) calc((100vw - 56px) / 2), calc(100vw - 32px)"
                      className={styles.photo}
                    />
                  </button>
                )}
                <a
                  href={photo.src}
                  download
                  className={styles.photoDownload}
                  aria-label={`Скачать фотографию ${index + 1}: ${photo.alt}`}
                >
                  <Download size={20} aria-hidden="true" />
                  <span className={styles.photoDownloadLabel}>Скачать</span>
                </a>
                <figcaption className="sr-only">{photo.alt}</figcaption>
              </figure>
            </ScrollReveal>
          </li>
        ))}
      </ul>

      {activePhoto && (
        <DialogContent
          fullscreen
          finalFocus={openerRef}
          onKeyDown={handleKeyDown}
          className={styles.lightbox}
        >
          <header className={styles.lightboxHeader}>
            <div className={styles.lightboxHeading}>
              <DialogTitle className={styles.lightboxTitle}>{album.title}</DialogTitle>
              <DialogDescription className={styles.lightboxCount} aria-live="polite">
                Фотография {(activeIndex ?? 0) + 1} из {count}
              </DialogDescription>
            </div>
            <div className={styles.lightboxActions}>
              <a
                href={activePhoto.src}
                download
                className={styles.lightboxDownload}
                aria-label={`Скачать фотографию: ${activePhoto.alt}`}
              >
                <Download size={20} aria-hidden="true" />
                <span>Скачать</span>
              </a>
              <DialogClose className={styles.lightboxClose} aria-label="Закрыть просмотр фотографий">
                <X size={24} aria-hidden="true" />
              </DialogClose>
            </div>
          </header>
          <div className={styles.lightboxBody}>
            {count > 1 && (
              <button type="button" className={styles.lightboxPrevious} onClick={() => changePhoto(-1)} aria-label="Предыдущая фотография">
                <ArrowLeft size={24} aria-hidden="true" />
              </button>
            )}
            <div className={styles.lightboxImageWrap}>
              <SiteImage
                key={activePhoto.id}
                src={activePhoto.src}
                alt={activePhoto.alt}
                textLinkLabel={activePhoto.alt}
                fill
                sizes="100vw"
                className={styles.lightboxImage}
              />
            </div>
            {count > 1 && (
              <button type="button" className={styles.lightboxNext} onClick={() => changePhoto(1)} aria-label="Следующая фотография">
                <ArrowRight size={24} aria-hidden="true" />
              </button>
            )}
          </div>
          <p className={styles.lightboxCaption}>{activePhoto.alt}</p>
        </DialogContent>
      )}
    </Dialog>
  );
}
