"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import { contentImageUrl } from "@/shared/lib/content-image-url";
import type { ContentProjectBlockItem } from "@/shared/types/model/content.type";
import { Carousel, CarouselContent, CarouselItem, useCarousel } from "@/shared/ui/carousel";
import { useAccessibilityStore, useEffectiveReducedMotion } from "@/state/accessibility";
import styles from "./project-detail-page.module.css";

function ExpertsControls({ title }: { title: string }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  return (
    <div className={styles.galleryControls} role="group" aria-label={`Управление блоком «${title}»`}>
      <button type="button" onClick={scrollPrev} disabled={!canScrollPrev} aria-label="Предыдущие эксперты" className={styles.galleryButton}>
        <ChevronLeft aria-hidden="true" size={20} />
      </button>
      <button type="button" onClick={scrollNext} disabled={!canScrollNext} aria-label="Следующие эксперты" className={styles.galleryButton}>
        <ChevronRight aria-hidden="true" size={20} />
      </button>
    </div>
  );
}

export function ExpertsCarousel({ items, title, headingId }: { items: readonly ContentProjectBlockItem[]; title: string; headingId: string }) {
  const textMode = useAccessibilityStore((state) => state.textMode);
  const reducedMotion = useEffectiveReducedMotion();

  if (items.length === 0) return null;

  const cards = items.map((item) => {
    const imageSrc = contentImageUrl(item.image?.url);
    return (
      <article key={item.id} className={styles.expertCard}>
        {imageSrc && (
          <div className={styles.expertImage}>
            <SiteImage
              src={imageSrc}
              unoptimized
              alt={item.image?.alt || item.title}
              textLinkLabel={item.image?.alt || item.title}
              fill
              sizes="(min-width: 1150px) 320px, (min-width: 768px) 50vw, 80vw"
              className="object-cover"
            />
          </div>
        )}
        <h3 className={styles.expertName}>{item.title}</h3>
        {item.description_html && <div className={styles.htmlContent} dangerouslySetInnerHTML={{ __html: item.description_html }} />}
      </article>
    );
  });

  if (textMode) {
    return (
      <section aria-labelledby={headingId} className={styles.expertsSection} data-text-flow>
        <h2 id={headingId} className={styles.sectionTitle}>{title}</h2>
        <ul className={styles.expertList}>{cards.map((card, index) => <li key={items[index].id}>{card}</li>)}</ul>
      </section>
    );
  }

  return (
    <section aria-labelledby={headingId} className={styles.expertsSection}>
      <Carousel opts={{ align: "start", containScroll: "trimSnaps", duration: reducedMotion ? 0 : 25 }} aria-label={title}>
        <div className={styles.expertsHeader}>
          <h2 id={headingId} className={styles.sectionTitle}>{title}</h2>
          <ExpertsControls title={title} />
        </div>
        <CarouselContent className={styles.expertsTrack}>
          {cards.map((card, index) => <CarouselItem key={items[index].id} className={styles.expertsItem}>{card}</CarouselItem>)}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
