import { useEffect, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "../../lib/cn";
import { useMotionPreference } from "../../lib/motion";

const N = 8;
const K = 2 * Math.PI;
const SAMPLES = 721;

type PatternPoint = { angle: number; af: number; db: number };

function dirichlet(n: number, psi: number) {
  const half = psi / 2;
  const denominator = Math.sin(half);
  if (Math.abs(denominator) < 1e-9) return 1;
  return Math.sin(n * half) / (n * denominator);
}

function computePattern(steering: number, spacing: number): PatternPoint[] {
  const steer = (steering * Math.PI) / 180;
  const points: PatternPoint[] = [];
  for (let i = 0; i < SAMPLES; i += 1) {
    const angle = -90 + (i * 180) / (SAMPLES - 1);
    const theta = (angle * Math.PI) / 180;
    const psi = K * spacing * (Math.sin(theta) - Math.sin(steer));
    const af = Math.abs(dirichlet(N, psi));
    const db = Math.max(20 * Math.log10(Math.max(af, 1e-4)), -60);
    points.push({ angle, af, db });
  }
  return points;
}

type Metrics = {
  peakAngle: number;
  peakDb: number;
  hpbw: number | null;
  sidelobe: number | null;
  grating: boolean;
};

function analyse(points: PatternPoint[], steering: number, spacing: number): Metrics {
  let peakIndex = 0;
  for (let i = 1; i < points.length; i += 1) {
    if (points[i].db > points[peakIndex].db) peakIndex = i;
  }

  let left = peakIndex;
  while (left > 0 && points[left].db > -3) left -= 1;
  let right = peakIndex;
  while (right < points.length - 1 && points[right].db > -3) right += 1;

  let hpbw: number | null = null;
  if (points[left].db <= -3 || left === 0) {
    if (right > left) hpbw = points[right].angle - points[left].angle;
  }

  let sidelobe: number | null = null;
  for (let i = 1; i < points.length - 1; i += 1) {
    const isPeak = points[i].db >= points[i - 1].db && points[i].db >= points[i + 1].db;
    const isMain = Math.abs(i - peakIndex) < 12;
    if (isPeak && !isMain) {
      sidelobe = sidelobe === null ? points[i].db : Math.max(sidelobe, points[i].db);
    }
  }

  const steerRad = (steering * Math.PI) / 180;
  const gratingLimit = 1 / (1 + Math.abs(Math.sin(steerRad)));
  return {
    peakAngle: points[peakIndex].angle,
    peakDb: points[peakIndex].db,
    hpbw,
    sidelobe,
    grating: spacing >= gratingLimit - 1e-9,
  };
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
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

export default function ArrayFactorLab({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { reduced } = useMotionPreference();
  const [steering, setSteering] = useState(18);
  const [spacing, setSpacing] = useState(0.5);
  const [sweeping, setSweeping] = useState(false);
  const gradientId = useId().replace(/:/g, "");
  const clipId = useId().replace(/:/g, "");

  const active = sweeping && !reduced;

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const phase = ((now - start) / 1000) * 0.55;
      const next = Math.round(Math.sin(phase) * 30 * 10) / 10;
      setSteering(Math.abs(next) < 0.05 ? 0 : next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const pattern = useMemo(() => computePattern(steering, spacing), [steering, spacing]);
  const metrics = useMemo(() => analyse(pattern, steering, spacing), [pattern, steering, spacing]);
  const peak = pattern.reduce((best, point) => (point.db > best.db ? point : best), pattern[0]);

  const width = 640;
  const height = 300;
  const pad = { left: 38, right: 12, top: 16, bottom: 30 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;

  const xFor = (angle: number) => pad.left + ((angle + 90) / 180) * plotWidth;
  const yFor = (db: number) => pad.top + (1 - (Math.max(-40, Math.min(0, db)) + 40) / 40) * plotHeight;

  const linePath = pattern
    .map((point, index) => `${index === 0 ? "M" : "L"}${xFor(point.angle).toFixed(2)},${yFor(point.db).toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L ${xFor(90).toFixed(2)},${yFor(-40).toFixed(2)} L ${xFor(-90).toFixed(2)},${yFor(-40).toFixed(2)} Z`;

  const polar = { cx: 140, cy: 140, radius: 108 };
  const polarRadius = (db: number) => (Math.max(0, (Math.max(-40, Math.min(0, db)) + 40) / 40)) * polar.radius;
  const polarPath = pattern
    .filter((point) => point.angle >= -90 && point.angle <= 90)
    .map((point, index) => {
      const r = polarRadius(point.db);
      const rad = (point.angle * Math.PI) / 180;
      const x = polar.cx + r * Math.sin(rad);
      const y = polar.cy - r * Math.cos(rad);
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const peakRad = (peak.angle * Math.PI) / 180;
  const peakPoint = {
    x: polar.cx + polarRadius(peak.db) * Math.sin(peakRad),
    y: polar.cy - polarRadius(peak.db) * Math.cos(peakRad),
  };
  const steerRad = (steering * Math.PI) / 180;

  const phaseCells = useMemo(() => {
    const step = K * spacing * Math.sin(steerRad);
    return Array.from({ length: 64 }, (_, index) => {
      const column = index % 8;
      const phase = ((-step * column) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const mix = phase / (2 * Math.PI);
      const r = Math.round(22 + mix * 148);
      const g = Math.round(64 + mix * 168);
      const b = Math.round(78 + mix * 168);
      return { column, phase, color: `rgb(${r} ${g} ${b})` };
    });
  }, [spacing, steerRad]);

  const metricsList = [
    { label: t("lab.peakAngle"), value: `${metrics.peakAngle.toFixed(1)}°` },
    { label: t("lab.hpbw"), value: metrics.hpbw === null ? "—" : `${metrics.hpbw.toFixed(1)}°` },
    { label: t("lab.sidelobe"), value: metrics.sidelobe === null ? "—" : `${metrics.sidelobe.toFixed(1)} dB` },
    { label: t("lab.grating"), value: metrics.grating ? "⚠" : "—", warn: metrics.grating },
  ];

  return (
    <section
      aria-label={t("lab.title")}
      className={cn("overflow-hidden border border-line bg-panel/30", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3.5 md:px-5">
        <div className="flex items-center gap-2.5">
          <span className="size-1.5 bg-glow" />
          <span className="eyebrow text-mist">Array factor · live model</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-steel sm:inline">
            8 × 8
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSweeping(false);
              setSteering(0);
              setSpacing(0.5);
            }}
            className="inline-flex h-7 items-center gap-1.5 border border-line px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-steel transition-colors hover:border-glow/40 hover:text-glow"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            {t("lab.reset")}
          </button>
          <button
            type="button"
            aria-pressed={active}
            aria-label={active ? t("lab.pause") : t("lab.sweep")}
            onClick={() => setSweeping((value) => !value)}
            disabled={reduced}
            className="inline-flex h-7 items-center gap-1.5 border border-glow/30 bg-glow/[0.06] px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-glow transition-colors hover:bg-glow/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {active ? <Pause className="size-3" aria-hidden="true" /> : <Play className="size-3" aria-hidden="true" />}
            {active ? t("lab.pause") : t("lab.sweep")}
          </button>
        </div>
      </div>

      <div className="grid gap-x-8 gap-y-5 px-4 py-5 md:grid-cols-12 md:px-5">
        <div className="md:col-span-5">
          <Slider
            label={t("lab.steering")}
            value={steering}
            min={-30}
            max={30}
            step={0.5}
            display={`${steering.toFixed(1)}°`}
            onChange={(value) => {
              setSweeping(false);
              setSteering(value);
            }}
          />
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setSweeping(false);
                setSteering(0);
              }}
              className={cn(
                "border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
                steering === 0
                  ? "border-glow/40 text-glow"
                  : "border-line text-steel hover:border-white/20 hover:text-mist",
              )}
            >
              {t("lab.broadside")}
            </button>
            <button
              type="button"
              onClick={() => {
                setSweeping(false);
                setSteering(30);
              }}
              className={cn(
                "border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
                steering === 30
                  ? "border-glow/40 text-glow"
                  : "border-line text-steel hover:border-white/20 hover:text-mist",
              )}
            >
              {t("lab.steer")}
            </button>
          </div>
        </div>

        <div className="md:col-span-4">
          <Slider
            label={t("lab.spacing")}
            value={spacing}
            min={0.2}
            max={0.9}
            step={0.01}
            display={`${spacing.toFixed(2)} λ`}
            onChange={setSpacing}
          />
        </div>

        <div className="md:col-span-3">
          <div className="flex h-full flex-col justify-between gap-2 border-l-0 border-line md:border-l md:pl-5">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
              <span>{t("lab.elements")}</span>
              <span className="text-ice">64</span>
            </div>
            <p className={cn("font-mono text-[10px] leading-relaxed", metrics.grating ? "text-amber-300/90" : "text-steel")}>
              {metrics.grating ? t("lab.spacingNote") : t("lab.notMeasured")}
            </p>
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 border-y border-line md:grid-cols-4">
        {metricsList.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "px-4 py-3.5 md:px-5",
              index % 2 === 0 && "border-r border-line",
              index < 2 && "border-b border-line md:border-b-0",
              index === 1 && "md:border-r",
              index === 2 && "md:border-r",
            )}
          >
            <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">{item.label}</dt>
            <dd className={cn("mt-1 font-mono text-sm tabular-nums", item.warn ? "text-amber-300" : "text-ice")}>
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 px-4 py-5 md:px-5 lg:grid-cols-3">
        <figure className="lg:col-span-2">
          <figcaption className="flex items-center justify-between">
            <span className="eyebrow text-steel">{t("lab.farField")}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-steel">dB · normalised</span>
          </figcaption>
          <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 w-full" role="img" aria-label={t("lab.title")}>
            <defs>
              <linearGradient id={`${gradientId}-fill`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6fd8ec" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#6fd8ec" stopOpacity="0" />
              </linearGradient>
              <clipPath id={`${clipId}-plot`}>
                <rect x={pad.left} y={pad.top} width={plotWidth} height={plotHeight} />
              </clipPath>
            </defs>

            {[0, -10, -20, -30, -40].map((db) => (
              <g key={db}>
                <line
                  x1={pad.left}
                  x2={width - pad.right}
                  y1={yFor(db)}
                  y2={yFor(db)}
                  stroke="#172530"
                  strokeDasharray={db === 0 ? undefined : "2 4"}
                />
                <text
                  x={pad.left - 7}
                  y={yFor(db) + 3}
                  textAnchor="end"
                  className="fill-[#75899a] font-mono text-[9px]"
                >
                  {db}
                </text>
              </g>
            ))}

            {[-60, -30, 0, 30, 60].map((angle) => (
              <g key={angle}>
                <line
                  x1={xFor(angle)}
                  x2={xFor(angle)}
                  y1={pad.top}
                  y2={height - pad.bottom}
                  stroke="#101b24"
                />
                <text
                  x={xFor(angle)}
                  y={height - 10}
                  textAnchor="middle"
                  className="fill-[#75899a] font-mono text-[9px]"
                >
                  {angle}°
                </text>
              </g>
            ))}

            <g clipPath={`url(#${clipId}-plot)`}>
              <path d={areaPath} fill={`url(#${gradientId}-fill)`} />
              <path d={linePath} fill="none" stroke="#6fd8ec" strokeWidth="1.6" strokeLinejoin="round" />
              <line
                x1={xFor(steering)}
                x2={xFor(steering)}
                y1={pad.top}
                y2={height - pad.bottom}
                stroke="#cbdde8"
                strokeOpacity="0.28"
                strokeDasharray="3 5"
              />
            </g>
            <line x1={pad.left} x2={width - pad.right} y1={height - pad.bottom} y2={height - pad.bottom} stroke="#172530" />
            <text
              x={xFor(steering)}
              y={pad.top + 10}
              textAnchor="middle"
              className="fill-[#a7bccb] font-mono text-[9px]"
            >
              {t("lab.peakLabel")} {peak.angle.toFixed(1)}°
            </text>
          </svg>
        </figure>

        <figure className="flex flex-col">
          <figcaption className="eyebrow text-steel">{t("lab.farField")} · polar</figcaption>
          <svg
            viewBox="0 0 280 170"
            className="mt-2 w-full max-w-[260px] self-center"
            role="img"
            aria-label={`${t("lab.farField")} polar cut`}
          >
            {[0.25, 0.5, 0.75, 1].map((ratio) => (
              <path
                key={ratio}
                d={`M ${polar.cx - polar.radius * ratio} ${polar.cy} A ${polar.radius * ratio} ${polar.radius * ratio} 0 0 1 ${polar.cx + polar.radius * ratio} ${polar.cy}`}
                fill="none"
                stroke="#172530"
                strokeDasharray={ratio === 1 ? undefined : "2 4"}
              />
            ))}
            {[-60, -30, 0, 30, 60].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={angle}
                  x1={polar.cx}
                  y1={polar.cy}
                  x2={polar.cx + polar.radius * Math.sin(rad)}
                  y2={polar.cy - polar.radius * Math.cos(rad)}
                  stroke="#101b24"
                />
              );
            })}
            {[-90, -60, -30, 0, 30, 60, 90].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <text
                  key={angle}
                  x={polar.cx + (polar.radius + 13) * Math.sin(rad)}
                  y={polar.cy - (polar.radius + 13) * Math.cos(rad) + 3}
                  textAnchor="middle"
                  className="fill-[#75899a] font-mono text-[8px]"
                >
                  {angle}°
                </text>
              );
            })}
            <path d={polarPath} fill="none" stroke="#6fd8ec" strokeWidth="1.4" strokeLinejoin="round" />
            <line
              x1={polar.cx}
              y1={polar.cy}
              x2={polar.cx + polar.radius * Math.sin(steerRad)}
              y2={polar.cy - polar.radius * Math.cos(steerRad)}
              stroke="#cbdde8"
              strokeOpacity="0.28"
              strokeDasharray="2 4"
            />
            <circle cx={peakPoint.x} cy={peakPoint.y} r="2.6" fill="#eaf6fc" />
            <line x1={polar.cx - polar.radius} x2={polar.cx + polar.radius} y1={polar.cy} y2={polar.cy} stroke="#172530" />
          </svg>
          <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.14em] text-steel">
            {t("lab.phase")} λ/2
          </p>
        </figure>
      </div>

      <div className="flex flex-col gap-5 border-t border-line px-4 py-4 md:flex-row md:items-start md:justify-between md:px-5">
        <div>
          <p className="eyebrow text-steel">{t("lab.phaseMap")}</p>
          <div className="mt-2 grid w-max grid-cols-8 gap-px border border-line bg-line p-px">
            {phaseCells.map((cell, index) => (
              <span
                key={index}
                className="block size-3.5"
                style={{ backgroundColor: cell.color }}
                title={`${t("lab.phase")} ${((cell.phase * 180) / Math.PI).toFixed(0)}°`}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 md:items-end md:text-right">
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-glow/80">{t("lab.notMeasured")}</span>
          <p className="max-w-xs text-[11px] leading-relaxed text-steel">{t("lab.caption")}</p>
        </div>
      </div>
    </section>
  );
}
