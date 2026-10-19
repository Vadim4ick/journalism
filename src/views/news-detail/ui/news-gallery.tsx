"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import styles from "./news-detail-page.module.css";

export function NewsGallery({ images }: { images: { src: string; alt: string }[] }) {
  const [active, setActive] = useState(0);
  const image = images[active];

  function move(direction: number) {
    setActive((index) => (index + direction + images.length) % images.length);
  }

  return (
    <figure className={styles.gallery}>
      <div className={styles.imageFrame}>
        <SiteImage
          key={image.src}
          src={image.src}
          alt={image.alt}
          textLinkLabel={`Фото новости: ${image.alt}`}
          fill
          unoptimized={image.src.startsWith("http")}
          sizes="(min-width: 880px) 800px, calc(100vw - 32px)"
          className="object-cover"
          priority={active === 0}
        />
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
  );
}
