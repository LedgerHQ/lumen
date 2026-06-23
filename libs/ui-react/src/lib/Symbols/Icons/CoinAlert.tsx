import createIcon from '../../Components/Icon/createIcon';

/**
 * CoinAlert icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:CoinAlert Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CoinAlert } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CoinAlert />
 *
 * @example
 * // With custom size and className
 * <CoinAlert size={40} className="text-warning" />
 */
export const CoinAlert = createIcon(
  'CoinAlert',
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
      d='M13.473 8.807a4.667 4.667 0 0 0-6.293-6.29M6.667 9.16v-1.7m-.001 3.573c-.047 0-.087.034-.087.08 0 .04.034.08.08.08.04 0 .08-.04.08-.086a.09.09 0 0 0-.086-.087M6.667 14A4.67 4.67 0 0 1 2 9.333a4.667 4.667 0 0 1 9.333 0A4.67 4.67 0 0 1 6.667 14'
    />
  </svg>,
);
