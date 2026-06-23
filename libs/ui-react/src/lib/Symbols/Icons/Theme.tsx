import createIcon from '../../Components/Icon/createIcon';

/**
 * Theme icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Theme Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Theme } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Theme />
 *
 * @example
 * // With custom size and className
 * <Theme size={40} className="text-warning" />
 */
export const Theme = createIcon(
  'Theme',
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
      d='M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8 11.667V4.333c2.02 0 3.667 1.64 3.667 3.667A3.673 3.673 0 0 1 8 11.667'
    />
  </svg>,
);
