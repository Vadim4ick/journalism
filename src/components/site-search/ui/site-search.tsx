"use client";

import { Typography, typographyVariants } from "@/shared/ui/typography";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { SiteImage as Image } from "@/components/site-image";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { searchSections } from "../model/search-sections";
import type { SearchResponse, SearchResult, SearchSection } from "@/shared/types/model/search.type";
import {
  useAccessibilityStore,
  useEffectiveReducedMotion,
} from "@/state/accessibility";
import { cn } from "@/shared/lib/utils";

const placeholder = "Поиск по сайту";

function searchResultHref(item: SearchResult): string | null {
  if (!item.url.startsWith("/") || item.url.startsWith("//")) return null;

  const slug = item.slug?.trim();
  return slug
    ? `${item.url.replace(/\/+$/, "")}/${encodeURIComponent(slug)}`
    : item.url;
}

function SiteSearch({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [section, setSection] = useState<SearchSection>("all");
  const [page, setPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const focusResultsAfterPage = useRef(false);
  const reducedMotion = useEffectiveReducedMotion();
  const enabled = useAccessibilityStore((state) => state.enabled);
  const textMode = useAccessibilityStore((state) => state.textMode);
  const normalizedQuery = query.trim();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setQuery("");
      setDebouncedQuery("");
      setSection("all");
      setPage(1);
      focusResultsAfterPage.current = false;
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(normalizedQuery), 300);
    return () => clearTimeout(timeout);
  }, [normalizedQuery]);

  const resultsQuery = useQuery({
    queryKey: ["site-search", debouncedQuery, section, page],
    enabled: open && debouncedQuery.length > 0,
    retry: false,
    queryFn: async ({ signal }): Promise<SearchResponse> => {
      const params = new URLSearchParams({ q: debouncedQuery, section, page: String(page) });
      const response = await fetch(`/api/search?${params}`, { signal });
      if (!response.ok) throw new Error("Не удалось выполнить поиск");
      return response.json() as Promise<SearchResponse>;
    },
  });
  const settled = normalizedQuery.length > 0 && normalizedQuery === debouncedQuery;
  const searchData = settled && resultsQuery.isSuccess ? resultsQuery.data.data : undefined;

  useEffect(() => {
    if (focusResultsAfterPage.current && searchData) {
      resultsHeadingRef.current?.focus();
      focusResultsAfterPage.current = false;
    }
  }, [searchData]);

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <span data-text-search className={compact && !textMode ? "relative block size-11 shrink-0" : "relative block min-h-13 w-full max-w-[25rem]"}>
        {!compact && !enabled && !textMode && (
          <Image
            src="/images/header/search.svg"
            alt=""
            width={20}
            height={20}
            className="pointer-events-none absolute top-4 left-4 z-10 size-5"
          />
        )}
        {compact && !textMode ? (
          <Dialog.Trigger
            render={<Button variant="secondary" size="icon" />}
            aria-label="Поиск по сайту"
            className="size-11 rounded-full"
          >
            <Search aria-hidden="true" className="size-5" />
          </Dialog.Trigger>
        ) : textMode || enabled ? (
          <Dialog.Trigger
            render={
              <Button
                variant="outline"
                className="w-full justify-start rounded-full px-4"
              />
            }
            aria-label="Поиск по сайту"
          >
            Поиск по сайту
          </Dialog.Trigger>
        ) : (
          <Dialog.Trigger
            nativeButton={false}
            render={<Input readOnly placeholder={placeholder} />}
            aria-label={placeholder}
            className={`${typographyVariants["search-trigger"]} min-h-13 cursor-pointer rounded-full border-0 bg-secondary py-3 pr-4 pl-13 text-primary placeholder:text-search-placeholder focus-visible:ring-2 focus-visible:ring-ring desktop1250:pl-17`}
          />
        )}
      </span>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-lg transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup
          initialFocus={inputRef}
          className="fixed inset-x-4 top-5 z-[61] mx-auto max-w-[1760px] outline-none transition-opacity duration-150 data-[ending-style]:opacity-0 motion-reduce:transition-none"
        >
          <Dialog.Title className="sr-only">Поиск по сайту</Dialog.Title>
          <Dialog.Description className="sr-only">
            Введите запрос и при необходимости выберите раздел для поиска по материалам сайта.
          </Dialog.Description>
          <motion.div
            initial={{
              maxWidth: reducedMotion ? 1760 : 400,
              opacity: reducedMotion ? 1 : 0,
            }}
            animate={{ maxWidth: 1760, opacity: 1 }}
            transition={{
              duration: reducedMotion ? 0 : 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto w-full"
          >
            <div
              role="search"
              className="flex min-h-13 items-center gap-3 rounded-full bg-secondary px-4 py-2 shadow-lg focus-within:ring-2 focus-within:ring-ring mobile:gap-8"
            >
              <Image
                src="/images/header/search.svg"
                alt=""
                width={20}
                height={20}
                className="size-5 shrink-0"
              />
              <Input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                aria-label={placeholder}
                placeholder={placeholder}
                className={`${typographyVariants.medium} min-h-11 flex-1 border-0 px-0 text-primary placeholder:text-search-placeholder`}
              />
              <Dialog.Close
                render={<Button variant="ghost" size="icon" />}
                aria-label="Закрыть поиск"
                className="size-11 rounded-full text-primary"
              >
                <X aria-hidden="true" />
              </Dialog.Close>
            </div>
            <div className="mt-4 max-h-[calc(100dvh-9rem)] overflow-y-auto rounded-3xl bg-background p-5 text-foreground shadow-xl mobile:p-8">
              <Typography
                as="p"
                variant="small"
                className="mb-4 text-muted-foreground"
              >
                Разделы сайта
              </Typography>
              <div role="group" className="flex flex-wrap gap-2" aria-label="Фильтр по разделам">
                {searchSections.map((item) => (
                  <Button
                    key={item.value}
                    variant={section === item.value ? "default" : "secondary"}
                    onClick={() => {
                      setSection(item.value);
                      setPage(1);
                    }}
                    aria-pressed={section === item.value}
                    className="min-h-11 rounded-full px-5"
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap items-baseline justify-between gap-2">
                <Typography as="h2" variant="heading-medium" ref={resultsHeadingRef} tabIndex={-1}>
                  Результаты поиска
                </Typography>
                <Typography
                  as="p"
                  variant="small"
                  role="status"
                  className="text-muted-foreground"
                >
                  {searchData ? `Найдено: ${searchData.pagination.total}` : normalizedQuery ? "" : "Введите запрос"}
                </Typography>
              </div>
              {!normalizedQuery ? (
                <Typography as="p" variant="small" className="mt-4 text-muted-foreground">
                  Начните вводить запрос, чтобы найти материалы сайта.
                </Typography>
              ) : !settled || resultsQuery.isPending ? (
                <>
                  <span role="status" className="sr-only">Ищем материалы…</span>
                  <Typography as="p" variant="small" aria-hidden="true" className="text-mode-only mt-4">
                    Ищем материалы…
                  </Typography>
                  <ul
                    aria-hidden="true"
                    className={cn(
                      "text-mode-hidden mt-4 grid gap-3",
                      enabled || textMode
                        ? "grid-cols-1"
                        : "mobile:grid-cols-2 desktop1250:grid-cols-3",
                    )}
                  >
                    {Array.from({ length: 6 }, (_, index) => (
                      <li key={index} className="min-h-36 rounded-2xl bg-muted p-5">
                        <div className="h-3 w-24 animate-pulse rounded-full bg-border motion-reduce:animate-none" />
                        <div className="mt-5 h-5 w-4/5 animate-pulse rounded-full bg-border motion-reduce:animate-none" />
                        <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-border motion-reduce:animate-none" />
                        <div className="mt-2 h-4 w-2/3 animate-pulse rounded-full bg-border motion-reduce:animate-none" />
                      </li>
                    ))}
                  </ul>
                </>
              ) : resultsQuery.isError ? (
                <div role="alert" className="mt-4">
                  <Typography as="p" variant="small">Не удалось загрузить результаты поиска.</Typography>
                  <Button variant="secondary" className="mt-3 min-h-11 rounded-full" onClick={() => resultsQuery.refetch()}>
                    Повторить
                  </Button>
                </div>
              ) : searchData && searchData.items.length > 0 ? (
                <>
                  <ul
                    className={cn(
                      "mt-4 grid gap-3",
                      enabled || textMode
                        ? "grid-cols-1"
                        : "mobile:grid-cols-2 desktop1250:grid-cols-3",
                    )}
                  >
                    {searchData.items.map((item) => {
                      const href = searchResultHref(item);

                      return (
                        <li key={`${item.section}-${item.id}`} className="rounded-2xl bg-muted p-5">
                          <Typography as="p" variant="caption" className="text-muted-foreground">
                            {item.section === "events" ? "Предстоящие события" : item.section_title}
                          </Typography>
                          <Typography as="h3" variant="heading-small" className="mt-2">
                            {href ? (
                              <Link href={href} onClick={() => handleOpenChange(false)} className="rounded-sm underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-ring">
                                {item.title}
                              </Link>
                            ) : item.title}
                          </Typography>
                          {item.description && <Typography as="p" variant="small" className="mt-2 text-muted-foreground">
                            {item.description}
                          </Typography>}
                          {item.published_at && <Typography as="p" variant="caption" className="mt-3 text-muted-foreground">
                            {item.published_at}
                          </Typography>}
                        </li>
                      );
                    })}
                  </ul>
                  {searchData.pagination.last_page > 1 && <nav aria-label="Страницы результатов поиска" className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    {page > 1 && <button type="button" aria-label="Предыдущая страница" className="inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring" onClick={() => { focusResultsAfterPage.current = true; setPage(page - 1); }}>
                      <ChevronLeft aria-hidden="true" size={18} />
                    </button>}
                    {Array.from({ length: searchData.pagination.last_page }, (_, index) => index + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        aria-label={`Страница ${pageNumber}`}
                        aria-current={pageNumber === page ? "page" : undefined}
                        className={cn(
                          "inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring",
                          pageNumber === page && "border-primary bg-primary text-primary-foreground",
                        )}
                        onClick={() => {
                          if (pageNumber === page) return;
                          focusResultsAfterPage.current = true;
                          setPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    {page < searchData.pagination.last_page && <button type="button" aria-label="Следующая страница" className="inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring" onClick={() => { focusResultsAfterPage.current = true; setPage(page + 1); }}>
                      <ChevronRight aria-hidden="true" size={18} />
                    </button>}
                  </nav>}
                </>
              ) : (
                <div className="py-10 text-center">
                  <Typography as="p" variant="medium">
                    Ничего не найдено
                  </Typography>
                  <Typography
                    as="p"
                    variant="small"
                    className="mt-2 text-muted-foreground"
                  >
                    Попробуйте другой запрос или выберите другой раздел.
                  </Typography>
                  <Button
                    variant="secondary"
                    className="mt-4 min-h-11 rounded-full"
                    onClick={() => {
                      setQuery("");
                      setSection("all");
                      setPage(1);
                      inputRef.current?.focus();
                    }}
                  >
                    Сбросить поиск
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { SiteSearch };
