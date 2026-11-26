import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { navigation } from "../../navigation";
import { visibleNavigation } from "../../lib/content";
import { stripLocale } from "../../lib/routes";
import { profile } from "../../data/profile";
import { cn } from "../../lib/cn";
import { useLocale } from "../../lib/useLocale";
import { LocaleToggle } from "../ui/LocaleToggle";
import { MotionToggle } from "../ui/MotionToggle";
import { ThemeToggle } from "../ui/ThemeToggle";
import { GithubMark, WaveMark } from "../ui/Primitives";
import { ScrollProgress } from "./ScrollProgress";

export function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { pick, href } = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const links = visibleNavigation.length > 1 ? visibleNavigation : navigation;
  const barePath = stripLocale(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const first = menuRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (path: string) =>
    path === "/" ? barePath === "/" : barePath === path || barePath.startsWith(`${path}/`);

  return (
    <>
      <header
        className={cn(
          "site-header fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled || open
            ? "glass border-b border-white/[0.06]"
            : "border-b border-transparent bg-gradient-to-b from-void/70 to-transparent",
        )}
      >
        <div className="shell flex h-16 items-center justify-between gap-4 md:h-20">
          <Link
            to={href("/")}
            onClick={() => setOpen(false)}
            className="group flex shrink-0 items-center gap-2.5"
          >
            <span className="grid size-8 place-items-center rounded-full border border-white/12 text-glow transition-colors duration-500 group-hover:border-glow/50 md:size-9">
              <WaveMark className="size-4" />
            </span>
            <span className="font-display text-[15px] font-medium tracking-[-0.01em] text-ice">
              {profile.displayName}
            </span>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-steel sm:inline">
              / {pick(profile.affiliationShort)}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-7">
              {links.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={href(item.path)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors duration-300",
                        active ? "text-ice" : "text-steel hover:text-ice",
                      )}
                    >
                      {t(`nav.${item.key}`)}
                      <span
                        className={cn(
                          "absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-glow transition-opacity duration-300",
                          active ? "opacity-100" : "opacity-0",
                        )}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <LocaleToggle />
            <div className="hidden md:inline-flex">
              <MotionToggle />
            </div>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              title="GitHub"
              className="hidden size-8 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-steel transition-colors duration-300 hover:border-glow/30 hover:text-ice md:grid"
            >
              <GithubMark className="size-3.5" />
            </a>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t("common.close") : t("common.menu")}
              className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-ice transition-colors duration-300 hover:border-glow/30 lg:hidden"
            >
              {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
        <ScrollProgress />
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              aria-label={t("common.close")}
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="absolute inset-0 cursor-default bg-void/94 backdrop-blur-xl"
            />
            <motion.div
              ref={menuRef}
              className="relative flex h-full flex-col justify-between overflow-y-auto pb-8 pt-24"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <nav aria-label="Mobile" className="shell">
                <ul className="border-t border-white/8">
                  {links.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <li key={item.path} className="border-b border-white/8">
                        <Link
                          to={href(item.path)}
                          onClick={() => setOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className="group flex items-baseline gap-4 py-3.5"
                        >
                          <span
                            className={cn(
                              "font-mono text-[10px] tracking-[0.16em]",
                              active ? "text-glow" : "text-steel",
                            )}
                          >
                            {item.index}
                          </span>
                          <span
                            className={cn(
                              "font-display text-[clamp(1.6rem,7vw,2.3rem)] leading-none tracking-[-0.03em] transition-colors duration-300",
                              active ? "text-ice" : "text-mist group-hover:text-ice",
                            )}
                          >
                            {t(`nav.${item.key}`)}
                          </span>
                          {active ? (
                            <span className="ml-auto size-1.5 rounded-full bg-glow" aria-hidden="true" />
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="shell mt-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="eyebrow">{t("common.theme")}</span>
                  <ThemeToggle withLabel />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="eyebrow">{t("footer.languageTitle")}</span>
                  <LocaleToggle />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="eyebrow">{t("footer.motionTitle")}</span>
                  <MotionToggle withLabel />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-6">
                  <a
                    href={profile.links.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mist"
                  >
                    <GithubMark className="size-4" />
                    GitHub
                  </a>
                  <span className="font-mono text-[10px] tracking-[0.14em] text-steel">
                    {pick(profile.affiliationShort)} / {profile.graduationYear}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
