import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { Text } from '../../primitives/Text';
import type { TextProps } from '../../primitives/Text';

import { useDonutSizeContext } from './donutSizeContext';
import type { DonutChartTitleProps, DonutSize, DonutTitleSize } from './types';
import { getCenterContentInset, getCenterMaxWidth } from './utils';

type Typography = NonNullable<TextProps['typography']>;

const TITLE_TYPOGRAPHY = {
  md: { md: 'heading1SemiBold', sm: 'heading2SemiBold' },
  sm: { md: 'heading4SemiBold', sm: 'body2SemiBold' },
} as const satisfies Record<DonutSize, Record<DonutTitleSize, Typography>>;

const useStyles = ({
  donutSize,
  size,
}: {
  donutSize: DonutSize;
  size: DonutTitleSize;
}) => {
  return useStyleSheet(
    (t) => ({
      root: {
        ...t.typographies[TITLE_TYPOGRAPHY[donutSize][size]],
        color: t.colors.text.base,
        paddingHorizontal: getCenterContentInset(donutSize),
        maxWidth: getCenterMaxWidth(donutSize),
        textAlign: 'center' as const,
      },
    }),
    [donutSize, size],
  );
};

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
  const styles = useStyles({ donutSize, size });

  return (
    <Text
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      {...props}
    >
      {children}
    </Text>
  );
}
