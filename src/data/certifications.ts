import { l, type Localized } from "../lib/localized";

export type Certification = {
  id: string;
  title: Localized;
  result: Localized;
  detail?: Localized;
};

/**
 * Language and professional qualifications, kept separate from honours in the
 * interface and in the CV. Only confirmed results supplied by the owner.
 */
export const certifications: Certification[] = [
  {
    id: "cet-4",
    title: l("College English Test Band 4 (CET-4)", "大学英语四级考试（CET-4）"),
    result: l("627", "627"),
  },
  {
    id: "cet-6",
    title: l("College English Test Band 6 (CET-6)", "大学英语六级考试（CET-6）"),
    result: l("609", "609"),
  },
  {
    id: "ncre-c",
    title: l(
      "National Computer Rank Examination, Level 2 — C Programming",
      "全国计算机等级考试二级 C 语言程序设计",
    ),
    result: l("Good", "良好"),
  },
  {
    id: "putonghua",
    title: l("Putonghua Proficiency Test", "普通话水平测试"),
    result: l("Level 2, Grade B", "二级乙等"),
  },
];

export const certificationsCount = certifications.length;
