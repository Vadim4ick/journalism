import { ProjectCard } from "@/components/project-card";
import Link from "next/link";
import { ArrowUpRight } from "@/shared/icons/arrow-up-right";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { Typography } from "@/shared/ui/typography";
import { HOME_PROJECTS } from "../model/projects";

export function HomeProjects() {
  return (
    <section id="home-projects" aria-labelledby="home-projects-heading" className="pt-16 pb-0 mobile:pt-20 desktop:pt-[120px]">
      <Container>
        <div className="mb-7 flex flex-wrap items-center justify-between gap-5 mobile:mb-[50px]">
          <Typography as="h2" variant="section-title" id="home-projects-heading">
            Наши проекты
          </Typography>
          <Button
            variant="pill"
            nativeButton={false}
            render={<Link href="/projects" />}
            addonRight={
              <span data-text-decorative className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground mobile:size-11 desktop1250:size-[50px]">
                <ArrowUpRight aria-hidden="true" className="size-[22px]" />
              </span>
            }
          >
            Все проекты
          </Button>
        </div>
        <div data-a11y-content-grid className="grid grid-cols-1 gap-5 mobile:grid-cols-2 desktop:grid-cols-3 desktop:gap-[30px]" data-text-flow>
          {HOME_PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
