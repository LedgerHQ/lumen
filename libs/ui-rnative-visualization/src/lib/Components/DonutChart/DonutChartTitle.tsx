import { Text } from '@ledgerhq/lumen-ui-rnative';
import type { TextProps } from '@ledgerhq/lumen-ui-rnative';
import { StyleSheet } from 'react-native';

import { DONUT_GEOMETRY } from '../../config';
import { useDonutSizeContext } from './donutSizeContext';
import type { DonutChartTitleProps, DonutSize, DonutTitleSize } from './types';
import { getCenterMaxWidth } from './utils';

type Typography = NonNullable<TextProps['typography']>;

/**
 * Typography per donut ring size (rows) x the title's own `size` (columns).
 * `md` ring / `md` title is the standalone count; `md` ring / `sm` title is
 * the active percent, sized down to leave room for the description below it.
 */
const TITLE_TYPOGRAPHY = {
  md: { md: 'heading1SemiBold', sm: 'heading2SemiBold' },
  sm: { md: 'heading4SemiBold', sm: 'body2SemiBold' },
} as const satisfies Record<DonutSize, Record<DonutTitleSize, Typography>>;

/** The dominant value of the donut center (e.g. the series count, or the active segment's percent). */
export function DonutChartTitle({
  children,
  lx,
  size = 'md',
  style,
  numberOfLines = 1,
  ellipsizeMode = 'tail',
  ...props
}: Readonly<DonutChartTitleProps>) {
  const { size: donutSize = 'md' } = useDonutSizeContext({
    consumerName: 'DonutChartTitle',
    contextRequired: false,
  });
  const maxWidth = getCenterMaxWidth(DONUT_GEOMETRY[donutSize]);

  return (
    <Text
      typography={TITLE_TYPOGRAPHY[donutSize][size]}
      lx={{ color: 'base', ...lx }}
      style={StyleSheet.flatten([{ maxWidth, textAlign: 'center' }, style])}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      {...props}
    >
      {children}
    </Text>
  );
}
