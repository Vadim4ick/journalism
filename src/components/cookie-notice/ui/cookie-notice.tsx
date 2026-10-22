"use client";

import { useState } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Container } from "@/shared/ui/container";
import { acceptCookies, useCookieAcceptance } from "@/state/cookie-acceptance";
import styles from "./cookie-notice.module.css";

export function CookieNotice() {
  const accepted = useCookieAcceptance();
  const [error, setError] = useState(false);

  if (accepted !== false) return null;

  return (
    <div className={styles.position}>
      <Container className={styles.container}>
        <aside className={styles.notice} aria-labelledby="cookie-notice-title" aria-describedby="cookie-notice-description">
          <div className={styles.icon} aria-hidden="true"><Cookie size={26} strokeWidth={1.8} /></div>
          <div className={styles.copy}>
            <h2 id="cookie-notice-title" className={styles.title}>Используем файлы cookie</h2>
            <div id="cookie-notice-description" className={styles.description}>
              <p>На сайте используются файлы cookie. Они помогают сайту работать стабильно, запоминать настройки и улучшать сервис.</p>
              <p>Продолжая пользоваться сайтом, вы соглашаетесь с <a href="https://nereiy.ru/docs/privacy">Политикой конфиденциальности</a>.</p>
            </div>
            {error && <p role="alert" className={styles.error}>Не удалось сохранить закрытие уведомления. Проверьте настройки браузера.</p>}
          </div>
          <Button
            type="button"
            className={styles.accept}
            onClick={() => setError(!acceptCookies())}
          >
            Согласен
          </Button>
        </aside>
      </Container>
    </div>
  );
}
