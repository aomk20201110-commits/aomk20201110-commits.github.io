import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { Lang, Localized } from "./localized";
import { withLocale } from "./routes";

export function useLocale() {
  const { i18n } = useTranslation();
  const lang: Lang = i18n.resolvedLanguage?.startsWith("zh") ? "zh" : "en";

  const setLang = useCallback(
    (next: Lang) => {
      void i18n.changeLanguage(next);
    },
    [i18n],
  );

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "zh" : "en");
  }, [lang, setLang]);

  const pick = useCallback(<T,>(value: Localized<T>): T => value[lang], [lang]);

  const tx = useCallback(
    (value: Localized<string> | string): string => (typeof value === "string" ? value : value[lang]),
    [lang],
  );

  const href = useCallback((path: string): string => withLocale(path, lang), [lang]);

  return { lang, setLang, toggleLang, pick, tx, href };
}
