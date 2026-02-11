import { BaseInputProps } from '../BaseInput/types';

export type TextInputProps = Omit<
  BaseInputProps,
  'prefix' | 'labelClassName' | 'inputClassName'
> & {
  /**
   * Ref to the text input element.
   */
  ref?: React.Ref<HTMLInputElement>;
};
