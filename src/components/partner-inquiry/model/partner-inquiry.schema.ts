import { z } from "zod";
import { isValidInn } from "./inn";

export const partnerInquirySchema = z.object({
  name: z.string().trim().min(1, "Укажите ваше имя"),
  email: z
    .string()
    .trim()
    .min(1, "Укажите адрес электронной почты")
    .email("Введите корректный адрес электронной почты"),
  inn: z.string().trim().superRefine((value, context) => {
    if (!value) {
      context.addIssue({ code: "custom", message: "Укажите ИНН" });
    } else if (!isValidInn(value)) {
      context.addIssue({
        code: "custom",
        message: "Введите корректный ИНН: 10 или 12 цифр с верной контрольной суммой",
      });
    }
  }),
  message: z.string().trim().min(1, "Напишите сообщение"),
});

export type PartnerInquiryValues = z.infer<typeof partnerInquirySchema>;
export type PartnerInquiryErrors = Partial<Record<keyof PartnerInquiryValues, string>>;

export function getPartnerInquiryErrors(issues: z.core.$ZodIssue[]): PartnerInquiryErrors {
  const errors: PartnerInquiryErrors = {};

  for (const issue of issues) {
    const field = issue.path[0];
    if (
      (field === "name" || field === "email" || field === "inn" || field === "message") &&
      !errors[field]
    ) {
      errors[field] = issue.message;
    }
  }

  return errors;
}
