import type { ComponentPropsWithRef } from 'react';
import type { BaseInputProps } from '../../internal/BaseInput/types';

export type TextInputProps = Omit<
  BaseInputProps,
  'prefix' | 'labelClassName' | 'inputClassName'
> &
  ComponentPropsWithRef<'input'>;
