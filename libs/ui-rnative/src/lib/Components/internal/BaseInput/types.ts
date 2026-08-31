import type {
  TextStyle,
  ViewStyle,
  StyleProp,
  TextInputProps,
} from 'react-native';
import type { BoxProps } from '../../primitives';

export type BaseInputStatus = 'error' | 'success';

export type BaseInputProps = {
  /**
   * The label text that floats above the input when focused or filled.
   */
  label?: string;
  /**
   * Whether the input is disabled.
   * When true, the input is not editable and displays a muted visual style.
   * This differs from `readOnly` which only prevents editing.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the input is read-only.
   * When true, the input prevents editing without applying the muted visual
   * style of `disabled` — useful for displaying values that should still look
   * like regular inputs. The clear button is hidden while read-only.
   * @default false
   */
  readOnly?: boolean;
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
   * Soft character limit. When set, renders a `count/maxCount` counter below the input.
   */
  maxCount?: number;
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
   * Called after the field is emptied. Clearing always calls `onChangeText('')`
   */
  onClear?: () => void;
  /**
   * Hide the clear button (shown by default when input has content).
   * @default false
   */
  hideClearButton?: boolean;
  /**
   * Renders a multi-line field that auto-grows between `minLines` and `maxLines`.
   * @default false
   */
  multiline?: boolean;
  /**
   * Minimum height of the field, in lines. Ignored unless `multiline` is set.
   * @default 1
   */
  minLines?: number;
  /**
   * Growth ceiling, in lines; past it the field scrolls internally. Unbounded when
   * omitted. Ignored unless `multiline` is set.
   */
  maxLines?: number;
} & Omit<TextInputProps, 'style' | 'multiline' | 'numberOfLines'> &
  BoxProps;

export type BaseInputLabelProps = {
  /**
   * Whether the input currently has focus, which floats the label.
   */
  isFocused: boolean;
  /**
   * Whether the input holds a value, which keeps the label floated.
   */
  hasContent: boolean;
  /**
   * Whether the clear button is visible, which narrows the label to avoid it.
   */
  showClearButton: boolean;
  /**
   * Whether the input is editable, driving the disabled label colour.
   */
  isEditable: boolean;
  /**
   * Keeps the label floated even when empty and unfocused, used when a label
   * and a placeholder are displayed together.
   */
  labelStaysFloatedWithPlaceholder: boolean;
  /**
   * Additional styles to apply to the label element.
   */
  style?: StyleProp<TextStyle>;
  /**
   * The label copy.
   */
  children: React.ReactNode;
} & Pick<BaseInputProps, 'status'>;

export type BaseInputHelperTextProps = {
  /**
   * The helper copy shown below the input.
   */
  helperText: string;
} & Pick<BaseInputProps, 'status'>;

export type BaseInputCounterProps = {
  /**
   * Current character count.
   */
  count: number;
} & Required<Pick<BaseInputProps, 'maxCount'>>;
