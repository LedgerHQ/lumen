import createIcon from '../../Components/Icon/createIcon';

/**
 * DollarConvert icon component.
 *
 * This icon component is automatically generated from SVG files and uses the createIcon utility
 * to create a consistent icon interface. It supports all standard SVG props and additional
 * size variants defined in the Icon component.
 *
 * @see {@link https://ldls.vercel.app/?path=/story/react-icon--base&args=name:DollarConvert Storybook}
 *
 * @component
 * @param {16 | 20 | 24 | 40 | 48 | 56} [size=24] - The size of the icon in pixels.
 * @param {string} [className] - Additional CSS classes to apply to the icon.
 * @param {React.SVGProps<SVGSVGElement>} [...props] - All standard SVG element props.
 *
 * @example
 * // Basic usage with default size (24px)
 * import { DollarConvert } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <DollarConvert />
 *
 * @example
 * // With custom size and className
 * <DollarConvert size={40} className="text-warning" />
 */
export const DollarConvert = createIcon(
  'DollarConvert',
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
      d='M7.833 4.667V5.5m0 5.833V10.5m1.654-3.833A1.247 1.247 0 0 0 8.245 5.5h-.913a1.17 1.17 0 0 0-1.173 1.167c0 .533.365 1 .88 1.133l1.562.387c.52.126.88.593.88 1.133a1.17 1.17 0 0 1-1.174 1.167h-.913c-.667 0-1.2-.52-1.247-1.174m-2.234-5.4A5.76 5.76 0 0 1 8 2.22a5.784 5.784 0 0 1 5.781 5.779c0 .44-.06.873-.153 1.293m-.895-.89 1.04 1.04 1.04-1.047m-2.726 3.69a5.8 5.8 0 0 1-4.094 1.687A5.784 5.784 0 0 1 2.36 6.693m.903.906L2.215 6.552 1.17 7.592'
    />
  </svg>,
);
