import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocale } from "../../lib/useLocale";
import { switchLocalePath } from "../../lib/routes";
import { cn } from "../../lib/cn";

const options = [
  { code: "en" as const, label: "EN" },
  { code: "zh" as const, label: "中文" },
];

export function LocaleToggle({ className }: { className?: string }) {
  const { lang } = useLocale();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const choose = (next: "en" | "zh") => {
    if (next === lang) return;
    void i18n.changeLanguage(next);
    const target = switchLocalePath(location.pathname, next);
    navigate(`${target}${location.search}${location.hash}`);
  };

  return (
    <div
      className={cn("inline-flex items-center rounded-full border border-line p-0.5", className)}
      role="group"
      aria-label="Language / 语言"
    >
      {options.map((option) => (
        <button
          key={option.code}
          type="button"
          onClick={() => choose(option.code)}
          aria-pressed={lang === option.code}
          className={cn(
            "rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] transition-colors duration-300",
            lang === option.code ? "bg-ice text-void" : "text-steel hover:text-ice",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
