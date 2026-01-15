import createIcon from '../../Components/Icon/createIcon';

/**
 * ExpandRight icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:ExpandRight Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { ExpandRight } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <ExpandRight />
 *
 * @example
 * // With custom size and className
 * <ExpandRight size={40} className="text-warning" />
 */
export const ExpandRight = createIcon(
  'ExpandRight',
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
      d='M9.667 9.333 11 8 9.667 6.667M8.667 2h2A3.333 3.333 0 0 1 14 5.333v5.334A3.333 3.333 0 0 1 10.667 14h-2m-2 0V2H5.333A3.333 3.333 0 0 0 2 5.333v5.334A3.333 3.333 0 0 0 5.333 14z'
    />
  </svg>,
);
