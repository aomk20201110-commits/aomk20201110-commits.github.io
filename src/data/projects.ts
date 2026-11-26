import { l, la, type Localized } from "../lib/localized";

export type ProjectLink = {
  label: Localized;
  href: string;
};

export type Project = {
  id: string;
  title: Localized;
  period: Localized;
  year: number;
  category: Localized;
  summary: Localized;
  tags: string[];
  links: ProjectLink[];
  status: Localized;
  /** Detail sections shown at /projects/:id. */
  question: Localized;
  background: Localized;
  methods: Localized<string[]>;
  tools: string[];
  validation: Localized;
  materials: Localized;
  featured?: boolean;
  sample?: boolean;
};

/**
 * Public research training and engineering practice.
 *
 * These are training experiences, not claims of completed research outputs.
 * Questions, parameters, unpublished results and simulation files are left out
 * by design.
 */
export const projects: Project[] = [
  {
    id: "computational-electromagnetics-training",
    title: l("Computational Electromagnetics Training", "计算电磁学训练"),
    period: l("2025 — present", "2025 — 至今"),
    year: 2026,
    category: l("Research training", "科研训练"),
    summary: l(
      "A structured undergraduate training in full-wave modelling for terahertz devices, metasurfaces and microfluidic resonant sensing.",
      "面向太赫兹器件、超表面与微流控谐振传感的全波建模本科科研训练。",
    ),
    tags: ["COMSOL", "CST", "Full-wave simulation", "Mesh convergence"],
    links: [],
    status: l("Ongoing", "进行中"),
    question: l(
      "How can a simulated electromagnetic response be made trustworthy before fabrication?",
      "在加工之前，如何让电磁仿真的响应结果变得可信？",
    ),
    background: l(
      "A full-wave solver is useful only when its numerical assumptions are explicit. This training follows the path from geometry and material models to mesh convergence, parameter sweeps and error analysis, using canonical structures before moving to more complex devices.",
      "全波求解器的价值取决于其数值假设是否明确。这项训练从几何与材料模型出发，经过网格收敛、参数扫描与误差分析，先以典型结构建立流程，再进入更复杂的器件问题。",
    ),
    methods: la(
      [
        "Build canonical two- and three-dimensional electromagnetic geometries",
        "Check mesh convergence and boundary-condition sensitivity",
        "Sweep geometric and material parameters against a defined observable",
        "Compare numerical limits with analytical expectations where available",
        "Record assumptions and error sources alongside every result",
      ],
      [
        "建立典型二维与三维电磁几何模型",
        "检查网格收敛性与边界条件敏感性",
        "围绕明确观测量扫描几何与材料参数",
        "在可能时与解析预期对比数值极限",
        "在每个结果旁记录假设与误差来源",
      ],
    ),
    tools: ["COMSOL Multiphysics", "CST Studio Suite", "MATLAB"],
    validation: l(
      "Results are checked against published methods and analytical limits where available; mesh and boundary sensitivity are recorded. No measured data is claimed.",
      "在可获得时，结果会与公开方法和解析极限对照，并记录网格与边界敏感性。本站不声称拥有实测数据。",
    ),
    materials: l(
      "Public materials are limited to this methods summary and generic diagrams. Source models, parameter files and unpublished results are not published.",
      "公开材料仅限本方法概述与通用示意图。仿真源文件、参数文件与未发表结果不公开。",
    ),
    featured: true,
  },
  {
    id: "literature-and-reproducibility",
    title: l(
      "Literature & Reproducibility Practice",
      "文献与可复现性实践",
    ),
    period: l("2025 — present", "2025 — 至今"),
    year: 2026,
    category: l("Research workflow", "科研工作流"),
    summary: l(
      "A reading and reproduction practice for terahertz and electromagnetic literature, focused on what can actually be verified.",
      "面向太赫兹与电磁文献的阅读与复现实践，关注真正可以验证的内容。",
    ),
    tags: ["Zotero", "LaTeX", "Reproduction", "Model validation"],
    links: [],
    status: l("Ongoing", "进行中"),
    question: l(
      "What does it take to reproduce a published electromagnetic result?",
      "复现一项已发表的电磁结果，需要哪些条件？",
    ),
    background: l(
      "Reading is organised by method and physical mechanism rather than by headline result. Promising papers are reduced to their assumptions, geometry, numerical protocol and validation strategy so that the claim can be separated from the presentation.",
      "阅读按方法与物理机制组织，而非按标题结果分类。对有价值的论文，会拆解其假设、几何、数值流程与验证策略，把主张与表达分开。",
    ),
    methods: la(
      [
        "Maintain a classified map of terahertz and electromagnetic literature",
        "Recreate analytical limits and canonical examples",
        "Compare numerical trends with reported behaviour",
        "Document assumptions and discrepancies that remain unresolved",
      ],
      [
        "维护太赫兹与电磁文献的分类地图",
        "重建解析极限与典型算例",
        "将数值趋势与论文报告的行为对照",
        "记录假设与尚未解决的差异",
      ],
    ),
    tools: ["Zotero", "LaTeX", "Python", "NumPy"],
    validation: l(
      "Reproduction is limited to public methods and generic models. Internal questions, parameters and conclusions are excluded.",
      "复现仅限公开方法与通用模型。内部研究问题、参数与结论不在此公开。",
    ),
    materials: l(
      "No manuscripts, raw data or simulation files are published here.",
      "本站不发布论文手稿、原始数据或仿真文件。",
    ),
    featured: true,
  },
  {
    id: "mathematical-modelling-mcm",
    title: l("Mathematical Modelling — MCM/ICM 2026", "数学建模 — 2026 MCM/ICM"),
    period: l("2026", "2026 年"),
    year: 2026,
    category: l("Mathematical modelling", "数学建模"),
    summary: l(
      "Team-based modelling, optimisation, numerical computation and sensitivity analysis, recognised with an Honorable Mention.",
      "团队建模、优化、数值计算与灵敏度分析训练，获 Honorable Mention。",
    ),
    tags: ["Python", "NumPy", "SciPy", "LaTeX", "Sensitivity analysis"],
    links: [],
    status: l("Completed · Honorable Mention", "已完成 · Honorable Mention"),
    question: l(
      "How should a model be simplified without hiding the mechanism that matters?",
      "模型应如何简化，才不会掩盖真正重要的机制？",
    ),
    background: l(
      "Competition modelling compresses an open problem into a defensible model under time pressure, making assumptions, sensitivity and communication part of the result rather than an afterthought.",
      "竞赛建模需要在有限时间内把开放问题压缩为可辩护的模型，因此假设、敏感性与表达本身就是结果的一部分，而不是事后补充。",
    ),
    methods: la(
      [
        "Frame the problem and define the modelling scope",
        "Construct and compare candidate models",
        "Implement numerical solution and optimisation routines",
        "Test sensitivity to the dominant parameters",
        "Visualise results and organise the written argument",
      ],
      [
        "界定问题并明确建模范围",
        "构建并比较候选模型",
        "实现数值求解与优化流程",
        "检验结果对主要参数的敏感性",
        "可视化结果并组织论证",
      ],
    ),
    tools: ["Python", "NumPy", "SciPy", "LaTeX"],
    validation: l(
      "The submitted paper is not reproduced or published here. Only the public award and the general modelling workflow are listed.",
      "参赛论文不在本站复现或公开。本站仅列出公开奖项与通用建模流程。",
    ),
    materials: l(
      "The competition submission is not published. The award is listed on the Honours page.",
      "竞赛论文不公开。奖项列于荣誉页面。",
    ),
    featured: true,
  },
  {
    id: "electronics-embedded-practice",
    title: l(
      "Electronics & Embedded Systems Practice",
      "电子与嵌入式系统实践",
    ),
    period: l("2025 — present", "2025 — 至今"),
    year: 2026,
    category: l("Engineering practice", "工程实践"),
    summary: l(
      "STM32 programming, waveform generation and measurement, analogue circuit design and instrument-based debugging.",
      "STM32 编程、波形生成与测量、模拟电路设计与仪器调试。",
    ),
    tags: ["STM32", "C", "Multisim", "Oscilloscope", "Circuit measurement"],
    links: [],
    status: l("Ongoing", "进行中"),
    question: l(
      "How does a signal move from a circuit model to a measured waveform?",
      "信号如何从电路模型走到可测量的波形？",
    ),
    background: l(
      "Bench work connects simulation to measurement: supplies, probes, grounding and timing decide whether a circuit behaves as designed. The practice focuses on building that chain carefully and reading the instrument honestly.",
      "台架实验把仿真与测量连接起来：供电、探头、接地与时序决定电路是否按设计工作。这项实践关注谨慎搭建这条链路，并诚实地读取仪器结果。",
    ),
    methods: la(
      [
        "Program STM32 peripherals for timing and digital I/O",
        "Generate and measure basic waveforms",
        "Design and simulate analogue stages in Multisim",
        "Use an oscilloscope and signal generator for verification",
        "Compare measurements with expected circuit behaviour",
      ],
      [
        "配置 STM32 外设的定时与数字 I/O",
        "生成并测量基础波形",
        "在 Multisim 中设计与仿真模拟电路",
        "使用示波器与信号发生器验证",
        "将测量结果与预期电路行为对照",
      ],
    ),
    tools: ["STM32", "C", "C++", "Multisim", "Oscilloscope", "Signal generator"],
    validation: l(
      "Practice-level work only. No product, patent, deployment or independent large-scale project is claimed.",
      "仅为学习实践。本站不声称拥有产品、专利、实际部署或独立完成的大型工程项目。",
    ),
    materials: l(
      "No project files or instrument data are published.",
      "不公开项目文件或仪器数据。",
    ),
  },
];

export function projectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export const featuredProjects = projects.filter((project) => project.featured);
