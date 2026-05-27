import type { ComponentPropsWithRef } from 'react';
import type { BaseInputProps } from '../BaseInput/types';

export type SearchInputProps = Omit<
  BaseInputProps,
  'prefix' | 'label' | 'labelClassName'
> & {
  /**
   * The visual appearance of the search input
   * @default 'plain'
   */
  appearance?: 'plain' | 'transparent';
} & ComponentPropsWithRef<'input'>;
