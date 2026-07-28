import { cn } from '@ledgerhq/lumen-utils-shared';

import type { DonutChartCenterProps } from './types';

/**
 * Layout wrapper for the donut center slot: a centered vertical stack for
 * `DonutChartTitle` / `DonutChartDescription`. Rendered via `renderCenter` /
 * `renderCenterActive` as the top-level element.
 * Use `className` to add custom styles.
 */
export const DonutChartCenter = ({
  ref,
  className,
  ...props
}: DonutChartCenterProps) => {
  return (
    <div
      ref={ref}
      className={cn(
        'pointer-events-auto flex flex-col items-center',
        className,
      )}
      {...props}
    />
  );
};
