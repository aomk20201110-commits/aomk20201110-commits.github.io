import { l, type Localized } from "../lib/localized";

export type EducationEntry = {
  id: string;
  period: Localized;
  title: Localized;
  institution: Localized;
  detail: Localized;
  status: "in-progress" | "expected" | "completed";
};

export type HonorCategory = "competition" | "scholarship" | "academic";

export type Honor = {
  id: string;
  title: Localized;
  organisation: Localized;
  category: HonorCategory;
  /** The edition, competition year or academic year as supplied. */
  period: Localized;
  /** Only present when a specific calendar year is known. */
  year?: number;
  /** Used by the academic timeline; omitted when the date is not explicit. */
  timelineYear?: number;
  rank?: Localized;
  detail?: Localized;
  /** Highlighted on the home page and at the top of the Honours page. */
  featured?: boolean;
  sample?: boolean;
};

export const education: EducationEntry[] = [
  {
    id: "beng",
    period: l("2025 — 2029 (expected)", "2025 — 2029（预计）"),
    title: l("B.Eng. in Electronic Science and Technology", "电子科学与技术 · 工学学士"),
    institution: l(
      "Nanjing University of Posts and Telecommunications",
      "南京邮电大学",
    ),
    detail: l(
      "Undergraduate programme in electronic science and technology, entered in 2025 and expected to graduate in 2029. Current interests: electromagnetics, terahertz devices, metasurfaces, microwave and millimetre-wave technology, microfluidic sensing, computational electromagnetics and scientific computing.",
      "电子科学与技术本科，2025 年入学，预计 2029 年毕业。当前兴趣：电磁学、太赫兹器件、超表面、微波与毫米波技术、微流控传感、计算电磁学与科学计算。",
    ),
    status: "in-progress",
  },
];

/**
 * Public, confirmed honours only.
 *
 * The user's prose mentioned “9 competition and university honours”, but the
 * enumerated list contains eight. Nothing is invented to fill the gap; the
 * count rendered by the site is derived from this array.
 */
export const honors: Honor[] = [
  {
    id: "cmc-18",
    title: l(
      "18th Chinese Mathematics Competition (CMC) — Non-Mathematics Category A, provincial preliminary",
      "第十八届全国大学生数学竞赛（CMC，非数学类 A 组）省级初赛",
    ),
    organisation: l("Chinese Mathematics Competition", "全国大学生数学竞赛"),
    category: "competition",
    period: l("18th edition", "第十八届"),
    year: 2026,
    timelineYear: 2026,
    rank: l("First Prize, Provincial Level", "省级一等奖"),
    detail: l(
      "Provincial-level first prize. The award is not a national-final prize.",
      "省级一等奖，并非全国总决赛奖项。",
    ),
    featured: true,
  },
  {
    id: "cmc-17",
    title: l(
      "17th Chinese Mathematics Competition (CMC) — Non-Mathematics Category A, provincial preliminary",
      "第十七届全国大学生数学竞赛（CMC，非数学类 A 组）省级初赛",
    ),
    organisation: l("Chinese Mathematics Competition", "全国大学生数学竞赛"),
    category: "competition",
    period: l("17th edition", "第十七届"),
    year: 2025,
    timelineYear: 2025,
    rank: l("First Prize, Provincial Level", "省级一等奖"),
    detail: l(
      "Provincial-level first prize, awarded in the preceding edition.",
      "省级一等奖，于上一届获得。",
    ),
    featured: true,
  },
  {
    id: "mcm-2026",
    title: l(
      "Mathematical Contest in Modeling / Interdisciplinary Contest in Modeling (MCM/ICM) 2026",
      "2026 年美国大学生数学建模竞赛（MCM/ICM）",
    ),
    organisation: l(
      "Consortium for Mathematics and Its Applications (COMAP)",
      "美国数学及其应用联合会（COMAP）",
    ),
    category: "competition",
    period: l("2026", "2026 年"),
    year: 2026,
    timelineYear: 2026,
    rank: l("Honorable Mention", "Honorable Mention"),
    detail: l(
      "Team-based modelling and writing under competition conditions. The submitted paper is not published here.",
      "在竞赛条件下完成的团队建模与论文写作。参赛论文不在此公开。",
    ),
    featured: true,
  },
  {
    id: "jiangsu-higher-math-23",
    title: l(
      "23rd Jiangsu Provincial Higher Mathematics Competition (Undergraduate Level I, Group A)",
      "江苏省高等学校第二十三届高等数学竞赛（本科一级 A）",
    ),
    organisation: l(
      "Jiangsu Provincial Higher Mathematics Competition",
      "江苏省高等学校高等数学竞赛",
    ),
    category: "competition",
    period: l("23rd edition", "第二十三届"),
    year: 2025,
    timelineYear: 2025,
    rank: l("Second Prize, Jiangsu Province", "江苏省二等奖"),
  },
  {
    id: "word-master-6",
    title: l(
      "6th SFLEP Word Master Cup, Jiangsu Division (Undergraduate Non-English Major Group)",
      "第六届“外教社·词达人杯”江苏赛区本科非英语类专业组",
    ),
    organisation: l("SFLEP Word Master Cup", "外教社·词达人杯"),
    category: "competition",
    period: l("6th edition", "第六届"),
    rank: l("First Prize, Jiangsu Division", "江苏赛区一等奖"),
    detail: l(
      "Division-level award in the Jiangsu regional round; not a national-final prize.",
      "江苏赛区（省级赛区）奖项，并非全国总决赛奖项。",
    ),
  },
  {
    id: "scholarship-2025-2026",
    title: l(
      "First-Class Scholarship, 2025–2026 Academic Year",
      "2025—2026 学年一等奖学金",
    ),
    organisation: l(
      "Nanjing University of Posts and Telecommunications",
      "南京邮电大学",
    ),
    category: "scholarship",
    period: l("2025–2026 academic year", "2025—2026 学年"),
    timelineYear: 2026,
  },
  {
    id: "merit-student-2025-2026",
    title: l(
      "Merit Student, 2025–2026 Academic Year",
      "2025—2026 学年三好学生",
    ),
    organisation: l(
      "Nanjing University of Posts and Telecommunications",
      "南京邮电大学",
    ),
    category: "academic",
    period: l("2025–2026 academic year", "2025—2026 学年"),
    timelineYear: 2026,
  },
  {
    id: "single-subject-2025-2026",
    title: l(
      "Outstanding Single-Subject Academic Performance Award, 2025–2026 Academic Year",
      "2025—2026 学年单科学习成绩优秀奖",
    ),
    organisation: l(
      "Nanjing University of Posts and Telecommunications",
      "南京邮电大学",
    ),
    category: "academic",
    period: l("2025–2026 academic year", "2025—2026 学年"),
    timelineYear: 2026,
  },
];

export const honorsCount = honors.length;

export function honorsByCategory(category: HonorCategory): Honor[] {
  return honors.filter((honor) => honor.category === category);
}
