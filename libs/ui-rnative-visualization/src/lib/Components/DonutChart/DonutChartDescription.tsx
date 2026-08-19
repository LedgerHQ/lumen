import { Box, Text, useStyleSheet } from '@ledgerhq/lumen-ui-rnative';
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

const useStyles = ({ donutSize }: { donutSize: DonutSize }) => {
  return useStyleSheet(
    (t) => {
      const paddingX = {
        md: t.spacings.s4,
        sm: t.spacings.s2,
      } satisfies Record<DonutSize, number>;
      const paddingHorizontal = paddingX[donutSize];
      const maxWidth = getCenterMaxWidth(DONUT_GEOMETRY[donutSize]);
      const smOffset =
        donutSize === 'sm' ? { marginTop: t.spacings['-s4'] } : {};

      return {
        text: {
          ...t.typographies[DESCRIPTION_TYPOGRAPHY[donutSize]],
          color: t.colors.text.muted,
          alignSelf: 'center' as const,
          paddingHorizontal,
          maxWidth,
          flexShrink: 1,
          minWidth: 0,
          textAlign: 'center' as const,
          ...smOffset,
        },
        container: {
          flexDirection: 'row' as const,
          alignItems: 'center' as const,
          gap: t.spacings.s2,
          paddingHorizontal,
          alignSelf: 'center' as const,
          maxWidth,
          ...smOffset,
        },
      };
    },
    [donutSize],
  );
};

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
  const styles = useStyles({ donutSize });

  if (isTextChildren(children)) {
    return (
      <Text
        lx={lx}
        style={StyleSheet.flatten([styles.text, style])}
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
      lx={lx}
      style={StyleSheet.flatten([styles.container, style])}
      {...props}
    >
      {children}
    </Box>
  );
}
