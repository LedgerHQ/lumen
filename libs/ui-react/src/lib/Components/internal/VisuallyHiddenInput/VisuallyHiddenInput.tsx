import type { VisuallyHiddenInputProps } from './types';

export const VisuallyHiddenInput = (props: VisuallyHiddenInputProps) => {
  return <input {...props} aria-hidden tabIndex={-1} className='sr-only' />;
};
