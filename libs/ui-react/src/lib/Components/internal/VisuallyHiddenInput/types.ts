import type { ComponentPropsWithRef } from 'react';

export type VisuallyHiddenInputProps = Omit<
  ComponentPropsWithRef<'input'>,
  'readOnly' | 'aria-hidden' | 'tabIndex' | 'className'
>;
