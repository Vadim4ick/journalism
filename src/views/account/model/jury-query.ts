import axios from "axios";
import type { JuryApiErrorResponse } from "@/shared/types/model/jury.type";

export function juryData<T>(response: ApiSuccessResponse<T>): T {
  if (response.status !== "success" || response.data == null) {
    throw new Error("Сервер вернул некорректный ответ.");
  }
  return response.data;
}

export function juryErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<JuryApiErrorResponse>(error)) {
    return error instanceof Error ? error.message : "Не удалось выполнить запрос. Попробуйте ещё раз.";
  }
  const status = error.response?.status;
  const message = error.response?.data?.message;
  if (status === 401) return "Сессия истекла. Войдите снова.";
  if (status === 403) return "У вас нет доступа к этому голосованию.";
  if (status === 404) return message || "Запрошенные данные больше не доступны.";
  if (status === 409) return message || "Данные изменились. Обновите работу и проверьте оценки.";
  if (status === 422) return message || "Проверьте заполненные оценки.";
  if (status === 429) return "Слишком много запросов. Попробуйте позже.";
  if (status === 500 || status === 503) return "Ошибка сервера. Попробуйте позже.";
  return message || "Не удалось выполнить запрос. Проверьте соединение и попробуйте ещё раз.";
}
