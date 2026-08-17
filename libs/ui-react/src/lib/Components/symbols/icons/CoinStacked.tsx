import createIcon from '../Icon/createIcon';

/**
 * CoinStacked icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:CoinStacked Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CoinStacked } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CoinStacked />
 *
 * @example
 * // With custom size and className
 * <CoinStacked size={40} className="text-warning" />
 */
export const CoinStacked = createIcon(
  'CoinStacked',
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
      d='M6.131 2.798a5 5 0 0 1 7.071 7.07m-1.869-.201a5 5 0 1 1-10 0 5 5 0 0 1 10 0'
    />
  </svg>,
);
