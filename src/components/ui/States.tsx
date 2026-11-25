import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";
import { usePreview } from "../../lib/preview";

export function PreviewBanner() {
  const { t } = useTranslation();
  const { preview, exit } = usePreview();
  if (!preview) return null;

  return (
    <div className="border-y border-glow/25 bg-glow/[0.05]">
      <div className="shell flex flex-wrap items-center justify-between gap-3 py-2.5">
        <p className="flex items-start gap-2.5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-glow/90">
          <span className="mt-1 inline-block size-1.5 shrink-0 bg-glow" aria-hidden="true" />
          {t("common.previewNotice")}
        </p>
        <button
          type="button"
          onClick={exit}
          className="shrink-0 border border-glow/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-glow transition-colors hover:bg-glow/10"
        >
          {t("common.previewExit")}
        </button>
      </div>
    </div>
  );
}

export function SampleBadge({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex items-center border border-amber-300/40 bg-amber-300/[0.06] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-200/90",
        className,
      )}
    >
      {t("common.sample")}
    </span>
  );
}

export function EmptyState({
  index = "00",
  title,
  body,
  hint,
  action,
  className,
}: {
  index?: string;
  title: string;
  body: string;
  hint?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden border border-line bg-panel/20 px-6 py-14 md:px-10 md:py-20", className)}>
      <div className="dot-field absolute inset-0 opacity-40" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(70%_90%_at_85%_10%,rgba(111,216,236,0.08),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="relative max-w-2xl">
        <span className="font-mono text-[10px] tracking-[0.18em] text-glow/60">{index}</span>
        <h2 className="mt-4 font-display text-2xl tracking-[-0.02em] text-ice md:text-3xl">{title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-mist md:text-[15px]">{body}</p>
        {hint ? (
          <p className="mt-6 max-w-lg font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-steel">
            {hint}
          </p>
        ) : null}
        {action ? <div className="mt-8">{action}</div> : null}
      </div>
    </div>
  );
}
