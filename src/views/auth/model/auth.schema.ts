import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .min(1, "Это обязательное поле")
  .email("Введите корректный адрес электронной почты");

export const loginSchema = z.object({
  login: z.string().trim().min(1, "Введите логин"),
  password: z.string().min(1, "Это обязательное поле"),
});

export const recoverySchema = z.object({
  email: emailField,
});

export type AuthFieldErrors = Partial<Record<"login" | "email" | "password", string>>;

export function getAuthFieldErrors(
  issues: z.core.$ZodIssue[],
): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  for (const issue of issues) {
    const field = issue.path[0];
    if ((field === "login" || field === "email" || field === "password") && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
}
