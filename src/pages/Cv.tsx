import { useTranslation } from "react-i18next";
import { Printer } from "lucide-react";
import { Page } from "../components/layout/Page";
import { PageHeader } from "../components/ui/PageHeader";
import { CtaLink } from "../components/ui/Links";
import { useLocale } from "../lib/useLocale";
import { profile } from "../data/profile";
import { education, honors } from "../data/honors";
import { projects } from "../data/projects";
import { skillGroups } from "../data/skills";
import { certifications } from "../data/certifications";
import { service } from "../data/service";
import { siteConfig } from "../lib/seo";

const cvHref = `${import.meta.env.BASE_URL}${siteConfig.cv.pdf.replace(/^\//, "")}`;

export default function Cv() {
  const { t } = useTranslation();
  const { pick } = useLocale();
  const degree = education[0];
  const interests = pick(profile.interests);
  const experience = [...projects].sort((a, b) => b.year - a.year || a.id.localeCompare(b.id));

  return (
    <Page meta={{ route: "cv" }}>
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
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-steel">
                {t("cv.downloadNote")}
              </p>
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
          <header className="flex flex-col gap-6 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-glow/70">
                Curriculum vitae
              </p>
              <h2 className="mt-2 font-display text-4xl tracking-[-0.03em] text-ice md:text-5xl">
                {profile.displayName}
              </h2>
              <p className="mt-2 text-sm text-mist">{pick(profile.role)}</p>
              <p className="mt-1 text-sm text-steel">{pick(profile.affiliation)}</p>
            </div>
            <dl className="grid gap-1.5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-steel md:text-right">
              <div>
                <dt className="sr-only">GitHub</dt>
                <dd>
                  <a
                    href={profile.links.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-mist underline decoration-line underline-offset-4 transition-colors hover:text-glow"
                  >
                    {t("cv.githubLink")}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">{t("cv.updatedLabel")}</dt>
                <dd>
                  {pick(profile.location)} · {t("cv.updatedLabel")} {profile.updated}
                </dd>
              </div>
              <div>
                <dt className="sr-only">{t("cv.institutionLabel")}</dt>
                <dd>{pick(profile.affiliationShort)}</dd>
              </div>
            </dl>
          </header>

          <div className="cv-columns mt-7">
            <aside className="cv-aside">
              <section>
                <h3 className="eyebrow text-glow/80">{t("cv.summaryTitle")}</h3>
                <p className="mt-2 text-[0.92em] leading-relaxed text-mist">{t("about.bioP1")}</p>
              </section>

              <section>
                <h3 className="eyebrow text-glow/80">{t("cv.interestsTitle")}</h3>
                <p className="mt-2 text-[0.92em] leading-relaxed text-mist">
                  {interests.join(" · ")}
                </p>
              </section>

              <section>
                <h3 className="eyebrow text-glow/80">{t("cv.skillsTitle")}</h3>
                <dl className="mt-2 space-y-2">
                  {skillGroups.map((group) => (
                    <div key={group.id}>
                      <dt className="text-[0.92em] leading-snug text-ice">{pick(group.title)}</dt>
                      <dd className="mt-0.5 text-[0.84em] leading-relaxed text-steel">
                        {group.items.join(" · ")}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-2 font-mono text-[0.72em] leading-relaxed tracking-[0.08em] text-steel">
                  {t("cv.skillsNote")}
                </p>
              </section>

              <section>
                <h3 className="eyebrow text-glow/80">{t("cv.certificationsTitle")}</h3>
                <dl className="mt-2 space-y-1.5">
                  {certifications.map((entry) => (
                    <div key={entry.id} className="flex items-baseline justify-between gap-3">
                      <dt className="text-[0.86em] leading-snug text-mist">{pick(entry.title)}</dt>
                      <dd className="shrink-0 font-mono text-[0.8em] uppercase tracking-[0.08em] text-ice">
                        {pick(entry.result)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section>
                <h3 className="eyebrow text-glow/80">{t("cv.activitiesTitle")}</h3>
                <ul className="mt-2 space-y-2">
                  {service.map((entry) => (
                    <li key={entry.id}>
                      <p className="text-[0.86em] leading-snug text-mist">{pick(entry.title)}</p>
                      <p className="mt-0.5 font-mono text-[0.72em] uppercase tracking-[0.08em] text-steel">
                        {pick(entry.period)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>

            <div className="cv-main">
              <section>
                <h3 className="eyebrow text-glow/80">{t("cv.educationTitle")}</h3>
                <div className="mt-2 border-t border-line pt-2">
                  <div className="cv-degree-row flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-display text-[1.15em] text-ice">{pick(degree.title)}</h4>
                    <p className="font-mono text-[0.78em] uppercase tracking-[0.1em] text-glow/70">
                      {pick(degree.period)}
                    </p>
                  </div>
                  <p className="mt-0.5 text-[0.9em] text-mist">{pick(degree.institution)}</p>
                  <p className="mt-1 font-mono text-[0.74em] uppercase tracking-[0.1em] text-steel">
                    {t("cv.statusLabel")} · {t("honors.inProgress")}
                  </p>
                </div>
              </section>

              <section>
                <h3 className="eyebrow text-glow/80">{t("cv.researchTitle")}</h3>
                <ol className="mt-2 border-t border-line">
                  {experience.map((project) => (
                    <li key={project.id} className="border-b border-line py-2.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <h4 className="text-[0.95em] leading-snug text-ice">{pick(project.title)}</h4>
                        <span className="font-mono text-[0.72em] uppercase tracking-[0.08em] text-steel">
                          {pick(project.period)} · {pick(project.status)}
                        </span>
                      </div>
                      <p className="mt-1 text-[0.85em] leading-relaxed text-mist">
                        {pick(project.summary)}
                      </p>
                      <p className="mt-0.5 font-mono text-[0.7em] tracking-[0.04em] text-steel">
                        {project.tools.join(" · ")}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <h3 className="eyebrow text-glow/80">{t("cv.honoursTitle")}</h3>
                <ol className="mt-2 border-t border-line">
                  {honors.map((honor) => (
                    <li key={honor.id} className="border-b border-line py-1.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                        <p className="text-[0.86em] leading-snug text-mist">{pick(honor.title)}</p>
                        <p className="font-mono text-[0.72em] uppercase tracking-[0.06em] text-ice">
                          {honor.rank ? pick(honor.rank) : pick(honor.period)}
                        </p>
                      </div>
                      <p className="mt-0.5 font-mono text-[0.68em] uppercase tracking-[0.06em] text-steel">
                        {pick(honor.organisation)} · {pick(honor.period)}
                      </p>
                    </li>
                  ))}
                </ol>
                <p className="mt-1.5 font-mono text-[0.7em] leading-relaxed tracking-[0.04em] text-steel">
                  {t("cv.honoursNote")}
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
