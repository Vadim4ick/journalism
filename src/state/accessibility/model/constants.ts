import type {
  AccessibilityColorScheme,
  AccessibilityFontScale,
  AccessibilitySettings,
} from "./types";

export const ACCESSIBILITY_STORAGE_KEY =
  "journalism-front:accessibility-settings";

export const ACCESSIBILITY_FONT_SCALES: readonly AccessibilityFontScale[] = [
  2,
  2.5,
];

export const ACCESSIBILITY_COLOR_SCHEMES: readonly {
  value: AccessibilityColorScheme;
  label: string;
}[] = [
  { value: "normal", label: "Обычная" },
  { value: "light-high-contrast", label: "Белый фон / чёрный текст" },
  { value: "dark-high-contrast", label: "Чёрный фон / белый текст" },
  { value: "blue-yellow", label: "Синий фон / жёлтый текст" },
];

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  enabled: false,
  textMode: false,
  fontScale: 2,
  colorScheme: "normal",
  reduceMotion: true,
  backgroundImagesVisible: false,
};
