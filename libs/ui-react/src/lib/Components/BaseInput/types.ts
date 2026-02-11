export type BaseInputProps = {
  /**
   * The label text that floats above the input when focused or filled.
   */
  label?: string;
  /**
   * An optional error message displayed below the input
   */
  errorMessage?: string;
  /**
   * Indicates whether the input value is invalid
   * @default false
   */
  'aria-invalid'?: boolean;
  /**
   * Custom content to render after the input.
   * @example suffix={<Icon />}
   */
  suffix?: React.ReactNode;
  /**
   * Custom content to render before the input (left side in LTR).
   * @example prefix={<Icon />}
   */
  prefix?: React.ReactNode;
  /**
   * Optional function to extend the default clear behavior with custom logic
   */
  onClear?: () => void;
  /**
   * Hide the clear button (shown by default when input has content)
   * @default false
   */
  hideClearButton?: boolean;
  /**
   * Additional class names to apply to the outer wrapper element
   */
  className?: string;
  /**
   * Additional class names to apply to the inner container element
   */
  containerClassName?: string;
  /**
   * Additional class names to apply to the input element
   */
  inputClassName?: string;
  /**
   * Additional class names to apply to the label element
   */
  labelClassName?: string;
  /**
   * Ref to the input element.
   */
  ref?: React.Ref<HTMLInputElement>;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>;
