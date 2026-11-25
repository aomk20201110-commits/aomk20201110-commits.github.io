import type { Localized } from "../lib/localized";

export type ProjectLink = {
  label: Localized;
  href: string;
};

export type Project = {
  id: string;
  title: string;
  year: number;
  category: Localized;
  summary: Localized;
  tags: string[];
  links: ProjectLink[];
  status?: Localized;
  /** Sample entries are only reachable through ?demo=1 and are never public records. */
  sample?: boolean;
  featured?: boolean;
};

/**
 * Public, shareable project records only.
 * Add a project when its repository or documentation can be linked publicly.
 */
export const projects: Project[] = [];
