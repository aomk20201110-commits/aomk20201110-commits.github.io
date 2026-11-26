import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Height reserved before the interactive surface mounts. */
  minHeight?: number;
  className?: string;
};

/**
 * Defers a heavy interactive instrument (SVG + sliders + observers) until it
 * approaches the viewport. The server renders the same lightweight placeholder
 * that the client renders on its first pass, so hydration stays deterministic
 * while the initial document avoids hundreds of inert nodes.
 */
export function DeferredLab({ children, minHeight = 560, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={mounted ? undefined : { minHeight }}>
      {mounted ? (
        children
      ) : (
        <div
          className="flex h-full min-h-[inherit] items-end justify-between border border-line/70 bg-panel/20 p-5"
          aria-hidden="true"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-steel/60">
            instrument
          </span>
          <span className="size-1.5 rounded-full bg-glow/50" />
        </div>
      )}
    </div>
  );
}
