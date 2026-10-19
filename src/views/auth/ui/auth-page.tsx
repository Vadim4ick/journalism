"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { ScrollReveal } from "@/shared/ui/scroll-reveal";
import { Typography } from "@/shared/ui/typography";
import {
  getAuthFieldErrors,
  loginSchema,
  recoverySchema,
  type AuthFieldErrors,
} from "../model/auth.schema";
import { AuthField } from "./auth-field";
import { PasswordInput } from "./password-input";
import { getLoginErrorMessage, useLoginMutation } from "@/shared/services/auth/hooks/useLoginMutation";

type AuthMode = "login" | "recovery";

export function AuthPage() {
  const router = useRouter();
  const loginMutation = useLoginMutation({ showToasts: false });
  const submitting = useRef(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [message, setMessage] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  const isRecovery = mode === "recovery";
  const isBusy = loginMutation.isPending || redirecting;
  const identifier = isRecovery ? "email" : "login";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || isBusy) return;
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    if (isRecovery) {
      const result = recoverySchema.safeParse(values);
      if (!result.success) {
        setErrors(getAuthFieldErrors(result.error.issues));
        (form.elements.namedItem("email") as HTMLInputElement | null)?.focus();
        return;
      }
      setErrors({});
      setMessage("Сервис восстановления пока не подключён: письмо не отправлено.");
      return;
    }

    const result = loginSchema.safeParse(values);

    if (!result.success) {
      setErrors(getAuthFieldErrors(result.error.issues));
      const firstField = result.error.issues[0]?.path[0];
      if (typeof firstField === "string") {
        (form.elements.namedItem(firstField) as HTMLInputElement | null)?.focus();
      }
      return;
    }

    setErrors({});
    submitting.current = true;
    try {
      await loginMutation.mutateAsync({
        ...result.data,
        captcha_token: "",
        rememberMe,
      });
      setRedirecting(true);
      router.replace("/account");
    } catch (error) {
      if (!axios.isCancel(error)) setMessage(getLoginErrorMessage(error));
    } finally {
      submitting.current = false;
    }
  }

  function switchMode(nextMode: AuthMode) {
    if (submitting.current || isBusy) return;
    setMode(nextMode);
    setErrors({});
    setMessage("");
    loginMutation.reset();
  }

  const title = isRecovery ? "Восстановление доступа" : "Вход в систему";

  return (
    <section
      className="flex w-full flex-1 items-start justify-center px-3 pt-8 pb-12 mobile:px-4 tablet:px-6 tablet:pb-20 desktop1250:px-8 desktop1250:pt-[292px] desktop1250:pb-30"
      aria-labelledby="auth-title"
      data-text-flow
    >
      <ScrollReveal className="grid w-full max-w-[1475px] grid-cols-1 overflow-hidden rounded-[20px] bg-background mobile:max-w-[520px] tablet:max-w-[1475px] tablet:grid-cols-[minmax(0,2.235fr)_minmax(280px,1fr)] tablet:rounded-[32px] tablet:min-h-[500px] desktop1250:grid-cols-[minmax(0,2.235fr)_minmax(320px,1fr)] desktop1250:min-h-[700px]">
        <div
          className="block aspect-[16/7] min-h-[180px] bg-[#003f39] bg-[url('/images/auth/soroka.png')] bg-cover bg-center tablet:aspect-auto tablet:min-h-full"
          aria-hidden="true"
          data-a11y-background-image
          data-text-decorative
        />

        <div className="flex items-center justify-center bg-muted px-4 py-8 mobile:px-6 mobile:pt-8 mobile:pb-6 tablet:p-8 desktop1250:p-12">
          <div className="w-full max-w-[420px]">
            {isRecovery && (
              <div className="mb-6">
                <Typography
                  as="h1"
                  id="auth-title"
                  variant="heading-medium"
                  className="mb-3 text-foreground"
                >
                  {title}
                </Typography>
                <Typography className="text-[18px] text-foreground">
                  Введите адрес электронной почты вашего аккаунта. На него
                  придёт письмо с инструкцией по смене пароля.
                </Typography>
              </div>
            )}

            <form className="flex flex-col" onSubmit={handleSubmit} aria-busy={isBusy} noValidate>
              <fieldset disabled={isBusy} className="contents">
                <legend className="sr-only">{title}</legend>
                {!isRecovery && (
                  <Typography
                    as="h1"
                    id="auth-title"
                    variant="heading-medium"
                    className="mb-6 text-foreground text-[20px] font-semibold"
                  >
                    {title}
                  </Typography>
                )}

                <div className="flex flex-col gap-4">
                  <AuthField
                    id={`auth-${identifier}`}
                    label={isRecovery ? "Электронная почта" : "Логин"}
                    error={errors[identifier]}
                  >
                    <Input
                      key={identifier}
                      id={`auth-${identifier}`}
                      name={identifier}
                      type={isRecovery ? "email" : "text"}
                      autoComplete={isRecovery ? "email" : "username"}
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder={isRecovery ? "example@mail.ru" : "Введите логин"}
                      aria-invalid={Boolean(errors[identifier])}
                      aria-describedby={
                        errors[identifier] ? `auth-${identifier}-error` : undefined
                      }
                      className="h-12 rounded-md border-border bg-background px-3.5 text-foreground placeholder:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive"
                      onChange={() =>
                        errors[identifier] &&
                        setErrors((current) => ({ ...current, [identifier]: undefined }))
                      }
                    />
                  </AuthField>

                  {!isRecovery && (
                    <PasswordInput
                      id="auth-password"
                      label="Пароль"
                      name="password"
                      autoComplete="current-password"
                      placeholder="Введите пароль"
                      error={errors.password}
                      visible={showPassword}
                      onVisibilityChange={setShowPassword}
                      onChange={() =>
                        errors.password &&
                        setErrors((current) => ({ ...current, password: undefined }))
                      }
                    />
                  )}
                </div>

                {mode === "login" && (
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <label
                      htmlFor="auth-remember"
                      className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                    >
                      <Checkbox
                        id="auth-remember"
                        name="rememberMe"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked === true)
                        }
                        className="size-5 border-1 border-border bg-background text-primary-foreground transition-colors data-checked:border-primary data-checked:bg-primary"
                      />
                      Запомнить меня
                    </label>
                    <button
                      type="button"
                      className="cursor-pointer text-sm text-brand underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => switchMode("recovery")}
                    >
                      Забыли пароль?
                    </button>
                  </div>
                )}

                <div className="mt-8 flex flex-col items-center gap-4">
                  <Button
                    type="submit"
                    disabled={isBusy}
                    className="h-12 w-full rounded-full text-[15px] font-semibold"
                  >
                    {isBusy ? "Входим…" : isRecovery ? "Восстановить пароль" : "Войти"}
                  </Button>
                </div>

                {isRecovery && (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-[0.35rem] border-t border-border pt-4 text-center">
                    <button
                      type="button"
                      className="cursor-pointer text-xs text-brand underline underline-offset-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => switchMode("login")}
                    >
                      Вернуться на страницу входа
                    </button>
                  </div>
                )}
              </fieldset>

              {message && (
                <p
                  className="mt-3 text-sm leading-6 text-foreground"
                  role={isRecovery ? "status" : "alert"}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export function AuthSuccessMessage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="mx-auto w-full max-w-[520px] rounded-2xl bg-muted p-6 text-foreground"
      aria-live="polite"
    >
      <div className="flex items-start gap-4">
        <Check aria-hidden="true" className="mt-1 size-8 shrink-0 text-brand" />
        <div>
          <Typography
            as="h1"
            variant="heading-medium"
            className="mb-3 text-foreground"
          >
            {title}
          </Typography>
          <Typography className="text-sm leading-6">{children}</Typography>
        </div>
      </div>
      <div className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
        Если письмо не пришло, проверьте папку «Спам» или обратитесь в
        поддержку.
      </div>
    </section>
  );
}
