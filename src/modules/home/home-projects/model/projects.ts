import type { ProjectCardData } from "@/components/project-card";

export const HOME_PROJECTS = [
  {
    id: "neighbors",
    slug: "sosedi",
    title: "«Соседи»",
    description:
      "Культурно-просветительский проект, знакомящий жителей и гостей Кубани с традициями, кухней, костюмами и обычаями народов Краснодарского края. Каждое событие превращает площадку в «дом» одной из национальностей",
    image: "/images/projects/sosedi.png",
    imageAlt: "Проект «Соседи»",
  },
  {
    id: "rural-blogger",
    slug: "rural-blogger",
    title: "«Сельский блогер»",
    description:
      "Первый региональный образовательный проект для жителей сёл, станиц и хуторов. Учит создавать вертикальные видео, работать с текстами и инструментами ИИ для продвижения своих территорий в социальных сетях",
    image: "/images/projects/bloger.png",
    imageAlt: "Проект «Сельский блогер»",
  },
  {
    id: "media-concept",
    slug: "media-concept",
    title: "«МедиаКонцепт»",
    description:
      "Обучающая программа для учителей, которые хотят основать школьные медиацентры. Формирует единый подход к медиаграмотности в школах Кубани, помогает педагогам развивать у учеников навыки работы с информацией и контентом",
    image: "/images/projects/media-concept.png",
    imageAlt: "Проект «МедиаКонцепт»",
  },
] satisfies ProjectCardData[];
