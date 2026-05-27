import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { BaseTagProps } from './types';

const baseTagVariants = cva(
  'inline-flex items-center justify-center gap-4 truncate rounded-xs',
  {
    variants: {
      appearance: {
        base: 'bg-muted-transparent text-base',
        gray: 'bg-muted-transparent text-muted',
        accent: 'bg-accent text-on-accent',
        'accent-subtle': 'bg-active-subtle text-active',
        success: 'bg-success text-success',
        error: 'bg-error text-error',
        warning: 'bg-warning text-warning',
        white: 'bg-white text-black',
      },
      size: {
        md: 'body-3',
        sm: 'body-4',
      },
      variant: {
        tag: '',
        media: '',
      },
      disabled: {
        true: 'bg-disabled text-disabled',
        false: '',
      },
    },
    compoundVariants: [
      { variant: 'tag', size: 'md', class: 'px-8 py-4' },
      { variant: 'tag', size: 'sm', class: 'px-4 py-2' },
      { variant: 'media', size: 'md', class: 'py-4 pr-8 pl-4' },
      { variant: 'media', size: 'sm', class: 'px-4 py-2' },
    ],
    defaultVariants: {
      appearance: 'accent',
      size: 'md',
      disabled: false,
    },
  },
);

export const BaseTag = ({
  ref,
  className,
  appearance,
  size,
  variant,
  consumerName,
  label,
  disabled: disabledProp,
  leadingContent,
  ...props
}: BaseTagProps) => {
  const disabled = useDisabledContext({
    consumerName,
    mergeWith: { disabled: disabledProp },
  });

  return (
    <div
      className={cn(
        baseTagVariants({ appearance, size, variant, disabled: !!disabled }),
        className,
      )}
      ref={ref}
      {...props}
    >
      {leadingContent}
      <span className='truncate'>{label}</span>
    </div>
  );
};
