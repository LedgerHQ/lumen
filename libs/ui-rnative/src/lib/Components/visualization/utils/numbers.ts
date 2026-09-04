/**
 * Type guard for a finite number. Narrows out `null`, `undefined`, `NaN` and
 * `Infinity`, i.e. any value that cannot be projected to a valid coordinate or
 * counted as a drawable data point.
 */
export const isFiniteNumber = (value: unknown): value is number =>
  Number.isFinite(value);

/**
 * Constrains `value` to the inclusive `[min, max]` range. For a degenerate
 * range where `min > max` (e.g. an index range `[0, length - 1]` for empty
 * data), `min` takes precedence and is returned — matching `lodash.clamp`.
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(Math.min(value, max), min);
