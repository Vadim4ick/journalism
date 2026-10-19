"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import { SiteImage } from "@/components/site-image";
import { useAccessibilityStore } from "@/state/accessibility";
import styles from "./news-detail-page.module.css";

export function NewsGallery({ images, title }: { images: { src: string; alt: string }[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const textMode = useAccessibilityStore((state) => state.textMode);
  const image = images[active];

  function move(direction: number) {
    setActive((index) => (index + direction + images.length) % images.length);
  }

  if (!image) return null;

  return (
    <>
      <figure className={styles.gallery}>
        <div className={styles.imageFrame}>
          {textMode ? (
            <a href={image.src} className={styles.textImageLink}>Открыть фото новости: {image.alt}</a>
          ) : (
            <button
              type="button"
              className={styles.imageOpen}
              aria-label={`Открыть фотографию ${active + 1}: ${image.alt}`}
              onClick={(event) => {
                openerRef.current = event.currentTarget;
                setLightboxOpen(true);
              }}
            >
              <SiteImage
                key={image.src}
                src={image.src}
                alt=""
                fill
                unoptimized={image.src.startsWith("http")}
                sizes="(min-width: 880px) 800px, calc(100vw - 32px)"
                className="object-cover"
                priority={active === 0}
              />
            </button>
          )}
        </div>
        {images.length > 1 && <div className={styles.galleryFooter}>
          <div role="group" className={styles.galleryControls} aria-label="Управление фотографиями">
            <button type="button" onClick={() => move(-1)} aria-label="Предыдущее фото" className={styles.galleryButton}>
              <ChevronLeft aria-hidden="true" size={20} />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Следующее фото" className={styles.galleryButton}>
              <ChevronRight aria-hidden="true" size={20} />
            </button>
          </div>
        </div>}
        {images.length > 1 && <p className="sr-only" aria-live="polite">Фото {active + 1} из {images.length}</p>}
      </figure>
      <GalleryLightbox images={images} title={title} activeIndex={active} open={lightboxOpen} onOpenChange={setLightboxOpen} onChange={move} finalFocus={openerRef} />
    </>
  );
}
