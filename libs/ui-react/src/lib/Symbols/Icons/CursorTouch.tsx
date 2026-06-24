import createIcon from '../../Components/Icon/createIcon';

/**
 * CursorTouch icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:CursorTouch Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { CursorTouch } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <CursorTouch />
 *
 * @example
 * // With custom size and className
 * <CursorTouch size={40} className="text-warning" />
 */
export const CursorTouch = createIcon(
  'CursorTouch',
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
      d='M3.473 5.333h.667m7.333 0h-.666M10.3 2.507l-.473.466M4.64 2.507l.473.466m2.36-1.64V2m.998 6.667v-3c0-.554-.454-1-1-1-.554 0-1 .446-1 1v5l-1.36-.454a1.098 1.098 0 0 0-1.054 1.884l2.7 2.247c.24.193.54.307.854.307h3.006c.667 0 1.24-.507 1.32-1.174l.36-2.895a1.33 1.33 0 0 0-1.106-1.48l-2.74-.46z'
    />
  </svg>,
);
