import { cn } from '@ledgerhq/lumen-utils-shared';

import { LegendItem } from './LegendItem';
import type { LegendProps } from './types';

export function Legend({
  series,
  ariaLabel = 'Legend',
  className,
}: LegendProps) {
  if (series.length === 0) {
    return null;
  }

  return (
    <ul
      aria-label={ariaLabel}
      className={cn(
        'm-0 flex list-none flex-wrap gap-x-16 gap-y-6 p-0',
        className,
      )}
    >
      {series.map((item) => (
        <LegendItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
