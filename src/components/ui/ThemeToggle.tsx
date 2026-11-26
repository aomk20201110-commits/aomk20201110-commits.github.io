import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";
import { useTheme } from "../../lib/theme";

export function ThemeToggle({ withLabel = false, className }: { withLabel?: boolean; className?: string }) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const label = next === "light" ? t("common.themeLight") : t("common.themeDark");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={theme === "light"}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center gap-2 border border-line bg-transparent font-mono text-[10px] uppercase tracking-[0.12em] text-steel transition-colors duration-300 hover:border-glow/40 hover:text-ice",
        withLabel ? "rounded-full px-3 py-1.5" : "size-8 justify-center rounded-full",
        className,
      )}
    >
      {theme === "dark" ? (
        <Sun className="size-3.5" aria-hidden="true" />
      ) : (
        <Moon className="size-3.5" aria-hidden="true" />
      )}
      {withLabel ? <span>{t(next === "light" ? "common.light" : "common.dark")}</span> : null}
    </button>
  );
}
