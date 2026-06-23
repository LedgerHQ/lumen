import createIcon from '../../Components/Icon/createIcon';

/**
 * Chart2 icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:Chart2 Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { Chart2 } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <Chart2 />
 *
 * @example
 * // With custom size and className
 * <Chart2 size={40} className="text-warning" />
 */
export const Chart2 = createIcon(
  'Chart2',
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
      d='m3.333 10.587 3.38-3.381a.65.65 0 0 1 .94 0l1.428 1.427c.26.26.68.26.94 0l3.973-3.974m-1.774.008h1.773V6.44M14 13.953H1.28V2.147'
    />
  </svg>,
);
