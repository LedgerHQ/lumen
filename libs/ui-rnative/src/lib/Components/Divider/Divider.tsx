import { Box } from '../Utility';
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
 * // With custom styling using lx props
 * <Divider lx={{ marginVertical: 's16' }} />
 */
export const Divider = ({
  lx = {},
  orientation = 'horizontal',
  ref,
  ...props
}: DividerProps) => {
  return (
    <Box
      ref={ref}
      accessibilityRole='none'
      lx={{
        ...(orientation === 'horizontal'
          ? {
              alignSelf: 'stretch',
              borderTopWidth: 's1',
              borderTopColor: 'mutedSubtle',
            }
          : {
              alignSelf: 'stretch',
              borderLeftWidth: 's1',
              borderLeftColor: 'mutedSubtle',
            }),
        ...lx,
      }}
      {...props}
    />
  );
};

Divider.displayName = 'Divider';
