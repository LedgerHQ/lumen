import createIcon from '../../Components/Icon/createIcon';

/**
 * NetworkWarning icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:NetworkWarning Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { NetworkWarning } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <NetworkWarning />
 *
 * @example
 * // With custom size and className
 * <NetworkWarning size={40} className="text-warning" />
 */
export const NetworkWarning = createIcon(
  'NetworkWarning',
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
      d='M10.667 2h2.186c.627 0 1.14.507 1.14 1.14v2.187M5.333 14H3.14a1.147 1.147 0 0 1-1.147-1.147V10.66m9.307.287V9.72m0 2.573c-.033 0-.066.027-.06.06 0 .034.027.06.06.06.034 0 .06-.033.06-.066a.07.07 0 0 0-.066-.067m1.17-3.88 2.026 3.61c.493.886-.147 1.986-1.167 1.986H9.257a1.34 1.34 0 0 1-1.167-1.993l2.027-3.614a1.33 1.33 0 0 1 2.32 0zM3.44 3.357c-.813.106-1.441.8-1.441 1.643 0 .92.746 1.667 1.666 1.667h3.667a1.333 1.333 0 1 0 0-2.667 2 2 0 0 0-3.893-.643z'
    />
  </svg>,
);
