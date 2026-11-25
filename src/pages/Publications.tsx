import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Search } from "lucide-react";
import { Page } from "../components/layout/Page";
import { PageHeader } from "../components/ui/PageHeader";
import { ArrowLink, CtaLink } from "../components/ui/Links";
import { EmptyState, PreviewBanner, SampleBadge } from "../components/ui/States";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/useLocale";
import { usePreview } from "../lib/preview";
import { publications, type Publication, type PublicationStatus, type PublicationType } from "../data/publications";
import { samplePublications } from "../data/samples";
import { profile } from "../data/profile";

const typeKeys: Record<PublicationType, string> = {
  journal: "publications.journal",
  conference: "publications.conference",
  preprint: "publications.preprint",
};

const statusKeys: Record<PublicationStatus, string> = {
  published: "publications.statusPublished",
  preprint: "publications.statusPreprint",
  "under-review": "publications.statusUnderReview",
  "in-preparation": "publications.statusInPreparation",
};

const statusStyles: Record<PublicationStatus, string> = {
  published: "border-glow/35 text-glow/90",
  preprint: "border-steel/40 text-mist",
  "under-review": "border-amber-300/30 text-amber-200/80",
  "in-preparation": "border-white/15 text-steel",
};

type TypeFilter = "all" | PublicationType;
type YearFilter = "all" | number;

export default function Publications() {
  const { t } = useTranslation();
  const { pick } = useLocale();
  const { preview } = usePreview();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [yearFilter, setYearFilter] = useState<YearFilter>("all");
  const [copied, setCopied] = useState<string | null>(null);

  const all = useMemo(
    () => (preview ? [...publications, ...samplePublications] : publications),
    [preview],
  );

  const years = useMemo(() => {
    const unique = new Set(all.map((entry) => entry.year));
    return [...unique].sort((a, b) => b - a);
  }, [all]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return all
      .filter((entry) => {
        if (typeFilter !== "all" && entry.type !== typeFilter) return false;
        if (yearFilter !== "all" && entry.year !== yearFilter) return false;
        if (!needle) return true;
        return [entry.title, entry.venue, ...entry.authors].some((value) =>
          value.toLowerCase().includes(needle),
        );
      })
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  }, [all, query, typeFilter, yearFilter]);

  const hasFilters = query.trim().length > 0 || typeFilter !== "all" || yearFilter !== "all";

  const clearFilters = () => {
    setQuery("");
    setTypeFilter("all");
    setYearFilter("all");
  };

  const copyBibtex = async (entry: Publication) => {
    if (!entry.bibtex) return;
    try {
      await navigator.clipboard.writeText(entry.bibtex);
      setCopied(entry.id);
      window.setTimeout(() => setCopied((value) => (value === entry.id ? null : value)), 2200);
    } catch {
      setCopied(null);
    }
  };

  return (
    <Page
      meta={{
        title: t("meta.publicationsTitle"),
        description: t("meta.publicationsDesc"),
        path: "/publications",
        noindex: preview,
      }}
    >
      <PageHeader
        index="02"
        eyebrow={t("publications.eyebrow")}
        title={t("publications.title")}
        lede={t("publications.lede")}
        aside={
          <div className="space-y-2">
            <p className="max-w-xs font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-steel md:ml-auto">
              {t("publications.note")}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel/60">
              {t("common.lastUpdated")} · {profile.updated}
            </p>
          </div>
        }
      />

      <div className="shell pb-24">
        <PreviewBanner />

        <div className="mt-8 flex flex-col gap-4 border-y border-line py-4 md:flex-row md:items-center md:justify-between">
          <label className="flex min-w-0 flex-1 items-center gap-3">
            <Search className="size-4 shrink-0 text-steel" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("publications.searchPlaceholder")}
              aria-label={t("publications.searchPlaceholder")}
              className="w-full min-w-0 bg-transparent font-mono text-xs text-ice outline-none placeholder:text-steel/60"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
              aria-label={t("publications.allTypes")}
              className="h-8 border border-line bg-void px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mist outline-none transition-colors hover:border-white/20 focus:border-glow/50"
            >
              <option value="all">{t("publications.allTypes")}</option>
              {(Object.keys(typeKeys) as PublicationType[]).map((key) => (
                <option key={key} value={key}>
                  {t(typeKeys[key])}
                </option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(event) =>
                setYearFilter(event.target.value === "all" ? "all" : Number(event.target.value))
              }
              aria-label={t("publications.allYears")}
              className="h-8 border border-line bg-void px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mist outline-none transition-colors hover:border-white/20 focus:border-glow/50"
            >
              <option value="all">{t("publications.allYears")}</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-steel underline decoration-line underline-offset-4 transition-colors hover:text-glow"
              >
                {t("publications.clear")}
              </button>
            ) : null}
          </div>
        </div>

        {all.length > 0 ? (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
            {t("publications.results", { shown: filtered.length, total: all.length })}
          </p>
        ) : null}

        {all.length === 0 ? (
          <EmptyState
            className="mt-10"
            title={t("publications.emptyTitle")}
            body={t("publications.emptyBody")}
            hint={t("publications.emptyHint")}
            action={<CtaLink to="/research">{t("publications.emptyCta")}</CtaLink>}
          />
        ) : filtered.length === 0 ? (
          <div className="mt-10 border border-line px-6 py-12 text-center md:py-16">
            <h2 className="font-display text-xl text-ice">{t("publications.noMatchTitle")}</h2>
            <p className="mt-2 text-sm text-steel">{t("publications.noMatchBody")}</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mist transition-colors hover:border-glow/40 hover:text-glow"
            >
              {t("publications.clear")}
            </button>
          </div>
        ) : (
          <ol className="mt-6 border-t border-line">
            {filtered.map((entry) => (
              <li key={entry.id} className="border-b border-line">
                <article className="grid gap-4 py-7 md:grid-cols-12 md:gap-6">
                  <div className="flex items-start gap-3 md:col-span-2 md:block">
                    <span className="font-mono text-sm text-glow/70">{entry.year}</span>
                    <div className="flex flex-wrap gap-1.5 md:mt-3">
                      {entry.sample ? <SampleBadge /> : null}
                      <span className="inline-flex items-center border border-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-steel">
                        {t(typeKeys[entry.type])}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-10">
                    <h2 className="max-w-3xl font-display text-xl leading-snug tracking-[-0.015em] text-ice md:text-2xl">
                      {entry.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-mist">{entry.authors.join(", ")}</p>
                    <p className="mt-1 font-mono text-[11px] leading-relaxed text-steel">
                      {t("publications.venueLabel")} · {entry.venue}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em]",
                          statusStyles[entry.status],
                        )}
                      >
                        {t(statusKeys[entry.status])}
                      </span>
                      {entry.featured ? (
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-glow/70">
                          {t("projects.featured")}
                        </span>
                      ) : null}
                    </div>

                    {entry.abstract ? (
                      <details className="group mt-4">
                        <summary className="inline-flex cursor-pointer list-none items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-steel transition-colors hover:text-glow">
                          <ChevronDown className="size-3 transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
                          {t("publications.abstractLabel")}
                        </summary>
                        <p className="mt-3 max-w-3xl border-l border-line pl-4 text-sm leading-relaxed text-mist">
                          {pick(entry.abstract)}
                        </p>
                      </details>
                    ) : null}

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                      {entry.doi ? (
                        <ArrowLink href={`https://doi.org/${entry.doi}`} external>
                          {t("publications.doiLabel")}
                        </ArrowLink>
                      ) : null}
                      {entry.pdf ? (
                        <ArrowLink href={entry.pdf} external>
                          {t("publications.pdfLabel")}
                        </ArrowLink>
                      ) : null}
                      {entry.code ? (
                        <ArrowLink href={entry.code} external>
                          {t("publications.codeLabel")}
                        </ArrowLink>
                      ) : null}
                      {entry.bibtex ? (
                        <button
                          type="button"
                          onClick={() => void copyBibtex(entry)}
                          className="font-mono text-[11px] uppercase tracking-[0.14em] text-silver underline decoration-line underline-offset-4 transition-colors hover:text-glow"
                        >
                          {copied === entry.id ? t("publications.bibtexCopied") : t("publications.copyBibtex")}
                        </button>
                      ) : null}
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
