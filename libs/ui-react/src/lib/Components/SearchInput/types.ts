import React from 'react';
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
} & React.ComponentPropsWithRef<'input'>;
