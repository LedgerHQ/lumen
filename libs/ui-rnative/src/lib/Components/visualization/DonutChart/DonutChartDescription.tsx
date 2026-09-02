import { isTextChildren } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { Box } from '../../primitives/Box';
import { Text } from '../../primitives/Text';
import type { TextProps } from '../../primitives/Text';

import { useDonutSizeContext } from './donutSizeContext';
import type { DonutChartDescriptionProps, DonutSize } from './types';
import { getCenterContentInset, getCenterMaxWidth } from './utils';

type Typography = NonNullable<TextProps['typography']>;

const DESCRIPTION_TYPOGRAPHY = {
  md: 'body3',
  sm: 'body4',
} as const satisfies Record<DonutSize, Typography>;

const useStyles = ({ donutSize }: { donutSize: DonutSize }) => {
  return useStyleSheet(
    (t) => {
      const paddingHorizontal = getCenterContentInset(donutSize);
      const maxWidth = getCenterMaxWidth(donutSize);
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
