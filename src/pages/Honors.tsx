import { useTranslation } from "react-i18next";
import { Page } from "../components/layout/Page";
import { PageHeader } from "../components/ui/PageHeader";
import { Eyebrow } from "../components/ui/Primitives";
import { ArrowLink } from "../components/ui/Links";
import { useLocale } from "../lib/useLocale";
import { availability } from "../lib/content";
import {
  certifications,
  certificationsCount,
} from "../data/certifications";
import {
  education,
  honors,
  honorsCount,
  type EducationEntry,
  type Honor,
  type HonorCategory,
} from "../data/honors";

const categoryKeys: Record<HonorCategory, string> = {
  competition: "honors.categoryCompetition",
  scholarship: "honors.categoryScholarship",
  academic: "honors.categoryAcademic",
};

const statusKeys: Record<EducationEntry["status"], string> = {
  "in-progress": "honors.inProgress",
  expected: "honors.expectedLabel",
  completed: "honors.completed",
};

function HonorRow({ entry, index }: { entry: Honor; index: number }) {
  const { t } = useTranslation();
  const { pick } = useLocale();
  const featured = entry.featured;

  return (
    <li id={entry.id} className="scroll-mt-28 border-b border-line">
      <article className="grid gap-4 py-7 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-glow/60">
            {String(index).padStart(2, "0")}
          </p>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-steel">
            {t(categoryKeys[entry.category])}
          </p>
        </div>
        <div className="md:col-span-7">
          <h3 className="font-display text-xl leading-snug tracking-[-0.02em] text-ice md:text-2xl">
            {pick(entry.title)}
          </h3>
          <p className="mt-2 text-sm text-mist">{pick(entry.organisation)}</p>
          {entry.detail ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-steel">{pick(entry.detail)}</p>
          ) : null}
        </div>
        <div className="md:col-span-3 md:text-right">
          {entry.rank ? (
            <span className={featured ? "tag border-glow/50 text-glow" : "tag"}>
              {pick(entry.rank)}
            </span>
          ) : null}
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-steel">
            {pick(entry.period)}
          </p>
        </div>
      </article>
    </li>
  );
}

function HonorGroup({
  index,
  title,
  lede,
  entries,
}: {
  index: string;
  title: string;
  lede?: string;
  entries: Honor[];
}) {
  const { t } = useTranslation();
  if (entries.length === 0) return null;
  return (
    <section className="mt-14 md:mt-18">
      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <Eyebrow index={index}>{title}</Eyebrow>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
          {String(entries.length).padStart(2, "0")}
        </span>
      </div>
      {lede ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-steel">{lede}</p> : null}
      <ol className="mt-4">
        {entries.map((entry, i) => (
          <HonorRow key={entry.id} entry={entry} index={i + 1} />
        ))}
      </ol>
      <p className="sr-only">{t("honors.timelineNote")}</p>
    </section>
  );
}

export default function Honors() {
  const { t } = useTranslation();
  const { pick } = useLocale();

  const featured = honors.filter((entry) => entry.featured);
  const competitions = honors.filter((entry) => entry.category === "competition");
  const scholarships = honors.filter((entry) => entry.category === "scholarship");
  const academic = honors.filter((entry) => entry.category === "academic");

  return (
    <Page meta={{ route: "honors", noindex: !availability.honors }}>
      <PageHeader
        index="04"
        eyebrow={t("honors.eyebrow")}
        title={t("honors.title")}
        lede={t("honors.lede")}
        aside={
          <div className="space-y-3 font-mono text-[10px] uppercase tracking-[0.14em] text-steel md:text-right">
            <p>{t("honors.countLabel", { count: honorsCount })}</p>
            <p>{t("honors.certificationsTitle")} · {String(certificationsCount).padStart(2, "0")}</p>
            <p className="max-w-[15rem] leading-relaxed">{t("honors.dateNote")}</p>
          </div>
        }
      />

      <div className="shell pb-24">
        <section className="mt-8 border-y border-line py-8 md:py-10">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow index="00">{t("honors.rankLabel")}</Eyebrow>
              <h2 className="mt-5 font-display text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.02] tracking-[-0.03em] text-gradient">
                {t("honors.featuredTitle")}
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-steel">
                {t("honors.featuredBody")}
              </p>
              <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-glow/70">
                {t("honors.provincialNote")}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
              {featured.map((entry, index) => (
                <a
                  key={entry.id}
                  href={`#${entry.id}`}
                  className="group border border-line bg-panel/30 p-6 transition-colors hover:border-glow/40"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-glow/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-steel">
                      {pick(entry.period)}
                    </span>
                  </div>
                  <p className="mt-8 font-display text-3xl leading-none tracking-[-0.03em] text-ice">
                    {entry.rank ? pick(entry.rank) : ""}
                  </p>
                  <p className="mt-3 text-sm leading-snug text-mist">
                    {pick(entry.title)}
                  </p>
                  {entry.id.startsWith("cmc-") ? (
                    <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-steel">
                      {t("honors.provincialNote")}
                    </p>
                  ) : null}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <Eyebrow index="01">{t("honors.educationTitle")}</Eyebrow>
          </div>
          {education.map((entry) => (
            <div key={entry.id} className="grid gap-4 border-b border-line py-7 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-glow/70">
                  {pick(entry.period)}
                </p>
                <span className="mt-2 inline-flex border border-glow/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-glow/90">
                  {t(statusKeys[entry.status])}
                </span>
              </div>
              <div className="md:col-span-9">
                <h2 className="font-display text-2xl leading-snug tracking-[-0.02em] text-ice">
                  {pick(entry.title)}
                </h2>
                <p className="mt-2 text-sm text-mist">{pick(entry.institution)}</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-steel">{pick(entry.detail)}</p>
              </div>
            </div>
          ))}
        </section>

        <HonorGroup
          index="02"
          title={t("honors.competitionsTitle")}
          lede={t("honors.competitionsLede")}
          entries={competitions}
        />
        <HonorGroup
          index="03"
          title={t("honors.scholarshipsTitle")}
          entries={scholarships}
        />
        <HonorGroup
          index="04"
          title={t("honors.academicHonoursTitle")}
          entries={academic}
        />

        <section className="mt-14 md:mt-18">
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <Eyebrow index="05">{t("honors.certificationsTitle")}</Eyebrow>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
              {String(certificationsCount).padStart(2, "0")}
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-steel">
            {t("honors.certificationsLede")}
          </p>
          <dl className="mt-4 border-t border-line">
            {certifications.map((entry) => (
              <div
                key={entry.id}
                className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-line py-4"
              >
                <dt className="text-sm text-mist">{pick(entry.title)}</dt>
                <dd className="font-mono text-[11px] uppercase tracking-[0.12em] text-ice">
                  {pick(entry.result)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-6">
          <p className="max-w-xl font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-steel">
            {t("honors.dateNote")}
          </p>
          <ArrowLink to="/cv">{t("cv.eyebrow")}</ArrowLink>
        </div>
      </div>
    </Page>
  );
}
