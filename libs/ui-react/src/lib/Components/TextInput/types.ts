import { BaseInputProps } from '../BaseInput/types';

export type TextInputProps = Omit<
  BaseInputProps,
  'prefix' | 'labelClassName' | 'inputClassName'
> & {
  ref?: React.Ref<HTMLInputElement>;
};
