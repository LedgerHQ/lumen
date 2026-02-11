import { AmountDisplayProps } from './types';

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
  ref,
  value,
  formatter,
  hidden = false,
  ...props
}: AmountDisplayProps) => {
  const parts = formatter(value);

  return (
    <div ref={ref} {...props}>
      <span className='heading-1-semi-bold text-base'>
        {(parts.currencyPosition === undefined ||
          parts.currencyPosition === 'start') && (
          <span className='me-4'>{parts.currencyText}</span>
        )}
        <span>{hidden ? '••••' : parts.integerPart}</span>
      </span>
      <span className='heading-2-semi-bold text-muted'>
        {parts.decimalPart && !hidden && (
          <span>{(parts.decimalSeparator || '.') + parts.decimalPart}</span>
        )}
        {parts.currencyPosition === 'end' && (
          <span className='ms-4'>{parts.currencyText}</span>
        )}
      </span>
    </div>
  );
};

AmountDisplay.displayName = 'AmountDisplay';
