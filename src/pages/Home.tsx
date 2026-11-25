import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Page } from "../components/layout/Page";
import Hero from "../components/sections/Hero";
import { SectionHeader } from "../components/ui/PageHeader";
import { ArrowLink, CtaLink } from "../components/ui/Links";
import { Eyebrow, Tag } from "../components/ui/Primitives";
import ArrayFactorLab from "../components/lab/ArrayFactorLab";
import { researchAreas } from "../data/research";
import { publications } from "../data/publications";
import { projects } from "../data/projects";
import { education, honors } from "../data/honors";
import { profile } from "../data/profile";
import { useLocale } from "../lib/useLocale";

function countLabel(value: number) {
  return String(value).padStart(2, "0");
}

export default function Home() {
  const { t } = useTranslation();
  const { lang, pick } = useLocale();

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
    <Page flush meta={{ title: t("meta.homeTitle"), description: t("meta.homeDesc"), path: "/" }}>
      <Hero />

      <section id="statement" className="scroll-mt-24 border-t border-line">
        <div className="shell grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-3">
            <Eyebrow index="01">{t("home.statementEyebrow")}</Eyebrow>
          </div>
          <div className="md:col-span-9">
            <p className="max-w-4xl font-display text-[clamp(1.45rem,2.7vw,2.35rem)] leading-[1.35] tracking-[-0.02em] text-ice">
              {t("home.statementText")}
            </p>
            <p
              className={
                lang === "zh"
                  ? "mt-7 font-display text-lg leading-relaxed text-steel"
                  : "mt-7 font-serif text-lg italic text-steel"
              }
            >
              {t("home.statementNote")}
            </p>

            <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-7 sm:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">{fact.label}</dt>
                  <dd className="mt-2 text-sm leading-snug text-ice">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
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
                  to={`/research#${area.id}`}
                  className="group grid gap-3 py-6 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:items-baseline md:gap-6 md:py-7"
                >
                  <span className="font-mono text-[10px] tracking-[0.16em] text-glow/60 md:col-span-1">
                    {area.index}
                  </span>
                  <div className="md:col-span-5">
                    <h3 className="font-display text-xl tracking-[-0.02em] text-ice transition-colors group-hover:text-glow md:text-2xl">
                      {pick(area.title)}
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-steel">{pick(area.short)}</p>
                  </div>
                  <p className="hidden text-sm leading-relaxed text-mist md:col-span-5 md:block">{pick(area.question)}</p>
                  <span className="hidden justify-self-end text-steel transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-glow md:col-span-1 md:block">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell py-20 md:py-28">
          <SectionHeader
            index="03"
            eyebrow={t("home.labEyebrow")}
            title={t("home.labTitle")}
            lede={t("home.labLede")}
          />
          <div className="mt-12">
            <ArrayFactorLab />
          </div>
          <p className="mt-4 max-w-2xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-steel">
            {t("home.labCaption")}
          </p>
        </div>
      </section>

      <section className="border-t border-line">
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
                  to={entry.to}
                  className="group grid gap-3 py-7 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:items-baseline md:gap-6"
                >
                  <span className="font-mono text-[10px] text-steel md:col-span-1">
                    {countLabel(entry.count)}
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

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Tag>{pick(profile.degree)}</Tag>
            <Tag>{pick(profile.graduation)}</Tag>
            <Tag>{pick(profile.affiliationShort)}</Tag>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="shell grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <Eyebrow index="05">{t("home.contactEyebrow")}</Eyebrow>
            <h2 className="text-gradient mt-6 font-display text-[clamp(2.4rem,5.6vw,4.8rem)] leading-[0.98] tracking-[-0.045em]">
              {t("home.contactTitle")}
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-mist">{t("home.contactLede")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CtaLink href={profile.links.github} external>
                {t("home.contactCta")}
              </CtaLink>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
                @aomk20201110-commits
              </span>
            </div>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-steel">{t("home.contactNote")}</p>
          </div>
          <div className="hidden md:col-span-5 md:block">
            <div className="relative ml-auto h-full min-h-[16rem] max-w-sm overflow-hidden border border-line bg-panel/30">
              <div className="grid-field absolute inset-0 opacity-50" />
              <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_70%_20%,rgba(111,216,236,0.16),transparent_65%)]" />
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
