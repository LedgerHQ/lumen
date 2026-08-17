import createIcon from '../Icon/createIcon';

/**
 * Servers icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Servers Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Servers } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Servers />
 *
 * @example
 * // With custom size and className
 * <Servers size={40} className="text-warning" />
 */
export const Servers = createIcon(
  'Servers',
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
      d='M10.333 8c0 .737-1.044 1.333-2.333 1.333S5.667 8.736 5.667 8m0-2c0 .737 1.044 1.333 2.333 1.333S10.333 6.737 10.333 6m0 0C10.334 5.263 9.288 4.667 8 4.667S5.667 5.264 5.667 6v4c0 .736 1.044 1.333 2.332 1.333 1.289 0 2.334-.596 2.334-1.333zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12'
    />
  </svg>,
);
