import type { Metadata } from "next";
import { ContactsPage } from "@/views/contacts";

export const metadata: Metadata = {
  title: "Контакты — Дом журналистики",
  description: "Контакты, режим работы и реквизиты медиацентра «Дом журналистики».",
};

export default function Page() {
  return <ContactsPage />;
}
