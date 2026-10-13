import type { ReactNode } from "react";

type AuthFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
};

export function AuthField({ id, label, error, children }: AuthFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="pl-4 text-xs text-primary">
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} className="pl-4 text-sm leading-5 text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
