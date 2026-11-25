import { Pause, Waves } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMotionPreference } from "../../lib/motion";
import { cn } from "../../lib/cn";

export function MotionToggle({ className, withLabel = false }: { className?: string; withLabel?: boolean }) {
  const { reduced, toggle } = useMotionPreference();
  const { t } = useTranslation();
  const label = reduced ? t("common.motionReduced") : t("common.motionFull");
  const Icon = reduced ? Pause : Waves;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={reduced}
      aria-label={label}
      title={label}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] text-steel transition-colors duration-300 hover:border-glow/30 hover:text-ice",
        withLabel ? "px-3 py-1.5" : "size-8 justify-center",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {withLabel ? <span className="font-mono text-[10px] tracking-[0.1em]">{label}</span> : null}
    </button>
  );
}
