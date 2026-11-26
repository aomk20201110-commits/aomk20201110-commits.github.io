import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Page } from "../components/layout/Page";
import { PageHeader } from "../components/ui/PageHeader";
import { ArrowLink, CtaLink } from "../components/ui/Links";
import { EmptyState, PreviewBanner, SampleBadge } from "../components/ui/States";
import { GithubMark, Tag } from "../components/ui/Primitives";
import { useLocale } from "../lib/useLocale";
import { usePreview } from "../lib/preview";
import { availability } from "../lib/content";
import { projects } from "../data/projects";
import { sampleProjects } from "../data/samples";
import { profile } from "../data/profile";

export default function Projects() {
  const { t } = useTranslation();
  const { pick } = useLocale();
  const { preview } = usePreview();

  const all = useMemo(() => (preview ? [...projects, ...sampleProjects] : projects), [preview]);
  const ordered = useMemo(
    () => [...all].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title)),
    [all],
  );

  return (
    <Page
      meta={{ route: "projects", noindex: preview || !availability.projects }}
    >
      <PageHeader
        index="03"
        eyebrow={t("projects.eyebrow")}
        title={t("projects.title")}
        lede={t("projects.lede")}
        aside={
          <ArrowLink href={profile.links.github} external>
            {t("projects.githubProfile")}
          </ArrowLink>
        }
      />

      <div className="shell pb-24">
        <PreviewBanner />

        {ordered.length === 0 ? (
          <EmptyState
            className="mt-8"
            title={t("projects.emptyTitle")}
            body={t("projects.emptyBody")}
            hint={t("projects.emptyHint")}
            action={
              <CtaLink href={profile.links.github} external>
                <span className="inline-flex items-center gap-2">
                  <GithubMark className="size-3.5" />
                  {t("projects.githubProfile")}
                </span>
              </CtaLink>
            }
          />
        ) : (
          <ol className="mt-8 border-t border-line">
            {ordered.map((project, index) => (
              <li key={project.id} className="border-b border-line">
                <article className="grid gap-4 py-8 md:grid-cols-12 md:gap-6 md:py-10">
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] tracking-[0.18em] text-glow/60">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {project.featured ? (
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-glow/70">
                          {t("projects.featured")}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-steel">
                      {pick(project.category)}
                      <span className="mx-2 text-steel/40">/</span>
                      {project.year}
                    </p>
                    {project.status ? (
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mist">
                        {t("projects.statusLabel")} · {pick(project.status)}
                      </p>
                    ) : null}
                    {project.sample ? <SampleBadge className="mt-3" /> : null}
                  </div>

                  <div className="md:col-span-9">
                    <h2 className="font-display text-2xl leading-tight tracking-[-0.02em] text-ice md:text-3xl">
                      {project.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist md:text-[15px]">
                      {pick(project.summary)}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>

                    {project.links.length > 0 ? (
                      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
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
                </article>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Page>
  );
}
