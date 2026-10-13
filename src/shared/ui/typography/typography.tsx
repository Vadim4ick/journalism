import { createElement, type ComponentPropsWithRef } from "react";
import { cn } from "@/shared/lib/utils";
import { typographyVariants, type TypographyVariant } from "./variants";

type TypographyElement =
  | "p"
  | "span"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "div"
  | "ul"
  | "li"
  | "dl"
  | "dt"
  | "dd"
  | "time"
  | "a"
  | "label";

export type TypographyProps<T extends TypographyElement = "p"> = {
  as?: T;
  variant?: TypographyVariant;
} & Omit<ComponentPropsWithRef<T>, "as" | "variant">;

/** Visual style and HTML semantics are selected independently. */
export function Typography<T extends TypographyElement = "p">({
  as,
  variant = "body",
  className,
  ...props
}: TypographyProps<T>) {
  return createElement(as ?? "p", {
    ...props,
    "data-typography-variant": variant,
    className: cn(typographyVariants[variant], className),
  });
}
