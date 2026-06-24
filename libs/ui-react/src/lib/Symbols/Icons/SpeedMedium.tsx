import createIcon from '../../Components/Icon/createIcon';

/**
 * SpeedMedium icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:SpeedMedium Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { SpeedMedium } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <SpeedMedium />
 *
 * @example
 * // With custom size and className
 * <SpeedMedium size={40} className="text-warning" />
 */
export const SpeedMedium = createIcon(
  'SpeedMedium',
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
      d='M2.525 6.207a5.95 5.95 0 0 0 1.693 7.12m7.548-.008a5.99 5.99 0 0 0 2.227-4.667A6.01 6.01 0 0 0 10 3.002M4.213 13.32a5.99 5.99 0 0 1-2.227-4.667 6.01 6.01 0 0 1 3.992-5.65m2.023 4.331V2.666m-.023 4.66a1.333 1.333 0 1 1 0 2.667 1.333 1.333 0 0 1 0-2.666'
    />
  </svg>,
);
