import createIcon from '../../Components/Icon/createIcon';

/**
 * Chart3 icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Chart3 Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Chart3 } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Chart3 />
 *
 * @example
 * // With custom size and className
 * <Chart3 size={40} className="text-warning" />
 */
export const Chart3 = createIcon(
  'Chart3',
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
      d='M9 7.673v2.994M7 5.333v5.334M5 8.84v1.827M11 6.5v4.167M5.333 2h5.334A3.333 3.333 0 0 1 14 5.333v5.334A3.333 3.333 0 0 1 10.667 14H5.333A3.333 3.333 0 0 1 2 10.667V5.333A3.333 3.333 0 0 1 5.333 2'
    />
  </svg>,
);
