import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/en";
import { zh } from "./locales/zh";
import { isLang, type Lang } from "../lib/localized";

const STORAGE_KEY = "yr.lang";

function initialLanguage(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    /* storage can be unavailable in private modes */
  }
  /* English is the default regardless of the browser locale. */
  return "en";
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
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* ignore */
  }
  document.documentElement.lang = lng === "zh" ? "zh-CN" : "en";
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language === "zh" ? "zh-CN" : "en";
}

export default i18n;
