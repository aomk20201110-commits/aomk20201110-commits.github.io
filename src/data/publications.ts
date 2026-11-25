import type { Localized } from "../lib/localized";

export type PublicationType = "journal" | "conference" | "preprint";
export type PublicationStatus = "published" | "preprint" | "under-review" | "in-preparation";

export type Publication = {
  id: string;
  year: number;
  title: string;
  authors: string[];
  venue: string;
  type: PublicationType;
  status: PublicationStatus;
  abstract?: Localized;
  doi?: string;
  pdf?: string;
  code?: string;
  bibtex?: string;
  /** Sample entries are only reachable through ?demo=1 and are never public records. */
  sample?: boolean;
  featured?: boolean;
};

/**
 * Public, verified publication records only.
 *
 * Add entries here once they are public. Do not list unpublished manuscripts,
 * submissions under review, or results that have not been approved for release.
 */
export const publications: Publication[] = [];
