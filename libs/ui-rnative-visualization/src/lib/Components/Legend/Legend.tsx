import { useStyleSheet } from '@ledgerhq/lumen-ui-rnative';
import { StyleSheet, View } from 'react-native';

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
}: Readonly<LegendProps>) {
  const styles = useLegendStyles();

  if (items.length === 0) {
    return null;
  }

  return (
    <View
      accessibilityRole='list'
      accessibilityLabel={accessibilityLabel}
      testID='legend'
      style={StyleSheet.flatten([styles.root, style])}
    >
      {items.map((item) => (
        <LegendItem key={item.id} item={item} />
      ))}
    </View>
  );
}
