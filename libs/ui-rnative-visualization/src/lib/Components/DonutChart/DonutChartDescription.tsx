import { Box, Text } from '@ledgerhq/lumen-ui-rnative';
import type { TextProps } from '@ledgerhq/lumen-ui-rnative';
import { isTextChildren } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet } from 'react-native';

import { DONUT_GEOMETRY } from '../../config';
import { useDonutSizeContext } from './donutSizeContext';
import type { DonutChartDescriptionProps, DonutSize } from './types';
import { getCenterMaxWidth } from './utils';

type Typography = NonNullable<TextProps['typography']>;

const DESCRIPTION_TYPOGRAPHY = {
  md: 'body3',
  sm: 'body4',
} as const satisfies Record<DonutSize, Typography>;

const PADDING_X = {
  md: 's4',
  sm: 's2',
} as const satisfies Record<DonutSize, 's2' | 's4'>;

export function DonutChartDescription({
  children,
  lx,
  style,
  ...props
}: Readonly<DonutChartDescriptionProps>) {
  const { size: donutSize = 'md' } = useDonutSizeContext({
    consumerName: 'DonutChartDescription',
    contextRequired: false,
  });
  const maxWidth = getCenterMaxWidth(DONUT_GEOMETRY[donutSize]);
  const typography = DESCRIPTION_TYPOGRAPHY[donutSize];
  const smOffset = donutSize === 'sm' ? { marginTop: '-s4' as const } : {};
  const paddingX = PADDING_X[donutSize];

  if (isTextChildren(children)) {
    return (
      <Text
        typography={typography}
        lx={{
          color: 'muted',
          alignSelf: 'center',
          paddingHorizontal: paddingX,
          ...smOffset,
          ...lx,
        }}
        style={StyleSheet.flatten([
          {
            maxWidth,
            flexShrink: 1,
            minWidth: 0,
            textAlign: 'center',
          },
          style,
        ])}
        numberOfLines={1}
        ellipsizeMode='tail'
        {...props}
      >
        {children}
      </Text>
    );
  }

  return (
    <Box
      lx={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 's2',
        paddingHorizontal: paddingX,
        alignSelf: 'center',
        ...smOffset,
        ...lx,
      }}
      style={StyleSheet.flatten([{ maxWidth }, style])}
      {...props}
    >
      {children}
    </Box>
  );
}
