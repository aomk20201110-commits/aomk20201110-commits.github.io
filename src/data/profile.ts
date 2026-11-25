import { l } from "../lib/localized";

/**
 * Single source of truth for personal information.
 * Replace placeholder / public-handle values here and every page, the CV and
 * the structured data will follow.
 *
 * Only information that is confirmed should be filled in. Unknown fields stay
 * null and are hidden by the UI rather than invented.
 */
export const profile = {
  /** Public GitHub handle. Replace with a legal name once one should be public. */
  name: "Yurripe",
  displayName: "Yurripe",
  monogram: "Y",
  role: l("Undergraduate · Electronic Science and Technology", "本科生 · 电子科学与技术"),
  affiliation: l("Nanjing University of Posts and Telecommunications", "南京邮电大学"),
  affiliationShort: l("NJUPT", "南邮"),
  degree: l("B.Eng. candidate", "工学学士（在读）"),
  field: l("Electronic Science and Technology", "电子科学与技术"),
  graduation: l("2029 (expected)", "2029 年（预计）"),
  graduationYear: 2029,
  location: l("Nanjing, China", "中国 · 南京"),
  siteUrl: "https://aomk20201110-commits.github.io",
  repo: "aomk20201110-commits/aomk20201110-commits.github.io",
  updated: "2026-11-25",
  links: {
    github: "https://github.com/aomk20201110-commits",
    email: null,
    orcid: null,
    scholar: null,
    linkedin: null,
  },
} as const;

export type Profile = typeof profile;
