import type { ComponentPropsWithRef } from 'react';
import type { BaseInputProps } from '../BaseInput/types';

export type TextInputProps = Omit<
  BaseInputProps,
  'prefix' | 'labelClassName' | 'inputClassName'
> &
  ComponentPropsWithRef<'input'>;
