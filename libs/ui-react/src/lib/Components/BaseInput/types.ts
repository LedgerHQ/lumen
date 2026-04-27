import type { ComponentPropsWithRef, ReactNode } from 'react';

export type BaseInputStatus = 'error' | 'success';

export type BaseInputProps = {
  /**
   * The label text that floats above the input when focused or filled.
   */
  label?: string;
  /**
   * Optional text shown below the input (hint, error, or success copy).
   * Pair with `status` for error/success styling and icons; omit `status` for a neutral hint.
   */
  helperText?: string;
  /**
   * Visual state for border, label, helper text, and helper icon.
   * Omit when `helperText` is a neutral hint.
   */
  status?: BaseInputStatus;
  /**
   * Overrides the accessibility invalid state on the input element.
   * Automatically set to `true` when `status` is `'error'` — only pass this
   * explicitly when you need to decouple the accessibility state from the visual state.
   */
  'aria-invalid'?: boolean;
  /**
   * Custom content to render after the input.
   * @example suffix={<Icon />}
   */
  suffix?: ReactNode;
  /**
   * Custom content to render before the input (left side in LTR).
   * @example prefix={<Icon />}
   */
  prefix?: ReactNode;
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
} & Omit<ComponentPropsWithRef<'input'>, 'size' | 'prefix'>;
