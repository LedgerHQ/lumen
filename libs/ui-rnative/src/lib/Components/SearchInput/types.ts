import type { BaseInputProps } from '../BaseInput';
import type { BoxProps } from '../Utility';

export type SearchInputProps = Omit<BaseInputProps, 'prefix' | 'label'> &
  BoxProps & {
    /**
     * The visual appearance of the search input
     * @default 'plain'
     */
    appearance?: 'plain' | 'transparent';
  };
