import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Page } from "../components/layout/Page";
import { PageHeader } from "../components/ui/PageHeader";
import { Eyebrow, Tag } from "../components/ui/Primitives";
import { ArrowLink, CtaLink } from "../components/ui/Links";
import { EmptyState } from "../components/ui/States";
import { useLocale } from "../lib/useLocale";
import { projects, projectById } from "../data/projects";

function Section({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-line py-7 md:py-8">
      <Eyebrow index={index}>{label}</Eyebrow>
      <div className="mt-4 max-w-3xl text-sm leading-relaxed text-mist md:text-[15px]">{children}</div>
    </section>
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { pick } = useLocale();
  const project = id ? projectById(id) : undefined;

  if (!project) {
    return (
      <Page meta={{ route: "projects", noindex: true }}>
        <PageHeader
          index="03"
          eyebrow={t("projects.eyebrow")}
          title={t("projects.notFoundTitle")}
          lede={t("projects.notFoundBody")}
          aside={
            <ArrowLink to="/projects">
              {t("projects.back")}
            </ArrowLink>
          }
        />
        <div className="shell pb-24">
          <EmptyState
            title={t("projects.notFoundTitle")}
            body={t("projects.notFoundBody")}
            action={<CtaLink to="/projects">{t("projects.back")}</CtaLink>}
          />
        </div>
      </Page>
    );
  }

  const related = projects.filter((entry) => entry.id !== project.id).slice(0, 3);
  const methods = pick(project.methods);

  return (
    <Page
      meta={{
        route: "projects",
        path: `/projects/${project.id}`,
        title: pick(project.title),
        description: pick(project.summary),
      }}
    >
      <PageHeader
        index="03"
        eyebrow={`${t("projects.eyebrow")} · ${pick(project.category)}`}
        title={pick(project.title)}
        lede={pick(project.summary)}
        aside={
          <div className="space-y-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-steel">
            <p>
              {t("projects.detailPeriod")} · {pick(project.period)}
            </p>
            <p>
              {t("projects.detailStatus")} · {pick(project.status)}
            </p>
            <ArrowLink to="/projects">{t("projects.back")}</ArrowLink>
          </div>
        }
      />

      <div className="shell pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <article className="lg:col-span-8">
            <div className="border-l border-glow/40 pl-6">
              <Eyebrow index="00">{t("projects.detailQuestion")}</Eyebrow>
              <p className="mt-4 max-w-2xl font-display text-2xl leading-snug tracking-[-0.02em] text-ice md:text-3xl">
                {pick(project.question)}
              </p>
            </div>

            <div className="mt-10">
              <Section index="01" label={t("projects.detailBackground")}>
                {pick(project.background)}
              </Section>

              <Section index="02" label={t("projects.detailMethods")}>
                <ol className="space-y-3">
                  {methods.map((method, index) => (
                    <li key={method} className="grid grid-cols-[2rem_1fr] gap-3">
                      <span className="font-mono text-[10px] tracking-[0.14em] text-glow/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{method}</span>
                    </li>
                  ))}
                </ol>
              </Section>

              <Section index="03" label={t("projects.detailTools")}>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <Tag key={tool}>{tool}</Tag>
                  ))}
                </div>
              </Section>

              <Section index="04" label={t("projects.detailValidation")}>
                {pick(project.validation)}
              </Section>

              <Section index="05" label={t("projects.detailMaterials")}>
                {pick(project.materials)}
              </Section>
            </div>
          </article>

          <aside className="lg:col-span-4">
            <div className="border border-line bg-panel/30 p-6">
              <p className="eyebrow">{t("projects.detailNote")}</p>
              <dl className="mt-6 space-y-4 font-mono text-[10px] uppercase tracking-[0.12em]">
                <div>
                  <dt className="text-steel">{t("projects.detailCategory")}</dt>
                  <dd className="mt-1 text-mist">{pick(project.category)}</dd>
                </div>
                <div>
                  <dt className="text-steel">{t("projects.detailPeriod")}</dt>
                  <dd className="mt-1 text-mist">{pick(project.period)}</dd>
                </div>
                <div>
                  <dt className="text-steel">{t("projects.detailStatus")}</dt>
                  <dd className="mt-1 text-mist">{pick(project.status)}</dd>
                </div>
              </dl>
              {project.links.length > 0 ? (
                <div className="mt-6 space-y-3 border-t border-line pt-5">
                  {project.links.map((link) => (
                    <ArrowLink
                      key={`${project.id}-${link.href}`}
                      href={link.href}
                      external={link.href.startsWith("http")}
                    >
                      {pick(link.label)}
                    </ArrowLink>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-10">
              <Eyebrow index="06">{t("projects.related")}</Eyebrow>
              <ul className="mt-5 border-t border-line">
                {related.map((entry) => (
                  <li key={entry.id} className="border-b border-line py-4">
                    <ArrowLink to={`/projects/${entry.id}`}>{pick(entry.title)}</ArrowLink>
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-steel">
                      {pick(entry.category)} · {pick(entry.period)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </Page>
  );
}
