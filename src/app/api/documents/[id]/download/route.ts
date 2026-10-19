import { isAxiosError } from "axios";
import { contentServices } from "@/shared/services/content";

type RouteContext = { params: Promise<{ id: string }> };

function storageUrl(path: string): URL | null {
  const base = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!base || !path.startsWith("/storage/")) return null;

  try {
    const origin = new URL(base).origin;
    const url = new URL(path, origin);
    return url.origin === origin && url.pathname.startsWith("/storage/") ? url : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request, { params }: RouteContext) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id < 1) {
    return Response.json({ message: "Некорректный ID документа" }, { status: 400 });
  }

  try {
    const document = await contentServices.getDocument(id, request.signal);
    const file = document.data?.element?.file;
    if (document.status !== "success" || !file) {
      return Response.json({ message: "Файл документа не найден" }, { status: 404 });
    }

    const fileId = file.id;
    let response: Response;
    if (typeof fileId === "number" && Number.isSafeInteger(fileId) && fileId > 0) {
      response = await contentServices.getFile(fileId, request.signal);
    } else {
      const url = storageUrl(file.url);
      if (!url) return Response.json({ message: "Файл документа не найден" }, { status: 404 });
      response = await fetch(url, { signal: request.signal, cache: "no-store", redirect: "error" });
    }

    if (!response.ok || !response.body) {
      return Response.json({ message: "Не удалось скачать файл" }, { status: response.status === 404 ? 404 : 502 });
    }

    const name = (file.name || `document-${id}`).replace(/[\\/\r\n\"]+/g, "_");
    const headers = new Headers({
      "Content-Type": response.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename="document-${id}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    });
    const length = response.headers.get("content-length");
    if (length && /^\d+$/.test(length)) headers.set("Content-Length", length);

    return new Response(response.body, { headers });
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return Response.json({ message: "Документ не найден" }, { status: 404 });
    }
    return Response.json({ message: "Не удалось скачать файл" }, { status: 502 });
  }
}
