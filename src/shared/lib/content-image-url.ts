export function contentImageUrl(path: string | null | undefined) {
  if (!path) return undefined;
  const base = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!base) return undefined;
  try {
    const url = new URL(path, `${base.replace(/\/$/, "")}/`);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}
