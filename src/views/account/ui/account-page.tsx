"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { Nominees } from "@/shared/icons/lk/nominees";
import { Voted } from "@/shared/icons/lk/voted";
import { LeftVoted } from "@/shared/icons/lk/left-voted";
import { LeftDay } from "@/shared/icons/lk/left-day";
import styles from "./account-page.module.css";

const statistics = [
  { label: "Всего номинантов", value: 67, icon: Nominees },
  { label: "Вы проголосовали", value: 1, icon: Voted },
  { label: "Осталось проголосовать", value: 66, icon: LeftVoted },
  { label: "Осталось дней", value: 10, icon: LeftDay },
];

type AccountTab = "overview" | "voting";

export function AccountPage() {
  const [activeTab, setActiveTab] = useState<AccountTab>("overview");

  return (
    <Container className={styles.container}>
      <nav className={styles.tabs} aria-label="Разделы личного кабинета">
        <button
          id="account-overview-tab"
          type="button"
          aria-pressed={activeTab === "overview"}
          aria-controls="account-overview-panel"
          className={styles.tab}
          onClick={() => setActiveTab("overview")}
        >
          Личный кабинет
        </button>
        <button
          id="account-voting-tab"
          type="button"
          aria-pressed={activeTab === "voting"}
          aria-controls="account-voting-panel"
          className={styles.tab}
          onClick={() => setActiveTab("voting")}
        >
          Голосование (66)
        </button>
      </nav>

      <section
        id="account-overview-panel"
        aria-labelledby="account-overview-tab"
        hidden={activeTab !== "overview"}
        className={styles.panel}
      >
        <header className={styles.intro}>
          <Typography as="h1" variant="heading-medium" className={styles.heading}>
            Анна, добро пожаловать!
          </Typography>
          <Typography as="p" variant="body" className={styles.subtitle}>
            Голосование членов жюри конкурса коммуникационных проектов «Сорока»
          </Typography>
        </header>

        <dl className={styles.statistics}>
          {statistics.map(({ label, value, icon: Icon }) => (
            <div className={styles.statistic} key={label}>
              <span className={styles.statisticIcon} aria-hidden="true">
                <Icon />
              </span>
              <dt className={styles.statisticLabel}>{label}</dt>
              <dd className={styles.statisticValue}>{value}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          className={styles.votingButton}
          onClick={() => setActiveTab("voting")}
        >
          Перейти к голосованию
          <span className={styles.buttonArrow} aria-hidden="true">
            <ArrowRight size={19} />
          </span>
        </button>

        <section className={styles.rules} aria-labelledby="voting-rules-title">
          <Typography as="h2" variant="heading-medium" id="voting-rules-title" className={styles.rulesHeading}>
            Правила голосования
          </Typography>

          <ol className={styles.rulesList}>
            <li>
              <h3>Общие положения</h3>
              <p>
                Голосование членов Жюри конкурса журналистики и медиакоммуникаций «Сорока» проходит
                с 13 января по 24 января 2025 года до 23:59 по московскому времени. К участию в оценке
                допускаются все члены экспертного совета, получившие доступ в личный кабинет.
              </p>
            </li>
            <li>
              <h3>Порядок голосования</h3>
              <ul>
                <li>Каждый член Жюри имеет право проголосовать за одного или нескольких номинантов в каждой номинации.</li>
                <li>Оценка работ осуществляется по 10-балльной шкале, где 1 — минимальная оценка, 10 — максимальная.</li>
                <li>Вы можете изменить свой выбор в любой момент до завершения голосования.</li>
                <li>После нажатия кнопки «Завершить голосование» изменения становятся невозможны.</li>
              </ul>
            </li>
            <li>
              <h3>Критерии оценки</h3>
              <ul>
                <li>Актуальность — соответствие темы современной повестке и интересам аудитории.</li>
                <li>Оригинальность — уникальность подачи материала и креативность подхода.</li>
                <li>Профессионализм — качество текста, монтажа, визуального оформления.</li>
                <li>Влияние — общественный резонанс и вовлеченность аудитории.</li>
                <li>Достоверность — проверенность фактов и соблюдение журналистской этики.</li>
              </ul>
            </li>
            <li>
              <h3>Номинации конкурса</h3>
              <ul>
                <li>Лучший репортаж.</li>
                <li>Лучшее интервью.</li>
                <li>Лучший аналитический материал.</li>
                <li>Лучший мультимедийный проект.</li>
                <li>Лучший социальный проект в медиа.</li>
              </ul>
            </li>
            <li>
              <h3>Завершение голосования и подведение итогов</h3>
              <p>
                После 24 января 2025 года 23:59 (МСК) голосование автоматически закрывается.
                Организационный комитет конкурса «Сорока» подсчитывает результаты, формирует итоговый
                рейтинг и публикует список победителей на официальном сайте. Решение Жюри является
                окончательным и не подлежит пересмотру.
              </p>
            </li>
            <li>
              <h3>Технические вопросы</h3>
              <p>
                В случае возникновения технических проблем при голосовании (ошибки при отправке оценки,
                недоступность личного кабинета) необходимо незамедлительно связаться с организаторами
                по адресу <a href="mailto:info@soroka-award.ru">info@soroka-award.ru</a>.
              </p>
            </li>
          </ol>
        </section>
      </section>

      <section
        id="account-voting-panel"
        aria-labelledby="account-voting-tab"
        hidden={activeTab !== "voting"}
        className={`${styles.panel} ${styles.votingPanel}`}
      >
        <Typography as="h1" variant="heading-medium" className={styles.heading}>
          Голосование
        </Typography>
        <p className={styles.unavailable}>
          Список номинантов и отправка оценок пока недоступны. Данные голосования не подключены.
        </p>
      </section>
    </Container>
  );
}
