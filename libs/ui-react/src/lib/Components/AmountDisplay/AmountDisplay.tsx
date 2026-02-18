import { cn } from '@ledgerhq/lumen-utils-shared';
import { memo } from 'react';
import {
  AmountDisplayProps,
  DigitStripProps,
  FormattedValue,
  SplitChar,
} from './types';
import { useSplitText } from './useSplitText';

const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function buildAriaLabel(parts: FormattedValue, hidden: boolean): string {
  if (hidden) return 'Amount hidden';

  const decimal = parts.decimalPart
    ? `${parts.decimalSeparator}${parts.decimalPart}`
    : '';
  const amount = `${parts.integerPart}${decimal}`;

  if (parts.currencyPosition === 'end') {
    return `${amount} ${parts.currencyText}`;
  }

  return `${parts.currencyText} ${amount}`;
}

const DigitStrip = memo(({ value, animate, loading }: DigitStripProps) => {
  const animated = animate && !loading;
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        animated && 'animate-slide-in-from-bottom',
      )}
    >
      <span className='invisible' aria-hidden='true'>
        0
      </span>
      <span
        className={cn(
          'absolute inset-x-0 top-0 flex flex-col items-center justify-center',
          animate && 'transition-transform duration-600 ease-in-out',
        )}
        style={{
          transform: `translateY(-${value * 10}%)`,
        }}
      >
        {digits.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </span>
    </div>
  );
});

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
  const ariaLabel = buildAriaLabel(parts, hidden);
  const renderDigits = (items: SplitChar[]) => {
    let digitCount = items.filter((c) => c.type === 'digit').length;
    return items.map((item, index) => {
      if (item.type === 'separator') {
        return <span key={`sep-${index}`}>{item.value}</span>;
      }
      digitCount--;
      return (
        <DigitStrip
          key={digitCount}
          value={parseInt(item.value, 10)}
          animate={animate}
          loading={loading}
        />
      );
    });
  };

  return (
    <div
      className={cn(
        loading && 'animate-pulse',
        'relative inline-flex items-end',
        className,
      )}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      <span
        className='inline-flex flex-row mask-fade-y heading-1-semi-bold text-base'
        aria-hidden='true'
      >
        {(parts.currencyPosition === undefined ||
          parts.currencyPosition === 'start') && (
          <span className='me-4'>{parts.currencyText}</span>
        )}
        {hidden ? <span>••••</span> : renderDigits(splitDigits.integerPart)}
      </span>
      <span
        className='inline-flex flex-row mask-fade-y pb-2 heading-2-semi-bold text-muted'
        aria-hidden='true'
      >
        {!hidden && parts.decimalPart && <span>{parts.decimalSeparator}</span>}
        {parts.decimalPart && !hidden && renderDigits(splitDigits.decimalPart)}
        {parts.currencyPosition === 'end' && (
          <span className='ms-4'>{parts.currencyText}</span>
        )}
      </span>
    </div>
  );
};

AmountDisplay.displayName = 'AmountDisplay';
