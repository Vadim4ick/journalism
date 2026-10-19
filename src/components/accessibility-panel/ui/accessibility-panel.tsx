"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { cn } from "@/shared/lib/utils";
import {
  ACCESSIBILITY_COLOR_SCHEMES,
  ACCESSIBILITY_FONT_SCALES,
  useAccessibilityStore,
} from "@/state/accessibility";
import type { AccessibilityFontScale } from "@/state/accessibility";

const FONT_SCALE_LABELS: Record<AccessibilityFontScale, string> = {
  1: "×1",
  1.25: "×2",
  1.5: "×2.5",
};

const COLOR_SCHEME_PREVIEW: Record<
  (typeof ACCESSIBILITY_COLOR_SCHEMES)[number]["value"],
  string
> = {
  normal: "bg-white text-[#7c2323] border-[#d3d3d3]",
  "light-high-contrast": "bg-white text-black border-black",
  "dark-high-contrast": "bg-black text-white border-white",
  "blue-yellow": "bg-[#003A70] text-[#FFE500] border-[#FFE500]",
};

type AccessibilityPanelProps = {
  triggerClassName?: string;
};

function AccessibilityPanel({ triggerClassName }: AccessibilityPanelProps) {
  const enabled = useAccessibilityStore((state) => state.enabled);
  const textMode = useAccessibilityStore((state) => state.textMode);
  const fontScale = useAccessibilityStore((state) => state.fontScale);
  const colorScheme = useAccessibilityStore((state) => state.colorScheme);
  const reduceMotion = useAccessibilityStore((state) => state.reduceMotion);
  const backgroundImagesVisible = useAccessibilityStore(
    (state) => state.backgroundImagesVisible,
  );
  const setEnabled = useAccessibilityStore((state) => state.setEnabled);
  const setTextMode = useAccessibilityStore((state) => state.setTextMode);
  const setFontScale = useAccessibilityStore((state) => state.setFontScale);
  const setColorScheme = useAccessibilityStore(
    (state) => state.setColorScheme,
  );
  const setReduceMotion = useAccessibilityStore(
    (state) => state.setReduceMotion,
  );
  const setBackgroundImagesVisible = useAccessibilityStore(
    (state) => state.setBackgroundImagesVisible,
  );

  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="secondary" />}
        aria-label={
          enabled
            ? "Настройки версии для слабовидящих"
            : "Включить версию для слабовидящих"
        }
        aria-pressed={enabled}
        className={triggerClassName}
        onClick={() => {
          if (!enabled) setEnabled(true);
        }}
      >
        <span
          aria-hidden="true"
          className="text-mode-hidden size-4 shrink-0 bg-current mask-[url('/images/header/eye.svg')] mask-contain mask-center mask-no-repeat desktop1250:size-5"
        />
        <span className="text-mode-only">Версия для слабовидящих</span>
      </DialogTrigger>

      <DialogContent
        data-a11y-settings-dialog
        className="max-w-[720px] p-4 mobile:p-5"
      >
        <div className="relative">
          <DialogTitle className="pr-12 text-[1.125em] leading-tight font-semibold">
            Версия для слабовидящих
          </DialogTitle>
          <DialogClose
            render={<Button variant="ghost" size="icon" />}
            aria-label="Закрыть настройки версии для слабовидящих"
            className="absolute top-0 right-0 size-11 rounded-full"
          >
            <X aria-hidden="true" />
          </DialogClose>
          <DialogDescription className="mt-2 max-w-[56ch] text-[0.75em] leading-snug text-muted-foreground">
            Настройки применяются ко всему сайту и сохраняются автоматически.
          </DialogDescription>
        </div>

        {textMode && (
          <p className="mt-3 text-[0.75em]">
            В текстовом режиме используется белый фон с чёрным текстом,
            изображения и анимации отключены. Размер текста можно менять.
          </p>
        )}

        <div className="mt-4 grid items-start gap-4 desktop:grid-cols-2">
          <fieldset className="min-w-0 rounded-xl border border-border p-3">
            <legend className="px-1 text-[0.75em] font-semibold">
              Размер текста
            </legend>

            <div className="mt-1 grid grid-cols-1 gap-2 mobileSmall:grid-cols-3">
              {ACCESSIBILITY_FONT_SCALES.map((scale) => {
                const selected = fontScale === scale;

                return (
                  <Button
                    key={scale}
                    variant={selected ? "default" : "outline"}
                    aria-pressed={selected}
                    aria-label={`Размер текста ${FONT_SCALE_LABELS[scale]} (${Math.round(scale * 100)}%)`}
                    onClick={() => setFontScale(scale)}
                    className="min-h-11 min-w-0 w-full px-2"
                  >
                    <span>{FONT_SCALE_LABELS[scale]}</span>
                  </Button>
                );
              })}
            </div>
          </fieldset>

          <fieldset disabled={textMode} className="min-w-0 rounded-xl border border-border p-3">
            <legend className="px-1 text-[0.75em] font-semibold">
              Отображение
            </legend>

            <div className="mt-1 grid gap-2">
              <Button
                variant={reduceMotion ? "default" : "outline"}
                aria-pressed={reduceMotion}
                onClick={() => setReduceMotion(!reduceMotion)}
                className="min-h-11 w-full justify-between gap-3 whitespace-normal px-3 text-left"
              >
                <span>Без анимаций</span>
                {reduceMotion && <Check aria-hidden="true" className="size-4" />}
              </Button>

              <Button
                variant={!backgroundImagesVisible ? "default" : "outline"}
                aria-pressed={!backgroundImagesVisible}
                onClick={() =>
                  setBackgroundImagesVisible(!backgroundImagesVisible)
                }
                className="min-h-11 w-full justify-between gap-3 whitespace-normal px-3 text-left"
              >
                <span>Без фоновых изображений</span>
                {!backgroundImagesVisible && (
                  <Check aria-hidden="true" className="size-4" />
                )}
              </Button>
            </div>
          </fieldset>

          <fieldset disabled={textMode} className="min-w-0 rounded-xl border border-border p-3 desktop:col-span-2">
            <legend className="px-1 text-[0.75em] font-semibold">
              Цветовая схема
            </legend>

            <div className="mt-1 grid gap-2 mobile:grid-cols-2">
              {ACCESSIBILITY_COLOR_SCHEMES.map((scheme) => {
                const selected = colorScheme === scheme.value;

                return (
                  <Button
                    key={scheme.value}
                    variant="outline"
                    aria-pressed={selected}
                    onClick={() => setColorScheme(scheme.value)}
                    className={cn(
                      "relative min-h-12 min-w-0 justify-start gap-2 whitespace-normal px-2.5 text-left [overflow-wrap:anywhere]",
                      selected && "border-ring ring-2 ring-ring/50",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-md border text-[0.625em] font-bold",
                        COLOR_SCHEME_PREVIEW[scheme.value],
                      )}
                    >
                      Aa
                    </span>
                    <span className="leading-tight">{scheme.label}</span>
                    {selected && (
                      <Check
                        aria-hidden="true"
                        className="absolute top-1.5 right-1.5 size-3.5"
                      />
                    )}
                  </Button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="mt-4 flex flex-col-reverse gap-2 border-t border-border pt-4 mobile:flex-row mobile:items-center mobile:justify-between">
          <span className="min-w-0 flex-1 text-[0.6875em] leading-snug text-muted-foreground">
            Настройки сохраняются после перезагрузки.
          </span>

          <DialogClose
            render={<Button variant="outline" />}
            onClick={() => {
              setEnabled(false);
              if (textMode) setTextMode(false);
            }}
            className="min-h-11 shrink-0 whitespace-normal"
          >
            {textMode ? "Выключить увеличение текста" : "Обычная версия"}
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { AccessibilityPanel };
