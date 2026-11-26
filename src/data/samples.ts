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
 *
 * Honours and projects now contain real records, so their sample arrays are
 * intentionally empty; only publications still need a layout preview.
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

export const sampleProjects: Project[] = [];
export const sampleHonors: Honor[] = [];
