import { useTranslation } from "react-i18next";
import { Page } from "../components/layout/Page";
import { PageHeader } from "../components/ui/PageHeader";
import { CtaLink } from "../components/ui/Links";
import { GithubMark, Rule, Tag, WaveMark } from "../components/ui/Primitives";
import { useLocale } from "../lib/useLocale";
import { profile } from "../data/profile";
import { researchAreas } from "../data/research";

export default function About() {
  const { t } = useTranslation();
  const { pick } = useLocale();

  return (
    <Page meta={{ title: t("meta.aboutTitle"), description: t("meta.aboutDesc"), path: "/about" }}>
      <PageHeader
        index="06"
        eyebrow={t("about.eyebrow")}
        title={t("about.title")}
        lede={t("about.lede")}
        aside={
          <div className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-steel md:ml-auto md:text-right">
            <p>{pick(profile.affiliationShort)}</p>
            <p className="mt-1">{pick(profile.location)}</p>
            <p className="mt-1 text-glow/70">{pick(profile.graduation)}</p>
          </div>
        }
      />

      <div className="shell pb-24">
        <div className="mt-4 grid gap-12 md:grid-cols-12 md:gap-10">
          <section className="md:col-span-7">
            <h2 className="eyebrow text-glow/80">{t("about.bioTitle")}</h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-mist md:text-[1.0625rem]">
              <p className="text-ice/90">{t("about.bioP1")}</p>
              <p>{t("about.bioP2")}</p>
              <p>{t("about.bioP3")}</p>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {researchAreas.map((area) => (
                <Tag key={area.id}>{pick(area.title)}</Tag>
              ))}
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 sm:grid-cols-3">
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
                  {t("about.institutionLabel")}
                </dt>
                <dd className="mt-2 text-sm text-ice">{pick(profile.affiliationShort)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
                  {t("about.programmeLabel")}
                </dt>
                <dd className="mt-2 text-sm text-ice">{pick(profile.degree)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
                  {t("about.graduatingLabel")}
                </dt>
                <dd className="mt-2 text-sm text-ice">{pick(profile.graduation)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
                  {t("about.fieldLabel")}
                </dt>
                <dd className="mt-2 text-sm text-ice">{pick(profile.field)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
                  {t("about.basedInLabel")}
                </dt>
                <dd className="mt-2 text-sm text-ice">{pick(profile.location)}</dd>
              </div>
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
                  {t("about.updatedLabel")}
                </dt>
                <dd className="mt-2 text-sm text-ice">{profile.updated}</dd>
              </div>
            </dl>
          </section>

          <aside className="md:col-span-5">
            <div className="sticky top-28">
              <div className="relative aspect-square overflow-hidden border border-line bg-panel/30">
                <div className="absolute inset-0 grid-field opacity-40" aria-hidden="true" />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(120% 90% at 30% 20%, rgba(111,216,236,0.14), transparent 55%)",
                  }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <div className="flex items-start justify-between">
                    <WaveMark className="h-5 w-16 text-glow/70" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-steel">Identity</span>
                  </div>
                  <p className="font-display text-[24vw] leading-none tracking-[-0.08em] text-ice/[0.12] md:text-[11rem]">
                    {profile.monogram}
                  </p>
                  <div className="flex items-end justify-between">
                    <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-steel">
                      {profile.displayName}
                      <br />
                      {pick(profile.role)}
                    </p>
                    <span className="size-1.5 rounded-full bg-glow anim-pulse" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
                {t("about.identityCaption")}
              </p>
            </div>
          </aside>
        </div>

        <Rule className="mt-16" />

        <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <h2 className="eyebrow text-glow/80">{t("about.colophonTitle")}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mist">{t("about.colophonBody")}</p>
          </div>
          <div className="md:col-span-5">
            <h2 className="eyebrow text-glow/80">{t("about.policyTitle")}</h2>
            <p className="mt-4 text-sm leading-relaxed text-mist">{t("about.policyBody")}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start gap-5 border-t border-line pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="eyebrow text-glow/80">{t("about.contactTitle")}</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist">{t("about.contactBody")}</p>
          </div>
          <CtaLink href={profile.links.github} external>
            <GithubMark className="mr-1 size-3.5" />
            {t("about.contactCta")}
          </CtaLink>
        </div>
      </div>
    </Page>
  );
}
