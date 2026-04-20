import { cn, useSplitText, buildAriaLabel } from '@ledgerhq/lumen-utils-shared';
import { memo } from 'react';
import { useCommonTranslation } from '../../../i18n';
import type {
  AmountDisplayProps,
  DigitStripListProps,
  DigitStripProps,
} from './types';
import { DIGITS } from './types';

const INTEGER_DIGIT_WIDTHS = {
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
};

const DECIMAL_DIGIT_WIDTHS = {
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
};

const DigitStrip = memo(({ value, animate, type }: DigitStripProps) => {
  const width = (
    type === 'integer' ? INTEGER_DIGIT_WIDTHS : DECIMAL_DIGIT_WIDTHS
  )[value];

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

const DigitStripList = memo(({ items, type, animate }: DigitStripListProps) => {
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
        type={type}
      />
    );
  });
});
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
export const AmountDisplay = ({
  value,
  formatter,
  hidden = false,
  loading = false,
  animate = true,
  className,
  ...props
}: AmountDisplayProps) => {
  const parts = formatter(value);
  const splitDigits = useSplitText(parts);
  const { t } = useCommonTranslation();
  const ariaLabel = buildAriaLabel(
    parts,
    hidden,
    t('components.amountDisplay.amountHiddenAriaLabel'),
  );

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
          className='inline-flex heading-1-semi-bold text-base'
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
              type='integer'
            />
          )}
        </span>
        <span
          className='inline-flex heading-2-semi-bold text-muted'
          aria-hidden='true'
        >
          {!hidden && parts.decimalPart && (
            <span>{parts.decimalSeparator}</span>
          )}
          {parts.decimalPart && !hidden && (
            <DigitStripList
              items={splitDigits.decimalPart}
              animate={animate}
              type='decimal'
            />
          )}
          {parts.currencyPosition === 'end' && (
            <span className='ms-4'>{parts.currencyText}</span>
          )}
        </span>
      </div>
    </div>
  );
};
