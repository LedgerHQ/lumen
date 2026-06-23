import createIcon from '../../Components/Icon/createIcon';

/**
 * Chart1 icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Chart1 Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Chart1 } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Chart1 />
 *
 * @example
 * // With custom size and className
 * <Chart1 size={40} className="text-warning" />
 */
export const Chart1 = createIcon(
  'Chart1',
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
      d='M4.667 11.667V8.333m2.22 3.334V4.333m2.22 7.334V7.6m2.226 4.067V5m-8-3h9.334C13.4 2 14 2.597 14 3.333v9.334C14 13.4 13.4 14 12.667 14H3.333C2.597 14 2 13.4 2 12.667V3.333C2 2.593 2.593 2 3.333 2'
    />
  </svg>,
);
