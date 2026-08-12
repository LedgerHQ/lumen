import type { BaseInputProps } from '../../internal/BaseInput';
import type { BoxProps } from '../../primitives';

export type TextInputProps = Omit<BaseInputProps, 'prefix'> & BoxProps;
