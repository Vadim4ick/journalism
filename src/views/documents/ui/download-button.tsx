"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";
import styles from "./documents-page.module.css";

export function DownloadButton({ title }: { title: string }) {
  return (
    <button
      type="button"
      className={styles.downloadButton}
      aria-label={`Скачать документ «${title}»`}
      onClick={() => toast.info("Файл документа пока не добавлен")}
    >
      <Download size={18} strokeWidth={1.7} aria-hidden="true" />
    </button>
  );
}
