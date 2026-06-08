import { Text, useStyleSheet } from '@ledgerhq/lumen-ui-rnative';
import type { ReactNode } from 'react';
import { View } from 'react-native';

type ChartEmptyLabelProps = {
  children: ReactNode;
};

const useStyles = () => {
  return useStyleSheet(
    (t) => ({
      container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
      },
      pill: {
        backgroundColor: t.colors.bg.muted,
        borderRadius: t.borderRadius.xs,
        paddingHorizontal: t.spacings.s12,
        paddingVertical: t.spacings.s6,
      },
      label: {
        color: t.colors.text.muted,
        ...t.typographies.body3,
      },
    }),
    [],
  );
};

/**
 * Centered overlay label shown when a chart has no data (and is not loading).
 * Rendered through the `overlay` slot of `CartesianChart` so it shares the
 * chart's positioned container and aligns with the chart footprint. Shared
 * across cartesian charts (LineChart, future BarChart).
 *
 * This is the lib's only non-SVG (View/Text) element, so unlike the chart
 * visuals (which read raw theme colors for `react-native-svg`) it is styled with
 * the design system's themed stylesheet, consistent with the components in
 * `ui-rnative`.
 */
export function ChartEmptyLabel({ children }: Readonly<ChartEmptyLabelProps>) {
  const styles = useStyles();

  return (
    <View pointerEvents='none' style={styles.container}>
      <View style={styles.pill}>
        <Text testID='chart-empty-label' style={styles.label}>
          {children}
        </Text>
      </View>
    </View>
  );
}
