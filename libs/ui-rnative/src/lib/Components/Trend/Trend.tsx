import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet } from 'react-native';
import { useCommonTranslation } from '../../../i18n';
import type { LumenTextStyle } from '../../../styles';
import { useStyleSheet } from '../../../styles';
import { Minus, TriangleDown, TriangleUp } from '../../Symbols';
import type { IconSize } from '../Icon';
import { Box, Text } from '../Utility';
import type { TrendProps } from './types';

type TrendVariant = 'positive' | 'negative' | 'neutral';

function getVariant(value: number): TrendVariant {
  if (value === 0) {
    return 'neutral';
  }
  return value > 0 ? 'positive' : 'negative';
}

export function Trend({
  value,
  size = 'md',
  lx = {},
  disabled: disabledProp = false,
  style,
  ...props
}: TrendProps) {
  const variant = getVariant(value);

  const disabled = useDisabledContext({
    consumerName: 'Trend',
    mergeWith: { disabled: disabledProp },
  });
  const { t } = useCommonTranslation();

  const styles = useStyles({ size, variant, disabled });

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

  const absoluteFormattedValue = `${Math.abs(value).toFixed(2)}%`;
  const formattedValue =
    value < 0 ? `-${absoluteFormattedValue}` : absoluteFormattedValue;

  return (
    <Box
      accessible
      accessibilityLabel={t(`components.trend.${variant}AriaLabel`, {
        value: absoluteFormattedValue,
      })}
      accessibilityState={{ disabled }}
      lx={lx}
      style={[styles.container, style]}
      {...props}
    >
      <Icon size={iconSize} color={disabled ? 'disabled' : iconColor} />
      <Text style={styles.text}>{formattedValue}</Text>
    </Box>
  );
}

const useStyles = ({
  size,
  variant,
  disabled,
}: {
  size: NonNullable<TrendProps['size']>;
  variant: TrendVariant;
  disabled: boolean;
}) =>
  useStyleSheet(
    (t) => {
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
        text: StyleSheet.flatten([
          {
            ...sizeMap,
            color,
          },
          disabled && { color: t.colors.text.disabled },
        ]),
      };
    },
    [size, variant, disabled],
  );
