import createIcon from '../../Components/Icon/createIcon';

/**
 * ComputerMobile icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:ComputerMobile Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { ComputerMobile } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <ComputerMobile />
 *
 * @example
 * // With custom size and className
 * <ComputerMobile size={40} className="text-warning" />
 */
export const ComputerMobile = createIcon(
  'ComputerMobile',
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
      d='M12.667 7.333V4c0-.74-.6-1.333-1.334-1.333H2.667c-.74 0-1.334.593-1.334 1.333v5.333c0 .734.594 1.334 1.334 1.334h8m-2.334 2.666v-2.666m-2.666 0v2.666m-.834 0h4.334m4.5 0h-2c-.554 0-1-.453-1-1v-4c0-.553.446-1 1-1h2c.546 0 1 .447 1 1v4c0 .547-.454 1-1 1'
    />
  </svg>,
);
