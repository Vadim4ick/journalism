import type { ProjectCardData } from "@/components/project-card";

// The detailed project content remains local until the project detail API is connected.
export const NEIGHBORS_PROJECT: ProjectCardData = {
  id: "neighbors",
  slug: "sosedi",
  title: "«Соседи»",
  description: "Культурно-просветительский проект, знакомящий жителей и гостей Кубани с традициями, кухней, костюмами и обычаями народов Краснодарского края. Каждое событие превращает площадку в «дом» одной из национальностей",
  image: "/images/projects/sosedi.png",
  imageAlt: "Проект «Соседи»",
  detailAvailable: true,
};

export const CURRENT_PROJECTS = [NEIGHBORS_PROJECT];
