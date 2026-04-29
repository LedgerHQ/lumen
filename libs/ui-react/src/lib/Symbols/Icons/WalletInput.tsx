import createIcon from '../../Components/Icon/createIcon';

/**
 * WalletInput icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:WalletInput Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { WalletInput } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <WalletInput />
 *
 * @example
 * // With custom size and className
 * <WalletInput size={40} className="text-warning" />
 */
export const WalletInput = createIcon(
  'WalletInput',
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
      d='M1.998 4.665h10.67c.737 0 1.335.598 1.335 1.334v6.336c0 .921-.747 1.667-1.668 1.667H8.667m2.668-9.337v-.667c0-.736-.597-1.334-1.334-1.334H3.665c-.92 0-1.667.747-1.667 1.668V10m4.668 2.668H1.998m4.668 0-1.334 1.333m1.334-1.333-1.334-1.334m6.002-2.001h-.666'
    />
  </svg>,
);
