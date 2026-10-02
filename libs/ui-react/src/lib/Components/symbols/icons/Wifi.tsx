import createIcon from '../Icon/createIcon';

/**
 * Wifi icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Wifi Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Wifi } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Wifi />
 *
 * @example
 * // With custom size and className
 * <Wifi size={40} className="text-warning" />
 */
export const Wifi = createIcon(
  'Wifi',
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 16 16'
  >
    <path
      fill='currentColor'
      d='M7.999 12.333a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3.06 8c2.729-2.502 7.15-2.502 9.879 0M1.063 5.203c3.831-3.382 10.043-3.382 13.874 0m-9.884 5.344a4.184 4.184 0 0 1 5.894 0'
    />
  </svg>,
);
