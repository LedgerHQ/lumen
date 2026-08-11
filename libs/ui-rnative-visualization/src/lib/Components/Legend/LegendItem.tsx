import { Text, useStyleSheet } from '@ledgerhq/lumen-ui-rnative';
import { View } from 'react-native';

import type { LegendItem as LegendItemData } from './types';

type LegendItemProps = {
  item: LegendItemData;
};

const useLegendItemStyles = (color?: string) =>
  useStyleSheet(
    (t) => ({
      root: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacings.s8,
      },
      swatch: {
        width: t.sizes.s8,
        height: t.sizes.s8,
        borderRadius: t.borderRadius.full,
        backgroundColor: color ?? t.colors.bg.mutedStrong,
      },
      label: {
        color: t.colors.text.base,
        ...t.typographies.body3,
      },
    }),
    [color],
  );

/**
 * Internal row: swatch + label. Not exported from the barrel — the legend owns
 * its own row markup.
 */
export const LegendItem = ({ item }: Readonly<LegendItemProps>) => {
  const styles = useLegendItemStyles(item.color);

  return (
    <View testID='legend-item' nativeID={item.id} style={styles.root}>
      <View accessible={false} testID='legend-swatch' style={styles.swatch} />
      <Text style={styles.label}>{item.label ?? item.id}</Text>
    </View>
  );
};
