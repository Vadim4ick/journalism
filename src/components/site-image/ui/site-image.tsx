"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { useAccessibilityStore } from "@/state/accessibility";

type SiteImageProps = Omit<ImageProps, "src"> & {
  src?: ImageProps["src"] | null;
  textLinkLabel?: string;
  textModeLink?: boolean;
};

const fallbackSrc = "/images/no-image.png";

function imagePath(src: SiteImageProps["src"]): string {
  if (typeof src === "string") return src.trim();
  if (!src) return "";
  return "default" in src ? src.default.src : src.src;
}

/** Wait for saved preferences before requesting image resources. */
export function SiteImage({ textLinkLabel, textModeLink = true, ...props }: SiteImageProps) {
  const textMode = useAccessibilityStore((state) => state.textMode);
  const hydrated = useAccessibilityStore((state) => state.hydrated);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const originalSrc = imagePath(props.src);
  const srcKey = originalSrc || fallbackSrc;
  const currentSrc = !originalSrc || failedSrc === srcKey ? fallbackSrc : srcKey;
  const src = currentSrc === fallbackSrc ? fallbackSrc : typeof props.src === "string" ? currentSrc : props.src!;

  if (textMode) {
    if (!textLinkLabel) return null;
    return textModeLink ? <a href={currentSrc}>{textLinkLabel}</a> : <span>{textLinkLabel}</span>;
  }

  // No src/srcset or preload is emitted until the text-mode preference is known.
  if (!hydrated) return null;

  return (
    <Image
      {...props}
      src={src}
      alt={props.alt}
      onLoad={(event) => {
        setLoadedSrc(currentSrc);
        props.onLoad?.(event);
      }}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) setFailedSrc(srcKey);
        props.onError?.(event);
      }}
      className={cn(
        props.className,
        loadedSrc === currentSrc ? "opacity-100" : "opacity-0",
        "transition-[opacity,scale] duration-700 ease-out motion-reduce:transition-none",
      )}
    />
  );
}
