import type { LumenTextStyle } from '../../../styles';
import { useStyleSheet } from '../../../styles';
import { Minus, TriangleDown, TriangleUp } from '../../Symbols';
import type { IconSize } from '../Icon';
import { Box, Text } from '../Utility';
import type { TrendProps } from './types';

type TrendVariant = 'positive' | 'negative' | 'neutral';

export function Trend({ value, size = 'md', lx = {}, ...props }: TrendProps) {
  const variant = value === 0 ? 'neutral' : value > 0 ? 'positive' : 'negative';
  const styles = useStyles({ size, variant });

  const Icon = {
    positive: TriangleUp,
    negative: TriangleDown,
    neutral: Minus,
  }[variant];

  const iconSize = (
    {
      md: 16,
      sm: 12,
    } as const
  )[size] as IconSize;

  const iconColor = (
    {
      positive: 'success',
      negative: 'error',
      neutral: 'muted',
    } as const
  )[variant] as LumenTextStyle['color'];

  return (
    <Box lx={lx} style={styles.container} {...props}>
      <Icon size={iconSize} color={iconColor} />
      <Text style={styles.text}>{value}%</Text>
    </Box>
  );
}

const useStyles = ({
  size,
  variant,
}: {
  size: NonNullable<TrendProps['size']>;
  variant: TrendVariant;
}) =>
  useStyleSheet((t) => {
    const color = {
      positive: t.colors.text.success,
      negative: t.colors.text.error,
      neutral: t.colors.text.muted,
    }[variant];

    const sizeMap = {
      sm: t.typographies.body3,
      md: t.typographies.body2,
    }[size];

    return {
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacings.s2,
      },
      text: {
        ...sizeMap,
        color,
      },
    };
  }, []);
