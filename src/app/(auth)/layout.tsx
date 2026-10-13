import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
// import { SiteDirectory } from "@/components/site-directory";
import { SiteSearch } from "@/components/site-search";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header variant="auth" search={<SiteSearch />} />
      {children}
      {/* <SiteDirectory /> */}
      <Footer />
    </div>
  );
}
