import createIcon from '../../Components/Icon/createIcon';

/**
 * WirelessCharging icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:WirelessCharging Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { WirelessCharging } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <WirelessCharging />
 *
 * @example
 * // With custom size and className
 * <WirelessCharging size={40} className="text-warning" />
 */
export const WirelessCharging = createIcon(
  'WirelessCharging',
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
      d='M9 11.333v1.334c0 .366-.3.666-.667.666h-.666A.664.664 0 0 1 7 12.667v-1.334m1 3.334v-1.334M7.835 5l-.84 1.667h2l-.84 1.666M3.333 2h9.334C13.403 2 14 2.597 14 3.333V10c0 .736-.597 1.333-1.333 1.333H3.333A1.333 1.333 0 0 1 2 10V3.333C2 2.597 2.597 2 3.333 2'
    />
  </svg>,
);
