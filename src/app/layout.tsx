import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Script from "next/script";

import "@/shared/assets/style/globals.css";
import "@/shared/assets/style/text-mode.css";
import { Providers } from "@/shared/providers/providers";
import { foglihten } from "@/shared/assets/font";
import {
  ACCESSIBILITY_COLOR_SCHEMES,
  ACCESSIBILITY_STORAGE_KEY,
  DEFAULT_ACCESSIBILITY_SETTINGS,
} from "@/state/accessibility/model/constants";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Дом журналистики",
  description: "Медиацентр «Дом журналистики»",

  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const accessibilityInitScript = `
(function () {
  try {
    var raw = localStorage.getItem(${JSON.stringify(ACCESSIBILITY_STORAGE_KEY)});
    if (!raw) return;
    var persisted = JSON.parse(raw);
    var settings = persisted && persisted.state ? persisted.state : persisted;
    if (!settings) return;

    var root = document.documentElement;
    root.dataset.textMode = String(settings.textMode === true);
    if (settings.textMode === true) root.dataset.a11yReduceMotion = "true";
    if (settings.enabled !== true) return;
    var fontScale = settings.fontScale === 2.5 ? "2.5" : "2";
    var schemes = ${JSON.stringify(ACCESSIBILITY_COLOR_SCHEMES.map((scheme) => scheme.value))};
    var scheme = schemes.indexOf(settings.colorScheme) >= 0
      ? settings.colorScheme
      : ${JSON.stringify(DEFAULT_ACCESSIBILITY_SETTINGS.colorScheme)};

    root.dataset.a11yEnabled = "true";
    root.dataset.a11yFontScale = fontScale;
    root.dataset.a11yColorScheme = scheme;
    root.dataset.a11yReduceMotion = String(settings.textMode === true || settings.reduceMotion !== false);
    root.dataset.a11yBackgroundImages = settings.backgroundImagesVisible === true
      ? "visible"
      : "hidden";
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={`${raleway.variable} ${foglihten.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="accessibility-settings-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: accessibilityInitScript }}
        />
      </head>
      <body className="h-full">
        <Providers>
          <a href="#main-content" className="skip-link">
            Перейти к основному содержимому
          </a>

          <div className="flex min-h-full flex-col">
            <main
              id="main-content"
              data-text-flow
              tabIndex={-1}
              className="flex flex-1 flex-col"
            >
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
