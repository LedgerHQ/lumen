import createIcon from '../../Components/Icon/createIcon';

/**
 * Printer icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Printer Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Printer } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Printer />
 *
 * @example
 * // With custom size and className
 * <Printer size={40} className="text-warning" />
 */
export const Printer = createIcon(
  'Printer',
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
      d='M4.667 5.333V2.667c0-.368.293-.667.666-.667h5.334c.366 0 .666.293.666.667v2.666m-6.666 6H3.333C2.597 11.333 2 10.733 2 10V6.667c0-.74.597-1.334 1.333-1.334h9.334c.733 0 1.333.594 1.333 1.334V10c0 .733-.6 1.333-1.333 1.333h-1.334m-6.666-4h.666M4.667 9.2h6.666v4.133c0 .367-.3.667-.666.667H5.333a.664.664 0 0 1-.666-.667z'
    />
  </svg>,
);
