export type AccessibilityFontScale = 2 | 2.5;

export type AccessibilityColorScheme =
  | "normal"
  | "light-high-contrast"
  | "dark-high-contrast"
  | "blue-yellow";

export type AccessibilitySettings = {
  enabled: boolean;
  textMode: boolean;
  fontScale: AccessibilityFontScale;
  colorScheme: AccessibilityColorScheme;
  reduceMotion: boolean;
  backgroundImagesVisible: boolean;
};
