import createIcon from '../../Components/Icon/createIcon';

/**
 * QrCodeScanner icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:QrCodeScanner Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { QrCodeScanner } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <QrCodeScanner />
 *
 * @example
 * // With custom size and className
 * <QrCodeScanner size={40} className="text-warning" />
 */
export const QrCodeScanner = createIcon(
  'QrCodeScanner',
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
      d='M14 5.333v-2C14 2.597 13.4 2 12.667 2h-2M5.333 2h-2C2.597 2 2 2.597 2 3.333v2m0 5.334v2C2 13.4 2.597 14 3.333 14h2m5.334 0h2C13.4 14 14 13.4 14 12.667v-2M2 8h12'
    />
  </svg>,
);
