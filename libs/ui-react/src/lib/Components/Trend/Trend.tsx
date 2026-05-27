import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { useCommonTranslation } from '../../../i18n';
import { Minus, TriangleDown, TriangleUp } from '../../Symbols';
import type { TrendProps } from './types';

type TrendVariant = 'positive' | 'negative' | 'neutral';

function getVariant(value: number): TrendVariant {
  if (value === 0) return 'neutral';
  return value > 0 ? 'positive' : 'negative';
}

const variantColor: Record<TrendVariant, string> = {
  positive: 'text-success',
  negative: 'text-error',
  neutral: 'text-muted',
};

const sizeClass: Record<NonNullable<TrendProps['size']>, string> = {
  md: 'body-2 gap-2',
  sm: 'body-3 gap-2',
};

const iconSize: Record<NonNullable<TrendProps['size']>, 12 | 16> = {
  md: 16,
  sm: 12,
};

export function Trend({
  value,
  size = 'md',
  disabled: disabledProp = false,
  className,
  ...props
}: TrendProps) {
  const variant = getVariant(value);
  const disabled = useDisabledContext({
    consumerName: 'Trend',
    mergeWith: { disabled: disabledProp },
  });
  const { t } = useCommonTranslation();

  const Icon = { positive: TriangleUp, negative: TriangleDown, neutral: Minus }[
    variant
  ];

  const absoluteFormattedValue = `${Math.abs(value).toFixed(2)}%`;
  const formattedValue =
    value < 0 ? `-${absoluteFormattedValue}` : absoluteFormattedValue;

  return (
    <span
      aria-label={t(`components.trend.${variant}AriaLabel`, {
        value: absoluteFormattedValue,
      })}
      className={cn(
        'inline-flex items-center',
        sizeClass[size],
        disabled ? 'text-disabled' : variantColor[variant],
        className,
      )}
      {...props}
    >
      <Icon size={iconSize[size]} disabled={disabled} />
      {formattedValue}
    </span>
  );
}
