import type { Metadata } from "next";
import { AccountPage } from "@/views/account";

export const metadata: Metadata = {
  title: "Личный кабинет — Дом журналистики",
  description: "Личный кабинет члена жюри конкурса «Сорока».",
};

export default function Page() {
  return <AccountPage />;
}
