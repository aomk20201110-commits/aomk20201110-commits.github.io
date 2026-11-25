import { l, type Localized } from "../lib/localized";

export type EducationEntry = {
  id: string;
  period: Localized;
  title: Localized;
  institution: Localized;
  detail: Localized;
  status: "in-progress" | "expected" | "completed";
};

export type HonorCategory = "award" | "scholarship" | "service" | "academic";

export type Honor = {
  id: string;
  year: string;
  title: Localized;
  organisation: Localized;
  category: HonorCategory;
  detail?: Localized;
  sample?: boolean;
};

/**
 * Education is known and confirmed. Start dates are intentionally omitted:
 * only the expected graduation year has been provided.
 */
export const education: EducationEntry[] = [
  {
    id: "beng",
    period: l("Expected 2029", "预计 2029 年"),
    title: l("B.Eng. in Electronic Science and Technology", "电子科学与技术 · 工学学士"),
    institution: l(
      "Nanjing University of Posts and Telecommunications",
      "南京邮电大学",
    ),
    detail: l(
      "Undergraduate programme in electronic science and technology, currently in progress. Research interests: terahertz electromagnetics, metasurfaces, microfluidic sensing, computational electromagnetics and scientific computing.",
      "电子科学与技术本科在读。研究兴趣：太赫兹电磁学、超表面、微流控传感、计算电磁学与科学计算。",
    ),
    status: "in-progress",
  },
];

/**
 * Confirmed awards, scholarships and service records only.
 * Nothing is listed until it is verified and approved for publication.
 */
export const honors: Honor[] = [];
