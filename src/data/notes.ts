import type { Localized } from "../lib/localized";

export type ResearchNote = {
  id: string;
  date: string;
  title: Localized;
  summary: Localized;
  tags: string[];
  href?: string;
};

/**
 * Research notes are published only when a note is complete, reproducible and
 * safe to share. The empty array keeps the page and navigation hidden.
 */
export const researchNotes: ResearchNote[] = [];

export const hasNotes = researchNotes.length > 0;
