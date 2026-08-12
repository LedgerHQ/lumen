import type { FormattedValue, SplitChar } from '@ledgerhq/lumen-utils-shared';
import type { ComponentPropsWithRef } from 'react';

export type { FormattedValue };

export const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

type Digit = (typeof DIGITS)[number];

export type AmountDisplaySize = 'sm' | 'md';

type DigitType = 'integer' | 'decimal';

export type DigitWidths = Record<Digit, number>;

export type PartConfig = {
  className: string;
  widths: DigitWidths;
};

export type SizeConfig = Record<DigitType, PartConfig>;

export type DigitStripProps = {
  value: Digit;
  animate: boolean;
  widths: DigitWidths;
};

export type DigitStripListProps = {
  items: SplitChar[];
} & Omit<DigitStripProps, 'value'>;

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
  /**
   * The size variant of the amount display.
   * @default 'md'
   */
  size?: AmountDisplaySize;
} & ComponentPropsWithRef<'div'>;
