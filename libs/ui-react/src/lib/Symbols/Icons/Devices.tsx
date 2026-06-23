import createIcon from '../../Components/Icon/createIcon';

/**
 * Devices icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Devices Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Devices } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Devices />
 *
 * @example
 * // With custom size and className
 * <Devices size={40} className="text-warning" />
 */
export const Devices = createIcon(
  'Devices',
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
      d='M6.667 14H3.333C2.593 14 2 13.4 2 12.667V3.333C2 2.593 2.593 2 3.333 2H10c.733 0 1.333.593 1.333 1.333v1.334m-.666 7.66H12M12.8 14H9.867a1.2 1.2 0 0 1-1.2-1.2V7.867c0-.667.533-1.2 1.2-1.2H12.8c.66 0 1.2.533 1.2 1.2V12.8c0 .66-.54 1.2-1.2 1.2'
    />
  </svg>,
);
