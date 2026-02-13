import { cn } from '@ledgerhq/lumen-utils-shared';
import { DividerProps } from './types';

/**
 * A simple divider component for separating content sections.
 *
 * The Divider renders a horizontal or vertical line to create visual separation
 * between content areas. It uses design system tokens for consistent styling.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/layout-divider--docs Storybook}
 *
 * @example
 * // Horizontal divider (default)
 * <Divider />
 *
 * @example
 * // Vertical divider
 * <Divider orientation="vertical" />
 *
 * @example
 * // With custom styling
 * <Divider className="my-16" />
 */
export const Divider = ({
  ref,
  className,
  orientation = 'horizontal',
  ...props
}: DividerProps) => {
  return (
    <div
      ref={ref}
      role='separator'
      aria-orientation={orientation}
      className={cn(
        'border-muted-subtle',
        orientation === 'horizontal' ? 'w-full border-t' : 'h-full border-l',
        className,
      )}
      {...props}
    />
  );
};

Divider.displayName = 'Divider';
