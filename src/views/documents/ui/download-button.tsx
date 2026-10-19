"use client";

import { Download } from "lucide-react";
import type { ContentDocumentFile } from "@/shared/types/model/content.type";
import styles from "./documents-page.module.css";

export function DownloadButton({
  documentId,
  title,
  file,
}: {
  documentId: number;
  title: string;
  file: ContentDocumentFile | null;
}) {
  if (!file || (!file.url && !file.id)) return null;

  return (
    <div className={styles.downloadAction}>
      <span className={styles.downloadLabel}>Скачать</span>
      <a
        href={`/api/documents/${documentId}/download`}
        download={file.name || undefined}
        className={styles.downloadButton}
        aria-label={`Скачать документ «${title}»`}
      >
        <Download size={18} strokeWidth={1.7} aria-hidden="true" />
      </a>
    </div>
  );
}
