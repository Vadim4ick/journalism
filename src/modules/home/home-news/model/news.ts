import type { NewsCardData } from "@/components/news-card";

// Placeholder content from Figma; the three photos lead to the same available article.
const content = {
  title: "На Кубани стартует школа «Сельский блогер»",
  description: "Обучение будет проходить в Медиацентре «Дом журналистики». Кто сможет там поучиться, как будет проходить конкурсный отбор, есть ли возрастные ограничения и как родилась идея создания проекта?",
  date: "2026-09-09",
  dateLabel: "09 сентября 2026",
  href: "/news/rural-blogger",
};

export const HOME_NEWS: readonly NewsCardData[] = [
  {
    ...content,
    id: "rural-blogger-workshop",
    image: "/images/news/rural-blogger-workshop.png",
    imageAlt: "Участники школы «Сельский блогер» за столами в Медиацентре",
  },
  {
    ...content,
    id: "rural-blogger-speaker",
    image: "/images/news/rural-blogger-speaker.png",
    imageAlt: "Выступление участницы с микрофоном в Медиацентре",
  },
  {
    ...content,
    id: "rural-blogger-studio",
    image: "/images/news/rural-blogger-studio.png",
    imageAlt: "Практическая съёмка в студии школы «Сельский блогер»",
  },
];
