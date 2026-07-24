import { cn } from '@ledgerhq/lumen-utils-shared';

import { useDonutSizeContext } from './donutSizeContext';
import type { DonutChartDescriptionProps, DonutSize } from './types';

/** Typography per donut ring size. */
const DESCRIPTION_TYPOGRAPHY: Record<DonutSize, string> = {
  md: 'body-3',
  sm: 'body-4',
};

/** Secondary line of the donut center (e.g. the active segment's label). */
export const DonutChartDescription = ({
  ref,
  children,
  className,
  ...props
}: DonutChartDescriptionProps) => {
  const { size: donutSize = 'md' } = useDonutSizeContext({
    consumerName: 'DonutChartDescription',
    contextRequired: false,
  });

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-2 text-muted',
        DESCRIPTION_TYPOGRAPHY[donutSize],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
