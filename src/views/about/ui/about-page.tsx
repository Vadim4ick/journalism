import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import { Container } from "@/shared/ui/container";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import styles from "./about-page.module.css";

export function AboutPage() {
  return (
    <>
      <section aria-labelledby="about-heading" className={styles.heroSection}>
        <Container className="w-full max-w-[1840px] px-0">
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
                <Link
                  href="/"
                  className="rounded-sm underline-offset-4 hover:underline focus-visible:underline"
                >
                  Главная
                </Link>
                <span aria-hidden="true" className={styles.breadcrumbSeparator}>
                  <SiteImage
                    src="/images/news/breadcrumb.svg"
                    alt=""
                    width={15}
                    height={15}
                    className="-rotate-90"
                  />
                  <span className="text-mode-only">›</span>
                </span>
                <span aria-current="page">О нас</span>
              </nav>
              <Typography
                as="h1"
                variant="hero-title"
                id="about-heading"
                className={styles.title}
              >
                О нас
              </Typography>
              <Typography
                as="p"
                variant="hero-description"
                className={styles.description}
              >
                Пространство для тех, кто создает контент. Здесь рождаются идеи,
                проекты и коллаборации.
              </Typography>
            </div>
          </div>
        </Container>
      </section>

      <section
        aria-label="О Доме журналистики и наших проектах"
        className={styles.storySection}
      >
        <Container>
          <ScrollReveal className={styles.storyGrid} dataTextFlow>
            <div className={styles.column}>
              <article
                className={styles.storyBlock}
                aria-labelledby="what-is-heading"
              >
                <Typography
                  as="h2"
                  variant="section-title"
                  id="what-is-heading"
                  className={styles.storyHeading}
                >
                  Что такое «Дом журналистики»?
                </Typography>
                <div className={styles.rule} aria-hidden="true" />
                <Typography variant="body" className={styles.storyText}>
                  Это точка притяжения медиа сообщества Краснодарского края. По
                  крайней мере мы к этому стремимся. Мы стремимся сделать
                  медиацентр тем самым «третьим местом», которое играет важную
                  роль в жизни медийщиков. Знаете, как бывает: первое — это дом,
                  второе — работа, а третье — такое уютное профессиональное
                  пространство, куда хочется приходить. Чтобы получить важную
                  информацию, поучаствовать в важном значимом событии и проекте,
                  найти единомышленников, пообщаться, подумать, поспорить и
                  вдохновиться.
                </Typography>
              </article>
              <figure className={styles.imageCard}>
                <SiteImage
                  src="/images/directory/photo-6.png"
                  alt="Участники медиацентра на профессиональном мероприятии"
                  textLinkLabel="Фотография: участники медиацентра на профессиональном мероприятии"
                  fill
                  sizes="(min-width: 1150px) 28vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </figure>
              {/* <Typography variant="body" className={styles.storyText}>
                В нашем пространстве проходят пресс-конференции, круглые столы на самые важные и интересные темы, деловые форумы и события.
              </Typography> */}
            </div>

            <div className={`${styles.column} ${styles.middleColumn}`}>
              <figure className={styles.imageCard}>
                <SiteImage
                  src="/images/directory/photo-4.png"
                  alt="Журналисты и гости Дома журналистики на встрече"
                  textLinkLabel="Фотография: журналисты и гости Дома журналистики на встрече"
                  fill
                  sizes="(min-width: 1150px) 30vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </figure>
              <article
                className={styles.storyBlock}
                aria-labelledby="projects-heading"
              >
                <Typography
                  as="h2"
                  variant="section-title"
                  id="projects-heading"
                  className={styles.storyHeading}
                >
                  О проектах
                </Typography>
                <div className={styles.rule} aria-hidden="true" />
                <Typography variant="body" className={styles.storyText}>
                  Отдельное место занимают просветительские проекты, где
                  эксперты делятся с участниками технологиями, которые реально
                  работают. В нашем календаре событий есть проекты, которые уже
                  широко известны на территории края. Это «Сорока» — первая
                  региональная премия в области коммуникаций, дающая признание
                  пиарщикам, журналистам и медиаменеджерам.
                </Typography>
                <Typography variant="body" className={styles.storyText}>
                  Пожалуй, первым касанием региональных органов власти
                  сообщества авторов новых медиа в наставническом формате в
                  регионе стал проект «Сельский блогер». Благодаря пулу
                  авторитетных спикеров мы помогаем новым авторам раскрыться и
                  настроиться на важные смыслы и ценности.
                </Typography>
              </article>
            </div>

            <div className={styles.column}>
              <div className={styles.storyBlock}>
                <Typography variant="body" className={styles.storyText}>
                  Мы ведем проект, направленный на развитие школьных
                  медиацентров «Медиаконцепт». Весь 2026 год медиацентр
                  реализует просветительский цикл событий «Соседи. Культура и
                  традиции народов Кубани».
                </Typography>
                <Typography variant="body" className={styles.storyText}>
                  И это далеко не всё. Мы одержимы пользой для нашей отрасли,
                  поэтому каждый год появляется что-то новое. Все идеи рождаются
                  в нашем пространстве благодаря сильной команде медиацентра,
                  мощной поддержке нашего учредителя в лице департамента
                  информационной политики Краснодарского края и при поддержке
                  нашего медиа сообщества.
                </Typography>
              </div>
              <Link href="/projects" className={styles.eventsLink}>
                <span>Наши проекты</span>
                <span aria-hidden="true" className={styles.linkArrow}>
                  ↗
                </span>
              </Link>
              <figure className={styles.imageCard}>
                <SiteImage
                  src="/images/gallery/neighbors-event.png"
                  alt="Событие проекта о культуре и традициях народов Кубани"
                  textLinkLabel="Фотография: событие проекта «Соседи»"
                  fill
                  sizes="(min-width: 1150px) 30vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </figure>
            </div>
          </ScrollReveal>
          <ScrollReveal className={styles.quote}>
            <blockquote className={styles.quoteText}>
              Домжур — это дверь в большую медиаиндустрию Кубани. Это
              пространство обновления и точка сборки смыслов.
            </blockquote>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
