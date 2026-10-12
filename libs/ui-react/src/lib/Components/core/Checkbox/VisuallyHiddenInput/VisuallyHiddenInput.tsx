import type { VisuallyHiddenInputProps } from './types';

export const VisuallyHiddenInput = ({
  checked,
  inputRef,
  value = 'on',
  ...props
}: VisuallyHiddenInputProps) => {
  return (
    <input
      {...props}
      ref={inputRef}
      type='checkbox'
      value={value}
      checked={checked}
      readOnly
      aria-hidden
      tabIndex={-1}
      className='sr-only'
    />
  );
};
