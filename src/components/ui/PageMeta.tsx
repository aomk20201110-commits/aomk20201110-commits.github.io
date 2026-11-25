import { useEffect } from "react";
import { profile } from "../../data/profile";
import { useLocale } from "../../lib/useLocale";

export type PageMetaProps = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  if (element.getAttribute("content") !== content) element.setAttribute("content", content);
}

/**
 * Per-page metadata.
 *
 * The tags already exist in index.html as a static fallback for the home page,
 * so this updates them in place rather than rendering duplicates. React 19
 * would hoist a second <meta> next to the static one, which produces
 * conflicting robots / canonical / Open Graph values.
 */
export function PageMeta({ title, description, path, noindex = false }: PageMetaProps) {
  const { lang } = useLocale();

  useEffect(() => {
    const fullTitle = `${title} — ${profile.displayName}`;
    const base = profile.siteUrl.replace(/\/$/, "");
    const canonical = path === "/" ? `${base}/` : `${base}${path}`;
    const image = `${base}/og.png`;
    const robots = noindex ? "noindex, nofollow" : "index, follow";
    const locale = lang === "zh" ? "zh_CN" : "en_US";
    const alternate = lang === "zh" ? "en_US" : "zh_CN";

    document.title = fullTitle;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    setMeta("name", "description", description);
    setMeta("name", "robots", robots);
    setMeta("name", "googlebot", robots);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", profile.displayName);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", image);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta("property", "og:image:alt", `${profile.displayName} — academic portfolio`);
    setMeta("property", "og:locale", locale);
    setMeta("property", "og:locale:alternate", alternate);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    if (canonicalLink.getAttribute("href") !== canonical) canonicalLink.setAttribute("href", canonical);
  }, [title, description, path, noindex, lang]);

  return null;
}
