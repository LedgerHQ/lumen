import createIcon from '../../Components/Icon/createIcon';

/**
 * Circles icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Circles Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Circles } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Circles />
 *
 * @example
 * // With custom size and className
 * <Circles size={40} className="text-warning" />
 */
export const Circles = createIcon(
  'Circles',
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
      d='M11.333 2.511a6 6 0 0 0-6.666 0m5.986 10.369a6 6 0 0 0 3.334-5.773m-8.64 5.773a6 6 0 0 1-3.334-5.773m11.89-3.315a1 1 0 1 1-1.414 1.414 1 1 0 0 1 1.414-1.414m-10.388 0a1 1 0 1 1-1.414 1.414 1 1 0 0 1 1.414-1.414m5.194 9a1 1 0 1 1-1.414 1.414 1 1 0 0 1 1.414-1.414M9.65 5.85a2.333 2.333 0 1 1-3.3 3.3 2.333 2.333 0 0 1 3.3-3.3'
    />
  </svg>,
);
