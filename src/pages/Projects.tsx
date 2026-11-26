import { useTranslation } from "react-i18next";
import { Page } from "../components/layout/Page";
import { PageHeader } from "../components/ui/PageHeader";
import { ArrowLink, CtaLink } from "../components/ui/Links";
import { EmptyState } from "../components/ui/States";
import { GithubMark, Tag } from "../components/ui/Primitives";
import { useLocale } from "../lib/useLocale";
import { availability } from "../lib/content";
import { projects } from "../data/projects";
import { profile } from "../data/profile";

export default function Projects() {
  const { t } = useTranslation();
  const { pick } = useLocale();

  const ordered = [...projects].sort((a, b) => b.year - a.year || a.id.localeCompare(b.id));

  return (
    <Page meta={{ route: "projects", noindex: !availability.projects }}>
      <PageHeader
        index="03"
        eyebrow={t("projects.eyebrow")}
        title={t("projects.title")}
        lede={t("projects.lede")}
        aside={
          <div className="space-y-3 font-mono text-[10px] uppercase tracking-[0.14em] text-steel md:text-right">
            <p>{t("projects.countLabel", { count: ordered.length })}</p>
            <ArrowLink href={profile.links.github} external>
              {t("projects.githubProfile")}
            </ArrowLink>
          </div>
        }
      />

      <div className="shell pb-24">
        <p className="caption border-t border-line pt-4">{t("projects.note")}</p>

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
          <ol className="mt-6 border-t border-line">
            {ordered.map((project, index) => (
              <li key={project.id} className="border-b border-line">
                <article className="grid gap-5 py-9 md:grid-cols-12 md:gap-8 md:py-11">
                  <div className="md:col-span-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-glow/60">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-steel">
                      {pick(project.category)}
                      <span className="mx-2 text-steel/40">/</span>
                      {pick(project.period)}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mist">
                      {t("projects.statusLabel")} · {pick(project.status)}
                    </p>
                  </div>

                  <div className="md:col-span-9">
                    <h2 className="font-display text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.05] tracking-[-0.03em] text-ice">
                      <ArrowLink to={`/projects/${project.id}`} variant="quiet">
                        {pick(project.title)}
                      </ArrowLink>
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mist md:text-[15px]">
                      {pick(project.summary)}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                    <div className="mt-6">
                      <ArrowLink to={`/projects/${project.id}`}>{t("projects.readProject")}</ArrowLink>
                    </div>
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
