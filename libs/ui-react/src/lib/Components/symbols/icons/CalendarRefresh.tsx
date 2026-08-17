import createIcon from '../Icon/createIcon';

/**
 * CalendarRefresh icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:CalendarRefresh Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CalendarRefresh } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CalendarRefresh />
 *
 * @example
 * // With custom size and className
 * <CalendarRefresh size={40} className="text-warning" />
 */
export const CalendarRefresh = createIcon(
  'CalendarRefresh',
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
      d='m9.482 11.247-.578-.52-.581.52m4.095 1.828a2.26 2.26 0 0 1-1.278.396 2.28 2.28 0 0 1-2.237-2.728m4.1.162.556.52.56-.52m-4.074-1.828a2.26 2.26 0 0 1 1.278-.396 2.28 2.28 0 0 1 2.236 2.728M10 2v1.333M4.667 2v1.333M2 5.333h10.667m0 1.334V4c0-.737-.597-1.333-1.334-1.333h-8C2.597 2.667 2 3.263 2 4v7.333c0 .737.597 1.334 1.333 1.334h3.334m.683-4.918h-.006l-.007-.007v-.006m-2.64.013H4.69l-.006-.007v-.006m.013 2.46H4.69l-.006-.006v-.007'
    />
  </svg>,
);
