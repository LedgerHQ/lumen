import createIcon from '../../Components/Icon/createIcon';

/**
 * Sun icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Sun Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Sun } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Sun />
 *
 * @example
 * // With custom size and className
 * <Sun size={40} className="text-warning" />
 */
export const Sun = createIcon(
  'Sun',
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
      d='M8 2.667V1.333m0 13.334v-1.334m4.24-9.573.473-.473m-9.426 9.426.473-.473M13.333 8h1.334M1.333 8h1.334m9.573 4.24.473.473M3.287 3.287l.473.473m6.597 1.883a3.333 3.333 0 1 1-4.714 4.714 3.333 3.333 0 0 1 4.714-4.714'
    />
  </svg>,
);
