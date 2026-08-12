import { Box, useStyleSheet } from '@ledgerhq/lumen-ui-rnative';

import { LegendItem } from './LegendItem';
import type { LegendProps } from './types';

const useLegendStyles = () =>
  useStyleSheet(
    (t) => ({
      root: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: t.spacings.s16,
        rowGap: t.spacings.s6,
      },
    }),
    [],
  );

export function Legend({
  items,
  accessibilityLabel = 'Legend',
  style,
  ...props
}: LegendProps) {
  const styles = useLegendStyles();

  if (items.length === 0) {
    return null;
  }

  return (
    <Box
      role='list'
      accessibilityLabel={accessibilityLabel}
      style={[styles.root, style]}
      {...props}
    >
      {items.map((item) => (
        <LegendItem key={item.id} item={item} />
      ))}
    </Box>
  );
}
