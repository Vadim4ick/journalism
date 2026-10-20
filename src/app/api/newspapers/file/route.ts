function storageUrl(path: string): URL | null {
  const base = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!base || !path.startsWith("/storage/")) return null;

  try {
    const origin = new URL(base).origin;
    const url = new URL(path, origin);
    return url.origin === origin && url.pathname.startsWith("/storage/")
      ? url
      : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const url = storageUrl(query.get("path") || "");
  if (!url) {
    return Response.json({ message: "Файл выпуска не найден" }, { status: 404 });
  }

  const rawName = query.get("name") || url.pathname.split("/").at(-1) || "issue";
  const name = rawName.slice(0, 255).replace(/[\\/\r\n"]+/g, "_");
  const extension = query.get("extension")?.trim().replace(/^\./, "").toLowerCase() || "";
  const isPdf = extension === "pdf";
  const fallbackName = `issue${/^[a-z0-9]{1,12}$/.test(extension) ? `.${extension}` : ""}`;
  const range = request.headers.get("range");

  try {
    const response = await fetch(url, {
      signal: request.signal,
      cache: "no-store",
      redirect: "error",
      headers: range && /^bytes=\d*-\d*$/.test(range) ? { Range: range } : undefined,
    });
    if (!response.ok || !response.body) {
      return Response.json(
        { message: "Не удалось загрузить файл выпуска" },
        { status: response.status === 404 ? 404 : 502 },
      );
    }

    const headers = new Headers({
      "Content-Type": isPdf ? "application/pdf" : "application/octet-stream",
      "Content-Disposition": `${isPdf ? "inline" : "attachment"}; filename="${fallbackName}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    });
    for (const header of ["content-length", "content-range", "accept-ranges"]) {
      const value = response.headers.get(header);
      if (value) headers.set(header, value);
    }

    return new Response(response.body, { status: response.status, headers });
  } catch {
    return Response.json({ message: "Не удалось загрузить файл выпуска" }, { status: 502 });
  }
}
