import { ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { profile } from "../../data/profile";
import { navigation } from "../../navigation";
import { useLocale } from "../../lib/useLocale";
import { useMotionPreference } from "../../lib/motion";
import { LocaleToggle } from "../ui/LocaleToggle";
import { MotionToggle } from "../ui/MotionToggle";
import { GithubMark, WaveMark } from "../ui/Primitives";

export function Footer() {
  const { t } = useTranslation();
  const { lang, pick } = useLocale();
  const { reduced } = useMotionPreference();

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer className="relative border-t border-white/[0.06] bg-ink/40">
      <div className="shell py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5 text-ice" aria-label={`${profile.displayName} — Home`}>
              <span className="grid size-8 place-items-center rounded-full border border-white/12 text-glow">
                <WaveMark className="size-4" />
              </span>
              <span className="font-display text-[15px] font-medium">{profile.displayName}</span>
            </Link>
            <p
              className={
                lang === "zh"
                  ? "mt-6 max-w-xs font-display text-[1.9rem] leading-[1.05] tracking-[-0.02em] text-silver"
                  : "mt-6 max-w-xs font-serif text-[1.9rem] italic leading-[1.05] text-silver"
              }
            >
              {lang === "zh" ? "场，表面与信号。" : "Fields, surfaces & signals."}
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-steel">
              {pick(profile.role)}
              <br />
              {pick(profile.affiliation)}
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h2 className="eyebrow">{t("footer.navTitle")}</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 md:grid-cols-1">
              {navigation.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="font-mono text-[11px] uppercase tracking-[0.12em] text-mist transition-colors hover:text-ice"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="eyebrow">{t("footer.elsewhereTitle")}</h2>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer noopener"
              className="group mt-5 inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-ice"
            >
              <GithubMark className="size-4 text-steel transition-colors group-hover:text-glow" />
              {profile.links.github.replace(/^https?:\/\//, "")}
            </a>

            <h2 className="eyebrow mt-9">{t("footer.siteTitle")}</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[13px] text-steel">{t("footer.languageTitle")}</span>
                <LocaleToggle />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[13px] text-steel">{t("footer.motionTitle")}</span>
                <MotionToggle withLabel />
              </div>
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="mt-16 select-none overflow-hidden font-display text-[clamp(3rem,13vw,11rem)] font-medium leading-[0.8] tracking-[-0.05em] text-white/[0.035]"
        >
          YURIPPE
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/[0.06] pt-6 text-[11px] text-steel sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono tracking-[0.08em]">{t("footer.copyright")}</p>
          <p className="font-mono tracking-[0.08em]">{t("footer.builtWith")}</p>
          <button
            type="button"
            onClick={backToTop}
            className="inline-flex items-center gap-1.5 self-start font-mono text-[10px] uppercase tracking-[0.14em] text-mist transition-colors hover:text-glow sm:self-auto"
          >
            {t("footer.backToTop")}
            <ArrowUp className="size-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
