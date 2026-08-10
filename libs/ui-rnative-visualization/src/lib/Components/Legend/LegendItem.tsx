import { Text, useStyleSheet } from '@ledgerhq/lumen-ui-rnative';
import { View } from 'react-native';

import { chartConfig, useChartTokens } from '../../config';

import type { LegendItem as LegendItemData } from './types';
import { resolveLegendItemColor, resolveLegendItemLabel } from './utils';

const { legend } = chartConfig;

type LegendItemProps = {
  item: LegendItemData;
};

const useLegendItemStyles = () =>
  useStyleSheet(
    (t) => ({
      root: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: legend.itemGap,
      },
      swatch: {
        width: legend.swatchSize,
        height: legend.swatchSize,
        borderRadius: legend.swatchSize / 2,
      },
      label: {
        color: t.colors.text.base,
        ...t.typographies.body3,
      },
    }),
    [],
  );

/**
 * Internal row: swatch + label. Not exported from the barrel — the legend owns
 * its own row markup.
 */
export const LegendItem = ({ item }: Readonly<LegendItemProps>) => {
  const styles = useLegendItemStyles();
  const tokens = useChartTokens();
  const swatchColor = resolveLegendItemColor(item, tokens.color.markFill);

  return (
    <View testID='legend-item' nativeID={item.id} style={styles.root}>
      <View
        accessible={false}
        testID='legend-swatch'
        style={[styles.swatch, { backgroundColor: swatchColor }]}
      />
      <Text style={styles.label}>{resolveLegendItemLabel(item)}</Text>
    </View>
  );
};
