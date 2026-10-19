import { HomeBanner } from "@/modules/home/home-banner";
import { HomeEvents } from "@/modules/home/home-events";
import { HomeNews } from "@/modules/home/home-news";
import { HomeProjects } from "@/modules/home/home-projects";
import { HomeGallery } from "@/modules/home/home-gallery";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import type { ContentEvent, ContentNews, ContentMedia, ContentProject } from "@/shared/types/model/content.type";

type HomePageProps = {
  events: ContentEvent[];
  news: ContentNews[];
  albums: ContentMedia[];
  projects: ContentProject[];
  eventsError: boolean;
  newsError: boolean;
  albumsError: boolean;
  projectsError: boolean;
};

export function HomePage({ events, news, albums, projects, eventsError, newsError, albumsError, projectsError }: HomePageProps) {
  return (
    <>
      <HomeBanner />
      <ScrollReveal><HomeEvents events={events} error={eventsError} /></ScrollReveal>
      <ScrollReveal><HomeProjects projects={projects} error={projectsError} /></ScrollReveal>
      <ScrollReveal><HomeNews news={news} error={newsError} /></ScrollReveal>
      <ScrollReveal><HomeGallery albums={albums} error={albumsError} /></ScrollReveal>
    </>
  );
}
