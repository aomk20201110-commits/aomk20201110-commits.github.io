import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { langFromPath } from "../../lib/routes";

/**
 * Keeps i18next in sync with the URL. The URL is the source of truth for
 * language so that both server-rendered shells and client navigation agree.
 */
export function LangSync() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    const next = langFromPath(pathname);
    if (i18n.resolvedLanguage?.startsWith(next)) return;
    void i18n.changeLanguage(next);
  }, [pathname, i18n]);

  return null;
}
