import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { IconSize } from '../Icon/types';
import type { TagProps } from './types';

const tagVariants = cva(
  'inline-flex items-center justify-center gap-4 truncate rounded-xs',
  {
    variants: {
      appearance: {
        base: 'bg-muted-transparent text-base',
        gray: 'bg-muted-transparent text-muted',
        accent: 'bg-accent text-on-accent',
        success: 'bg-success text-success',
        error: 'bg-error text-error',
        warning: 'bg-warning text-warning',
      },
      size: {
        md: 'px-8 py-4 body-3',
        sm: 'px-4 py-2 body-4',
      },
      disabled: {
        true: 'bg-disabled text-disabled',
        false: '',
      },
    },
    defaultVariants: {
      appearance: 'accent',
      size: 'md',
      disabled: false,
    },
  },
);

export const Tag = ({
  ref,
  className,
  appearance,
  size,
  icon,
  label,
  disabled: disabledProp,
  ...props
}: TagProps) => {
  const disabled = useDisabledContext({
    consumerName: 'Tag',
    mergeWith: { disabled: disabledProp },
  });
  const iconSizeMap: { [key: string]: IconSize } = {
    md: 16,
    sm: 12,
  };

  const calculatedIconSize = size ? iconSizeMap[size] : 16;
  const IconComponent = icon;

  return (
    <div
      className={cn(tagVariants({ appearance, size, disabled }), className)}
      ref={ref}
      {...props}
    >
      {IconComponent && <IconComponent size={calculatedIconSize} />}
      <span className='truncate'>{label}</span>
    </div>
  );
};
