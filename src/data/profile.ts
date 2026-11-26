import config from "../../site.config.json";
import type { Localized } from "../lib/localized";

/**
 * Public profile, derived from `site.config.json`.
 *
 * The JSON file is the single source for personal details, page SEO metadata,
 * the CV and structured data. Unknown or private fields stay `null`; the UI
 * hides them rather than inventing a value.
 */
const { profile: source, site } = config;

export const profile = {
  name: source.displayName,
  displayName: source.displayName,
  monogram: source.monogram,
  role: source.role as Localized<string>,
  affiliation: source.affiliation as Localized<string>,
  affiliationShort: source.affiliationShort as Localized<string>,
  degree: source.degree as Localized<string>,
  field: source.field as Localized<string>,
  graduation: source.graduation as Localized<string>,
  graduationYear: source.graduationYear,
  location: source.location as Localized<string>,
  siteUrl: site.url,
  repo: site.repo,
  updated: site.updated,
  links: source.links,
} as const;

export type Profile = typeof profile;
