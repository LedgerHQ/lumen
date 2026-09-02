import { Box } from '@ledgerhq/lumen-ui-rnative';

import type { DonutChartCenterProps } from './types';

/**
 * Layout wrapper for the donut center slot: a centered vertical stack for
 * `DonutChartTitle` / `DonutChartDescription`. Rendered via `renderCenter` /
 * `renderCenterActive` as the top-level element.
 * Use `lx` to add custom styles.
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
