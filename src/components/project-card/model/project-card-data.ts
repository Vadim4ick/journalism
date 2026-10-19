import { contentImageUrl } from "@/shared/lib/content-image-url";
import type { ContentProject } from "@/shared/types/model/content.type";
import type { ProjectCardData } from "../ui/project-card";

export const NEIGHBORS_API_SLUG = "proekt-sosedi-kultura-i-traditsii-narodov-kubani";

export function projectCardData(project: ContentProject): ProjectCardData {
  return {
    id: project.slug === NEIGHBORS_API_SLUG ? "neighbors" : String(project.id),
    slug: project.slug,
    title: project.title,
    description: project.description,
    image: contentImageUrl(project.image) ?? "",
    imageAlt: `Изображение проекта «${project.title}»`,
    detailAvailable: project.slug === NEIGHBORS_API_SLUG,
  };
}
