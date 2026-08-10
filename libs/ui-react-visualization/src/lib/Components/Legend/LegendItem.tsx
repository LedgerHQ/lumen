import { chartConfig } from '../../config';

import type { LegendItem as LegendItemData } from './types';
import { resolveLegendItemColor, resolveLegendItemLabel } from './utils';

const { legend } = chartConfig;

type LegendItemProps = {
  item: LegendItemData;
};

// Internal, not exported from the barrel: the legend owns its own row markup.
export const LegendItem = ({ item }: Readonly<LegendItemProps>) => {
  const swatchColor = resolveLegendItemColor(item, legend.defaultSwatchColor);

  return (
    <li
      data-testid='legend-item'
      data-legend-id={item.id}
      className='inline-flex items-center gap-8'
    >
      <span
        aria-hidden='true'
        data-testid='legend-swatch'
        className='shrink-0 rounded-full'
        style={{
          width: legend.swatchSize,
          height: legend.swatchSize,
          backgroundColor: swatchColor,
        }}
      />
      <span className='body-3 text-base'>{resolveLegendItemLabel(item)}</span>
    </li>
  );
};
