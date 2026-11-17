import createIcon from '../Icon/createIcon';

/**
 * Building icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Building Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Building } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Building />
 *
 * @example
 * // With custom size and className
 * <Building size={40} className="text-warning" />
 */
export const Building = createIcon(
  'Building',
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
      d='M1.333 14H2m0 0h4m-4 0V5.333a.667.667 0 0 1 .667-.666H6M6 14h2.667M6 14V4.667M8.667 14h2.666m-2.666 0v-2.667M11.333 14H14m-2.667 0v-2.667M14 14h.667M14 14V2.667A.667.667 0 0 0 13.333 2H6.667A.667.667 0 0 0 6 2.667v2m2 0h4m-4 2h4m-4 2h4m-.667 2.666H12m-.667 0H8.667m0 0H8'
    />
  </svg>,
);
