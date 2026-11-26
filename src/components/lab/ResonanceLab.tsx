import { useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import katex from "katex";
import "katex/dist/katex.min.css";
import { cn } from "../../lib/cn";
import {
  RESONANCE_PRESETS,
  resonanceCurve,
  resonanceMetrics,
} from "../../lib/models/resonance";

type Preset = "under" | "critical" | "over";

const PRESETS = RESONANCE_PRESETS;

const FORMULA = String.raw`
\begin{aligned}
r(\omega) &= \frac{j(\omega-\omega_0)+\gamma_i-\gamma_e}{j(\omega-\omega_0)+\gamma_i+\gamma_e} \\[4pt]
\gamma_{i,e} &= \frac{\omega_0}{2Q_{i,e}}, \qquad
\frac{1}{Q_\mathrm{tot}} = \frac{1}{Q_i} + \frac{1}{Q_e}
\end{aligned}
`;

const FORMULA_CRITERION = String.raw`
R(\omega_0) = \left(\frac{Q_i-Q_e}{Q_i+Q_e}\right)^{2}, \qquad
A(\omega_0) = 1 - R(\omega_0)
`;

function LabSlider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="eyebrow text-steel">{label}</span>
        <span className="font-mono text-xs tabular-nums text-ice">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 block h-1 w-full cursor-pointer appearance-none rounded-full bg-line accent-glow"
      />
    </label>
  );
}

export default function ResonanceLab({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [f0, setF0] = useState(1);
  const [qi, setQi] = useState(120);
  const [qe, setQe] = useState(120);
  const gradientId = useId().replace(/:/g, "");

  const metricsModel = useMemo(() => resonanceMetrics(qi, qe, f0), [qi, qe, f0]);
  const { totalQ, linewidthGHz, r0, a0, regime, spanGHz } = metricsModel;

  const data = useMemo(() => resonanceCurve(qi, qe, f0), [qi, qe, f0]);

  const chart = { width: 760, height: 250, left: 44, right: 18, top: 18, bottom: 30 };
  const plotWidth = chart.width - chart.left - chart.right;
  const plotHeight = chart.height - chart.top - chart.bottom;
  const xFor = (delta: number) => chart.left + ((delta + spanGHz) / (2 * spanGHz)) * plotWidth;
  const yFor = (value: number) => chart.top + (1 - value) * plotHeight;

  const linePath = (key: "r" | "a") =>
    data.map((point, index) => `${index === 0 ? "M" : "L"}${xFor(point.delta).toFixed(2)},${yFor(point[key]).toFixed(2)}`).join(" ");

  const rPath = linePath("r");
  const aPath = linePath("a");
  const areaPath = `${rPath} L ${xFor(spanGHz).toFixed(2)},${yFor(0).toFixed(2)} L ${xFor(-spanGHz).toFixed(2)},${yFor(0).toFixed(2)} Z`;

  const xTicks = [-spanGHz, -spanGHz / 2, 0, spanGHz / 2, spanGHz];
  const formulaHtml = useMemo(
    () => katex.renderToString(FORMULA, { displayMode: true, throwOnError: false }),
    [],
  );
  const criterionHtml = useMemo(
    () => katex.renderToString(FORMULA_CRITERION, { displayMode: false, throwOnError: false }),
    [],
  );

  const regimeLabel =
    regime === "critical"
      ? t("resonance.regimeCritical")
      : regime === "over"
        ? t("resonance.regimeOver")
        : t("resonance.regimeUnder");

  const metrics = [
    { label: t("resonance.totalQ"), value: totalQ.toFixed(0) },
    { label: t("resonance.linewidth"), value: `${linewidthGHz.toFixed(linewidthGHz >= 10 ? 1 : 2)} ${t("resonance.ghz")}` },
    { label: t("resonance.reflection"), value: `${(r0 * 100).toFixed(1)} %` },
    { label: t("resonance.absorption"), value: `${(a0 * 100).toFixed(1)} %` },
  ];

  return (
    <section className={cn("border border-line bg-panel/40", className)} aria-labelledby="resonance-lab-title">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-5">
        <div className="flex items-center gap-2">
          <span className="size-1.5 bg-glow" aria-hidden="true" />
          <h3 id="resonance-lab-title" className="font-mono text-[10px] uppercase tracking-[0.16em] text-mist">
            {t("resonance.formulaLabel")} · single port
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(PRESETS) as Preset[]).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setQi(PRESETS[preset].qi);
                setQe(PRESETS[preset].qe);
              }}
              className="border border-line px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-steel transition-colors hover:border-glow/40 hover:text-glow"
            >
              {t(`resonance.preset${preset === "under" ? "Under" : preset === "critical" ? "Critical" : "Over"}`)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setF0(1);
              setQi(120);
              setQe(120);
            }}
            className="border border-line px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-steel transition-colors hover:border-glow/40 hover:text-glow"
          >
            {t("resonance.reset")}
          </button>
        </div>
      </div>

      <div className="grid gap-5 border-b border-line px-4 py-4 md:grid-cols-12 md:px-5">
        <div className="md:col-span-4">
          <LabSlider
            label={t("resonance.f0")}
            value={f0}
            display={`${f0.toFixed(2)} ${t("resonance.thz")}`}
            min={0.5}
            max={3}
            step={0.01}
            onChange={setF0}
          />
        </div>
        <div className="md:col-span-4">
          <LabSlider
            label={t("resonance.qi")}
            value={qi}
            display={qi.toFixed(0)}
            min={10}
            max={1000}
            step={5}
            onChange={setQi}
          />
        </div>
        <div className="md:col-span-4">
          <LabSlider
            label={t("resonance.qe")}
            value={qe}
            display={qe.toFixed(0)}
            min={10}
            max={1000}
            step={5}
            onChange={setQe}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-line border-b border-line md:grid-cols-4 md:divide-y-0">
        {metrics.map((metric) => (
          <div key={metric.label} className="px-4 py-3 md:px-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">{metric.label}</p>
            <p className="mt-1 font-display text-lg text-ice">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 px-4 py-4 md:grid-cols-12 md:px-5">
        <figure className="md:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <figcaption className="eyebrow text-steel">{t("resonance.chartTitle")}</figcaption>
            <div className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.12em] text-steel">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-px w-4 bg-glow" aria-hidden="true" />
                {t("resonance.reflectance")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-px w-4 border-t border-dashed border-amber" aria-hidden="true" />
                {t("resonance.absorbance")}
              </span>
            </div>
          </div>
          <svg
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            className="chart-svg mt-3 w-full"
            role="img"
            aria-label={`${t("resonance.chartTitle")} — ${t("resonance.reflectance")} / ${t("resonance.absorbance")}`}
          >
            <defs>
              <linearGradient id={`${gradientId}-res`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((value) => (
              <g key={value}>
                <line
                  x1={chart.left}
                  x2={chart.width - chart.right}
                  y1={yFor(value)}
                  y2={yFor(value)}
                  className="chart-grid"
                  strokeDasharray={value === 0 ? undefined : "2 4"}
                />
                <text
                  x={chart.left - 7}
                  y={yFor(value) + 3}
                  textAnchor="end"
                  className="chart-axis-label"
                >
                  {value}
                </text>
              </g>
            ))}
            {xTicks.map((tick) => (
              <g key={tick}>
                <line
                  x1={xFor(tick)}
                  x2={xFor(tick)}
                  y1={chart.top}
                  y2={chart.top + plotHeight}
                  className="chart-grid"
                />
                <text
                  x={xFor(tick)}
                  y={chart.height - 8}
                  textAnchor="middle"
                  className="chart-axis-label"
                >
                  {Math.abs(tick) >= 10 ? tick.toFixed(0) : tick.toFixed(2)}
                </text>
              </g>
            ))}
            <path d={areaPath} fill={`url(#${gradientId}-res)`} />
            <path d={aPath} fill="none" stroke="var(--c-chart-hot)" strokeWidth="1.2" strokeDasharray="3 3" strokeOpacity="0.9" />
            <path d={rPath} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            <line
              x1={xFor(0)}
              x2={xFor(0)}
              y1={chart.top}
              y2={chart.top + plotHeight}
              stroke="currentColor"
              strokeOpacity="0.24"
              strokeDasharray="3 5"
            />
            <circle cx={xFor(0)} cy={yFor(r0)} r="2.8" fill="currentColor" />
            <text
              x={chart.left}
              y={chart.height - 8}
              textAnchor="start"
              className="chart-axis-label"
              opacity="0"
            >
              {t("resonance.detuning")}
            </text>
          </svg>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-steel">
            {t("resonance.detuning")} · {t("resonance.ghz")}
          </p>
        </figure>

        <div className="md:col-span-4">
          <div className="flex items-center justify-between gap-2">
            <span className="eyebrow text-steel">{t("resonance.regime")}</span>
            <span
              className={cn(
                "border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]",
                regime === "critical"
                  ? "border-glow/50 text-glow"
                  : regime === "over"
                    ? "border-amber/50 text-amber"
                    : "border-line text-mist",
              )}
            >
              {regimeLabel}
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-steel">
            {regime === "critical" ? t("resonance.criticalHint") : t("resonance.formulaVariables")}
          </p>
          <div
            className="mt-4 overflow-x-auto border-t border-line pt-3 text-[11px] text-mist [&_.katex]:text-ice"
            dangerouslySetInnerHTML={{ __html: formulaHtml }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-line px-4 py-4 md:flex-row md:items-start md:justify-between md:px-5">
        <p className="text-[11px] leading-relaxed text-steel">
          {t("resonance.criterion")}: <span className="text-mist" dangerouslySetInnerHTML={{ __html: criterionHtml }} />
        </p>
        <div className="flex flex-col gap-1.5 md:items-end md:text-right">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-glow/80">{t("resonance.notMeasured")}</span>
          <p className="max-w-xs text-[11px] leading-relaxed text-steel">{t("resonance.caption")}</p>
        </div>
      </div>
    </section>
  );
}
