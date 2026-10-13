import { HomeBanner } from "@/modules/home/home-banner";
import { HomeEvents } from "@/modules/home/home-events";
import { HomeNews } from "@/modules/home/home-news";
import { HomeProjects } from "@/modules/home/home-projects";
import { HomeGallery } from "@/modules/home/home-gallery";
import { GALLERY_ALBUMS } from "@/views/gallery";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";

export function HomePage() {
  return (
    <>
      <HomeBanner />
      <ScrollReveal><HomeEvents /></ScrollReveal>
      <ScrollReveal><HomeProjects /></ScrollReveal>
      <ScrollReveal><HomeNews /></ScrollReveal>
      <ScrollReveal><HomeGallery albums={GALLERY_ALBUMS} /></ScrollReveal>
    </>
  );
}
