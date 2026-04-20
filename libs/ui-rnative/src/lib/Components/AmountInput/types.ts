import type { TextInputProps, ViewStyle } from 'react-native';
import type { BoxProps } from '../Utility';

export type AmountInputProps = Omit<
  TextInputProps,
  'value' | 'onChangeText'
> & {
  /**
   * The controlled value of the input
   * @required
   */
  value: string | number;
  /**
   * Change handler
   * @required
   */
  onChangeText: (text: string) => void;
  /**
   * The currency text (e.g. USD, EUR)
   */
  currencyText?: string;
  /**
   * Position of the currency text.
   * @default 'left'
   */
  currencyPosition?: 'left' | 'right';
  /**
   * Maximum length for integer part (before decimal)
   * @default 9
   */
  maxIntegerLength?: number;
  /**
   * Maximum length for decimal part (after decimal)
   * @default 9
   */
  maxDecimalLength?: number;
  /**
   * Allow decimal values
   * @default true
   */
  allowDecimals?: boolean;
  /**
   * Whether the input is disabled.
   * When true, the input is not editable and displays a muted visual style.
   * This differs from `editable={false}` which only prevents interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * Additional style
   */
  style?: ViewStyle;
  /**
   * Whether to use thousands separator (e.g. 1 000 for 1000)
   * @default true
   */
  thousandsSeparator?: boolean;
  /**
   * Mark input as invalid (e.g. for error display)
   * @default false
   */
  isInvalid?: boolean;
} & BoxProps;
