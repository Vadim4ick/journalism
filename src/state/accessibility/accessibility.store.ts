"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  ACCESSIBILITY_COLOR_SCHEMES,
  ACCESSIBILITY_FONT_SCALES,
  ACCESSIBILITY_STORAGE_KEY,
  DEFAULT_ACCESSIBILITY_SETTINGS,
} from "./model/constants";
import type {
  AccessibilityColorScheme,
  AccessibilityFontScale,
  AccessibilitySettings,
} from "./model/types";

type AccessibilityStore = AccessibilitySettings & {
  hydrated: boolean;
  setTextMode: (textMode: boolean) => void;
  setEnabled: (enabled: boolean) => void;
  setFontScale: (fontScale: AccessibilityFontScale) => void;
  setColorScheme: (colorScheme: AccessibilityColorScheme) => void;
  setReduceMotion: (reduceMotion: boolean) => void;
  setBackgroundImagesVisible: (visible: boolean) => void;
  reset: () => void;
};

function isFontScale(value: unknown): value is AccessibilityFontScale {
  return ACCESSIBILITY_FONT_SCALES.includes(value as AccessibilityFontScale);
}

function restoreFontScale(value: unknown): AccessibilityFontScale {
  // Preserve the closest option for settings saved before the scale was reduced.
  if (value === 2) return 1.25;
  if (value === 2.5) return 1.5;
  return isFontScale(value) ? value : DEFAULT_ACCESSIBILITY_SETTINGS.fontScale;
}

function isColorScheme(value: unknown): value is AccessibilityColorScheme {
  return ACCESSIBILITY_COLOR_SCHEMES.some((scheme) => scheme.value === value);
}

function mergePersistedSettings(
  persistedState: unknown,
  currentState: AccessibilityStore,
): AccessibilityStore {
  if (!persistedState || typeof persistedState !== "object") {
    return currentState;
  }

  const persisted = persistedState as Partial<AccessibilitySettings>;

  return {
    ...currentState,
    textMode: persisted.textMode === true,
    enabled:
      typeof persisted.enabled === "boolean"
        ? persisted.enabled
        : currentState.enabled,
    fontScale: restoreFontScale(persisted.fontScale),
    colorScheme: isColorScheme(persisted.colorScheme)
      ? persisted.colorScheme
      : currentState.colorScheme,
    reduceMotion:
      typeof persisted.reduceMotion === "boolean"
        ? persisted.reduceMotion
        : currentState.reduceMotion,
    backgroundImagesVisible:
      typeof persisted.backgroundImagesVisible === "boolean"
        ? persisted.backgroundImagesVisible
        : currentState.backgroundImagesVisible,
  };
}

const useAccessibilityStore = create<AccessibilityStore>()(
  persist(
    (set) => ({
      ...DEFAULT_ACCESSIBILITY_SETTINGS,
      hydrated: false,
      setTextMode: (textMode) => set({ textMode }),
      setEnabled: (enabled) => set({ enabled }),
      setFontScale: (fontScale) => set({ fontScale }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setBackgroundImagesVisible: (backgroundImagesVisible) =>
        set({ backgroundImagesVisible }),
      reset: () => set(DEFAULT_ACCESSIBILITY_SETTINGS),
    }),
    {
      name: ACCESSIBILITY_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({
        enabled,
        textMode,
        fontScale,
        colorScheme,
        reduceMotion,
        backgroundImagesVisible,
      }) => ({
        enabled,
        textMode,
        fontScale,
        colorScheme,
        reduceMotion,
        backgroundImagesVisible,
      }),
      merge: (persistedState, currentState) =>
        mergePersistedSettings(persistedState, currentState),
    },
  ),
);

export { useAccessibilityStore };
export type { AccessibilityStore };
