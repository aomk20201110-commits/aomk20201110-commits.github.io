import { l, type Localized } from "../lib/localized";

export type ServiceEntry = {
  id: string;
  period: Localized;
  title: Localized;
  detail: Localized;
};

/**
 * Public service only at the level of activity and role. Locations, schools,
 * participants and identifying material are intentionally omitted.
 */
export const service: ServiceEntry[] = [
  {
    id: "summer-care-2026",
    period: l("Summer 2026", "2026 年暑期"),
    title: l(
      "“Returning Home” public summer care class — team member",
      "“返家乡”公益暑托班 — 团队成员",
    ),
    detail: l(
      "Volunteer support for a community children's public education programme.",
      "参与社区儿童公益助学志愿服务。",
    ),
  },
  {
    id: "alma-mater-talk-2026",
    period: l("2026", "2026 年"),
    title: l("“Love Back to Alma Mater” volunteer talk — speaker", "“爱回母校”志愿宣讲 — 分享人"),
    detail: l(
      "Shared university study experience and perspectives on choosing a major with high-school students considering university.",
      "向高中生分享大学学习经验与专业选择体会。",
    ),
  },
];
