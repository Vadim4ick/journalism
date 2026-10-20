"use client";

import { type KeyboardEvent, type RefObject } from "react";
import { ArrowLeft, ArrowRight, Download, X } from "lucide-react";
import { SiteImage } from "@/components/site-image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import styles from "./gallery-lightbox.module.css";

type GalleryImage = { src: string; alt: string };

export function GalleryLightbox({
  images,
  title,
  activeIndex,
  open,
  onOpenChange,
  onChange,
  finalFocus,
}: {
  images: readonly GalleryImage[];
  title: string;
  activeIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (direction: number) => void;
  finalFocus: RefObject<HTMLButtonElement | null>;
}) {
  const activeImage = images[activeIndex];
  if (!activeImage) return null;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (images.length < 2) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      onChange(event.key === "ArrowLeft" ? -1 : 1);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent fullscreen finalFocus={finalFocus} onKeyDown={handleKeyDown} className={styles.lightbox}>
        <header className={styles.header}>
          <div className={styles.heading}>
            <DialogTitle className={styles.title}>{title}</DialogTitle>
            <DialogDescription className={styles.count} aria-live="polite">
              Фотография {activeIndex + 1} из {images.length}
            </DialogDescription>
          </div>
          <div className={styles.actions}>
            <a href={activeImage.src} download className={styles.download} aria-label={`Скачать фотографию: ${activeImage.alt}`}>
              <Download size={20} aria-hidden="true" />
              <span>Скачать</span>
            </a>
            <DialogClose className={styles.close} aria-label="Закрыть просмотр фотографий">
              <X size={24} aria-hidden="true" />
            </DialogClose>
          </div>
        </header>
        <div className={styles.body}>
          {images.length > 1 && (
            <button type="button" className={styles.previous} onClick={() => onChange(-1)} aria-label="Предыдущая фотография">
              <ArrowLeft size={24} aria-hidden="true" />
            </button>
          )}
          <div className={styles.imageWrap}>
            <SiteImage
              key={activeImage.src}
              src={activeImage.src}
              unoptimized={activeImage.src.startsWith("http")}
              alt={activeImage.alt}
              textLinkLabel={activeImage.alt}
              fill
              sizes="100vw"
              className={styles.image}
            />
          </div>
          {images.length > 1 && (
            <button type="button" className={styles.next} onClick={() => onChange(1)} aria-label="Следующая фотография">
              <ArrowRight size={24} aria-hidden="true" />
            </button>
          )}
        </div>
        <p className={styles.caption}>{activeImage.alt}</p>
      </DialogContent>
    </Dialog>
  );
}
