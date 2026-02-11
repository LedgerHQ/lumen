import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { BaseButton } from './BaseButton';
import { ButtonProps } from './types';

const buttonVariants = cva('', {
  variants: {
    size: {
      sm: 'px-16 py-12 body-2-semi-bold',
      md: 'px-16 py-12',
      lg: 'p-16',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

/**
 * A customizable button component that supports various appearances, sizes, full-width mode, loading states, and optional icons.
 *
 * When in loading state, it displays a spinner. If an icon is provided without children, it renders as an icon-only button.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/action-button--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/action-button--docs#dos-and-donts Guidelines}
 *
 * @warning The `className` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the button's core appearance (colors, padding, etc). Use the `appearance` prop instead.
 *
 * @example
 * import { Button } from '@ledgerhq/lumen-ui-react';
 *
 * // Basic primary button
 * <Button appearance="base" size="md" onClick={() => console.log('Clicked!')}>
 *   Click Me
 * </Button>
 *
 *
 * // Full-width button with custom class
 * <Button appearance="accent" isFull={true} className="ml-16">
 *   Submit
 * </Button>
 *
 * // Button as a link (asChild pattern)
 * import { Link } from 'react-router-dom';
 *
 * <Button asChild appearance="base" size="md">
 *   <Link to="/dashboard">Go to Dashboard</Link>
 * </Button>
 *
 */
export const Button = ({
  ref,
  className,
  loading,
  disabled,
  children,
  size,
  icon,
  ...props
}: ButtonProps) => {
  return (
    <BaseButton
      ref={ref}
      size={size}
      disabled={disabled}
      icon={icon}
      loading={loading}
      className={cn(buttonVariants({ size }), 'gap-8', className)}
      {...props}
    >
      {children}
    </BaseButton>
  );
};

Button.displayName = 'Button';
