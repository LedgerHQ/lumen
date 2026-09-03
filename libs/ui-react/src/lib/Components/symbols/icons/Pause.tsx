import createIcon from '../Icon/createIcon';

/**
 * Pause icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Pause Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Pause } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Pause />
 *
 * @example
 * // With custom size and className
 * <Pause size={40} className="text-warning" />
 */
export const Pause = createIcon(
  'Pause',
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
      d='M9.333 10V6m-2.666 4V6M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0'
    />
  </svg>,
);
