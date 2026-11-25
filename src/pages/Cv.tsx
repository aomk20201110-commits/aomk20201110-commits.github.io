import { useTranslation } from "react-i18next";
import { Printer } from "lucide-react";
import { Page } from "../components/layout/Page";
import { PageHeader } from "../components/ui/PageHeader";
import { CtaLink } from "../components/ui/Links";
import { Tag } from "../components/ui/Primitives";
import { useLocale } from "../lib/useLocale";
import { profile } from "../data/profile";
import { education } from "../data/honors";
import { researchAreas } from "../data/research";

const cvHref = `${import.meta.env.BASE_URL}cv/Yurripe-CV.pdf`;

export default function Cv() {
  const { t } = useTranslation();
  const { pick } = useLocale();
  const degree = education[0];

  return (
    <Page meta={{ title: t("meta.cvTitle"), description: t("meta.cvDesc"), path: "/cv" }}>
      <div className="no-print">
        <PageHeader
          index="05"
          eyebrow={t("cv.eyebrow")}
          title={t("cv.title")}
          lede={t("cv.lede")}
          aside={
            <div className="flex flex-col items-start gap-3 md:items-end">
              <CtaLink href={cvHref} download>
                {t("cv.download")}
              </CtaLink>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-steel">{t("cv.downloadNote")}</p>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-steel transition-colors hover:text-glow"
              >
                <Printer className="size-3.5" aria-hidden="true" />
                {t("cv.print")}
              </button>
            </div>
          }
        />
      </div>

      <div className="cv-page shell pb-24">
        <article className="cv-sheet print-sheet mt-2 border border-line bg-panel/20 p-6 md:p-10 lg:p-12">
          <header className="flex flex-col gap-8 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-glow/70">Curriculum vitae</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.03em] text-ice md:text-5xl">
                {profile.displayName}
              </h2>
              <p className="mt-3 text-sm text-mist">{pick(profile.role)}</p>
              <p className="mt-1 text-sm text-steel">{pick(profile.affiliation)}</p>
            </div>
            <dl className="grid gap-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-steel md:text-right">
              <div>
                <dt className="sr-only">GitHub</dt>
                <dd>
                  <a
                    href={profile.links.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-mist underline decoration-line underline-offset-4 transition-colors hover:text-glow"
                  >
                    @aomk20201110-commits
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">{t("cv.updatedLabel")}</dt>
                <dd>
                  {t("cv.updatedLabel")} · {profile.updated}
                </dd>
              </div>
              <div>
                <dt className="sr-only">{t("cv.institutionLabel")}</dt>
                <dd>{pick(profile.affiliationShort)}</dd>
              </div>
            </dl>
          </header>

          <div className="cv-columns mt-8 grid gap-10 md:grid-cols-12 md:gap-10">
            <aside className="space-y-8 md:col-span-4">
              <section>
                <h3 className="eyebrow text-glow/80">{t("cv.profileTitle")}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{t("about.bioP1")}</p>
              </section>

              <section>
                <h3 className="eyebrow text-glow/80">{t("cv.linksTitle")}</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <a
                      href={profile.links.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-mist transition-colors hover:text-glow"
                    >
                      GitHub · @aomk20201110-commits
                    </a>
                  </li>
                </ul>
                <p className="mt-3 font-mono text-[9px] leading-relaxed tracking-[0.12em] text-steel">
                  {t("cv.contactNote")}
                </p>
              </section>

              <section>
                <h3 className="eyebrow text-glow/80">{t("cv.focusTitle")}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {researchAreas.map((area) => (
                    <Tag key={area.id}>{pick(area.title)}</Tag>
                  ))}
                </div>
              </section>
            </aside>

            <div className="space-y-10 md:col-span-8">
              <section>
                <h3 className="eyebrow text-glow/80">{t("cv.educationTitle")}</h3>
                <div className="mt-4 border-t border-line pt-4">
                  <div className="cv-degree-row flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-display text-lg text-ice">{pick(degree.title)}</h4>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-glow/70">
                      {pick(degree.period)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-mist">{pick(degree.institution)}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-steel">
                    <div>
                      <dt>{t("cv.institutionLabel")}</dt>
                      <dd className="mt-1 text-mist">{pick(profile.affiliationShort)}</dd>
                    </div>
                    <div>
                      <dt>{t("cv.statusLabel")}</dt>
                      <dd className="mt-1 text-mist">{t("honors.inProgress")}</dd>
                    </div>
                  </dl>
                </div>
              </section>

              <section>
                <h3 className="eyebrow text-glow/80">{t("cv.interestsTitle")}</h3>
                <ol className="mt-4 border-t border-line">
                  {researchAreas.map((area) => (
                    <li key={area.id} className="grid gap-2 border-b border-line py-4 sm:grid-cols-[auto_1fr] sm:gap-4">
                      <span className="font-mono text-[10px] tracking-[0.16em] text-glow/60">{area.index}</span>
                      <div>
                        <p className="text-sm text-ice">{pick(area.title)}</p>
                        <p className="mt-1 text-xs leading-relaxed text-steel">{pick(area.short)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <h3 className="eyebrow text-glow/80">{t("cv.degreeLabel")}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">
                  {pick(profile.degree)} · {pick(profile.graduation)} · {pick(profile.field)}
                </p>
              </section>
            </div>
          </div>
        </article>

        <p className="no-print mt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-steel">
          {t("cv.printNote")}
        </p>
      </div>
    </Page>
  );
}
