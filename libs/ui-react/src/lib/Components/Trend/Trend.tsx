import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useCommonTranslation } from '../../../i18n';
import { TriangleDown, TriangleUp } from '../../Symbols';
import type { TrendProps } from './types';

type TrendVariant = 'positive' | 'negative' | 'neutral';

function getVariant(value: number): TrendVariant {
  if (value === 0) return 'neutral';
  return value > 0 ? 'positive' : 'negative';
}

const trendVariants = cva('inline-flex items-center', {
  variants: {
    size: {
      md: 'body-2 gap-2',
      sm: 'body-3 gap-2',
    },
    variant: {
      positive: '',
      negative: '',
      neutral: '',
    },
    disabled: {
      true: 'text-disabled',
      false: '',
    },
  },
  compoundVariants: [
    { variant: 'positive', disabled: false, class: 'text-success' },
    { variant: 'negative', disabled: false, class: 'text-error' },
    { variant: 'neutral', disabled: false, class: 'text-muted' },
  ],
  defaultVariants: {
    size: 'md',
    disabled: false,
  },
});

const iconSize: Record<NonNullable<TrendProps['size']>, 12 | 16> = {
  md: 16,
  sm: 12,
};

const iconMap = {
  positive: TriangleUp,
  negative: TriangleDown,
  neutral: null,
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
  const Icon = iconMap[variant];

  const absoluteFormattedValue = `${Math.abs(value).toFixed(2)}%`;
  const formattedValue =
    value < 0 ? `-${absoluteFormattedValue}` : absoluteFormattedValue;

  return (
    <span
      aria-label={t(`components.trend.${variant}AriaLabel`, {
        value: absoluteFormattedValue,
      })}
      className={cn(trendVariants({ size, variant, disabled }), className)}
      {...props}
    >
      {Icon && <Icon size={iconSize[size]} disabled={disabled} />}
      {formattedValue}
    </span>
  );
}
