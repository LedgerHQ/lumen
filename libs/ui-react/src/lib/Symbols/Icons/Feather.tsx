import createIcon from '../../Components/Icon/createIcon';

/**
 * Feather icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Feather Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Feather } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Feather />
 *
 * @example
 * // With custom size and className
 * <Feather size={40} className="text-warning" />
 */
export const Feather = createIcon(
  'Feather',
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
      d='m8.666 7.334-6 6m7.871-2.08a9.6 9.6 0 0 0 2.673-7.161 1.36 1.36 0 0 0-1.303-1.303 9.6 9.6 0 0 0-7.162 2.673c-1.92 1.921-2.182 4.775-.582 6.374 1.6 1.6 4.453 1.339 6.374-.582'
    />
  </svg>,
);
