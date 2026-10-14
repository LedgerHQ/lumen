import type { ComponentPropsWithRef } from 'react';

export type VisuallyHiddenInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  'aria-hidden' | 'tabIndex' | 'className'
>;
