"use client";

import { useEffect, useRef, useState } from "react";
import { useSiteSettingsStore } from "@/state/site-settings.store";

type YandexPlacemark = Record<string, unknown>;

type YandexMapInstance = {
  geoObjects: {
    add(placemark: YandexPlacemark): void;
  };
  destroy(): void;
};

type YandexMapsApi = {
  ready(callback: () => void): void;
  Map: new (
    element: HTMLElement,
    state: { center: [number, number]; zoom: number },
    options: { controls: string[]; suppressMapOpenBlock: boolean },
  ) => YandexMapInstance;
  Placemark: new (
    coordinates: [number, number],
    properties: Record<string, string>,
    options: Record<string, unknown>,
  ) => YandexPlacemark;
  templateLayoutFactory: {
    createClass(template: string): unknown;
  };
};

declare global {
  interface Window {
    ymaps?: YandexMapsApi;
  }
}

const MAP_COORDINATES: [number, number] = [45.026317, 38.973660];
const API_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

const labelLayout = (ymaps: YandexMapsApi) =>
  ymaps.templateLayoutFactory.createClass(
    '<div style="box-sizing:border-box;width:220px;padding:10px 14px;border-radius:8px;background:rgba(255,255,255,.96);box-shadow:0 2px 8px rgba(0,0,0,.18);font-family:Arial,sans-serif;color:#171717;line-height:1.2;white-space:normal">' +
      '<div style="font-size:16px;font-weight:700">Дом журналистики</div>' +
      '<div style="margin-top:4px;font-size:13px;color:#666">Общественная организация</div>' +
      "</div>",
  );

const FooterMap = () => {
  const contacts = useSiteSettingsStore((state) => state.settings?.contacts);
  const status = useSiteSettingsStore((state) => state.status);
  const mapUrl = contacts?.map_url && /^https?:\/\//i.test(contacts.map_url)
    ? contacts.map_url
    : null;
  const mapElementRef = useRef<HTMLDivElement>(null);
  const [showMapFallback, setShowMapFallback] = useState(!API_KEY);

  useEffect(() => {
    if (!API_KEY || !mapElementRef.current) return;

    let isDisposed = false;
    let map: YandexMapInstance | undefined;
    let script = document.querySelector<HTMLScriptElement>("#yandex-maps-api");

    const initializeMap = () => {
      const ymaps = window.ymaps;
      const mapElement = mapElementRef.current;
      if (!ymaps || !mapElement || isDisposed) return;

      ymaps.ready(() => {
        if (isDisposed || !mapElementRef.current) return;

        map = new ymaps.Map(
          mapElement,
          { center: MAP_COORDINATES, zoom: 17 },
          { controls: [], suppressMapOpenBlock: true },
        );

        const placemark = new ymaps.Placemark(
          MAP_COORDINATES,
          {},
          {
            iconLayout: "default#imageWithContent",
            iconImageHref: "/images/footer/map-marker.svg",
            iconImageSize: [60, 68],
            iconImageOffset: [-30, -68],
            iconContentLayout: labelLayout(ymaps),
            iconContentOffset: [68, 0],
            iconShape: {
              type: "Circle",
              coordinates: [0, -41],
              radius: 29,
            },
          },
        );

        map.geoObjects.add(placemark);
        setShowMapFallback(false);
      });
    };

    const handleScriptError = () => setShowMapFallback(true);

    if (window.ymaps) {
      initializeMap();
    } else {
      if (!script) {
        script = document.createElement("script");
        script.id = "yandex-maps-api";
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(API_KEY)}&lang=ru_RU`;
        script.async = true;
        document.head.append(script);
      }

      script.addEventListener("load", initializeMap);
      script.addEventListener("error", handleScriptError);
    }

    return () => {
      isDisposed = true;
      script?.removeEventListener("load", initializeMap);
      script?.removeEventListener("error", handleScriptError);
      map?.destroy();
    };
  }, []);

  return (
    <>
      <div
        ref={mapElementRef}
        title={contacts?.address ? `Яндекс Карты: ${contacts.address}` : "Яндекс Карты"}
        className="text-mode-hidden absolute inset-0 size-full"
      />
      {showMapFallback && (
        mapUrl ? (
          <a
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            className="text-mode-hidden absolute inset-0 z-10 flex items-center justify-center bg-[#e8e8e8] p-4 text-center text-base font-semibold text-[#171717] underline underline-offset-4"
          >
            Карта временно недоступна. Открыть Яндекс.Карты
          </a>
        ) : (
          <span className="text-mode-hidden absolute inset-0 z-10 flex items-center justify-center bg-[#e8e8e8] p-4 text-center text-base font-semibold text-[#171717]">
            Карта временно недоступна
          </span>
        )
      )}
      {mapUrl ? (
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          className="text-mode-only text-base font-semibold underline underline-offset-2 mobile:text-lg"
        >
          Открыть карту: {contacts?.address}
        </a>
      ) : (
        <span className="text-mode-only text-base font-semibold">
          {contacts?.address ?? (status === "error" ? "Адрес временно недоступен" : "Адрес загружается…")}
        </span>
      )}
    </>
  );
};

export { FooterMap };
