"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";
import { useAccessibilityStore } from "./accessibility.store";
import type { AccessibilitySettings } from "./model/types";

function applySettingsToDocument(settings: AccessibilitySettings) {
  const root = document.documentElement;

  root.dataset.a11yEnabled = String(settings.enabled);
  root.dataset.textMode = String(settings.textMode);
  root.dataset.a11yFontScale = String(settings.fontScale);
  root.dataset.a11yColorScheme = settings.colorScheme;
  root.dataset.a11yReduceMotion = String(
    settings.textMode || (settings.enabled && settings.reduceMotion),
  );
  root.dataset.a11yBackgroundImages = settings.backgroundImagesVisible
    ? "visible"
    : "hidden";
}

function AccessibilityEffects() {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    void Promise.resolve(useAccessibilityStore.persist.rehydrate()).then(() => {
      if (cancelled) return;

      useAccessibilityStore.setState({ hydrated: true });
      applySettingsToDocument(useAccessibilityStore.getState());
      unsubscribe = useAccessibilityStore.subscribe((state) => {
        applySettingsToDocument(state);
      });
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return null;
}

function useEffectiveReducedMotion() {
  const systemReducedMotion = useReducedMotion();
  const enabled = useAccessibilityStore((state) => state.enabled);
  const reduceMotion = useAccessibilityStore((state) => state.reduceMotion);
  const textMode = useAccessibilityStore((state) => state.textMode);

  return Boolean(textMode || systemReducedMotion || (enabled && reduceMotion));
}

export { AccessibilityEffects, useEffectiveReducedMotion };
