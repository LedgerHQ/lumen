import createIcon from '../../Components/Icon/createIcon';

/**
 * PinLocation icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:PinLocation Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { PinLocation } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <PinLocation />
 *
 * @example
 * // With custom size and className
 * <PinLocation size={40} className="text-warning" />
 */
export const PinLocation = createIcon(
  'PinLocation',
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
      d='M8 8.667a2 2 0 1 1 0-4 2 2 0 0 1 0 4'
    />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M8 14s-4.667-3.833-4.667-7.333a4.667 4.667 0 0 1 9.333 0C12.667 10.167 8 14 8 14'
    />
  </svg>,
);
