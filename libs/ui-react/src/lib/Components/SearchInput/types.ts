import { BaseInputProps } from '../BaseInput/types';

export type SearchInputProps = Omit<
  BaseInputProps,
  'prefix' | 'label' | 'labelClassName' | 'containerClassName'
> & {
  /**
   * The visual appearance of the search input
   * @default 'plain'
   */
  appearance?: 'plain' | 'transparent';
  /**
   * Ref to the search input element.
   */
  ref?: React.Ref<HTMLInputElement>;
};
