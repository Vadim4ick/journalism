import type { ReactNode } from "react";
import { AccountAccessGate } from "@/views/account";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountAccessGate>{children}</AccountAccessGate>;
}
