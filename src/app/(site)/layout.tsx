import type { ReactNode } from "react";
import { SiteHeader } from "@/components/header";
import { Footer } from "@/components/footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      {children}
      <Footer />
    </div>
  );
}
