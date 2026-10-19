"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteImage } from "@/components/site-image";

type GalleryImage = { src: string; alt: string };

export function EventGallery({ images, title, source }: { images: GalleryImage[]; title: string; source?: string }) {
  const [active, setActive] = useState(0);
  const image = images[active];
  const move = (direction: number) =>
    setActive((index) => (index + direction + images.length) % images.length);

  return (
    <figure>
      <div className="relative aspect-[2/1] overflow-hidden rounded-2xl bg-muted">
        <SiteImage
          key={image.src}
          src={image.src}
          alt={image.alt}
          textLinkLabel={`Фото события «${title}»: ${image.alt}`}
          fill
          unoptimized={image.src.startsWith("http")}
          sizes="(min-width: 1232px) 1200px, calc(100vw - 32px)"
          className="object-cover"
          priority={active === 0}
        />
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        {source && <figcaption className="text-xs text-muted-foreground">Источник: {source}</figcaption>}
        {images.length > 1 && (
          <div className="flex shrink-0 gap-4" aria-label="Управление фотографиями">
            <button type="button" onClick={() => move(-1)} aria-label="Предыдущее фото" className="flex size-[52px] items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none">
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Следующее фото" className="flex size-[52px] items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none">
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        )}
      </div>
      {images.length > 1 && <p className="sr-only" aria-live="polite">Фото {active + 1} из {images.length}</p>}
    </figure>
  );
}
