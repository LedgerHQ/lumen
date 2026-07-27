import { cn } from '@ledgerhq/lumen-utils-shared';

import { useDonutSizeContext } from './donutSizeContext';
import type { DonutChartDescriptionProps, DonutSize } from './types';
import { DONUT_GEOMETRY, getCenterMaxWidth } from './utils';

const DESCRIPTION_TYPOGRAPHY: Record<DonutSize, string> = {
  md: 'body-3',
  sm: 'body-4',
};

/**
 * Secondary line of the donut center (e.g. the active segment's label).
 */
export const DonutChartDescription = ({
  ref,
  children,
  className,
  style,
  ...props
}: DonutChartDescriptionProps) => {
  const { size: donutSize = 'md' } = useDonutSizeContext({
    consumerName: 'DonutChartDescription',
    contextRequired: false,
  });
  const maxWidth = getCenterMaxWidth(DONUT_GEOMETRY[donutSize]);

  return (
    <div
      ref={ref}
      style={{ maxWidth, ...style }}
      className={cn(
        'flex items-center gap-2 overflow-hidden text-muted',
        '[&>.truncate]:min-w-0 [&>.truncate]:flex-1',
        DESCRIPTION_TYPOGRAPHY[donutSize],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
