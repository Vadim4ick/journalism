"use client";

import { useId, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { CONTACTS } from "@/shared/const/contacts.const";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import {
  getPartnerInquiryErrors,
  partnerInquirySchema,
  type PartnerInquiryErrors,
} from "../model/partner-inquiry.schema";

type Field = keyof PartnerInquiryErrors;

export function PartnerInquiry({
  project,
  className,
}: {
  project: string;
  className?: string;
}) {
  const id = useId();
  const [errors, setErrors] = useState<PartnerInquiryErrors>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const result = partnerInquirySchema.safeParse(
      Object.fromEntries(new FormData(form)),
    );
    if (!result.success) {
      const nextErrors = getPartnerInquiryErrors(result.error.issues);
      setErrors(nextErrors);
      const firstError = (Object.keys(nextErrors) as Field[])[0];
      if (firstError)
        (form.elements.namedItem(firstError) as HTMLElement | null)?.focus();
      return;
    }

    setErrors({});
    const { name, email, inn, message } = result.data;
    const subject = `Партнёрство: ${project}`;
    const body = `Проект: ${project}\nИмя: ${name}\nEmail: ${email}\nИНН: ${inn}\n\n${message}`;
    window.location.href = `mailto:${CONTACTS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function clearError(field: Field) {
    if (errors[field])
      setErrors((current) => ({ ...current, [field]: undefined }));
  }

  const inputClass = "h-12 border-border bg-background px-3 text-foreground";

  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="pill" size="default" />}
        className={`relative z-[2] min-h-11 max-w-full gap-3 whitespace-normal py-1 pl-4 pr-1 text-xs ${className ?? ""}`}
        aria-label={`Стать партнёром проекта ${project}`}
      >
        <span className="min-w-0 text-center leading-tight">
          Стать партнёром
        </span>
        <span
          aria-hidden="true"
          data-text-decorative
          className="flex size-9 items-center justify-center rounded-full bg-primary text-2xl font-normal leading-none text-primary-foreground"
        >
          +
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-[520px] overflow-x-hidden p-3 mobile:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 [overflow-wrap:anywhere]">
            <DialogTitle className="text-xl font-semibold">
              Стать партнёром
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm text-muted-foreground">
              Заявка по проекту {project}. После заполнения откроется письмо в
              вашей почтовой программе.
            </DialogDescription>
          </div>
          <DialogClose
            render={<Button variant="ghost" size="icon" />}
            aria-label="Закрыть форму"
            className="size-[44px] shrink-0 rounded-full"
          >
            <X aria-hidden="true" />
          </DialogClose>
        </div>
        <form className="mt-5 grid gap-4" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-1.5">
            <label htmlFor={`${id}-name`} className="text-sm font-medium">
              Ваше имя *
            </label>
            <Input
              id={`${id}-name`}
              name="name"
              autoComplete="name"
              required
              className={inputClass}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${id}-name-error` : undefined}
              onChange={() => clearError("name")}
            />
            {errors.name && (
              <p
                id={`${id}-name-error`}
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.name}
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <label htmlFor={`${id}-email`} className="text-sm font-medium">
              Электронная почта *
            </label>
            <Input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClass}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${id}-email-error` : undefined}
              onChange={() => clearError("email")}
            />
            {errors.email && (
              <p
                id={`${id}-email-error`}
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.email}
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <label htmlFor={`${id}-inn`} className="text-sm font-medium">
              ИНН *
            </label>
            <Input
              id={`${id}-inn`}
              name="inn"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={12}
              required
              className={inputClass}
              aria-invalid={Boolean(errors.inn)}
              aria-describedby={`${id}-inn-hint${errors.inn ? ` ${id}-inn-error` : ""}`}
              onChange={() => clearError("inn")}
            />
            <p id={`${id}-inn-hint`} className="text-xs text-muted-foreground">
              10 цифр для организации или 12 для ИП и физического лица
            </p>
            {errors.inn && (
              <p
                id={`${id}-inn-error`}
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.inn}
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <label htmlFor={`${id}-message`} className="text-sm font-medium">
              Сообщение *
            </label>
            <Textarea
              id={`${id}-message`}
              name="message"
              rows={4}
              required
              className="bg-background px-3 text-foreground"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={
                errors.message ? `${id}-message-error` : undefined
              }
              onChange={() => clearError("message")}
            />
            {errors.message && (
              <p
                id={`${id}-message-error`}
                role="alert"
                className="text-sm text-destructive"
              >
                {errors.message}
              </p>
            )}
          </div>
          <Button type="submit" className="min-h-11 rounded-full px-5">
            Открыть письмо
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
