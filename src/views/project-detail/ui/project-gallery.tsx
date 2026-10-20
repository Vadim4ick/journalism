"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import { SiteImage } from "@/components/site-image";
import { Carousel, CarouselContent, CarouselItem, useCarousel } from "@/shared/ui/carousel";
import { useAccessibilityStore, useEffectiveReducedMotion } from "@/state/accessibility";
import styles from "./project-detail-page.module.css";

type GalleryImage = { src: string; alt: string };

function GalleryControls() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <div className={styles.galleryControls} role="group" aria-label="Управление фотографиями">
      <button type="button" onClick={scrollPrev} disabled={!canScrollPrev} aria-label="Предыдущие фотографии" className={styles.galleryButton}>
        <ChevronLeft aria-hidden="true" size={20} />
      </button>
      <button type="button" onClick={scrollNext} disabled={!canScrollNext} aria-label="Следующие фотографии" className={styles.galleryButton}>
        <ChevronRight aria-hidden="true" size={20} />
      </button>
    </div>
  );
}

export function ProjectGallery({ images }: { images: readonly GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const textMode = useAccessibilityStore((state) => state.textMode);
  const reducedMotion = useEffectiveReducedMotion();

  function move(direction: number) {
    setActiveIndex((index) => (index + direction + images.length) % images.length);
  }

  if (images.length === 0) return null;

  if (textMode) {
    return (
      <section aria-labelledby="project-gallery-heading" className={styles.gallerySection} data-text-flow>
        <h2 id="project-gallery-heading" className="sr-only">Фотографии проекта</h2>
        <ul className={styles.textGallery}>
          {images.map((image) => (
            <li key={image.src}>
              <SiteImage src={image.src} alt={image.alt} textLinkLabel={image.alt} width={400} height={300} />{" "}
              <a href={image.src} download>Скачать фотографию</a>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <>
      <section aria-labelledby="project-gallery-heading" className={styles.gallerySection}>
        <h2 id="project-gallery-heading" className="sr-only">Фотографии проекта</h2>
        <Carousel opts={{ align: "start", containScroll: "trimSnaps", duration: reducedMotion ? 0 : 25 }} aria-label="Фотографии проекта">
          <div className={styles.galleryHeading}><GalleryControls /></div>
          <CarouselContent className={styles.galleryTrack}>
            {images.map((image, index) => (
              <CarouselItem key={`${image.src}-${index}`} className={styles.galleryItem}>
                <div className={styles.galleryImage}>
                  <button
                    type="button"
                    className={styles.galleryOpen}
                    aria-label={`Открыть фотографию ${index + 1}: ${image.alt}`}
                    onClick={(event) => {
                      openerRef.current = event.currentTarget;
                      setActiveIndex(index);
                      setLightboxOpen(true);
                    }}
                  >
                    <SiteImage src={image.src} alt="" fill sizes="(min-width: 1150px) calc((min(100vw, 1792px) - 64px) / 3), (min-width: 768px) 50vw, calc(100vw - 32px)" className="object-cover" />
                  </button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
      <GalleryLightbox images={images} title="Фотографии проекта" activeIndex={activeIndex} open={lightboxOpen} onOpenChange={setLightboxOpen} onChange={move} finalFocus={openerRef} />
    </>
  );
}
