import { publications } from "../data/publications";
import { projects } from "../data/projects";
import { honors } from "../data/honors";
import { hasNotes } from "../data/notes";
import { navigation, type PageKey } from "../navigation";

/**
 * Sections without confirmed public records are kept in the router (their
 * data model and empty states remain), but they are removed from navigation
 * and marked noindex until content exists. Adding a record makes them public
 * again automatically on the next build.
 */
export const availability = {
  publications: publications.length > 0,
  projects: projects.length > 0,
  honors: honors.length > 0,
  notes: hasNotes,
} as const;

export function isSectionAvailable(key: PageKey): boolean {
  if (
    key === "publications" ||
    key === "projects" ||
    key === "honors" ||
    key === "notes"
  ) {
    return availability[key];
  }
  return true;
}

export const visibleNavigation = navigation.filter((item) => isSectionAvailable(item.key));

export const hasAnyArchive = availability.publications || availability.projects || availability.honors;
