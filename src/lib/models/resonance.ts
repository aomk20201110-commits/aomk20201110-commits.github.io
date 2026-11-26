/**
 * Single-port coupled-mode model of a resonant element.
 * Analytic and UI-independent so the numbers can be unit-tested.
 */

export type CouplingRegime = "under" | "critical" | "over";

export const RESONANCE_PRESETS = {
  // Undercoupled: external decay is weaker than the intrinsic loss (Qe > Qi).
  under: { qi: 70, qe: 300 },
  critical: { qi: 120, qe: 120 },
  // Overcoupled: external decay dominates the intrinsic loss (Qe < Qi).
  over: { qi: 300, qe: 70 },
} as const;

export const RESONANCE_SAMPLES = 481;
export const RESONANCE_SPAN_LINEWIDTHS = 4;

export type ResonanceMetrics = {
  totalQ: number;
  linewidthGHz: number;
  half: number;
  r0: number;
  a0: number;
  regime: CouplingRegime;
  spanGHz: number;
};

export type ResonancePoint = { delta: number; r: number; a: number };

export function resonanceMetrics(qi: number, qe: number, f0: number): ResonanceMetrics {
  const totalQ = 1 / (1 / qi + 1 / qe);
  const linewidthGHz = (f0 / totalQ) * 1000;
  const r0 = ((qi - qe) / (qi + qe)) ** 2;
  const a0 = 1 - r0;
  const relative = Math.abs(qi - qe) / Math.max(qi, qe);
  const regime: CouplingRegime = relative < 0.02 ? "critical" : qi > qe ? "over" : "under";

  return {
    totalQ,
    linewidthGHz,
    half: 1 / (2 * totalQ),
    r0,
    a0,
    regime,
    spanGHz: RESONANCE_SPAN_LINEWIDTHS * linewidthGHz,
  };
}

/**
 * Reflectance and absorption versus detuning from f0.
 * `delta` is in GHz, spanning ±4 linewidths.
 */
export function resonanceCurve(
  qi: number,
  qe: number,
  f0: number,
  samples = RESONANCE_SAMPLES,
): ResonancePoint[] {
  const { totalQ, spanGHz } = resonanceMetrics(qi, qe, f0);
  const halfWidth = f0 / (2 * totalQ);
  const qdiff = (qe - qi) / (qe + qi);
  const points: ResonancePoint[] = [];

  for (let i = 0; i < samples; i += 1) {
    const delta = -spanGHz + (2 * spanGHz * i) / (samples - 1);
    const u = delta / (1000 * halfWidth);
    const r = (qdiff * qdiff + u * u) / (1 + u * u);
    points.push({ delta, r, a: 1 - r });
  }
  return points;
}
