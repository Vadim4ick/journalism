import { SiteImage as Image } from "@/components/site-image";
import Link from "next/link";
import { ArrowUpRight } from "@/shared/icons/arrow-up-right";
import { Typography } from "@/shared/ui/typography";

export type ProjectCardData = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const titleId = `project-${project.id}-title`;
  const descriptionId = `project-${project.id}-description`;
  const logoProject = project.id === "neighbors" || project.id === "rural-blogger";

  return (
    <article
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="group relative flex h-full min-w-0 flex-col gap-8 rounded-3xl bg-card p-3 pb-6 mobile:p-4"
    >
      <div className="relative block aspect-[535/400] w-full shrink-0 overflow-hidden rounded-[20px] bg-background">
        <Image
          src={project.image}
          alt={project.imageAlt}
          textLinkLabel={`Изображение проекта: ${project.imageAlt || project.title}`}
          textModeLink={false}
          fill
          sizes="(min-width: 1150px) calc((100vw - 100px) / 3), (min-width: 768px) calc((100vw - 72px) / 2), calc(100vw - 56px)"
          className={logoProject ? "object-contain" : "object-cover"}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-8 p-2">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <Typography as="h3" variant="heading-medium" id={titleId} className="min-w-0 text-xl leading-tight font-semibold break-words mobile:text-2xl">
            <span className="rounded-sm group-hover:underline group-focus-within:underline">{project.title}</span>
          </Typography>
          <span aria-hidden="true" data-text-decorative className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground mobile:size-11 desktop1250:size-[50px]">
            <ArrowUpRight className="size-5" />
          </span>
        </div>
        <Typography
          as="p"
          variant="body"
          id={descriptionId}
          className="text-base leading-[1.2] font-normal break-words mobile:text-xl"
        >
          {project.description}
        </Typography>
      </div>
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`О проекте ${project.title}`}
        className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring"
      />
    </article>
  );
}
