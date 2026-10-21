"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import Script from "next/script";

type SmartCaptchaApi = {
  render: (
    container: HTMLElement,
    options: { sitekey: string; hl: "ru"; invisible: true; hideShield: true; callback: (token: string) => void },
  ) => number;
  execute: (widgetId: number) => void;
  reset: (widgetId: number) => void;
  destroy: (widgetId: number) => void;
  subscribe: (
    widgetId: number,
    event: "token-expired" | "network-error" | "javascript-error" | "challenge-hidden",
    callback: () => void,
  ) => () => void;
};

declare global {
  interface Window {
    smartCaptcha?: SmartCaptchaApi;
    journalismLoginCaptchaReady?: () => void;
  }
}

type LoginCaptchaProps = {
  siteKey: string;
  resetSignal: number;
  onToken: (token: string) => void;
  onError: (message: string) => void;
  onChallengeHidden: () => void;
  onReadyChange: (ready: boolean) => void;
};

export type LoginCaptchaHandle = { execute: () => boolean };

export const LoginCaptcha = forwardRef<LoginCaptchaHandle, LoginCaptchaProps>(function LoginCaptcha(
  { siteKey, resetSignal, onToken, onError, onChallengeHidden, onReadyChange },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const failedRef = useRef(false);
  const callbacksRef = useRef({ onToken, onError, onChallengeHidden, onReadyChange });
  const initializeRef = useRef<() => void>(() => {});

  useEffect(() => {
    callbacksRef.current = { onToken, onError, onChallengeHidden, onReadyChange };
  }, [onToken, onError, onChallengeHidden, onReadyChange]);

  useImperativeHandle(ref, () => ({
    execute: () => {
      const api = window.smartCaptcha;
      if (!api || widgetIdRef.current === null || failedRef.current) return false;
      try {
        api.execute(widgetIdRef.current);
        return true;
      } catch {
        return false;
      }
    },
  }), []);

  useEffect(() => {
    if (!siteKey) return;

    let active = true;
    let javascriptFailed = false;
    let unsubscribers: (() => void)[] = [];
    const loadTimeout = window.setTimeout(() => {
      if (active && widgetIdRef.current === null) {
        callbacksRef.current.onError("Капча не загрузилась. Проверьте соединение и обновите страницу.");
      }
    }, 15000);

    const initialize = () => {
      const api = window.smartCaptcha;
      const container = containerRef.current;
      if (!active || !api || !container || widgetIdRef.current !== null) return;

      try {
        const widgetId = api.render(container, {
          sitekey: siteKey,
          hl: "ru",
          invisible: true,
          hideShield: true,
          callback: (token) => {
            if (active && !javascriptFailed) callbacksRef.current.onToken(token);
          },
        });
        widgetIdRef.current = widgetId;
        unsubscribers = [
          api.subscribe(widgetId, "token-expired", () => {
            callbacksRef.current.onError("Время проверки истекло. Попробуйте войти снова.");
          }),
          api.subscribe(widgetId, "network-error", () => {
            callbacksRef.current.onError("Не удалось загрузить капчу. Проверьте соединение и попробуйте снова.");
          }),
          api.subscribe(widgetId, "javascript-error", () => {
            javascriptFailed = true;
            failedRef.current = true;
            callbacksRef.current.onReadyChange(false);
            callbacksRef.current.onError("Ошибка капчи. Обновите страницу и попробуйте снова.");
          }),
          api.subscribe(widgetId, "challenge-hidden", () => callbacksRef.current.onChallengeHidden()),
        ];
        window.clearTimeout(loadTimeout);
        callbacksRef.current.onReadyChange(true);
      } catch {
        if (widgetIdRef.current !== null) {
          api.destroy(widgetIdRef.current);
          widgetIdRef.current = null;
        }
        callbacksRef.current.onReadyChange(false);
        callbacksRef.current.onError("Не удалось загрузить капчу. Обновите страницу и попробуйте снова.");
      }
    };
    initializeRef.current = initialize;
    window.journalismLoginCaptchaReady = initialize;
    if (window.smartCaptcha) initialize();

    return () => {
      active = false;
      callbacksRef.current.onReadyChange(false);
      window.clearTimeout(loadTimeout);
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      if (widgetIdRef.current !== null) {
        window.smartCaptcha?.destroy(widgetIdRef.current);
        widgetIdRef.current = null;
      }
      initializeRef.current = () => {};
      if (window.journalismLoginCaptchaReady === initialize) {
        delete window.journalismLoginCaptchaReady;
      }
    };
  }, [siteKey]);

  useEffect(() => {
    if (widgetIdRef.current !== null) {
      window.smartCaptcha?.reset(widgetIdRef.current);
    }
  }, [resetSignal]);

  return (
    <>
      <Script
        id="yandex-login-captcha"
        src="https://smartcaptcha.cloud.yandex.ru/captcha.js?render=onload&onload=journalismLoginCaptchaReady"
        strategy="afterInteractive"
        onReady={() => initializeRef.current()}
        onError={() => {
          callbacksRef.current.onReadyChange(false);
          callbacksRef.current.onError("Не удалось загрузить капчу. Проверьте соединение и попробуйте снова.");
        }}
      />
      <div ref={containerRef} />
    </>
  );
});
