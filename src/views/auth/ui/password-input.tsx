"use client";

import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { AuthField } from "./auth-field";

type PasswordInputProps = {
  id: string;
  label: string;
  name: string;
  autoComplete: "current-password" | "new-password";
  placeholder: string;
  error?: string;
  visible: boolean;
  onVisibilityChange: (visible: boolean) => void;
  onChange: () => void;
};

export function PasswordInput({
  id,
  label,
  name,
  autoComplete,
  placeholder,
  error,
  visible,
  onVisibilityChange,
  onChange,
}: PasswordInputProps) {
  const toggleLabel =
    id === "auth-password-confirm"
      ? visible
        ? "Скрыть повторный пароль"
        : "Показать повторный пароль"
      : visible
        ? "Скрыть пароль"
        : "Показать пароль";

  return (
    <AuthField id={id} label={label} error={error}>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-12 rounded-md border-border bg-background px-3.5 pr-12 text-foreground placeholder:text-muted-foreground aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive"
          onChange={onChange}
        />
        <button
          type="button"
          className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => onVisibilityChange(!visible)}
          aria-label={toggleLabel}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-[18px]" />
          ) : (
            <Eye aria-hidden="true" className="size-[18px]" />
          )}
        </button>
      </div>
    </AuthField>
  );
}
