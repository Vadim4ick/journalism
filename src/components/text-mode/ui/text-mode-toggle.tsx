"use client";

import { FileText } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useAccessibilityStore } from "@/state/accessibility";

export function TextModeToggle() {
  const textMode = useAccessibilityStore((state) => state.textMode);
  const setTextMode = useAccessibilityStore((state) => state.setTextMode);

  return (
    <div
      className="flex shrink-0 flex-row-reverse items-center justify-end gap-2"
      data-text-controls
    >
      <Button
        variant="secondary"
        aria-label="Текстовый режим"
        title="Текстовый режим"
        aria-pressed={textMode}
        onClick={() => setTextMode(!textMode)}
        className="size-11 gap-2 rounded-full whitespace-normal desktop1250:size-13"
      >
        <FileText aria-hidden="true" className="text-mode-hidden size-5" />
        <span className="text-mode-only">Текстовый режим</span>
      </Button>
      {textMode && (
        <Button variant="outline" onClick={() => window.print()} className="min-h-11">
          Печать страницы
        </Button>
      )}
    </div>
  );
}
