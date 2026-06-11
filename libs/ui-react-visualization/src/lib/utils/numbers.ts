/**
 * Type guard for a finite number. Narrows out `null`, `undefined`, `NaN` and
 * `Infinity`, i.e. any value that cannot be projected to a valid coordinate or
 * counted as a drawable data point.
 */
export const isFiniteNumber = (value: unknown): value is number =>
  Number.isFinite(value);

/**
 * Constrains `value` to the inclusive `[min, max]` range. Assumes `min <= max`.
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
