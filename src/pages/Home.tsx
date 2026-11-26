import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Page } from "../components/layout/Page";
import Hero from "../components/sections/Hero";
import { FieldPlate } from "../components/sections/FieldPlate";
import { SectionHeader } from "../components/ui/PageHeader";
import { ArrowLink, CtaLink } from "../components/ui/Links";
import { Eyebrow, Tag } from "../components/ui/Primitives";
import { researchAreas } from "../data/research";
import { publications } from "../data/publications";
import { projects } from "../data/projects";
import { education, honors } from "../data/honors";
import { profile } from "../data/profile";
import { hasAnyArchive } from "../lib/content";
import { useLocale } from "../lib/useLocale";
import { siteConfig } from "../lib/seo";

const cvHref = `${import.meta.env.BASE_URL}${siteConfig.cv.pdf.replace(/^\//, "")}`;
const ArrayFactorLab = lazy(() => import("../components/lab/ArrayFactorLab"));

export default function Home() {
  const { t } = useTranslation();
  const { lang, pick, href } = useLocale();
  const showArchive = hasAnyArchive;

  const facts = [
    { label: t("home.factsAffiliation"), value: pick(profile.affiliationShort) },
    { label: t("home.factsDegree"), value: pick(profile.degree) },
    { label: t("home.factsField"), value: pick(profile.field) },
    { label: t("home.factsGraduation"), value: String(profile.graduationYear) },
  ];

  const archive = [
    {
      key: "publications",
      to: "/publications",
      title: t("home.archivePublicationsTitle"),
      body: t("home.archivePublicationsBody"),
      count: publications.length,
    },
    {
      key: "projects",
      to: "/projects",
      title: t("home.archiveProjectsTitle"),
      body: t("home.archiveProjectsBody"),
      count: projects.length,
    },
    {
      key: "honors",
      to: "/honors",
      title: t("home.archiveHonorsTitle"),
      body: t("home.archiveHonorsBody"),
      count: honors.length + education.length,
    },
  ];

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

      <section id="statement" className="scroll-mt-24 border-t border-line">
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
            <p
              className={
                lang === "zh"
                  ? "mt-6 font-display text-lg leading-relaxed text-steel"
                  : "mt-6 font-serif text-lg italic text-steel"
              }
            >
              {t("home.statementNote")}
            </p>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-7 sm:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">{fact.label}</dt>
                  <dd className="mt-2 text-sm leading-snug text-ice">{fact.value}</dd>
                </div>
              ))}
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
            eyebrow={t("home.researchEyebrow")}
            title={t("home.researchTitle")}
            lede={t("home.researchLede")}
            action={<ArrowLink to="/research">{t("common.viewAll")}</ArrowLink>}
          />

          <ul className="mt-12 border-t border-line">
            {researchAreas.map((area) => (
              <li key={area.id} className="border-b border-line">
                <Link
                  to={href(`/research#${area.id}`)}
                  className="group grid gap-3 py-6 transition-colors hover:bg-panel/40 md:grid-cols-12 md:items-baseline md:gap-6 md:py-7"
                >
                  <span className="font-mono text-[10px] tracking-[0.16em] text-glow/70 md:col-span-1">
                    {area.index}
                  </span>
                  <div className="md:col-span-5">
                    <h3 className="font-display text-2xl tracking-[-0.02em] text-ice transition-colors group-hover:text-glow md:text-[1.7rem]">
                      {pick(area.title)}
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-steel">{pick(area.short)}</p>
                  </div>
                  <p className="hidden text-sm leading-relaxed text-mist md:col-span-5 md:block">
                    {pick(area.question)}
                  </p>
                  <span className="hidden justify-self-end text-steel transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-glow md:col-span-1 md:block">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="caption mt-5">{t("home.researchNote")}</p>
        </div>
      </section>

      <section className="defer-section border-t border-line">
        <div className="shell py-20 md:py-28">
          <SectionHeader
            index="03"
            eyebrow={t("home.labEyebrow")}
            title={t("home.labTitle")}
            lede={t("home.labLede")}
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <Suspense
                fallback={
                  <div
                    className="min-h-[560px] border border-line bg-panel/20"
                    aria-hidden="true"
                  />
                }
              >
                <ArrayFactorLab />
              </Suspense>
              <p className="caption mt-4 max-w-2xl">{t("home.labCaption")}</p>
            </div>

            <aside className="lg:col-span-4">
              <p className="eyebrow border-b border-line pb-3">{t("home.labEyebrow")}</p>
              <ul className="border-b border-line">
                <li className="border-b border-line py-5">
                  <Link to={href("/research")} className="group block">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl text-ice transition-colors group-hover:text-glow">
                        {t("home.workArrayTitle")}
                      </h3>
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">01</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-steel">{t("home.workArrayBody")}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-glow">
                      {t("home.workOpen")}
                      <ArrowUpRight className="size-3" aria-hidden="true" />
                    </span>
                  </Link>
                </li>

                <li className="border-b border-line py-5">
                  <Link to={href("/research#resonance")} className="group block">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl text-ice transition-colors group-hover:text-glow">
                        {t("home.workResonanceTitle")}
                      </h3>
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">02</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-steel">{t("home.workResonanceBody")}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-glow">
                      {t("home.workOpen")}
                      <ArrowUpRight className="size-3" aria-hidden="true" />
                    </span>
                  </Link>
                </li>

                <li className="border-b border-line py-5">
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl text-ice">{t("home.workPlateTitle")}</h3>
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">03</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-steel">{t("home.workPlateBody")}</p>
                  </div>
                </li>

                <li className="py-5">
                  <a href={cvHref} download className="group block">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl text-ice transition-colors group-hover:text-glow">
                        {t("home.workCvTitle")}
                      </h3>
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">04</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-steel">{t("home.workCvBody")}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-glow">
                      {t("home.workDownload")}
                      <ArrowUpRight className="size-3" aria-hidden="true" />
                    </span>
                  </a>
                </li>
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-2">
                <Tag>{pick(profile.degree)}</Tag>
                <Tag>{pick(profile.graduation)}</Tag>
                <Tag>{pick(profile.affiliationShort)}</Tag>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {showArchive ? (
        <section className="defer-section border-t border-line">
          <div className="shell py-20 md:py-28">
            <SectionHeader
              index="04"
              eyebrow={t("home.archiveEyebrow")}
              title={t("home.archiveTitle")}
              lede={t("home.archiveLede")}
            />

            <ul className="mt-12 border-t border-line">
              {archive.map((entry) => (
                <li key={entry.key} className="border-b border-line">
                  <Link
                    to={href(entry.to)}
                    className="group grid gap-3 py-7 transition-colors hover:bg-panel/40 md:grid-cols-12 md:items-baseline md:gap-6"
                  >
                    <span className="font-mono text-[10px] text-steel md:col-span-1">
                      {String(entry.count).padStart(2, "0")}
                      <span className="ml-2 text-steel/50">{t("home.entriesLabel")}</span>
                    </span>
                    <h3 className="font-display text-2xl tracking-[-0.02em] text-ice transition-colors group-hover:text-glow md:col-span-4">
                      {entry.title}
                    </h3>
                    <p className="max-w-xl text-sm leading-relaxed text-steel md:col-span-6">{entry.body}</p>
                    <span className="hidden justify-self-end text-steel transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-glow md:col-span-1 md:block">
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Tag>{pick(profile.degree)}</Tag>
              <Tag>{pick(profile.graduation)}</Tag>
              <Tag>{pick(profile.affiliationShort)}</Tag>
            </div>
          </div>
        </section>
      ) : null}

      <section className="defer-section border-t border-line">
        <div className="shell grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <Eyebrow index="05">{t("home.contactEyebrow")}</Eyebrow>
            <h2 className="display-page mt-6 text-ice">{t("home.contactTitle")}</h2>
            <p className="lede mt-6">{t("home.contactLede")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CtaLink href={profile.links.github} external>
                {t("home.contactCta")}
              </CtaLink>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
                @aomk20201110-commits
              </span>
            </div>
            <p className="caption mt-6">{t("home.contactNote")}</p>
          </div>
          <div className="hidden md:col-span-5 md:block">
            <div className="relative ml-auto h-full min-h-[16rem] max-w-sm overflow-hidden border border-line bg-panel/30">
              <div className="grid-field absolute inset-0 opacity-50" />
              <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_70%_20%,var(--c-chart-fill),transparent_65%)]" />
              <div className="relative flex h-full flex-col justify-between p-6">
                <span className="eyebrow text-steel">{t("home.contactEyebrow")}</span>
                <div>
                  <p className="font-serif text-4xl italic leading-none text-ice/90">{profile.displayName}</p>
                  <p className="mt-3 max-w-[16rem] text-xs leading-relaxed text-steel">
                    {pick(profile.affiliationShort)} · {pick(profile.graduation)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
