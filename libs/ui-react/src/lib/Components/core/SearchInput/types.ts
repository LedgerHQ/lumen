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
> & {
  /**
   * The visual appearance of the search input
   * @default 'plain'
   */
  appearance?: 'plain' | 'transparent';
};
