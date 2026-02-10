import { cn } from '@ledgerhq/lumen-utils-shared';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { IconSize } from '../Icon/types';
import { Spinner } from '../Spinner';
import { BaseButtonProps } from './types';

const baseButtonVariants = cva(
  'inline-flex size-fit cursor-pointer items-center justify-center rounded-full body-1-semi-bold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  {
    variants: {
      appearance: {
        base: 'bg-interactive text-on-interactive hover:bg-interactive-hover active:bg-interactive-pressed',
        gray: 'bg-muted text-base hover:bg-muted-hover active:bg-muted-pressed',
        accent:
          'bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-pressed',
        transparent:
          'bg-muted-transparent text-base hover:bg-muted-transparent-hover active:bg-muted-transparent-pressed',
        'no-background':
          'bg-transparent text-base hover:bg-base-transparent-hover active:bg-base-transparent-pressed disabled:bg-base-transparent',
        red: 'bg-error text-error hover:bg-error-hover active:bg-error-pressed',
      },
      disabled: {
        true: '',
        false: '',
      },
      loading: {
        true: '',
        false: '',
      },
      size: {
        xs: 'p-8',
        sm: 'p-10',
        md: 'p-12',
        lg: 'p-16',
      },
      isFull: {
        true: 'w-full',
      },
    },
    compoundVariants: [
      {
        disabled: true,
        loading: false,
        class:
          'cursor-default bg-disabled text-disabled hover:bg-disabled hover:text-disabled active:bg-disabled active:text-disabled',
      },
      {
        disabled: true,
        loading: true,
        class:
          'cursor-default bg-disabled text-disabled hover:bg-disabled hover:text-disabled active:bg-disabled active:text-disabled',
      },
    ],
    defaultVariants: {
      appearance: 'base',
      size: 'md',
      isFull: false,
    },
  },
);

const iconVariants = cva('shrink-0', {
  variants: {
    appearance: {
      base: 'text-on-interactive',
      accent: 'text-on-accent',
      red: 'text-error',
      gray: 'text-base',
      'no-background': 'text-base',
      transparent: 'text-base',
    },
    disabled: {
      true: 'text-disabled',
    },
  },
});

export const BaseButton = ({
  ref,
  className,
  appearance = 'base',
  size,
  isFull,
  disabled = false,
  asChild = false,
  icon: Icon,
  loading = false,
  children,
  onClick,
  ...props
}: BaseButtonProps) => {
  const iconSizeMap: { [key: string]: IconSize } = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 24,
  };

  const calculatedIconSize = size ? iconSizeMap[size] : 24;
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(
        baseButtonVariants({ disabled, loading, appearance, size, isFull }),
        className,
      )}
      ref={ref}
      data-disabled={disabled || undefined}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <Spinner
          size={calculatedIconSize}
          className={iconVariants({ appearance, disabled })}
        />
      )}
      {!loading && Icon && (
        <Icon
          size={calculatedIconSize}
          className={iconVariants({ appearance, disabled })}
        />
      )}

      {children &&
        (asChild ? (
          <Slottable>{children}</Slottable>
        ) : (
          <span className='line-clamp-2 text-left'>{children}</span>
        ))}
    </Comp>
  );
};

BaseButton.displayName = 'BaseButton';
