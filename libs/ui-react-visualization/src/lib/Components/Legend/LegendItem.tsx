import { cssVar } from '@ledgerhq/lumen-design-core';

import type { LegendItem as LegendItemData } from './types';

type LegendItemProps = {
  item: LegendItemData;
};

// Internal, not exported from the barrel: the legend owns its own row markup.
export const LegendItem = ({ item }: Readonly<LegendItemProps>) => (
  <li
    data-testid='legend-item'
    data-legend-id={item.id}
    className='inline-flex items-center gap-8'
  >
    <span
      aria-hidden='true'
      data-testid='legend-swatch'
      className='size-8 shrink-0 rounded-full'
      style={{
        backgroundColor: item.color ?? cssVar('var(--background-muted-strong)'),
      }}
    />
    <span className='body-3 text-base'>{item.label ?? item.id}</span>
  </li>
);
