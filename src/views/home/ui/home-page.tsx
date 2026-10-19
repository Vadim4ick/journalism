import { HomeBanner } from "@/modules/home/home-banner";
import { HomeEvents } from "@/modules/home/home-events";
import { HomeNews } from "@/modules/home/home-news";
import { HomeProjects } from "@/modules/home/home-projects";
import { HomeGallery } from "@/modules/home/home-gallery";
import { GALLERY_ALBUMS } from "@/views/gallery";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import type { ContentEvent, ContentNews } from "@/shared/types/model/content.type";

type HomePageProps = {
  events: ContentEvent[];
  news: ContentNews[];
  eventsError: boolean;
  newsError: boolean;
};

export function HomePage({ events, news, eventsError, newsError }: HomePageProps) {
  return (
    <>
      <HomeBanner />
      <ScrollReveal><HomeEvents events={events} error={eventsError} /></ScrollReveal>
      <ScrollReveal><HomeProjects /></ScrollReveal>
      <ScrollReveal><HomeNews news={news} error={newsError} /></ScrollReveal>
      <ScrollReveal><HomeGallery albums={GALLERY_ALBUMS} /></ScrollReveal>
    </>
  );
}
