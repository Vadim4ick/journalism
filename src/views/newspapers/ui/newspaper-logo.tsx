import { SiteImage } from "@/components/site-image";
import type { ContentNewspaper } from "@/shared/types/model/content.type";
import { contentImageUrl } from "@/shared/lib/content-image-url";
import styles from "./newspaper-logo.module.css";

export function NewspaperLogo({ newspaper }: { newspaper: ContentNewspaper }) {
  const logo = contentImageUrl(newspaper.logo);
  return (
    <span aria-hidden="true" className={styles.logo}>
      <SiteImage
        src={logo}
        unoptimized
        alt=""
        fill
        sizes="(min-width: 1250px) 280px, (min-width: 768px) 33vw, 50vw"
        className={styles.image}
      />
    </span>
  );
}
