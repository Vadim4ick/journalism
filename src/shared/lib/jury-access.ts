import type { Profile } from "@/shared/types/model/auth.type";

export function isJuryMember(profile: Profile | null | undefined): boolean {
  return profile?.group_codes?.includes("jury_member") === true;
}
