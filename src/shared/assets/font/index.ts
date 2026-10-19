import localFont from "next/font/local";

export const raleway = localFont({
  display: "swap",
  variable: "--font-raleway",
  src: "./Raleway-wght.ttf",
  weight: "400 600",
  style: "normal",
});

export const foglihten = localFont({
  display: "swap",
  variable: "--font-foglihten",
  src: [
    {
      path: "./ofont.ru_FoglihtenNo06.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});
