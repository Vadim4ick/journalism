import { Typography } from "@/shared/ui/typography";
import { ArrowUpRight } from "@/shared/icons/arrow-up-right";
import { NewsCard, newsCardData } from "@/components/news-card";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import type { ContentNews } from "@/shared/types/model/content.type";
import Link from "next/link";

export function HomeNews({ news, error }: { news: ContentNews[]; error: boolean }) {
  const cards = news.slice(0, 3).map(newsCardData);

  return (
    <section id="home-news" aria-labelledby="home-news-heading" className="pt-16 pb-0 mobile:pt-20 desktop:pt-[120px]">
      <Container>
        <div className="mb-7 flex flex-wrap items-center justify-between gap-5 mobile:mb-[50px]">
          <Typography as="h2" variant="section-title" id="home-news-heading">
            Новости
          </Typography>
          <Button
            variant="pill"
            nativeButton={false}
            render={<Link href="/news" />}
            addonRight={
              <span data-text-decorative className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground mobile:size-11 desktop1250:size-[50px]">
                <ArrowUpRight aria-hidden="true" className="size-[22px]" />
              </span>
            }
          >
            Все новости
          </Button>
        </div>
        {error ? <p role="alert">Не удалось загрузить новости. Попробуйте обновить страницу.</p> : cards.length === 0 ? <p>Новостей пока нет.</p> : (
          <div data-a11y-content-grid className="grid grid-cols-1 gap-x-5 gap-y-10 mobile:grid-cols-2 mobile:gap-y-16 desktop:grid-cols-3" data-text-flow>
            {cards.map((item) => <NewsCard key={item.id} news={item} />)}
          </div>
        )}
      </Container>
    </section>
  );
}
