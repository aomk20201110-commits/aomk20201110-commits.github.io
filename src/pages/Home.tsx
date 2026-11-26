import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Page } from "../components/layout/Page";
import Hero from "../components/sections/Hero";
import { FieldPlate } from "../components/sections/FieldPlate";
import { SectionHeader } from "../components/ui/PageHeader";
import { ArrowLink, CtaLink } from "../components/ui/Links";
import { Eyebrow, Tag } from "../components/ui/Primitives";
import InstrumentTabs from "../components/lab/InstrumentTabs";
import { projects } from "../data/projects";
import { honors } from "../data/honors";
import { certificationsCount } from "../data/certifications";
import { academicTimeline } from "../data/timeline";
import { profile } from "../data/profile";
import { useLocale } from "../lib/useLocale";
import { siteConfig } from "../lib/seo";

const cvHref = `${import.meta.env.BASE_URL}${siteConfig.cv.pdf.replace(/^\//, "")}`;

export default function Home() {
  const { t } = useTranslation();
  const { pick, href } = useLocale();

  const featuredProjects = [...projects]
    .sort((a, b) => b.year - a.year || a.id.localeCompare(b.id))
    .slice(0, 4);

  const featuredHonors = honors.filter((honor) => honor.featured);
  const timelineItems = academicTimeline.slice(0, 4);

  const interests = pick(profile.interests);
  const extended = pick(profile.extendedInterests);

  return (
    <Page flush meta={{ route: "home" }}>
      <Hero />

      <div className="border-b border-line bg-ink/30 md:hidden">
        <div className="shell py-6">
          <figure>
            <div className="relative aspect-[5/4] w-full overflow-hidden border border-line bg-panel/20">
              <FieldPlate variant="compact" className="h-full w-full" />
            </div>
            <figcaption className="mt-3 flex items-start justify-between gap-5">
              <span className="caption max-w-[15rem]">{t("hero.figureCaption")}</span>
              <span className="caption max-w-[9rem] text-right">{t("hero.figureNote")}</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <section id="profile" className="scroll-mt-24 border-t border-line">
        <div className="shell grid gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Eyebrow index="01">{t("home.statementEyebrow")}</Eyebrow>
            <p className="caption mt-5 max-w-[15rem] normal-case tracking-[0.06em]">
              {pick(profile.affiliation)} · {pick(profile.field)}
            </p>
          </div>

          <div className="lg:col-span-9">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <h2 className="display-page text-ice">{profile.displayName}</h2>
              <span className="font-serif text-2xl italic text-steel">{t("home.profileLabel")}</span>
            </div>

            <p className="lede mt-8 max-w-4xl text-[clamp(1.25rem,2.2vw,1.75rem)] leading-[1.5] text-ice">
              {t("home.statementText")}
            </p>
            <p className="mt-6 font-serif text-lg italic text-steel">{t("home.statementNote")}</p>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-7 sm:grid-cols-4">
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
                  {t("home.factsAffiliation")}
                </dt>
                <dd className="mt-2 text-sm leading-snug text-ice">
                  {pick(profile.affiliationShort)}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
                  {t("home.factsDegree")}
                </dt>
                <dd className="mt-2 text-sm leading-snug text-ice">{pick(profile.degree)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
                  {t("home.factsField")}
                </dt>
                <dd className="mt-2 text-sm leading-snug text-ice">{pick(profile.field)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
                  {t("home.factsGraduation")}
                </dt>
                <dd className="mt-2 text-sm leading-snug text-ice">{profile.graduationYear}</dd>
              </div>
            </dl>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <CtaLink to="/cv" variant="ghost">
                {t("home.profileCta")}
              </CtaLink>
              <ArrowLink href={profile.links.github} external variant="quiet">
                GitHub
              </ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <section className="defer-section border-t border-line">
        <div className="shell py-20 md:py-28">
          <SectionHeader
            index="02"
            eyebrow={t("home.focusEyebrow")}
            title={t("home.focusTitle")}
            lede={t("home.focusLede")}
            action={<ArrowLink to="/research">{t("common.viewAll")}</ArrowLink>}
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
            <ol className="border-t border-line lg:col-span-8">
              {interests.map((interest, index) => (
                <li key={interest} className="border-b border-line">
                  <Link
                    to={href("/research")}
                    className="group flex items-baseline gap-4 py-4 transition-colors hover:bg-panel/30 md:gap-6 md:py-5"
                  >
                    <span className="font-mono text-[10px] tracking-[0.16em] text-glow/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-xl leading-snug tracking-[-0.02em] text-ice transition-colors group-hover:text-glow md:text-2xl">
                      {interest}
                    </span>
                    <ArrowUpRight
                      className="ml-auto size-4 shrink-0 text-steel transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-glow"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ol>

            <aside className="lg:col-span-4">
              <div className="border-t border-line pt-5">
                <p className="eyebrow">{t("home.focusExtendedLabel")}</p>
                <ul className="mt-4 space-y-3">
                  {extended.map((interest) => (
                    <li
                      key={interest}
                      className="border-b border-line pb-3 text-sm leading-relaxed text-mist"
                    >
                      {interest}
                    </li>
                  ))}
                </ul>
                <p className="caption mt-6 max-w-xs normal-case tracking-[0.04em]">
                  {t("home.focusNote")}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="defer-section border-t border-line">
        <div className="shell py-20 md:py-28">
          <SectionHeader
            index="03"
            eyebrow={t("home.workEyebrow")}
            title={t("home.workTitle")}
            lede={t("home.workLede")}
            action={<ArrowLink to="/projects">{t("home.workCta")}</ArrowLink>}
          />

          <ol className="mt-12 border-t border-line">
            {featuredProjects.map((project, index) => (
              <li key={project.id} className="border-b border-line">
                <Link
                  to={href(`/projects/${project.id}`)}
                  className="group grid gap-4 py-7 md:grid-cols-12 md:items-baseline md:gap-6"
                >
                  <div className="md:col-span-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-glow/60">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-steel">
                      {pick(project.category)}
                    </p>
                  </div>
                  <div className="md:col-span-6">
                    <h3 className="font-display text-2xl leading-snug tracking-[-0.02em] text-ice transition-colors group-hover:text-glow">
                      {pick(project.title)}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-steel">
                      {pick(project.summary)}
                    </p>
                  </div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-steel md:col-span-2">
                    {pick(project.status)}
                  </p>
                  <span className="hidden justify-self-end text-steel transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-glow md:col-span-2 md:block">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="defer-section border-t border-line">
        <div className="shell py-20 md:py-28">
          <SectionHeader
            index="04"
            eyebrow={t("home.honorsEyebrow")}
            title={t("home.honorsTitle")}
            lede={t("home.honorsLede")}
            action={<ArrowLink to="/honors">{t("home.honorsCta")}</ArrowLink>}
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredHonors.map((honor) => (
              <div key={honor.id} className="border border-line bg-panel/25 p-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-glow/70">
                  {pick(honor.period)}
                </p>
                <p className="mt-6 font-display text-3xl leading-none tracking-[-0.03em] text-ice">
                  {honor.rank ? pick(honor.rank) : ""}
                </p>
                <p className="mt-3 text-sm leading-snug text-mist">{pick(honor.title)}</p>
              </div>
            ))}
            <div className="flex flex-col justify-between border border-line bg-panel/10 p-5">
              <div className="flex items-baseline justify-between">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-steel">
                  {t("honors.countLabel", { count: honors.length })}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-steel">
                  {t("honors.certificationsTitle")} · {certificationsCount}
                </p>
              </div>
              <p className="mt-6 text-sm leading-relaxed text-steel">{t("honors.featuredBody")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="defer-section border-t border-line">
        <div className="shell py-20 md:py-28">
          <SectionHeader
            index="05"
            eyebrow={t("home.labEyebrow")}
            title={t("home.labTitle")}
            lede={t("home.labLede")}
          />
          <div className="mt-10">
            <InstrumentTabs />
          </div>
        </div>
      </section>

      <section className="defer-section border-t border-line">
        <div className="shell grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-3">
            <Eyebrow index="06">{t("home.timelineEyebrow")}</Eyebrow>
            <h2 className="display-page mt-6 text-ice">{t("home.timelineTitle")}</h2>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-steel">
              {t("home.timelineLede")}
            </p>
            <div className="mt-7">
              <ArrowLink to="/honors" variant="quiet">
                {t("home.timelineCta")}
              </ArrowLink>
            </div>
          </div>

          <ol className="md:col-span-9">
            {timelineItems.map((item) => (
              <li key={item.id} className="border-t border-line py-6 last:border-b">
                <Link
                  to={href(item.href)}
                  className="group grid gap-2 md:grid-cols-12 md:items-baseline md:gap-6"
                >
                  <span className="font-mono text-sm tabular-nums tracking-[0.12em] text-glow/70 md:col-span-2">
                    {item.year}
                  </span>
                  <div className="md:col-span-9">
                    <h3 className="font-display text-xl leading-snug tracking-[-0.02em] text-ice transition-colors group-hover:text-glow md:text-2xl">
                      {pick(item.title)}
                    </h3>
                    {item.detail ? (
                      <p className="mt-1 text-sm text-steel">{pick(item.detail)}</p>
                    ) : null}
                  </div>
                  <span className="hidden justify-self-end text-steel md:col-span-1 md:block">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="defer-section border-t border-line">
        <div className="shell grid gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow index="07">{t("home.cvEyebrow")}</Eyebrow>
            <h2 className="display-page mt-6 text-ice">{t("home.cvTitle")}</h2>
            <p className="lede mt-6 max-w-xl">{t("home.cvLede")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CtaLink href={cvHref} download>
                {t("cv.download")}
              </CtaLink>
              <ArrowLink to="/cv" variant="quiet">
                {t("home.cvCta")}
              </ArrowLink>
            </div>
            <p className="caption mt-5">{t("cv.downloadNote")}</p>
          </div>

          <div className="lg:col-span-6">
            <div className="grid gap-5 border-t border-line pt-6 sm:grid-cols-2">
              <div>
                <p className="eyebrow">{t("home.contactEyebrow")}</p>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
                  {t("home.contactLede")}
                </p>
                <div className="mt-5">
                  <ArrowLink href={profile.links.github} external>
                    {t("home.contactCta")}
                  </ArrowLink>
                </div>
              </div>
              <div className="border-l border-line pl-5">
                <p className="eyebrow">{t("honors.academicHonoursTitle")}</p>
                <ul className="mt-4 space-y-3">
                  {honors
                    .filter((honor) => honor.category !== "competition")
                    .slice(0, 3)
                    .map((honor) => (
                      <li key={honor.id} className="text-sm leading-snug text-mist">
                        {pick(honor.title)}
                      </li>
                    ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Tag>{pick(profile.degree)}</Tag>
                  <Tag>{pick(profile.affiliationShort)}</Tag>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-line pt-5">
              <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-steel">
                {t("home.contactNote")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
