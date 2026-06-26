import createIcon from '../../Components/Icon/createIcon';

/**
 * Wallet icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Wallet Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Wallet } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Wallet />
 *
 * @example
 * // With custom size and className
 * <Wallet size={40} className="text-warning" />
 */
export const Wallet = createIcon(
  'Wallet',
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
      d='M11.063 8.75a.25.25 0 0 0-.253.247c0 .133.107.25.25.246.133 0 .25-.113.25-.25a.25.25 0 0 0-.253-.25M2 3.333v9c0 .734.597 1.334 1.333 1.334h9.334c.733 0 1.333-.6 1.333-1.334V5.667c0-.74-.6-1.334-1.333-1.334H3c-.553 0-1-.453-1-1m0 0c0-.553.447-1 1-1h8.333'
    />
  </svg>,
);
