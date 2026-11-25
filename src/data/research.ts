import { la, l, type Localized } from "../lib/localized";

export type ResearchGlyph = "wave" | "lattice" | "channel" | "grid" | "convergence";

export type ResearchArea = {
  id: string;
  index: string;
  title: Localized;
  short: Localized;
  description: Localized;
  question: Localized;
  scale: Localized;
  keywords: Localized<string[]>;
  glyph: ResearchGlyph;
};

/**
 * Research directions. These are stated interests, not claims of completed
 * work. Descriptions describe the questions, not results.
 */
export const researchAreas: ResearchArea[] = [
  {
    id: "terahertz",
    index: "01",
    title: l("Terahertz electromagnetics", "太赫兹电磁学"),
    short: l(
      "Broadband fields between microwave and light — sources, propagation, and the structures that shape them.",
      "位于微波与光之间的宽带场——源、传播，以及塑造它们的结构。",
    ),
    description: l(
      "The terahertz band sits between microwaves and infrared, where many molecular and lattice resonances live but conventional sources and detectors remain difficult. I am interested in how broadband terahertz pulses propagate through, and couple to, structured materials — and in the measurement and modelling techniques that make this band accessible.",
      "太赫兹频段位于微波与红外之间，许多分子与晶格共振都落在这里，但常规的源与探测器仍然难以覆盖。我关注宽带太赫兹脉冲如何穿过人工结构并与之耦合，也关注让这一频段变得可及的测量与建模方法。",
    ),
    question: l(
      "How can broadband terahertz fields be shaped and detected with structures that are themselves smaller than the wavelength?",
      "如何用自身尺寸小于波长的结构，对宽带太赫兹场进行整形与探测？",
    ),
    scale: l("0.1–10 THz", "0.1–10 THz"),
    keywords: la(
      ["Time-domain spectroscopy", "Wave–matter interaction", "Broadband sources"],
      ["时域光谱", "波—物质相互作用", "宽带源"],
    ),
    glyph: "wave",
  },
  {
    id: "metasurfaces",
    index: "02",
    title: l("Metasurfaces & metamaterials", "超表面与超材料"),
    short: l(
      "Subwavelength unit cells that impose phase, amplitude and polarisation on a wavefront.",
      "以亚波长单元结构对波前施加相位、振幅与偏振控制。",
    ),
    description: l(
      "Planar arrays of subwavelength resonators can impose abrupt phase, amplitude and polarisation changes on an incident wave. I am interested in the design space of these unit cells — from resonant geometries to phase-gradient profiles — and in how their response can be made broadband, efficient and reconfigurable.",
      "由亚波长谐振单元组成的平面阵列，可以对入射波施加突变的相位、振幅与偏振。我关注这些单元结构的设计空间——从谐振几何到相位梯度分布——以及如何让它们的响应更宽带、更高效、可重构。",
    ),
    question: l(
      "What unit-cell geometries give efficient, broadband wavefront control without sacrificing fabrication tolerance?",
      "什么样的单元结构能在不牺牲加工容差的前提下，实现高效、宽带的波前调控？",
    ),
    scale: l("λ/10 – λ/2", "λ/10 – λ/2"),
    keywords: la(
      ["Phase-gradient metasurfaces", "Unit-cell design", "Wavefront shaping"],
      ["相位梯度超表面", "单元结构设计", "波前调控"],
    ),
    glyph: "lattice",
  },
  {
    id: "microfluidics",
    index: "03",
    title: l("Microfluidic sensing", "微流控传感"),
    short: l(
      "Confining a sample to the scale of an electromagnetic mode, and reading what changes.",
      "把样品约束到电磁模式的尺度，并读出其中的变化。",
    ),
    description: l(
      "A microfluidic channel confines a sample to a volume comparable to an electromagnetic mode, which can make small changes in permittivity observable. I am interested in the interplay between channel geometry, field confinement and readout sensitivity, especially in the microwave and terahertz regimes.",
      "微流控通道把样品约束到与电磁模式可比拟的体积中，使介电常数的微小变化变得可观测。我关注通道几何、场约束与读出灵敏度之间的相互作用，尤其是在微波与太赫兹频段。",
    ),
    question: l(
      "How close can a microfluidic channel and an electromagnetic resonator be brought together before their coupling becomes the dominant design constraint?",
      "微流控通道与电磁谐振器可以靠得多近，直到它们的耦合本身成为最主要的设计约束？",
    ),
    scale: l("10–500 µm", "10–500 µm"),
    keywords: la(
      ["Microfluidics", "Dielectric sensing", "Resonant readout"],
      ["微流控", "介电传感", "谐振读出"],
    ),
    glyph: "channel",
  },
  {
    id: "computational-em",
    index: "04",
    title: l("Computational electromagnetics", "计算电磁学"),
    short: l(
      "Turning Maxwell's equations into something that can be interrogated, and knowing its limits.",
      "把麦克斯韦方程变成可以被追问的东西，并清楚它的边界。",
    ),
    description: l(
      "Maxwell's equations rarely admit closed-form solutions for realistic structures. I am interested in finite-difference, finite-element and integral-equation methods — their dispersion, stability, boundary conditions and the assumptions that decide whether a simulation is a convenience or a falsifiable prediction.",
      "对于真实结构，麦克斯韦方程很少存在解析解。我关注有限差分、有限元与积分方程方法——它们的色散、稳定性、边界条件，以及决定一次仿真是便利工具还是可证伪预测的那些假设。",
    ),
    question: l(
      "Where does numerical dispersion end and physical dispersion begin in a broadband simulation?",
      "在宽带仿真中，数值色散在哪里结束，物理色散又从哪里开始？",
    ),
    scale: l("FDTD · FEM · MoM", "FDTD · FEM · MoM"),
    keywords: la(
      ["Dispersion & stability", "Boundary conditions", "Mesh convergence"],
      ["色散与稳定性", "边界条件", "网格收敛"],
    ),
    glyph: "grid",
  },
  {
    id: "scientific-computing",
    index: "05",
    title: l("Scientific computing", "科学计算"),
    short: l(
      "Small, legible tools that make an electromagnetic experiment repeatable.",
      "让电磁实验可重复的小而清晰的计算工具。",
    ),
    description: l(
      "Reproducible research depends on more than a solver: data structures, parameter sweeps, versioned scripts and careful visualisation all shape what can be seen. I am interested in building small, legible computational tools that make electromagnetic experiments easier to question and repeat.",
      "可复现的研究不只取决于求解器：数据结构、参数扫描、版本化的脚本与审慎的可视化，共同决定了我们能看到什么。我关注构建小而清晰的计算工具，让电磁实验更容易被追问与重复。",
    ),
    question: l(
      "What does a computational experiment need in order to be reproduced by someone who did not write it?",
      "一次计算实验需要具备什么，才能被没有写它的人复现？",
    ),
    scale: l("Python · pipelines", "Python · 工作流"),
    keywords: la(
      ["Reproducibility", "Parameter sweeps", "Data visualisation"],
      ["可复现性", "参数扫描", "数据可视化"],
    ),
    glyph: "convergence",
  },
];
