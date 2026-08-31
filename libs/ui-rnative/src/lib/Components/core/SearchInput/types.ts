import type { BaseInputProps } from '../../internal/BaseInput';
import type { BoxProps } from '../../primitives';

export type SearchInputProps = Omit<
  BaseInputProps,
  'prefix' | 'label' | 'multiline' | 'minLines' | 'maxLines'
> &
  BoxProps & {
    /**
     * The visual appearance of the search input
     * @default 'plain'
     */
    appearance?: 'plain' | 'transparent';
  };
