import type { FormattedValue, SplitChar } from '@ledgerhq/lumen-utils-shared';
import { ViewProps, TextStyle } from 'react-native';
import { StyledViewProps } from '../../../styles';

export type { FormattedValue };

export const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

type IntegerDigit = (typeof DIGITS)[number];

export type DigitStripProps = {
  value: IntegerDigit;
  animate: boolean;
  textStyle: TextStyle & { lineHeight: number };
  type: 'integer' | 'decimal';
};

export type DigitStripListProps = {
  items: SplitChar[];
} & Omit<DigitStripProps, 'value'>;

/**
 * Props for the AmountDisplay component.
 */
export type AmountDisplayProps = ViewProps & {
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
} & Omit<StyledViewProps, 'children'>;
