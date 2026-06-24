import createIcon from '../../Components/Icon/createIcon';

/**
 * Moon icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Moon Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Moon } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Moon />
 *
 * @example
 * // With custom size and className
 * <Moon size={40} className="text-warning" />
 */
export const Moon = createIcon(
  'Moon',
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
      d='M13.133 10c-1.666.533-3.6.2-4.933-1.133-1.667-1.667-1.8-4.334-.467-6.2C5 2.933 2.867 5.2 2.867 8c0 2.933 2.4 5.333 5.333 5.333 2.2 0 4.133-1.4 4.933-3.333'
      clipRule='evenodd'
    />
  </svg>,
);
