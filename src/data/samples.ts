import { l } from "../lib/localized";
import type { Publication } from "./publications";
import type { Project } from "./projects";
import type { Honor } from "./honors";

/**
 * SAMPLE CONTENT — layout review only.
 *
 * These entries are never shown in the public build. They are reachable only
 * through ?demo=1, are labelled SAMPLE in the UI and set the page to noindex.
 * They are fictional and must not be treated as real records.
 */

export const samplePublications: Publication[] = [
  {
    id: "sample-metasurface",
    year: 2026,
    title: "Phase-gradient metasurface for broadband terahertz wavefront shaping",
    authors: ["Sample Author", "Sample Coauthor", "Yurripe"],
    venue: "Sample Journal of Applied Electromagnetics",
    type: "journal",
    status: "published",
    abstract: l(
      "A demonstration entry used to review the layout of a publication record, including a long abstract, author list, identifiers and outbound links. This text is fictional.",
      "这是一条用于检查论文条目版式的示例记录，包含长摘要、作者列表、标识符与外部链接。文字内容为虚构。",
    ),
    doi: "10.0000/sample.2026.0001",
    pdf: "#",
    code: "#",
    bibtex:
      "@article{sample2026metasurface,\n  title = {Phase-gradient metasurface for broadband terahertz wavefront shaping},\n  author = {Sample Author and Sample Coauthor and Yurripe},\n  journal = {Sample Journal of Applied Electromagnetics},\n  year = {2026}\n}",
    sample: true,
    featured: true,
  },
  {
    id: "sample-microfluidic",
    year: 2026,
    title: "A compact microfluidic resonant sensor for dielectric characterisation",
    authors: ["Sample Author", "Yurripe"],
    venue: "Sample Conference on Microwave Sensing",
    type: "conference",
    status: "published",
    abstract: l(
      "A second demonstration record, shorter than the first, used to check how conference entries and their metadata are rendered. This text is fictional.",
      "第二条示例记录，篇幅较短，用于检查会议条目及元数据的排版。文字内容为虚构。",
    ),
    doi: "10.0000/sample.2026.0002",
    sample: true,
  },
  {
    id: "sample-preprint",
    year: 2025,
    title: "An open numerical toolkit for array-factor exploration",
    authors: ["Yurripe", "Sample Author"],
    venue: "arXiv (sample)",
    type: "preprint",
    status: "preprint",
    abstract: l(
      "A third demonstration record showing preprint styling. This text is fictional and the identifier is not real.",
      "第三条示例记录，用于展示预印本样式。文字与标识符均为虚构。",
    ),
    doi: "10.0000/sample.2025.0003",
    sample: true,
  },
];

export const sampleProjects: Project[] = [
  {
    id: "sample-array-toolkit",
    title: "Phased-array beam steering toolkit",
    year: 2026,
    category: l("Computational tool", "计算工具"),
    summary: l(
      "An interactive exploration of array factor, grating lobes and beam broadening for uniform linear and planar arrays. Sample record for layout review.",
      "面向均匀线阵与平面阵的阵列因子、栅瓣与波束展宽交互探索工具。用于版式检查的示例记录。",
    ),
    tags: ["Python", "NumPy", "Matplotlib", "Signal processing"],
    links: [{ label: l("GitHub profile", "GitHub 主页"), href: "https://github.com/aomk20201110-commits" }],
    status: l("Active", "进行中"),
    sample: true,
    featured: true,
  },
  {
    id: "sample-thz-viewer",
    title: "Terahertz time-domain trace viewer",
    year: 2026,
    category: l("Experiment tooling", "实验工具"),
    summary: l(
      "A small viewer for time-domain waveforms and their spectra, designed to make parameter sweeps easy to compare. Sample record for layout review.",
      "用于时域波形及其频谱的小型查看器，便于比较不同参数扫描。用于版式检查的示例记录。",
    ),
    tags: ["Python", "FFT", "Data visualisation"],
    links: [{ label: l("GitHub profile", "GitHub 主页"), href: "https://github.com/aomk20201110-commits" }],
    status: l("Prototype", "原型"),
    sample: true,
  },
  {
    id: "sample-resonator-sweep",
    title: "Microfluidic resonator parameter sweep",
    year: 2025,
    category: l("Simulation", "仿真"),
    summary: l(
      "A reproducible sweep of channel geometry against resonant response, with versioned configuration and exported figures. Sample record for layout review.",
      "针对通道几何与谐振响应的可复现参数扫描，包含版本化配置与导出图表。用于版式检查的示例记录。",
    ),
    tags: ["Python", "FDTD", "Reproducibility"],
    links: [{ label: l("GitHub profile", "GitHub 主页"), href: "https://github.com/aomk20201110-commits" }],
    status: l("Archived", "已归档"),
    sample: true,
  },
];

export const sampleHonors: Honor[] = [
  {
    id: "sample-fellowship",
    year: "2026",
    title: l("Undergraduate research fellowship (sample)", "本科生科研奖学金（示例）"),
    organisation: l("Sample Foundation", "示例基金会"),
    category: "scholarship",
    detail: l(
      "A demonstration entry for the honors timeline. This record is fictional.",
      "用于荣誉时间轴的示例条目。该记录为虚构。",
    ),
    sample: true,
  },
  {
    id: "sample-award",
    year: "2025",
    title: l("Student innovation award (sample)", "学生创新奖（示例）"),
    organisation: l("Sample University", "示例大学"),
    category: "award",
    detail: l("Another demonstration entry. This record is fictional.", "另一条示例记录，内容为虚构。"),
    sample: true,
  },
];
