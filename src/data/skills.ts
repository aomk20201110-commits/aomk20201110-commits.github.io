import { l, type Localized } from "../lib/localized";

export type SkillGroup = {
  id: string;
  title: Localized;
  summary: Localized;
  items: string[];
};

/**
 * Tools and methods the owner has used in coursework, self-study or project
 * work. Deliberately no proficiency percentages or unverifiable levels.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "computational-em",
    title: l("Computational electromagnetics", "计算电磁学"),
    summary: l(
      "Full-wave modelling workflow: geometry, materials, meshing and convergence.",
      "全波建模仿真流程：几何、材料、网格与收敛性。",
    ),
    items: ["COMSOL Multiphysics", "CST Studio Suite"],
  },
  {
    id: "scientific-computing",
    title: l("Scientific computing", "科学计算"),
    summary: l(
      "Numerical experiments, parameter sweeps and scientific visualisation.",
      "数值实验、参数扫描与科学可视化。",
    ),
    items: ["MATLAB", "Python", "NumPy", "SciPy", "Numerical analysis", "Scientific visualisation"],
  },
  {
    id: "electronics-embedded",
    title: l("Electronics & embedded systems", "电子与嵌入式系统"),
    summary: l(
      "Embedded programming, analogue circuit simulation and bench measurement.",
      "嵌入式编程、模拟电路仿真与台式仪器测量。",
    ),
    items: ["STM32", "C / C++", "Multisim", "Oscilloscope", "Signal generator", "Circuit measurement"],
  },
  {
    id: "research-workflow",
    title: l("Research workflow", "科研工作流"),
    summary: l(
      "Reproducible notes, references and versioned computational work.",
      "可复现的笔记、文献管理与版本化计算工作。",
    ),
    items: ["LaTeX", "Zotero", "Git", "Reference management", "Reproducible workflows"],
  },
];
