import { cn, useSplitText, buildAriaLabel } from '@ledgerhq/lumen-utils-shared';
import { memo } from 'react';
import { useCommonTranslation } from '../../../i18n';
import type {
  AmountDisplayProps,
  AmountDisplaySize,
  DigitStripListProps,
  DigitStripProps,
  DigitWidths,
  SizeConfig,
} from './types';
import { DIGITS } from './types';

const TYPOGRAPHY_WIDTHS: Record<string, DigitWidths> = {
  'heading-1-semi-bold': {
    0: 25,
    1: 15.5,
    2: 23.5,
    3: 24.5,
    4: 25.5,
    5: 23.5,
    6: 25,
    7: 22,
    8: 24.5,
    9: 24.5,
  },
  'heading-2-semi-bold': {
    0: 17.5,
    1: 11,
    2: 16.5,
    3: 17,
    4: 18,
    5: 16,
    6: 17.5,
    7: 15,
    8: 17,
    9: 17,
  },
  'heading-4-semi-bold': {
    0: 13,
    1: 8.5,
    2: 12.5,
    3: 12.5,
    4: 13,
    5: 12,
    6: 12.5,
    7: 11.5,
    8: 12.5,
    9: 12.5,
  },
};

const SIZE_CONFIG: Record<AmountDisplaySize, SizeConfig> = {
  md: {
    integer: {
      className: 'heading-1-semi-bold',
      widths: TYPOGRAPHY_WIDTHS['heading-1-semi-bold'],
    },
    decimal: {
      className: 'heading-2-semi-bold',
      widths: TYPOGRAPHY_WIDTHS['heading-2-semi-bold'],
    },
  },
  sm: {
    integer: {
      className: 'heading-2-semi-bold',
      widths: TYPOGRAPHY_WIDTHS['heading-2-semi-bold'],
    },
    decimal: {
      className: 'heading-4-semi-bold',
      widths: TYPOGRAPHY_WIDTHS['heading-4-semi-bold'],
    },
  },
};

const DigitStrip = memo(({ value, animate, widths }: DigitStripProps) => {
  const width = widths[value];

  return (
    <div
      className='relative overflow-hidden mask-fade-y transition-[width] duration-600'
      style={{ width: width + 'px' }}
    >
      <span className='invisible'>0</span>
      <span
        className={cn(
          'absolute inset-x-0 top-0 flex flex-col items-center justify-center',
          animate && 'transition-transform duration-600 ease-in-out',
        )}
        style={{
          transform: `translateY(-${value * 10}%)`,
        }}
      >
        {DIGITS.map((d, i) => (
          <span inert={d !== value ? true : false} key={i}>
            {d}
          </span>
        ))}
      </span>
    </div>
  );
});
DigitStrip.displayName = 'DigitStrip';

const DigitStripList = memo(
  ({ items, widths, animate }: DigitStripListProps) => {
    return items.map((item, index) => {
      const key = items.length - index;
      if (item.type === 'separator') {
        return <span key={key}>{item.value}</span>;
      }
      return (
        <DigitStrip
          key={key}
          value={Number(item.value) as DigitStripProps['value']}
          animate={animate}
          widths={widths}
        />
      );
    });
  },
);
DigitStripList.displayName = 'DigitStripList';

/**
 * AmountDisplay - Renders formatted monetary amounts with flexible currency positioning and decimal formatting.
 *
 * This component uses a formatter function pattern that gives you full control over how amounts are displayed,
 * including currency position, decimal separators, and precision. Use the `hidden` prop for privacy features.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/communication-amountdisplay-overview--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/communication-amountdisplay-implementation--docs#dos-and-donts Guidelines}
 *
 * @example
 * ```tsx
 * import { AmountDisplay } from '@ledgerhq/lumen-ui-react';
 * import type { FormattedValue } from '@ledgerhq/lumen-ui-react';
 *
 * // Create a formatter function
 * const usdFormatter = (value: number): FormattedValue => {
 *   const [integerPart, decimalPart] = value.toFixed(2).split('.');
 *   return {
 *     integerPart,
 *     decimalPart,
 *     currencyText: '$',
 *     decimalSeparator: '.',
 *     currencyPosition: 'start',
 *   };
 * };
 *
 * // Basic usage
 * <AmountDisplay value={1234.56} formatter={usdFormatter} />
 *
 * // With privacy (hidden)
 * <AmountDisplay value={1234.56} formatter={usdFormatter} hidden={true} />
 * ```
 */
export function AmountDisplay({
  value,
  formatter,
  hidden = false,
  loading = false,
  animate = true,
  size = 'md',
  className,
  ...props
}: AmountDisplayProps) {
  const parts = formatter(value);
  const splitDigits = useSplitText(parts);
  const { t } = useCommonTranslation();
  const ariaLabel = buildAriaLabel(
    parts,
    hidden,
    t('components.amountDisplay.amountHiddenAriaLabel'),
  );
  const config = SIZE_CONFIG[size];

  return (
    <div
      className={cn(
        loading && 'animate-pulse',
        'relative inline-flex',
        className,
      )}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      <div className='flex items-baseline'>
        <span
          className={cn('inline-flex text-base', config.integer.className)}
          aria-hidden='true'
        >
          {parts.currencyPosition === 'start' && (
            <span className='me-4'>{parts.currencyText}</span>
          )}
          {hidden ? (
            <span>••••</span>
          ) : (
            <DigitStripList
              items={splitDigits.integerPart}
              animate={animate}
              widths={config.integer.widths}
            />
          )}
        </span>
        <span
          className={cn('inline-flex text-muted', config.decimal.className)}
          aria-hidden='true'
        >
          {!hidden && parts.decimalPart && (
            <span>{parts.decimalSeparator}</span>
          )}
          {parts.decimalPart && !hidden && (
            <DigitStripList
              items={splitDigits.decimalPart}
              animate={animate}
              widths={config.decimal.widths}
            />
          )}
          {parts.currencyPosition === 'end' && (
            <span className='ms-4'>{parts.currencyText}</span>
          )}
        </span>
      </div>
    </div>
  );
}
