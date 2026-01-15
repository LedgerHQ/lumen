import {
  TextStyle,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { BoxProps } from '../Utility';

export type BaseInputProps = {
  /**
   * The label text that floats above the input when focused or filled.
   */
  label?: string;
  /**
   * Additional styles to apply to the outer wrapper element.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Additional styles to apply to the inner container element (Pressable).
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Additional styles to apply to the input element.
   */
  inputStyle?: StyleProp<TextStyle>;
  /**
   * Additional styles to apply to the label element.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * An optional error message displayed below the input.
   */
  errorMessage?: string;
  /**
   * Custom content to render after the input (right side in LTR).
   * @example suffix={<Icon />}
   */
  suffix?: React.ReactNode;
  /**
   * Custom content to render before the input (left side in LTR).
   * @example prefix={<Icon />}
   */
  prefix?: React.ReactNode;
  /**
   * Optional function to extend the default clear behavior with custom logic.
   */
  onClear?: () => void;
  /**
   * Hide the clear button (shown by default when input has content).
   */
  hideClearButton?: boolean;
} & Omit<TextInputProps, 'style'> &
  BoxProps;
