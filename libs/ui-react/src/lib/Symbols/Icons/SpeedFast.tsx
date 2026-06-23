import createIcon from '../../Components/Icon/createIcon';

/**
 * SpeedFast icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:SpeedFast Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { SpeedFast } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <SpeedFast />
 *
 * @example
 * // With custom size and className
 * <SpeedFast size={40} className="text-warning" />
 */
export const SpeedFast = createIcon(
  'SpeedFast',
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
      d='m8.94 7.727 3.393-3.394m1.12 1.874a5.95 5.95 0 0 1-1.693 7.12m-1.307-10.12a5.9 5.9 0 0 0-2.46-.547h0c-3.314-.007-6 2.68-6.007 5.993a5.99 5.99 0 0 0 2.227 4.666M8 7.327a1.333 1.333 0 1 0 0 2.666 1.333 1.333 0 0 0 0-2.666'
    />
  </svg>,
);
