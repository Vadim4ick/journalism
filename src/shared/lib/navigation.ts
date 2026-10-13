export function isActiveNavigationLink(pathname: string, href: string) {
  if (!href.startsWith("/") || href === "/") return false;

  const normalizedHref = href.replace(/\/$/, "");
  return pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);
}
