import { cn } from '@ledgerhq/lumen-utils-shared';

import { useDonutSizeContext } from './donutSizeContext';
import type { DonutChartTitleProps, DonutSize } from './types';
import { DONUT_GEOMETRY, getCenterMaxWidth } from './utils';

/**
 * Typography per donut ring size (rows) x the title's own `size` (columns).
 * `md` ring / `md` title is the standalone count; `md` ring / `sm` title is
 * the active percent, sized down to leave room for the description below it.
 */
const TITLE_TYPOGRAPHY: Record<DonutSize, Record<DonutSize, string>> = {
  md: { md: 'heading-1-semi-bold', sm: 'heading-2-semi-bold' },
  sm: { md: 'heading-4-semi-bold', sm: 'body-2-semi-bold' },
};

/** The dominant value of the donut center (e.g. the series count, or the active segment's percent). */
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
