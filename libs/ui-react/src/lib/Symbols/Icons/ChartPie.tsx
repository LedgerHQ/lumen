import createIcon from '../../Components/Icon/createIcon';

/**
 * ChartPie icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:ChartPie Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { ChartPie } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <ChartPie />
 *
 * @example
 * // With custom size and className
 * <ChartPie size={40} className="text-warning" />
 */
export const ChartPie = createIcon(
  'ChartPie',
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
      d='M7 4C4.233 4 2 6.233 2 9c0 2.76 2.233 5 5 5 2.76 0 5-2.24 5-5H7z'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M14 6.667A4.667 4.667 0 0 0 9.333 2v4.667z'
    />
  </svg>,
);
