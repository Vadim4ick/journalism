import { contentServices } from "@/shared/services/content";

export async function GET(request: Request) {
  try {
    const response = await contentServices.getLegalDocuments(undefined, request.signal);
    return Response.json(response);
  } catch {
    return Response.json({ message: "Не удалось загрузить правовые документы" }, { status: 502 });
  }
}
