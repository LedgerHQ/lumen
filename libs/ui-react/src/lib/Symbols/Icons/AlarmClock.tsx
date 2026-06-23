import createIcon from '../../Components/Icon/createIcon';

/**
 * AlarmClock icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:AlarmClock Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { AlarmClock } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <AlarmClock />
 *
 * @example
 * // With custom size and className
 * <AlarmClock size={40} className="text-warning" />
 */
export const AlarmClock = createIcon(
  'AlarmClock',
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
      d='M3.113 11.473c.39.546.868 1.024 1.414 1.414M2.09 7A6 6 0 0 0 2 8c0 .341.035.674.09 1m1.023-4.473a6 6 0 0 1 1.414-1.414M7 13.91c.326.055.659.09 1 .09A6 6 0 1 0 8 2a6 6 0 0 0-1 .09m3.667 4.577L7.333 10l-2-2'
    />
  </svg>,
);
