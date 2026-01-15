import createIcon from '../../Components/Icon/createIcon';

/**
 * Exchange icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/symbols-interface-icons--icon&args=name:Exchange Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Exchange } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Exchange />
 *
 * @example
 * // With custom size and className
 * <Exchange size={40} className="text-warning" />
 */
export const Exchange = createIcon(
  'Exchange',
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
      d='M8.667 12.667h-2a3.334 3.334 0 0 1-3.334-3.334v-6m0 0L5 5M3.333 3.333 1.667 5m5.657-1.667h2a3.334 3.334 0 0 1 3.333 3.334v6m0 0L10.99 11m1.667 1.667L14.324 11'
    />
  </svg>,
);
