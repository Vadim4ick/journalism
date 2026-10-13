"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { useAccessibilityStore } from "@/state/accessibility";

type SiteImageProps = ImageProps & {
  textLinkLabel?: string;
  textModeLink?: boolean;
};

/** Wait for saved preferences before requesting image resources. */
export function SiteImage({ textLinkLabel, textModeLink = true, ...props }: SiteImageProps) {
  const textMode = useAccessibilityStore((state) => state.textMode);
  const hydrated = useAccessibilityStore((state) => state.hydrated);
  const [loaded, setLoaded] = useState(false);

  if (textMode) {
    const src =
      typeof props.src === "string"
        ? props.src
        : "default" in props.src
          ? props.src.default.src
          : props.src.src;

    if (!textLinkLabel) return null;
    return textModeLink ? <a href={src}>{textLinkLabel}</a> : <span>{textLinkLabel}</span>;
  }

  // No src/srcset or preload is emitted until the text-mode preference is known.
  if (!hydrated) return null;

  return (
    <Image
      {...props}
      alt={props.alt}
      onLoad={(event) => {
        setLoaded(true);
        props.onLoad?.(event);
      }}
      className={cn(
        props.className,
        loaded ? "opacity-100" : "opacity-0",
        "transition-[opacity,scale] duration-700 ease-out motion-reduce:transition-none",
      )}
    />
  );
}
