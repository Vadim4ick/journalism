"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { ContentLegalDocumentsResponse } from "@/shared/types/model/content.type";
import effects from "@/shared/assets/style/link-effects.module.css";

export function FooterPolicyLink() {
  const { data } = useQuery({
    queryKey: ["legal-documents"],
    queryFn: async ({ signal }): Promise<ContentLegalDocumentsResponse> => {
      const response = await fetch("/api/legal-documents", { signal });
      if (!response.ok) throw new Error("Не удалось загрузить правовые документы");
      return response.json() as Promise<ContentLegalDocumentsResponse>;
    },
    retry: false,
  });
  const slug = data?.data?.items?.find((item) => item.slug === "policy")?.slug;

  if (!slug) return null;
  return (
    <Link
      href={`/legal-documents/${encodeURIComponent(slug)}`}
      className={`${effects.link} ${effects.text} w-fit text-base font-semibold underline underline-offset-2 mobile:text-lg`}
    >
      Политика конфиденциальности
    </Link>
  );
}
