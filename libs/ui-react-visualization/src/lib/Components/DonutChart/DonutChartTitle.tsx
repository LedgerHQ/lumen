import { cn } from '@ledgerhq/lumen-utils-shared';

import { useDonutSizeContext } from './donutSizeContext';
import type { DonutChartTitleProps, DonutSize } from './types';
import { DONUT_GEOMETRY, getCenterMaxWidth } from './utils';

const TITLE_TYPOGRAPHY: Record<DonutSize, Record<DonutSize, string>> = {
  md: { md: 'heading-1-semi-bold', sm: 'heading-2-semi-bold' },
  sm: { md: 'heading-4-semi-bold', sm: 'body-2-semi-bold' },
};

export const DonutChartTitle = ({
  ref,
  children,
  className,
  size = 'md',
  style,
  ...props
}: DonutChartTitleProps) => {
  const { size: donutSize = 'md' } = useDonutSizeContext({
    consumerName: 'DonutChartTitle',
    contextRequired: false,
  });
  const maxWidth = getCenterMaxWidth(DONUT_GEOMETRY[donutSize]);

  return (
    <div
      ref={ref}
      style={{ maxWidth, ...style }}
      className={cn(
        'truncate text-base',
        TITLE_TYPOGRAPHY[donutSize][size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
