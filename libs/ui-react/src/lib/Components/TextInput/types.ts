import type { ComponentPropsWithRef } from 'react';
import { BaseInputProps } from '../BaseInput/types';

export type TextInputProps = Omit<
  BaseInputProps,
  'prefix' | 'labelClassName' | 'inputClassName'
> &
  ComponentPropsWithRef<'input'>;
