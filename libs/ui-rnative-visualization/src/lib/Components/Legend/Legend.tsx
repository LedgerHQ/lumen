import { useStyleSheet } from '@ledgerhq/lumen-ui-rnative';
import { StyleSheet, View } from 'react-native';

import { chartConfig } from '../../config';

import { LegendItem } from './LegendItem';
import type { LegendProps } from './types';

const { legend } = chartConfig;

const useLegendStyles = () =>
  useStyleSheet(
    () => ({
      root: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: legend.columnGap,
        rowGap: legend.rowGap,
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
