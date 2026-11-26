import { useTranslation } from "react-i18next";
import { Page } from "../components/layout/Page";
import { PageHeader } from "../components/ui/PageHeader";
import { Reveal } from "../components/ui/Reveal";
import { Rule } from "../components/ui/Primitives";
import { ArrowLink } from "../components/ui/Links";
import ResearchGlyph from "../components/sections/ResearchGlyph";
import ArrayFactorLab from "../components/lab/ArrayFactorLab";
import ResonanceLab from "../components/lab/ResonanceLab";
import { useLocale } from "../lib/useLocale";
import { availability } from "../lib/content";
import { researchAreas } from "../data/research";

export default function Research() {
  const { t } = useTranslation();
  const { pick } = useLocale();

  return (
    <Page
      meta={{ route: "research" }}
    >
      <PageHeader
        index="01"
        eyebrow={t("research.eyebrow")}
        title={t("research.title")}
        lede={t("research.lede")}
        aside={
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-steel md:ml-auto md:max-w-[17rem]">
            {t("research.note")}
          </p>
        }
      />

      <div className="shell pb-24">
        <section aria-labelledby="research-focus">
          <h2 id="research-focus" className="sr-only">
            {t("research.focusLabel")}
          </h2>
          {researchAreas.map((area) => (
            <Reveal key={area.id}>
              <article
                id={area.id}
                className="grid scroll-mt-28 gap-8 border-t border-line py-10 md:grid-cols-12 md:gap-10 md:py-14"
              >
                <div className="md:col-span-5">
                  <ResearchGlyph variant={area.glyph} label={pick(area.title)} />
                </div>
                <div className="md:col-span-7">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-glow/60">{area.index}</span>
                    <h3 className="font-display text-3xl leading-tight tracking-[-0.025em] text-ice md:text-4xl">
                      {pick(area.title)}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-glow">{pick(area.short)}</p>
                  <p className="mt-5 max-w-2xl text-sm leading-relaxed text-mist md:text-[0.9375rem]">
                    {pick(area.description)}
                  </p>

                  <dl className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
                        {t("research.questionLabel")}
                      </dt>
                      <dd className="mt-2 max-w-2xl border-l border-glow/30 pl-4 text-sm leading-relaxed text-ice/85">
                        {pick(area.question)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
                        {t("research.scaleLabel")}
                      </dt>
                      <dd className="mt-2 font-mono text-[11px] tracking-[0.02em] text-mist">{pick(area.scale)}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
                        {t("research.keywordsLabel")}
                      </dt>
                      <dd className="mt-2 font-mono text-[11px] leading-relaxed tracking-[0.02em] text-mist">
                        {pick(area.keywords).join(" · ")}
                      </dd>
                    </div>
                  </dl>
                </div>
              </article>
            </Reveal>
          ))}
        </section>

        <section id="lab" className="scroll-mt-28 border-t border-line pt-12 md:pt-16" aria-labelledby="lab-title">
          <div className="grid gap-8 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-5">
              <p className="eyebrow text-glow/80">{t("lab.eyebrow")}</p>
              <h2
                id="lab-title"
                className="mt-4 font-display text-3xl leading-tight tracking-[-0.025em] text-ice md:text-4xl"
              >
                {t("lab.title")}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-mist">{t("lab.lede")}</p>
            </div>
            <div className="md:col-span-7 md:self-end">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">{t("research.modelTitle")}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-steel">{t("research.modelBody")}</p>
            </div>
          </div>

          <ArrayFactorLab className="mt-10 md:mt-12" />
        </section>

        <section
          id="resonance"
          className="scroll-mt-28 border-t border-line pt-12 md:pt-16"
          aria-labelledby="resonance-title"
        >
          <div className="grid gap-8 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-5">
              <p className="eyebrow text-glow/80">{t("resonance.eyebrow")}</p>
              <h2
                id="resonance-title"
                className="mt-4 font-display text-3xl leading-tight tracking-[-0.025em] text-ice md:text-4xl"
              >
                {t("resonance.title")}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-mist">{t("resonance.lede")}</p>
            </div>
            <div className="md:col-span-7 md:self-end">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">{t("resonance.formulaLabel")}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-steel">{t("resonance.formulaVariables")}</p>
            </div>
          </div>

          <ResonanceLab className="mt-10 md:mt-12" />
        </section>

        {availability.publications ? (
          <>
            <Rule className="mt-16" />
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-lg text-sm text-steel">{t("publications.lede")}</p>
              <ArrowLink to="/publications">{t("nav.publications")}</ArrowLink>
            </div>
          </>
        ) : null}
      </div>
    </Page>
  );
}
