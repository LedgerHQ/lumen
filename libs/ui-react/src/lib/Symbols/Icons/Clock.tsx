import createIcon from '../../Components/Icon/createIcon';

/**
 * Clock icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Clock Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Clock } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Clock />
 *
 * @example
 * // With custom size and className
 * <Clock size={40} className="text-warning" />
 */
export const Clock = createIcon(
  'Clock',
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
      d='M10.707 8.08h-3.1V4.347m.4-2.674a6 6 0 1 0 0 12 6 6 0 0 0 0-12'
    />
  </svg>,
);
