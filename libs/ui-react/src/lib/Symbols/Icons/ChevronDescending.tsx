import createIcon from '../../Components/Icon/createIcon';

/**
 * ChevronDescending icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:ChevronDescending Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { ChevronDescending } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <ChevronDescending />
 *
 * @example
 * // With custom size and className
 * <ChevronDescending size={40} className="text-warning" />
 */
export const ChevronDescending = createIcon(
  'ChevronDescending',
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
      d='M5.333 10 8 12.667 10.667 10'
    />
    <path
      stroke='#E8E8E8'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.3}
      d='M5.333 6 8 3.333 10.667 6'
    />
  </svg>,
);
