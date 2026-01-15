import { BaseInputProps } from '../BaseInput';
import { BoxProps } from '../Utility';

export type SearchInputProps = Omit<BaseInputProps, 'prefix' | 'label'> &
  BoxProps & {
    /**
     * The visual appearance of the search input
     * @default 'plain'
     */
    appearance?: 'plain' | 'transparent';
  };
