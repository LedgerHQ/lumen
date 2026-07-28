import { Box } from '@ledgerhq/lumen-ui-rnative';

import type { DonutChartCenterProps } from './types';

/**
 * Layout wrapper for the donut center slot: a centered vertical stack for
 * `DonutChartTitle` / `DonutChartDescription`. Rendered via `renderCenter`.
 */
export function DonutChartCenter({
  children,
  lx,
  ...props
}: Readonly<DonutChartCenterProps>) {
  return (
    <Box lx={{ alignItems: 'center', ...lx }} {...props}>
      {children}
    </Box>
  );
}
