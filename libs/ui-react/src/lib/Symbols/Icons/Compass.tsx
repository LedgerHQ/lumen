import createIcon from '../../Components/Icon/createIcon';

/**
 * Compass icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Compass Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Compass } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Compass />
 *
 * @example
 * // With custom size and className
 * <Compass size={40} className="text-warning" />
 */
export const Compass = createIcon(
  'Compass',
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
      d='M12.243 3.753a6 6 0 0 1 0 8.48 6.007 6.007 0 0 1-8.487 0 5.996 5.996 0 0 1 0-8.486 5.99 5.99 0 0 1 8.48-.001m-2.69 5.787L6.454 6.467m0 .002 4.214-1.142-1.12 4.193-4.214 1.133z'
    />
  </svg>,
);
