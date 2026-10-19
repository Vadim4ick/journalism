"use server";

import { contentServices } from "@/shared/services/content";
import type { ContentDocumentSection } from "@/shared/types/model/content.type";

export async function getDocumentsAction(): Promise<{
  sections: ContentDocumentSection[];
  error: boolean;
}> {
  try {
    const response = await contentServices.getDocuments({
      page: 1,
      per_page: 100,
    });
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test"
    ) {
      console.log({ action: "getDocumentsAction", response }, { depth: null });
    }
    if (
      response.status !== "success" ||
      !Array.isArray(response.data?.sections) ||
      !response.data.sections.every((section) => Array.isArray(section.items))
    ) {
      throw new Error("Некорректный ответ сервера при загрузке документов");
    }

    return { sections: response.data.sections, error: false };
  } catch (cause) {
    console.error("Не удалось загрузить документы", cause);
    return { sections: [], error: true };
  }
}
