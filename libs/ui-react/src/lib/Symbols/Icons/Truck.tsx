import createIcon from '../../Components/Icon/createIcon';

/**
 * Truck icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Truck Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Truck } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Truck />
 *
 * @example
 * // With custom size and className
 * <Truck size={40} className="text-warning" />
 */
export const Truck = createIcon(
  'Truck',
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
      d='M6.667 2.667h2.666c.367 0 .667.293.667.666V10H1.333m2 2.94H2a.67.67 0 0 1-.667-.667V8.66M10 4.667h2.882c.267 0 .513.16.613.413l1.067 2.673q.092.232.093.494v3.965c0 .367-.3.667-.666.667h-1.227m-2.095.068h-5.22m9.22-3.614H12V6.667h2.133m-12.8-4h3.334m-3.334 2h2M2 6.667h-.667m11.136 5.526c.407.407.407 1.08 0 1.494a1.066 1.066 0 0 1-1.493 0 1.054 1.054 0 0 1 0-1.494 1.054 1.054 0 0 1 1.493 0m-7.333 0c.407.407.407 1.08 0 1.494a1.066 1.066 0 0 1-1.493 0 1.054 1.054 0 0 1 0-1.494 1.054 1.054 0 0 1 1.493 0'
    />
  </svg>,
);
