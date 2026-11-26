import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { Pause, Waves } from "lucide-react";
import { cn } from "../../lib/cn";
import { useLocale } from "../../lib/useLocale";
import { useMotionPreference } from "../../lib/motion";
import { useTheme } from "../../lib/theme";
import { useIsMobile } from "../../lib/useMediaQuery";
import { profile } from "../../data/profile";
import { CtaLink } from "../ui/Links";
import { FieldPlate } from "./FieldPlate";
import type { PointerTarget } from "../three/HeroField";

const HeroField = lazy(() => import("../three/HeroField"));

function signed(value: number) {
  return `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(2)}`;
}

function Probe({
  pointerRef,
  active,
  live,
  className,
}: {
  pointerRef: RefObject<PointerTarget>;
  active: boolean;
  live: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const xRef = useRef<HTMLSpanElement>(null);
  const yRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active || !live) return;
    let raf = 0;
    const tick = () => {
      const point = pointerRef.current;
      if (xRef.current) xRef.current.textContent = signed(point.x * 8.5);
      if (yRef.current) yRef.current.textContent = signed(point.y * 5.5);
      if (phaseRef.current) {
        const phase = (Math.atan2(point.y, point.x) * 180) / Math.PI;
        phaseRef.current.textContent = `${phase.toFixed(0)}°`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, live, pointerRef]);

  return (
    <div
      className={cn(
        "relative border border-line bg-panel/70 p-4 backdrop-blur-md md:p-5",
        className,
      )}
    >
      <span className="pointer-events-none absolute -left-px -top-px size-3 border-l border-t border-glow/70" />
      <span className="pointer-events-none absolute -right-px -top-px size-3 border-r border-t border-glow/70" />
      <span className="pointer-events-none absolute -bottom-px -left-px size-3 border-b border-l border-glow/70" />
      <span className="pointer-events-none absolute -bottom-px -right-px size-3 border-b border-r border-glow/70" />

      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow text-mist">{t("hero.fieldLabel")}</span>
        <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
          <span className="relative flex size-1.5">
            {live ? (
              <span className="anim-pulse absolute inline-flex size-full rounded-full bg-glow/70" />
            ) : null}
            <span className={cn("relative inline-flex size-1.5 rounded-full", live ? "bg-glow" : "bg-steel")} />
          </span>
          {live ? t("hero.liveField") : t("hero.staticField")}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-3 border border-line">
        <div className="border-r border-line px-3 py-2.5">
          <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">{t("hero.probeX")}</dt>
          <dd className="mt-1 font-mono text-[13px] tabular-nums text-ice">
            <span ref={xRef}>{live ? "+0.00" : "—"}</span>
          </dd>
        </div>
        <div className="border-r border-line px-3 py-2.5">
          <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">{t("hero.probeY")}</dt>
          <dd className="mt-1 font-mono text-[13px] tabular-nums text-ice">
            <span ref={yRef}>{live ? "+0.00" : "—"}</span>
          </dd>
        </div>
        <div className="px-3 py-2.5">
          <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">{t("hero.probePhase")}</dt>
          <dd className="mt-1 font-mono text-[13px] tabular-nums text-ice">
            <span ref={phaseRef}>{live ? "0°" : "—"}</span>
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-steel">
        <span>{t("hero.coordinates")}</span>
        <span className="text-glow/80">λ/10 — λ/2</span>
      </div>
    </div>
  );
}

function FieldToggle({
  live,
  onToggle,
  disabled,
}: {
  live: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  if (disabled) return null;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={live}
      className="group inline-flex items-center gap-2 border border-line bg-panel/50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-mist transition-colors hover:border-glow/50 hover:text-ice"
    >
      {live ? <Pause className="size-3.5 text-glow" aria-hidden="true" /> : <Waves className="size-3.5 text-glow" aria-hidden="true" />}
      {live ? t("hero.stopLive") : t("hero.enableLive")}
    </button>
  );
}

export default function Hero() {
  const { t } = useTranslation();
  const { lang, pick } = useLocale();
  const { reduced } = useMotionPreference();
  const { theme } = useTheme();
  const mobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const pointerRef = useRef<PointerTarget>({ x: 0, y: 0 });
  const [inView, setInView] = useState(true);
  const [live, setLive] = useState(false);

  // Defer the WebGL chunk on capable desktops. Mobile and reduced-motion
  // visitors keep the static plate unless they explicitly ask for the field.
  useEffect(() => {
    if (reduced || mobile) {
      setLive(false);
      return;
    }
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setLive(true);
    };
    const supportsIdle = typeof window.requestIdleCallback === "function";
    const handle = supportsIdle
      ? window.requestIdleCallback(enable, { timeout: 2600 })
      : window.setTimeout(enable, 1600);
    return () => {
      cancelled = true;
      if (supportsIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [mobile, reduced]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.05),
      { threshold: [0, 0.05, 0.2] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const onPointerMove = (event: PointerEvent) => {
      x = (event.clientX / window.innerWidth) * 2 - 1;
      y = -(event.clientY / window.innerHeight) * 2 + 1;
      pointerRef.current = { x, y };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        node.style.setProperty("--mx", x.toFixed(3));
        node.style.setProperty("--my", y.toFixed(3));
        raf = 0;
      });
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate min-h-[100svh] overflow-hidden border-b border-line"
      style={{ "--mx": 0, "--my": 0 } as CSSProperties}
    >
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_62%_18%,var(--c-panel-2)_0%,var(--c-ink)_46%,var(--c-void)_100%)]" />
        <div className="grid-field absolute inset-0 opacity-45 [mask-image:radial-gradient(78%_72%_at_58%_45%,black,transparent)]" />
        <div className="hero-plate-layer absolute inset-0">
          <FieldPlate className="absolute inset-0 h-full w-full opacity-90" />
        </div>
        {live ? (
          <div className="absolute inset-0 opacity-85 [mask-image:linear-gradient(to_left,black_30%,transparent_82%)]">
            <Suspense fallback={null}>
              <HeroField pointerRef={pointerRef} active={inView} light={theme === "light"} />
            </Suspense>
          </div>
        ) : null}
        <div className="hero-scrim absolute inset-0" />
        <div className="noise" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-void to-transparent" />
      <div className="pointer-events-none absolute right-5 top-1/2 z-[2] hidden -translate-y-1/2 rotate-90 font-mono text-[9px] uppercase tracking-[0.34em] text-steel/70 xl:block">
        {t("hero.sector")}
      </div>

      <div className="shell relative z-10 flex min-h-[100svh] flex-col justify-between pb-7 pt-24 md:pb-10 md:pt-28">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="relative flex size-1.5">
              <span className="anim-pulse absolute inline-flex size-full rounded-full bg-glow/60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-glow" />
            </span>
            <p className="eyebrow text-mist">{t("hero.eyebrow")}</p>
          </div>
          <p className="caption hidden text-right md:block">{t("hero.figureCaption")}</p>
        </div>

        <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-12 lg:gap-8 lg:py-10">
          <div className="lg:col-span-7">
            <h1 className="display-hero hero-title mt-2">
              <span className="block text-ice">{t("hero.line1")}</span>
              <span className="block text-gradient">{t("hero.line2")}</span>
              <span
                className={cn(
                  "block",
                  lang === "en" ? "font-serif italic tracking-[-0.02em] text-ice" : "text-gradient",
                )}
              >
                {t("hero.line3")}
              </span>
            </h1>

            <p className="lede mt-7 md:mt-9">{t("hero.lede")}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
              <CtaLink to="/research">{t("hero.ctaPrimary")}</CtaLink>
              <CtaLink to="/cv" variant="ghost">
                {t("hero.ctaSecondary")}
              </CtaLink>
            </div>
          </div>

          <div className="hidden lg:col-span-5 md:block">
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <Probe
                pointerRef={pointerRef}
                active={inView}
                live={live}
                className="hidden w-full sm:block lg:max-w-[20rem]"
              />
              <div className="flex flex-wrap items-center gap-3">
                <FieldToggle live={live} onToggle={() => setLive((value) => !value)} disabled={reduced} />
                <span className="caption max-w-[15rem]">{t("hero.figureNote")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between gap-6 border-t border-line pt-4">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
            <span>
              <span className="text-glow/80">◈</span> {pick(profile.affiliationShort)}
            </span>
            <span className="hidden sm:inline">
              {t("hero.programme")} · {pick(profile.degree)}
            </span>
            <span className="hidden md:inline">
              {t("hero.graduating")} · {profile.graduationYear}
            </span>
          </div>
          <a
            href="#statement"
            className="group hidden shrink-0 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-steel transition-colors hover:text-glow md:flex"
          >
            {t("hero.scroll")}
            <span className="h-9 w-px bg-gradient-to-b from-glow/70 to-transparent transition-all duration-500 group-hover:h-12" />
          </a>
        </div>
      </div>
    </section>
  );
}
