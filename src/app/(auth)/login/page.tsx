import type { Metadata } from "next";
import { AuthPage } from "@/views/auth";

export const metadata: Metadata = {
  title: "Вход — Дом журналистики",
  description: "Войдите в аккаунт на сайте Дома журналистики.",
};

export default function LoginPage() {
  return <AuthPage />;
}
