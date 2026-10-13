import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .min(1, "Это обязательное поле")
  .email("Введите корректный адрес электронной почты");

const passwordField = z
  .string()
  .min(1, "Это обязательное поле")
  .min(8, "Пароль должен содержать не менее 8 символов");

export const registerSchema = z
  .object({
    email: emailField,
    password: passwordField,
    passwordConfirm: z.string().min(1, "Это обязательное поле"),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Пароли не совпадают",
  });

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Это обязательное поле"),
});

export const recoverySchema = z.object({
  email: emailField,
});

export type AuthFieldErrors = Partial<
  Record<"email" | "password" | "passwordConfirm", string>
>;

export function getAuthFieldErrors(
  issues: z.core.$ZodIssue[],
): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  for (const issue of issues) {
    const field = issue.path[0];
    if (
      (field === "email" ||
        field === "password" ||
        field === "passwordConfirm") &&
      !errors[field]
    ) {
      errors[field] = issue.message;
    }
  }

  return errors;
}
