import { Typography } from "@/shared/ui/typography";
import { Container } from "@/shared/ui/container";
import { HOME_CATEGORIES } from "../model/const";
import { SiteImage as Image } from "@/components/site-image";
import styles from "./home-categories.module.css";

const HomeCategories = () => {
  return (
    <section aria-label="Направления Дома журналистики" className="py-15 mobile:py-20 tablet:py-25">
      <Container>
        <div className={styles.grid}>
          {HOME_CATEGORIES.map((category) => (
            <article key={category.id} className={styles.card}>
              <Image
                src={category.image}
                alt=""
                width={270}
                height={270}
                sizes="(min-width: 768px) 270px, (min-width: 450px) 45vw, 220px"
                className={styles.image}
              />
              <Typography as="h2" variant="category-title" className={styles.title}>{category.title}</Typography>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export { HomeCategories };
