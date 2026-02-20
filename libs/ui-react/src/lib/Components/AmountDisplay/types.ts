import type { FormattedValue, SplitChar } from '@ledgerhq/lumen-utils-shared';
import type { ComponentPropsWithRef } from 'react';

export type { FormattedValue, SplitChar };

export type DigitStripProps = {
  value: number;
  animate: boolean;
};

/**
 * Props for the AmountDisplay component.
 */
export type AmountDisplayProps = {
  /**
   * The numeric value to display.
   * Pass the raw number value (e.g., 1234.56) - the formatter will handle conversion.
   */
  value: number;
  /**
   * Function that formats the numeric value into a FormattedValue object.
   */
  formatter: (value: number) => FormattedValue;
  /**
   * When true, displays bullet points (••••) instead of the actual amount.
   * Useful for privacy features where users can toggle amount visibility.
   * @default false
   */
  hidden?: boolean;
  /**
   * When true, applies a pulse animation to indicate the amount is being fetched or updated.
   * @default false
   */
  loading?: boolean;
  /**
   * Whether the odometer animation should play on value change or not
   * @default true
   */
  animate?: boolean;
} & ComponentPropsWithRef<'div'>;
