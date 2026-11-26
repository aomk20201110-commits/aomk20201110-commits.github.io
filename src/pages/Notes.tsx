import { useTranslation } from "react-i18next";
import { Page } from "../components/layout/Page";
import { PageHeader } from "../components/ui/PageHeader";
import { EmptyState, PreviewBanner } from "../components/ui/States";
import { ArrowLink, CtaLink } from "../components/ui/Links";
import { Tag } from "../components/ui/Primitives";
import { useLocale } from "../lib/useLocale";
import { usePreview } from "../lib/preview";
import { availability } from "../lib/content";
import { researchNotes } from "../data/notes";

export default function Notes() {
  const { t } = useTranslation();
  const { pick } = useLocale();
  const { preview } = usePreview();
  const notes = researchNotes;

  return (
    <Page meta={{ route: "notes", noindex: preview || !availability.notes }}>
      <PageHeader
        index="07"
        eyebrow={t("notes.eyebrow")}
        title={t("notes.title")}
        lede={t("notes.lede")}
        aside={
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-steel md:ml-auto md:max-w-[15rem]">
            {t("notes.countLabel", { count: notes.length })}
          </p>
        }
      />

      <div className="shell pb-24">
        <PreviewBanner />
        {notes.length === 0 ? (
          <EmptyState
            title={t("notes.emptyTitle")}
            body={t("notes.emptyBody")}
            action={
              <CtaLink to="/research">{t("notes.emptyCta")}</CtaLink>
            }
          />
        ) : (
          <ol className="border-t border-line">
            {notes.map((note) => (
              <li key={note.id} className="border-b border-line py-8">
                <div className="grid gap-4 md:grid-cols-12 md:gap-8">
                  <div className="md:col-span-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-glow/70">
                      {note.date}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {note.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-9">
                    <h2 className="font-display text-2xl leading-tight tracking-[-0.02em] text-ice md:text-3xl">
                      {pick(note.title)}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist md:text-[15px]">
                      {pick(note.summary)}
                    </p>
                    {note.href ? (
                      <div className="mt-4">
                        <ArrowLink to={note.href}>{t("common.readMore")}</ArrowLink>
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Page>
  );
}
