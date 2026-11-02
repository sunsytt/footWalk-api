const STRIDE_METERS = 0.72; // zancada promedio estimada

export function stepsToKm(steps: number): number {
  return Math.round(((steps * STRIDE_METERS) / 1000) * 100) / 100;
}