"use client";

import Link from "next/link";
import { Menu } from "@base-ui/react/menu";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useLogoutMutation } from "@/shared/services/auth/hooks/useLogoutMutation";
import { useAuthStore } from "@/state/auth.store";
import { isJuryMember } from "@/shared/lib/jury-access";

export function AccountMenu() {
  const profile = useAuthStore((state) => state.profile);
  const fullName = profile?.full_name?.trim();
  const canOpenAccount = isJuryMember(profile);
  const logout = useLogoutMutation();

  return (
    <Menu.Root>
      <Menu.Trigger className="group/account inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring">
        <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#333]">
          <UserRound size={17} />
        </span>
        <span className="max-w-48 truncate mobile:max-w-64">{fullName || "Аккаунт"}</span>
        <ChevronDown aria-hidden="true" size={16} className="transition-transform group-data-[popup-open]/account:rotate-180 motion-reduce:transition-none" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={8} className="z-[80]">
          <Menu.Popup className="min-w-40 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg outline-none">
            {canOpenAccount && (
              <Menu.LinkItem
                render={<Link href="/account" />}
                closeOnClick
                className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium outline-none data-[highlighted]:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <UserRound aria-hidden="true" size={18} />
                Личный кабинет
              </Menu.LinkItem>
            )}
            <Menu.Item
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium outline-none data-[highlighted]:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogOut aria-hidden="true" size={18} />
              Выйти
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
