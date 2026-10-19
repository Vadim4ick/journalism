"use client";

import { Download } from "lucide-react";
import type { ContentDocumentFile } from "@/shared/types/model/content.type";
import styles from "./documents-page.module.css";

function fileUrl(file: ContentDocumentFile | null) {
  if (!file || typeof file.url !== "string" || !file.url.trim()) return null;

  try {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const url = new URL(file.url, serverUrl ? `${serverUrl.replace(/\/$/, "")}/` : undefined);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

export function DownloadButton({
  title,
  file,
}: {
  title: string;
  file: ContentDocumentFile | null;
}) {
  const href = fileUrl(file);
  if (!href) return null;

  return (
    <div className={styles.downloadAction}>
      <span className={styles.downloadLabel}>Скачать</span>
      <a
        href={href}
        download={file?.name ?? ""}
        className={styles.downloadButton}
        aria-label={`Скачать документ «${title}»`}
      >
        <Download size={18} strokeWidth={1.7} aria-hidden="true" />
      </a>
    </div>
  );
}
