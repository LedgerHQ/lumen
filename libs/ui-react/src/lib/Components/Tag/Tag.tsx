import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { IconSize } from '../Icon/types';
import { TagProps } from './types';

const tagVariants = cva(
  'inline-flex items-center justify-center gap-4 rounded-xs',
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
  disabled,
  ...props
}: TagProps) => {
  const iconSizeMap: { [key: string]: IconSize } = {
    md: 16,
    sm: 12,
  };

  const calculatedIconSize = size ? iconSizeMap[size] : 16;
  const IconComponent = icon;

  return (
    <div
      className={cn(className, tagVariants({ appearance, size, disabled }))}
      ref={ref}
      {...props}
    >
      {IconComponent && (
        <IconComponent size={calculatedIconSize} className='shrink-0' />
      )}
      <span>{label}</span>
    </div>
  );
};

Tag.displayName = 'Tag';
