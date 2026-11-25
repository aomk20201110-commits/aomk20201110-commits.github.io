import { useLocale } from "../../lib/useLocale";
import { cn } from "../../lib/cn";

export function LocaleToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLocale();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/[0.02] p-0.5",
        className,
      )}
      role="group"
      aria-label="Language / 语言"
    >
      {(["en", "zh"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={cn(
            "rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] transition-colors duration-300",
            lang === code ? "bg-ice text-void" : "text-steel hover:text-ice",
          )}
        >
          {code === "en" ? "EN" : "中文"}
        </button>
      ))}
    </div>
  );
}
