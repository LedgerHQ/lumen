import createIcon from '../../Components/Icon/createIcon';

/**
 * UsbC icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:UsbC Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { UsbC } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <UsbC />
 *
 * @example
 * // With custom size and className
 * <UsbC size={40} className="text-warning" />
 */
export const UsbC = createIcon(
  'UsbC',
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
      d='M6.667 12.667v2M5.333 6V2.667A.66.66 0 0 1 6 2h4c.367 0 .667.293.667.667V6m-1.334 6.667v2M5 6h6c.547 0 1 .447 1 1v3.667c0 1.1-.9 2-2 2H6c-1.107 0-2-.9-2-2V7c0-.553.447-1 1-1'
    />
  </svg>,
);
