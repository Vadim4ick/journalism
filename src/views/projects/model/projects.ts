import type { ProjectCardData } from "@/components/project-card";
import { HOME_PROJECTS } from "@/modules/home/home-projects/model/projects";

export const CURRENT_PROJECTS = [
  HOME_PROJECTS[0],
  HOME_PROJECTS[1],
  {
    id: "laboratory",
    slug: "laboratory",
    title: "«Лаборатория PROМедиа»",
    description:
      "Практико-ориентированная медиашкола для студентов социально-экономических направлений. Учит деловой журналистике через лекции, мастер-классы и стажировки в ведущих редакциях региона",
    image: "/images/projects/laboratory.png",
    imageAlt: "Участники проекта «Лаборатория PROМедиа»",
  },
  {
    id: "jurtur",
    slug: "jurtur",
    title: "«ЖУРТУР»",
    description:
      "Уникальный экскурсионный маршрут по медиаиндустрии Кубани. Знакомит с историей и современной работой редакций, радиостанций и телеканалов Краснодара",
    image: "/images/projects/jurtur.png",
    imageAlt: "Экскурсия проекта «ЖУРТУР»",
  },
  HOME_PROJECTS[2],
] satisfies ProjectCardData[];

export const COMPLETED_PROJECTS: ProjectCardData[] = [];
