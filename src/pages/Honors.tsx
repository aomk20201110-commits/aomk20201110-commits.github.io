import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Page } from "../components/layout/Page";
import { PageHeader } from "../components/ui/PageHeader";
import { Eyebrow } from "../components/ui/Primitives";
import { EmptyState, PreviewBanner, SampleBadge } from "../components/ui/States";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/useLocale";
import { usePreview } from "../lib/preview";
import { education, honors, type EducationEntry, type Honor, type HonorCategory } from "../data/honors";
import { sampleHonors } from "../data/samples";

const categoryKeys: Record<HonorCategory, string> = {
  award: "honors.categoryAward",
  scholarship: "honors.categoryScholarship",
  service: "honors.categoryService",
  academic: "honors.categoryAcademic",
};

const statusKeys: Record<EducationEntry["status"], string> = {
  "in-progress": "honors.inProgress",
  expected: "honors.expectedLabel",
  completed: "honors.completed",
};

function TimelineLine() {
  return (
    <span
      className="absolute bottom-0 left-[7px] top-2 w-px bg-line"
      aria-hidden="true"
    />
  );
}

function TimelineDot({ active = false }: { active?: boolean }) {
  return (
    <span className="absolute left-0 top-1.5 flex size-[15px] items-center justify-center rounded-full border border-glow/40 bg-void">
      <span className={cn("size-1.5 rounded-full", active ? "bg-glow" : "bg-glow/50")} />
    </span>
  );
}

export default function Honors() {
  const { t } = useTranslation();
  const { pick } = useLocale();
  const { preview } = usePreview();

  const awards = useMemo<Honor[]>(() => {
    const all = preview ? [...honors, ...sampleHonors] : honors;
    return [...all].sort((a, b) => Number(b.year) - Number(a.year));
  }, [preview]);

  return (
    <Page
      meta={{
        title: t("meta.honorsTitle"),
        description: t("meta.honorsDesc"),
        path: "/honors",
        noindex: preview,
      }}
    >
      <PageHeader
        index="04"
        eyebrow={t("honors.eyebrow")}
        title={t("honors.title")}
        lede={t("honors.lede")}
        aside={
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-steel md:ml-auto md:max-w-[16rem]">
            {t("honors.timelineNote")}
          </p>
        }
      />

      <div className="shell pb-24">
        <PreviewBanner />

        <section className="mt-10">
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <Eyebrow index="01">{t("honors.educationTitle")}</Eyebrow>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
              {String(education.length).padStart(2, "0")}
            </span>
          </div>

          <div className="relative mt-8">
            <TimelineLine />
            <ol>
              {education.map((entry) => (
                <li key={entry.id} className="relative pl-8 pb-2 md:pl-10">
                  <TimelineDot active />
                  <div className="grid gap-5 md:grid-cols-12 md:gap-6">
                    <div className="md:col-span-3">
                      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-glow/70">
                        {pick(entry.period)}
                      </p>
                      <span className="mt-2 inline-flex border border-glow/30 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-glow/90">
                        {t(statusKeys[entry.status])}
                      </span>
                    </div>
                    <div className="md:col-span-9">
                      <h2 className="font-display text-2xl leading-tight tracking-[-0.02em] text-ice md:text-3xl">
                        {pick(entry.title)}
                      </h2>
                      <p className="mt-2 text-sm text-mist">{pick(entry.institution)}</p>
                      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-steel">{pick(entry.detail)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mt-16 md:mt-20">
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <Eyebrow index="02">{t("honors.awardsTitle")}</Eyebrow>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
              {String(awards.length).padStart(2, "0")}
            </span>
          </div>

          {awards.length === 0 ? (
            <EmptyState
              className="mt-8"
              title={t("honors.awardsEmptyTitle")}
              body={t("honors.awardsEmptyBody")}
            />
          ) : (
            <div className="relative mt-8">
              <TimelineLine />
              <ol>
                {awards.map((entry) => (
                  <li key={entry.id} className="relative pl-8 pb-10 md:pl-10">
                    <TimelineDot active={!entry.sample} />
                    <div className="grid gap-4 md:grid-cols-12 md:gap-6">
                      <div className="md:col-span-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-glow/70">{entry.year}</p>
                        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-steel">
                          {t(categoryKeys[entry.category])}
                        </p>
                        {entry.sample ? <SampleBadge className="mt-2" /> : null}
                      </div>
                      <div className="md:col-span-9">
                        <h3 className="font-display text-xl leading-snug text-ice md:text-2xl">{pick(entry.title)}</h3>
                        <p className="mt-1.5 text-sm text-mist">{pick(entry.organisation)}</p>
                        {entry.detail ? (
                          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-steel">{pick(entry.detail)}</p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      </div>
    </Page>
  );
}
