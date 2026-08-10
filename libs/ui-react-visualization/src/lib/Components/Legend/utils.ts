import type { LegendItem } from './types';

export const resolveLegendItemColor = (
  item: LegendItem,
  fallback: string,
): string => item.color ?? fallback;

export const resolveLegendItemLabel = (item: LegendItem): string =>
  item.label ?? item.id;
