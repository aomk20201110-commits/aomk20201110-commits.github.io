import { useEffect } from "react";
import config from "../../../site.config.json";
import { fullTitle, notFoundSeo, ogLocale, pageSeo, type PageKey } from "../../lib/seo";
import { canonicalUrl, switchLocalePath } from "../../lib/routes";
import { useLocale } from "../../lib/useLocale";

export type PageMetaProps = {
  route: PageKey;
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

function setAlternate(hreflang: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
  if (!element) {
    element = document.createElement("link");
    element.rel = "alternate";
    element.hreflang = hreflang;
    document.head.appendChild(element);
  }
  if (element.getAttribute("href") !== href) element.setAttribute("href", href);
}

/**
 * Per-page metadata, updated in place so the pre-rendered tags and the client
 * never disagree or duplicate.
 */
export function PageMeta({ route, noindex = false }: PageMetaProps) {
  const { lang } = useLocale();

  useEffect(() => {
    const seo = route === "notFound" ? notFoundSeo(lang) : pageSeo(route, lang);
    const base = config.site.url.replace(/\/+$/, "");
    const title = fullTitle(seo.title);
    const canonical = route === "notFound" ? "" : canonicalUrl(config.site.url, seo.path, lang);
    const image = `${base}${config.site.ogImage}`;
    const robots = noindex || route === "notFound" ? "noindex, nofollow" : "index, follow";
    const { locale, alternate } = ogLocale(lang);

    document.title = title;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    setMeta("name", "description", seo.description);
    setMeta("name", "robots", robots);
    setMeta("name", "googlebot", robots);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", config.site.name);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:url", canonical || base);
    setMeta("property", "og:image", image);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta("property", "og:image:alt", `${config.site.name} — academic portfolio`);
    setMeta("property", "og:locale", locale);
    setMeta("property", "og:locale:alternate", alternate);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", seo.description);
    setMeta("name", "twitter:image", image);

    const canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (route === "notFound") {
      canonicalLink?.remove();
    } else if (canonicalLink) {
      canonicalLink.setAttribute("href", canonical);
    } else {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = canonical;
      document.head.appendChild(link);
    }

    if (route !== "notFound") {
      const enPath = switchLocalePath(seo.path, "en");
      const zhPath = switchLocalePath(seo.path, "zh");
      setAlternate("en", canonicalUrl(config.site.url, enPath, "en"));
      setAlternate("zh", canonicalUrl(config.site.url, zhPath, "zh"));
      setAlternate("x-default", canonicalUrl(config.site.url, enPath, "en"));
    }
  }, [route, noindex, lang]);

  return null;
}
