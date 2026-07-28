import { Box, Text } from '@ledgerhq/lumen-ui-rnative';
import type { TextProps } from '@ledgerhq/lumen-ui-rnative';
import { StyleSheet } from 'react-native';

import { DONUT_GEOMETRY } from './constants';
import { useDonutSizeContext } from './donutSizeContext';
import type { DonutChartDescriptionProps, DonutSize } from './types';
import { getCenterMaxWidth } from './utils';

type Typography = NonNullable<TextProps['typography']>;

const DESCRIPTION_TYPOGRAPHY = {
  md: 'body3',
  sm: 'body4',
} as const satisfies Record<DonutSize, Typography>;

/**
 * Secondary line of the donut center (e.g. the active segment's label), with
 * an optional trailing `icon` (e.g. an `InteractiveIcon` with `ChevronRight`).
 */
export function DonutChartDescription({
  children,
  icon,
  lx,
  style,
  ...props
}: Readonly<DonutChartDescriptionProps>) {
  const { size: donutSize = 'md' } = useDonutSizeContext({
    consumerName: 'DonutChartDescription',
    contextRequired: false,
  });
  const maxWidth = getCenterMaxWidth(DONUT_GEOMETRY[donutSize]);

  return (
    <Box
      lx={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 's2',
        alignSelf: 'center',
        ...lx,
      }}
      style={StyleSheet.flatten([
        { maxWidth, ...(donutSize === 'sm' ? { marginTop: -4 } : {}) },
        style,
      ])}
      {...props}
    >
      <Text
        typography={DESCRIPTION_TYPOGRAPHY[donutSize]}
        lx={{ color: 'muted' }}
        style={{ flexShrink: 1, minWidth: 0 }}
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        {children}
      </Text>
      {icon}
    </Box>
  );
}
