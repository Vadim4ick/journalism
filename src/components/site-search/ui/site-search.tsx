"use client";

import { Typography, typographyVariants } from "@/shared/ui/typography";
import { useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { motion } from "motion/react";
import { SiteImage as Image } from "@/components/site-image";
import { Search, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { searchItems, searchSections } from "../model/search-data";
import {
  useAccessibilityStore,
  useEffectiveReducedMotion,
} from "@/state/accessibility";
import { cn } from "@/shared/lib/utils";

const placeholder = "Поиск мероприятий, афиши, события";

function SiteSearch({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [section, setSection] =
    useState<(typeof searchSections)[number]>("Все");
  const inputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useEffectiveReducedMotion();
  const enabled = useAccessibilityStore((state) => state.enabled);
  const textMode = useAccessibilityStore((state) => state.textMode);
  const normalizedQuery = query.trim().toLocaleLowerCase("ru");
  const results = searchItems.filter(
    (item) =>
      (section === "Все" || item.section === section) &&
      `${item.title} ${item.description} ${item.section}`
        .toLocaleLowerCase("ru")
        .includes(normalizedQuery),
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
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
            Введите запрос или выберите раздел. Пока представлены
            демонстрационные материалы.
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
                onChange={(event) => setQuery(event.target.value)}
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
              <div className="flex flex-wrap gap-2" aria-label="Фильтр по разделам">
                {searchSections.map((item) => (
                  <Button
                    key={item}
                    variant={section === item ? "default" : "secondary"}
                    onClick={() => setSection(item)}
                    aria-pressed={section === item}
                    className="min-h-11 rounded-full px-5"
                  >
                    {item}
                  </Button>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap items-baseline justify-between gap-2">
                <Typography as="h2" variant="heading-medium">
                  {normalizedQuery
                    ? "Результаты поиска"
                    : "Вам может быть интересно"}
                </Typography>
                <Typography
                  as="p"
                  variant="small"
                  role="status"
                  className="text-muted-foreground"
                >
                  Найдено: {results.length}
                </Typography>
              </div>
              <Typography
                as="p"
                variant="caption"
                className="mt-2 text-muted-foreground"
              >
                Демонстрационные материалы
              </Typography>
              {results.length ? (
                <ul
                  className={cn(
                    "mt-4 grid gap-3",
                    enabled || textMode
                      ? "grid-cols-1"
                      : "mobile:grid-cols-2 desktop1250:grid-cols-3",
                  )}
                >
                  {results.map((item) => (
                    <li key={item.title} className="rounded-2xl bg-muted p-5">
                      <Typography
                        as="p"
                        variant="caption"
                        className="text-muted-foreground"
                      >
                        {item.section}
                      </Typography>
                      <Typography as="h3" variant="heading-small" className="mt-2">
                        {item.title}
                      </Typography>
                      <Typography
                        as="p"
                        variant="small"
                        className="mt-2 text-muted-foreground"
                      >
                        {item.description}
                      </Typography>
                    </li>
                  ))}
                </ul>
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
                      setSection("Все");
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
