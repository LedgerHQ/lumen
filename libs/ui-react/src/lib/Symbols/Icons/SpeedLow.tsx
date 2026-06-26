import createIcon from '../../Components/Icon/createIcon';

/**
 * SpeedLow icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:SpeedLow Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { SpeedLow } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <SpeedLow />
 *
 * @example
 * // With custom size and className
 * <SpeedLow size={40} className="text-warning" />
 */
export const SpeedLow = createIcon(
  'SpeedLow',
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
      d='M7.038 7.727 3.645 4.333m-1.12 1.874a5.95 5.95 0 0 0 1.693 7.12m1.307-10.12a5.9 5.9 0 0 1 2.46-.547h0c3.314-.007 6 2.68 6.007 5.993a5.99 5.99 0 0 1-2.226 4.666M7.978 7.327a1.333 1.333 0 1 1 0 2.666 1.333 1.333 0 0 1 0-2.666'
    />
  </svg>,
);
