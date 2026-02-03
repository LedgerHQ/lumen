import { Box } from '../Utility';
import { PageIndicatorProps } from './types';

/**
 * A page indicator component for displaying pagination progress.
 *
 * The PageIndicator shows a series of dots representing the total number of pages
 * and highlights the current active page.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_components-pageindicator--docs Storybook}
 *
 * @example
 * // Basic usage
 * <PageIndicator />
 */
export const PageIndicator = ({
  lx = {},
  ref,
  ...props
}: PageIndicatorProps) => {
  return (
    <Box
      ref={ref}
      accessibilityRole='none'
      lx={{
        flexDirection: 'row',
        gap: 's8',
        ...lx,
      }}
      {...props}
    >
      {/* TODO: Implement page indicator dots */}
    </Box>
  );
};

PageIndicator.displayName = 'PageIndicator';
