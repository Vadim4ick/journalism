import type { Metadata } from "next";
import { AuthPage } from "@/views/auth";

export const metadata: Metadata = {
  title: "Вход и регистрация — Дом журналистики",
  description:
    "Войдите в аккаунт или зарегистрируйтесь на сайте Дома журналистики.",
};

export default function LoginPage() {
  return <AuthPage />;
}
