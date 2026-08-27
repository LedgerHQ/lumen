import type { ComponentPropsWithRef } from 'react';
import type { BaseInputProps } from '../../internal/BaseInput/types';

export type SearchInputProps = Omit<
  BaseInputProps,
  | 'prefix'
  | 'label'
  | 'labelClassName'
  | 'multiline'
  | 'minLines'
  | 'maxLines'
  | 'scrollbarWidth'
  | 'ref'
  | 'onChange'
> &
  Pick<ComponentPropsWithRef<'input'>, 'ref' | 'onChange'> & {
    /**
     * The visual appearance of the search input
     * @default 'plain'
     */
    appearance?: 'plain' | 'transparent';
  };
