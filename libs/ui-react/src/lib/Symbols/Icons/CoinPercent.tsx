import createIcon from '../../Components/Icon/createIcon';

/**
 * CoinPercent icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:CoinPercent Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CoinPercent } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CoinPercent />
 *
 * @example
 * // With custom size and className
 * <CoinPercent size={40} className="text-warning" />
 */
export const CoinPercent = createIcon(
  'CoinPercent',
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
      d='m7.86 6.133 2.273-2.28m-2.42-.086c0-.034.02-.061.054-.061.026 0 .053.02.053.053-.007.027-.027.054-.06.054-.033-.007-.06-.027-.06-.06v-.007m-2.367.92V3.534c0-1.22.98-2.2 2.2-2.2h2.934c1.213 0 2.2.98 2.2 2.2v2.934c0 1.213-.987 2.2-2.2 2.2H10m.283-2.44c-.006.026-.026.053-.06.053-.033-.007-.06-.027-.06-.06s.02-.06.054-.06c.026 0 .053.02.053.053M2 8.4v4.533C2 13.52 3.193 14 4.667 14c1.466 0 2.66-.48 2.666-1.067V8.4M2 10.667c0 .586 1.187 1.066 2.66 1.066 1.467 0 2.667-.48 2.667-1.066m0-2.267c0 .587-1.2 1.067-2.667 1.067-1.473 0-2.667-.48-2.667-1.067 0-.593 1.194-1.067 2.667-1.067s2.66.474 2.667 1.067'
    />
  </svg>,
);
