import config from "../../site.config.json";
import type { Lang } from "./localized";

export const siteConfig = config;

export type PageKey = (typeof config.pages)[number]["key"] | "notFound";

export type PageSeo = {
  key: string;
  path: string;
  title: string;
  description: string;
};

function findPage(key: PageKey) {
  return config.pages.find((page) => page.key === key);
}

export function pageSeo(key: Exclude<PageKey, "notFound">, lang: Lang): PageSeo {
  const page = findPage(key);
  if (!page) throw new Error(`Unknown page key: ${key}`);
  return {
    key,
    path: page.path,
    title: page.title[lang],
    description: page.description[lang],
  };
}

export function notFoundSeo(lang: Lang): PageSeo {
  return {
    key: "notFound",
    path: "/404",
    title: config.notFound.title[lang],
    description: config.notFound.description[lang],
  };
}

export function pageIndex(key: string): string {
  return findPage(key as PageKey)?.index ?? "—";
}

export function fullTitle(title: string): string {
  return `${title} — ${config.site.name}`;
}

export function ogLocale(lang: Lang): { locale: string; alternate: string } {
  return lang === "zh"
    ? { locale: "zh_CN", alternate: "en_US" }
    : { locale: "en_US", alternate: "zh_CN" };
}
