export type NewsArticle = {
  title: string;
  publishedAt: string;
  dateLabel: string;
  timeLabel: string;
  lead: string;
  paragraphs: readonly string[];
  gallery: readonly { src: string; alt: string }[];
  tags: readonly { label: string; tone: "green" | "violet" | "blue" | "orange" | "pink" }[];
};

export const RURAL_BLOGGER_ARTICLE: NewsArticle = {
  title: "На Кубани стартует школа «Сельский блогер»",
  publishedAt: "2026-09-09T10:00",
  dateLabel: "09.09.2026",
  timeLabel: "10:00",
  lead: "Обучение будет проходить в Медиацентре «Дом журналистики». Кто сможет там поучиться, как будет проходить конкурсный отбор, есть ли возрастные ограничения и как родилась идея создания проекта?",
  paragraphs: [
    "Есть один миф, в который до сих пор верят люди. Звучит он так: всё интересное происходит где-то там — в больших городах, в ярких студиях, среди людей, у которых «связи» и «возможности». А если ты живёшь в станице, хуторе или небольшом селе, то остаётся только смотреть на чужую жизнь через экран телефона.",
    "Команда медиацентра «Дом журналистики» уверена: ЭТО НЕПРАВДА. И в 2026 году собирается вам это доказать. Мы запускаем проект «Сельский блогер» — практическую школу для тех, кто живёт на селе и хочет рассказывать о своей жизни так, чтобы это слушали, смотрели и любили.",
  ],
  gallery: [
    {
      src: "/images/news/rural-blogger-workshop.png",
      alt: "Участники школы «Сельский блогер» за столами в Медиацентре",
    },
    {
      src: "/images/news/rural-blogger-speaker.png",
      alt: "Выступление участницы с микрофоном в Медиацентре",
    },
    {
      src: "/images/news/rural-blogger-studio.png",
      alt: "Практическая съёмка в студии школы «Сельский блогер»",
    },
  ],
  tags: [
    { label: "#Сельский блогер", tone: "green" },
    { label: "#Блогинг", tone: "violet" },
    { label: "#Школа", tone: "blue" },
    { label: "#Блогеры", tone: "orange" },
    { label: "#Краснодарский край", tone: "pink" },
  ],
};
