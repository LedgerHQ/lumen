import type {
  TextStyle,
  ViewStyle,
  StyleProp,
  TextInputProps,
} from 'react-native';
import type { BoxProps } from '../Utility';

export type BaseInputStatus = 'error' | 'success';

export type BaseInputProps = {
  /**
   * The label text that floats above the input when focused or filled.
   */
  label?: string;
  /**
   * Whether the input is disabled.
   * When true, the input is not editable and displays a muted visual style.
   * This differs from `editable={false}` which only prevents interaction.
   * @default false
   */
  disabled?: boolean;
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
   * Optional text shown below the input (hint, error, or success copy).
   * Pair with `status` for error/success styling and icons; omit `status` for a neutral hint.
   */
  helperText?: string;
  /**
   * Visual state for border, helper text, helper icon, and the label in error state.
   * Omit when `helperText` is a neutral hint.
   */
  status?: BaseInputStatus;
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
