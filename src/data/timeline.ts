import { l, type Localized } from "../lib/localized";
import { education, honors } from "./honors";

export type TimelineItem = {
  id: string;
  year: number;
  kind: "education" | "honour";
  title: Localized;
  detail?: Localized;
  href: string;
};

/**
 * Events with an explicit year only. Awards whose dates are expressed as an
 * edition or academic year stay on the Honours page instead of being assigned
 * an invented calendar date here.
 */
export const academicTimeline: TimelineItem[] = [
  {
    id: "degree-start",
    year: 2025,
    kind: "education" as const,
    title: education[0].title,
    detail: l(
      "Began the undergraduate programme in electronic science and technology.",
      "开始电子科学与技术本科学习。",
    ),
    href: "/about",
  },
  ...honors
    .filter((honor) => honor.timelineYear)
    .map((honor) => ({
      id: honor.id,
      year: honor.timelineYear as number,
      kind: "honour" as const,
      title: honor.title,
      detail: honor.rank,
      href: `/honors#${honor.id}`,
    })),
].sort((a, b) => b.year - a.year || a.id.localeCompare(b.id));
