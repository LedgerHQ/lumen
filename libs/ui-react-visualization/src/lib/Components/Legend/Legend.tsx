import { cn } from '@ledgerhq/lumen-utils-shared';

import { chartConfig } from '../../config';

import { LegendItem } from './LegendItem';
import type { LegendProps } from './types';

const { legend } = chartConfig;

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
      className={cn('m-0 flex list-none flex-wrap p-0', className)}
      style={{
        columnGap: legend.columnGap,
        rowGap: legend.rowGap,
      }}
    >
      {items.map((item) => (
        <LegendItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
