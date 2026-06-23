import createIcon from '../../Components/Icon/createIcon';

/**
 * QrCode icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:QrCode Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { QrCode } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <QrCode />
 *
 * @example
 * // With custom size and className
 * <QrCode size={40} className="text-warning" />
 */
export const QrCode = createIcon(
  'QrCode',
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
      d='M10.667 14H12c1.1 0 2-.9 2-2v-1.333M10.667 2H12c1.1 0 2 .893 2 2v1.333M2 10.667V12c0 1.1.893 2 2 2h1.333M2 5.333V4c0-1.107.893-2 2-2h1.333m3.7 7h-.006l-.007-.007v-.006M11.303 9h-.006l-.007-.007v-.006m-2.257 2.346h-.006l-.007-.006v-.007m2.28.013h-.007l-.006-.006v-.007m-1.117-1.153h-.007l-.006-.007v-.007m-.824-5.486h1.666c.184 0 .334.149.334.333v1.667c0 .184-.15.333-.334.333H9.333a.333.333 0 0 1-.334-.333V5c0-.184.15-.333.334-.333m-4.334 0h1.667c.184 0 .333.149.333.333v1.667C7 6.85 6.85 7 6.666 7H4.999a.333.333 0 0 1-.333-.333V5c0-.184.15-.333.333-.333M5 9h1.667c.184 0 .333.15.333.333V11c0 .184-.149.333-.333.333H4.999A.333.333 0 0 1 4.666 11V9.333c0-.184.15-.333.333-.333'
    />
  </svg>,
);
