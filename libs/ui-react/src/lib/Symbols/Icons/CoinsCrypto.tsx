import createIcon from '../../Components/Icon/createIcon';

/**
 * CoinsCrypto icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:CoinsCrypto Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CoinsCrypto } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CoinsCrypto />
 *
 * @example
 * // With custom size and className
 * <CoinsCrypto size={40} className="text-warning" />
 */
export const CoinsCrypto = createIcon(
  'CoinsCrypto',
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
      d='M6.453 3.295a4.42 4.42 0 0 1 6.252 0 4.42 4.42 0 0 1 0 6.252m-7.572.02V7.7h1.882c.513 0 .926.413.926.927a.93.93 0 0 1-.933.926m-.695-2.386v.534m0 4.286v-.607m4.53-1.801c0 2.44-1.98 4.421-4.422 4.421A4.42 4.42 0 0 1 2 9.579a4.414 4.414 0 0 1 4.421-4.422 4.42 4.42 0 0 1 4.422 4.422m-3.596 1.799H5.133V9.565h2.11c.494 0 .9.4.9.9 0 .493-.406.9-.906.9z'
    />
  </svg>,
);
