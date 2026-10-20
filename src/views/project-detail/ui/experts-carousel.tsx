"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import { SiteImage } from "@/components/site-image";
import { Carousel, CarouselContent, CarouselItem, useCarousel } from "@/shared/ui/carousel";
import { Typography } from "@/shared/ui/typography";
import { useAccessibilityStore, useEffectiveReducedMotion } from "@/state/accessibility";
import styles from "./project-detail-page.module.css";

const EXPERT_PHOTOS = Array.from({ length: 10 }, (_, index) => ({
  src: "/images/no-image.png",
  alt: `Фото эксперта ${index + 1}: изображение пока не добавлено`,
}));

function ExpertsControls() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <div className={styles.galleryControls} role="group" aria-label="Управление фотографиями экспертов">
      <button type="button" onClick={scrollPrev} disabled={!canScrollPrev} aria-label="Предыдущие фотографии экспертов" className={styles.galleryButton}>
        <ChevronLeft aria-hidden="true" size={20} />
      </button>
      <button type="button" onClick={scrollNext} disabled={!canScrollNext} aria-label="Следующие фотографии экспертов" className={styles.galleryButton}>
        <ChevronRight aria-hidden="true" size={20} />
      </button>
    </div>
  );
}

export function ExpertsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const textMode = useAccessibilityStore((state) => state.textMode);
  const reducedMotion = useEffectiveReducedMotion();

  function move(direction: number) {
    setActiveIndex((index) => (index + direction + EXPERT_PHOTOS.length) % EXPERT_PHOTOS.length);
  }

  if (textMode) {
    return (
      <>
        <Typography as="h2" variant="body" id="experts-heading" className={styles.sectionTitle}>Наши эксперты</Typography>
        <p>Фотографии десяти экспертов пока не добавлены.</p>
        <a href="/images/no-image.png" download>Скачать файл-заглушку</a>
      </>
    );
  }

  return (
    <>
      <Carousel
        opts={{ align: "start", containScroll: "trimSnaps", duration: reducedMotion ? 0 : 25 }}
        aria-label="Фотографии экспертов"
        className={styles.expertsCarousel}
      >
        <div className={styles.expertsHeader}>
          <Typography as="h2" variant="body" id="experts-heading" className={styles.sectionTitle}>Наши эксперты</Typography>
          <ExpertsControls />
        </div>
        <div className={styles.expertsWindow}>
          <CarouselContent className={styles.expertsTrack}>
            {EXPERT_PHOTOS.map((image, index) => (
              <CarouselItem key={index} className={styles.expertsItem} aria-label={`Фото эксперта ${index + 1} из ${EXPERT_PHOTOS.length}: изображение пока не добавлено`}>
                <div className={styles.expertImage}>
                  <button
                    type="button"
                    className={styles.galleryOpen}
                    aria-label={`Открыть фото эксперта ${index + 1}`}
                    onClick={(event) => {
                      openerRef.current = event.currentTarget;
                      setActiveIndex(index);
                      setLightboxOpen(true);
                    }}
                  >
                    <SiteImage
                      src={image.src}
                      alt=""
                      fill
                      sizes="(min-width: 1350px) 320px, (min-width: 1150px) 33vw, (min-width: 768px) 50vw, 80vw"
                      className="object-cover"
                    />
                  </button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
      <GalleryLightbox images={EXPERT_PHOTOS} title="Наши эксперты" activeIndex={activeIndex} open={lightboxOpen} onOpenChange={setLightboxOpen} onChange={move} finalFocus={openerRef} />
    </>
  );
}
