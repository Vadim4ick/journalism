import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().trim().min(1, "Введите логин"),
  password: z.string().min(1, "Это обязательное поле"),
});

export type AuthFieldErrors = Partial<Record<"login" | "password", string>>;

export function getAuthFieldErrors(
  issues: z.core.$ZodIssue[],
): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  for (const issue of issues) {
    const field = issue.path[0];
    if ((field === "login" || field === "password") && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
}
