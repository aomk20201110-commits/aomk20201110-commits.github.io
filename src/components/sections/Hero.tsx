import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";
import { useLocale } from "../../lib/useLocale";
import { profile } from "../../data/profile";
import { CtaLink } from "../ui/Links";
import type { PointerTarget } from "../three/HeroField";

const HeroField = lazy(() => import("../three/HeroField"));

function signed(value: number) {
  return `${value >= 0 ? "+" : "−"}${Math.abs(value).toFixed(2)}`;
}

function Probe({
  pointerRef,
  active,
  className,
}: {
  pointerRef: React.RefObject<PointerTarget>;
  active: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const xRef = useRef<HTMLSpanElement>(null);
  const yRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active) return;
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
  }, [active, pointerRef]);

  return (
    <div className={cn("relative border border-white/10 bg-void/40 p-4 backdrop-blur-md md:p-5", className)}>
      <span className="pointer-events-none absolute -left-px -top-px size-3 border-l border-t border-glow/70" />
      <span className="pointer-events-none absolute -right-px -top-px size-3 border-r border-t border-glow/70" />
      <span className="pointer-events-none absolute -bottom-px -left-px size-3 border-b border-l border-glow/70" />
      <span className="pointer-events-none absolute -bottom-px -right-px size-3 border-b border-r border-glow/70" />

      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow text-mist">{t("hero.fieldLabel")}</span>
        <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
          <span className="relative flex size-1.5">
            <span className="anim-pulse absolute inline-flex size-full rounded-full bg-glow/70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-glow" />
          </span>
          {t("hero.liveModel")}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-3 border border-white/10">
        <div className="border-r border-white/10 px-3 py-2.5">
          <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">{t("hero.probeX")}</dt>
          <dd className="mt-1 font-mono text-[13px] tabular-nums text-ice">
            <span ref={xRef}>+0.00</span>
          </dd>
        </div>
        <div className="border-r border-white/10 px-3 py-2.5">
          <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">{t("hero.probeY")}</dt>
          <dd className="mt-1 font-mono text-[13px] tabular-nums text-ice">
            <span ref={yRef}>+0.00</span>
          </dd>
        </div>
        <div className="px-3 py-2.5">
          <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">{t("hero.probePhase")}</dt>
          <dd className="mt-1 font-mono text-[13px] tabular-nums text-ice">
            <span ref={phaseRef}>0°</span>
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-steel">
        <span>{t("hero.coordinates")}</span>
        <span className="text-glow/70">λ/10 — λ/2</span>
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useTranslation();
  const { lang, pick } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const pointerRef = useRef<PointerTarget>({ x: 0, y: 0 });
  const [active, setActive] = useState(true);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting && entry.intersectionRatio > 0.05);
      },
      { threshold: [0, 0.05, 0.2] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <section id="top" ref={sectionRef} className="relative isolate min-h-[100svh] overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(130%_95%_at_50%_-12%,#0a2029_0%,#050b10_48%,#04070a_100%)]" />
        <div className="absolute right-[-8%] top-[12%] h-[64%] w-[60%] rounded-full bg-[radial-gradient(circle,rgba(46,125,143,0.32),transparent_68%)] blur-2xl" />
        <div className="grid-field absolute inset-0 opacity-40 [mask-image:radial-gradient(75%_65%_at_50%_45%,black,transparent)]" />
      </div>

      <div aria-hidden="true" className="absolute inset-0">
        <Suspense fallback={null}>
          <HeroField pointerRef={pointerRef} active={active} />
        </Suspense>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(4,7,10,0.92)_0%,rgba(4,7,10,0.55)_30%,rgba(4,7,10,0.08)_62%,transparent_100%)]" />
      <div className="noise" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-void via-void/60 to-transparent" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_200px_70px_rgba(4,7,10,0.72)]" />

      <div className="shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-7 pt-28 md:pb-10 md:pt-36">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3">
              <span className="relative flex size-1.5">
                <span className="anim-pulse absolute inline-flex size-full rounded-full bg-glow/60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-glow" />
              </span>
              <p className="eyebrow text-mist">{t("hero.eyebrow")}</p>
            </div>

            <h1 className="mt-6 font-display text-[clamp(2.9rem,9.4vw,8.4rem)] font-medium leading-[0.88] tracking-[-0.06em] md:mt-8">
              <span className="text-gradient block">{t("hero.line1")}</span>
              <span className="text-gradient block">{t("hero.line2")}</span>
              <span
                className={cn(
                  "block",
                  lang === "en"
                    ? "font-serif italic tracking-[-0.02em] text-ice"
                    : "text-gradient",
                )}
              >
                {t("hero.line3")}
              </span>
            </h1>

            <p className="mt-7 max-w-[36rem] text-[15px] leading-[1.75] text-mist md:mt-9 md:text-base">
              {t("hero.lede")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-9">
              <CtaLink to="/research">{t("hero.ctaPrimary")}</CtaLink>
              <CtaLink to="/cv" variant="ghost">
                {t("hero.ctaSecondary")}
              </CtaLink>
            </div>
          </div>

          <div className="lg:col-span-4 lg:pb-2">
            <Probe pointerRef={pointerRef} active={active} className="w-full lg:ml-auto lg:max-w-[19rem]" />
          </div>
        </div>

        <div className="mt-12 flex items-end justify-between gap-6 border-t border-white/[0.09] pt-4 md:mt-16">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
            <span>
              <span className="text-glow/70">◈</span> {pick(profile.affiliationShort)}
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
