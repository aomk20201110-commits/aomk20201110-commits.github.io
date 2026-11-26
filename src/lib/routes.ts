import type { Lang } from "./localized";

/** Localised routes: English lives at `/`, Chinese under `/zh`. */
export function langFromPath(pathname: string): Lang {
  return pathname === "/zh" || pathname.startsWith("/zh/") ? "zh" : "en";
}

/** Removes the locale prefix from a pathname. */
export function stripLocale(pathname: string): string {
  if (pathname === "/zh") return "/";
  if (pathname.startsWith("/zh/")) return pathname.slice(3);
  return pathname || "/";
}

/**
 * Prefixes an internal path with the active locale. External URLs, mailto
 * links and plain hashes are returned unchanged.
 */
export function withLocale(path: string, lang: Lang): string {
  if (/^(?:https?:)?\/\//.test(path) || path.startsWith("mailto:") || path.startsWith("tel:")) {
    return path;
  }
  const hashIndex = path.indexOf("#");
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const beforeHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const queryIndex = beforeHash.indexOf("?");
  const query = queryIndex >= 0 ? beforeHash.slice(queryIndex) : "";
  const pathname = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;
  const prefix = lang === "zh" ? "/zh" : "";
  const normalised = pathname === "/" ? "" : pathname;
  const full = `${prefix}${normalised}` || "/";
  return `${full}${query}${hash}`;
}

/** Path to the same page in the other language. */
export function switchLocalePath(pathname: string, lang: Lang): string {
  return withLocale(stripLocale(pathname), lang);
}

/** Canonical absolute URL for a locale-free page path. */
export function canonicalUrl(siteUrl: string, path: string, lang: Lang): string {
  const base = siteUrl.replace(/\/+$/, "");
  const localised = withLocale(path, lang);
  return localised === "/" ? `${base}/` : `${base}${localised}/`;
}

/** True when a pathname already starts with the locale prefix. */
export function hasLocalePrefix(pathname: string): boolean {
  return pathname === "/zh" || pathname.startsWith("/zh/");
}
