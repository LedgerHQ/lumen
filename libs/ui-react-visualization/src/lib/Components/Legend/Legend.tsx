import { cn } from '@ledgerhq/lumen-utils-shared';

import { LegendItem } from './LegendItem';
import type { LegendProps } from './types';

export function Legend({
  items,
  ariaLabel = 'Legend',
  className,
}: Readonly<LegendProps>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul
      aria-label={ariaLabel}
      data-testid='legend'
      className={cn(
        'm-0 flex list-none flex-wrap gap-x-16 gap-y-6 p-0',
        className,
      )}
    >
      {items.map((item) => (
        <LegendItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
