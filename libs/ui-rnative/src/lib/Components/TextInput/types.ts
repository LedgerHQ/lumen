import type { BaseInputProps } from '../BaseInput';
import type { BoxProps } from '../Utility';

export type TextInputProps = Omit<BaseInputProps, 'prefix'> & BoxProps;
