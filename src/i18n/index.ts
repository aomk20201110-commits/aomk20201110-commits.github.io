import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/en";
import { zh } from "./locales/zh";
import type { Lang } from "../lib/localized";

/** The URL is the source of truth for language; English is the default. */
function initialLanguage(): Lang {
  if (typeof window === "undefined") return "en";
  const path = window.location.pathname;
  return path === "/zh" || path.startsWith("/zh/") ? "zh" : "en";
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: initialLanguage(),
  fallbackLng: "en",
  supportedLngs: ["en", "zh"],
  load: "languageOnly",
  initAsync: false,
  interpolation: { escapeValue: false },
  returnNull: false,
});

i18n.on("languageChanged", (lng) => {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lng === "zh" ? "zh-CN" : "en";
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language === "zh" ? "zh-CN" : "en";
}

export default i18n;
