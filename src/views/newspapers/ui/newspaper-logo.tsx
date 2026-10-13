import { SiteImage } from "@/components/site-image";
import type { Newspaper } from "../model/newspapers";
import styles from "./newspaper-logo.module.css";

export function NewspaperLogo({ newspaper }: { newspaper: Newspaper }) {
  return (
    <span aria-hidden="true" className={styles.logo}>
      {newspaper.logo ? (
        <SiteImage
          src={newspaper.logo.src}
          alt=""
          width={newspaper.logo.width}
          height={newspaper.logo.height}
          sizes="(min-width: 1250px) 280px, (min-width: 768px) 33vw, 50vw"
          className={styles.image}
        />
      ) : (
        <span className={styles.placeholder}>{newspaper.shortName}</span>
      )}
    </span>
  );
}
