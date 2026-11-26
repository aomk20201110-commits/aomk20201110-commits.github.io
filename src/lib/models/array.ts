/**
 * Array-factor model for a uniform linear array of isotropic elements.
 * Normalised, analytic, and independent of the UI so it can be unit-tested.
 */

export const ARRAY_N = 8;
export const ARRAY_SAMPLES = 721;
const K = 2 * Math.PI;

export type ArrayPatternPoint = { angle: number; af: number; db: number };

export type ArrayMetrics = {
  peakAngle: number;
  peakDb: number;
  hpbw: number | null;
  sidelobe: number | null;
  grating: boolean;
};

export function dirichlet(n: number, psi: number) {
  const half = psi / 2;
  const denominator = Math.sin(half);
  if (Math.abs(denominator) < 1e-9) return 1;
  return Math.sin(n * half) / (n * denominator);
}

export function arrayPattern(
  steering: number,
  spacing: number,
  samples = ARRAY_SAMPLES,
): ArrayPatternPoint[] {
  const steer = (steering * Math.PI) / 180;
  const points: ArrayPatternPoint[] = [];
  for (let i = 0; i < samples; i += 1) {
    const angle = -90 + (i * 180) / (samples - 1);
    const theta = (angle * Math.PI) / 180;
    const psi = K * spacing * (Math.sin(theta) - Math.sin(steer));
    const af = Math.abs(dirichlet(ARRAY_N, psi));
    const db = Math.max(20 * Math.log10(Math.max(af, 1e-4)), -60);
    points.push({ angle, af, db });
  }
  return points;
}

export function gratingLimit(steering: number): number {
  return 1 / (1 + Math.abs(Math.sin((steering * Math.PI) / 180)));
}

export function analyseArray(
  points: ArrayPatternPoint[],
  steering: number,
  spacing: number,
): ArrayMetrics {
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

  return {
    peakAngle: points[peakIndex].angle,
    peakDb: points[peakIndex].db,
    hpbw,
    sidelobe,
    grating: spacing >= gratingLimit(steering) - 1e-9,
  };
}
