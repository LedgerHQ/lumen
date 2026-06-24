import createIcon from '../../Components/Icon/createIcon';

/**
 * Grid icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Grid Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Grid } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Grid />
 *
 * @example
 * // With custom size and className
 * <Grid size={40} className="text-warning" />
 */
export const Grid = createIcon(
  'Grid',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M5.167 6.5H3.333C2.597 6.5 2 5.9 2 5.167V3.333C2 2.597 2.597 2 3.333 2h1.834C5.9 2 6.5 2.597 6.5 3.333v1.834C6.5 5.9 5.9 6.5 5.167 6.5M12.667 6.5h-1.834c-.74 0-1.333-.6-1.333-1.333V3.333A1.33 1.33 0 0 1 10.833 2h1.834C13.4 2 14 2.597 14 3.333v1.834C14 5.9 13.4 6.5 12.667 6.5M5.167 14H3.333C2.597 14 2 13.4 2 12.667v-1.834c0-.74.597-1.333 1.333-1.333h1.834c.733 0 1.333.593 1.333 1.333v1.834C6.5 13.4 5.9 14 5.167 14M12.667 14h-1.834c-.74 0-1.333-.6-1.333-1.333v-1.834c0-.74.593-1.333 1.333-1.333h1.834c.733 0 1.333.593 1.333 1.333v1.834C14 13.4 13.4 14 12.667 14'
      clipRule='evenodd'
    />
  </svg>,
);
